/**
 * AI Approval API
 * Handles governed approval decisions and attaches generated surveys to activities.
 */

import {
  getCookie,
  getSupabaseUser,
  isAdminRole,
  hasAdminPermission,
  json,
  permissionsForRole,
  supabaseConfig,
} from "../auth/_shared";

type Env = Record<string, unknown>;

type AiExecution = {
  id: string;
  tool_id?: string | null;
  intent: string;
  status: string;
  risk_level?: string | null;
  input?: Record<string, unknown> | null;
  output?: Record<string, unknown> | null;
  completed_at?: string | null;
};

async function callSupabase<T>(
  env: Env,
  token: string,
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const { url, key, configured } = supabaseConfig(env);
  if (!configured) throw new Error("Supabase environment is not configured");

  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      ...(init.headers || {}),
    },
  });

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const detail =
      body && typeof body === "object"
        ? ((body as Record<string, unknown>).message ?? JSON.stringify(body))
        : `HTTP ${response.status}`;
    throw new Error(`Supabase REST ${response.status}: ${String(detail).slice(0, 240)}`);
  }

  return body as T;
}

async function updateExecution(
  env: Env,
  token: string,
  executionId: string,
  patch: Record<string, unknown>,
): Promise<AiExecution> {
  const updated = await callSupabase<AiExecution[]>(
    env,
    token,
    `ai_executions?id=eq.${encodeURIComponent(executionId)}&select=id,status,completed_at,input,output&limit=1`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(patch),
    },
  );

  const row = updated?.[0];
  if (!row) {
    throw new Error("AI execution update returned no rows; execution state was not changed");
  }

  const expectedStatus = typeof patch.status === "string" ? patch.status : null;
  if (expectedStatus && row.status !== expectedStatus) {
    throw new Error(
      `AI execution update did not persist expected status '${expectedStatus}' (actual '${row.status}')`,
    );
  }

  return row;
}

function isAllowedSurveyQuestionType(value: string):
  | "rating"
  | "text"
  | "single_choice"
  | "multi_choice" {
  if (value === "text") return "text";
  if (value === "single_choice") return "single_choice";
  if (value === "multi_choice") return "multi_choice";
  return "rating";
}

export async function onRequest({
  request,
  env,
}: {
  request: Request;
  env: Env;
}) {
  try {
    const user = await getSupabaseUser(request, env);
    const role = user?.app_metadata?.role;
    const token = getCookie(request, "sb_access_token");

    if (!user || !isAdminRole(role) || !token) {
      return json({ success: false, error: "Unauthorized" }, 401);
    }
    if (!hasAdminPermission(role, "ai.command.approval.read")) return json({ success: false, error: "Forbidden" }, 403);


    if (request.method === "GET") {
      const executions = await callSupabase<AiExecution[]>(
        env,
        token,
        "ai_executions?status=eq.awaiting_approval&select=id,tool_id,intent,status,risk_level,input,output,created_at&order=created_at.desc&limit=100",
      );

      return json({ success: true, data: executions });
    }

    if (request.method !== "POST") {
      return json(
        { success: false, error: "Method Not Allowed" },
        405,
        { Allow: "GET, POST" },
      );
    }

    const body = (await request.json()) as {
      executionId?: string;
      decision?: "approved" | "rejected";
      reason?: string;
      survey?: Record<string, unknown> | null;
    };

    const executionId = body.executionId?.trim();
    const decision = body.decision;
    if (!executionId || !decision) {
      return json(
        { success: false, error: "executionId and decision are required" },
        400,
      );
    }

    const executions = await callSupabase<AiExecution[]>(
      env,
      token,
      `ai_executions?id=eq.${encodeURIComponent(executionId)}&select=id,tool_id,intent,status,risk_level,input,output&limit=1`,
    );
    const execution = executions?.[0];

    if (!execution || execution.status !== "awaiting_approval") {
      return json(
        { success: false, error: "Execution is not awaiting approval" },
        409,
      );
    }

    const existingApprovals = await callSupabase<
      Array<{ id: string; decision: "approved" | "rejected"; reviewer_id?: string | null }>
    >(
      env,
      token,
      `ai_approvals?execution_id=eq.${encodeURIComponent(execution.id)}&select=id,decision,reviewer_id&order=decided_at.desc&limit=1`,
    );

    let approvalRecorded = false;
    if (existingApprovals?.length) {
      const existingApproval = existingApprovals[0];
      if (existingApproval.decision !== decision) {
        return json(
          { success: false, error: "Execution already has a different approval decision" },
          409,
        );
      }
      // Idempotent retry: continue the approved execution if a previous request
      // recorded the approval but did not persist the execution lifecycle update.
      approvalRecorded = true;
    } else {
      await callSupabase(env, token, "ai_approvals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          execution_id: execution.id,
          reviewer_id: user.id,
          decision,
          reason: body.reason?.trim() || null,
          decided_at: new Date().toISOString(),
        }),
      });
      approvalRecorded = true;
    }

    if (decision === "rejected") {
      await updateExecution(env, token, execution.id, {
        status: "rejected",
        completed_at: new Date().toISOString(),
      });

      return json({
        success: true,
        status: "rejected",
        executionTriggered: false,
        message: "Execution rejected",
      });
    }

    if (approvalRecorded && !existingApprovals?.length) {
      await callSupabase(env, token, "audit_logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actor_id: user.id,
          action: "survey reviewed",
          table_name: "ai_executions",
          record_id: execution.id,
          new_data: { decision },
        }),
      }).catch(() => undefined);
    }

    if (execution.intent === "survey_generation") {
      const input = execution.input ?? {};
      const output = execution.output ?? {};
      const survey =
        body.survey && typeof body.survey === "object"
          ? body.survey
          : output.survey && typeof output.survey === "object"
            ? (output.survey as Record<string, unknown>)
            : {};
      const activityId = String(input.activityId ?? "").trim();
      const surveyTitle = String(survey.surveyTitle ?? "").trim();
      if (!surveyTitle) {
        return json(
          { success: false, error: "surveyTitle missing from reviewed survey" },
          400,
        );
      }

      if (!activityId) {
        return json(
          { success: false, error: "activityId missing from execution input" },
          400,
        );
      }

      const occurrences = await callSupabase<Array<{ id: string }>>(
        env,
        token,
        `activity_occurrences?activity_id=eq.${encodeURIComponent(activityId)}&order=occurrence_no.asc&limit=1&select=id`,
      );
      let occurrenceId = occurrences?.[0]?.id;

      if (!occurrenceId) {
        const activities = await callSupabase<Array<{ activity_date: string | null }>>(
          env,
          token,
          `activities?id=eq.${encodeURIComponent(activityId)}&select=activity_date&limit=1`,
        );
        const activity = activities?.[0];
        const created = await callSupabase<Array<{ id: string }>>(
          env,
          token,
          "activity_occurrences",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Prefer: "return=representation",
            },
            body: JSON.stringify({
              activity_id: activityId,
              occurrence_no: 1,
              start_at: activity?.activity_date
                ? `${activity.activity_date}T09:00:00Z`
                : new Date().toISOString(),
              status: "scheduled",
              participant_count: 0,
            }),
          },
        );
        occurrenceId = created?.[0]?.id;
      }

      if (!occurrenceId) {
        return json(
          { success: false, error: "Unable to create activity occurrence" },
          500,
        );
      }

      const surveys = await callSupabase<Array<{ id: string }>>(
        env,
        token,
        `occurrence_surveys?occurrence_id=eq.${encodeURIComponent(occurrenceId)}&limit=1&select=id`,
      );
      let surveyId = surveys?.[0]?.id;

      if (!surveyId) {
        const createdSurvey = await callSupabase<Array<{ id: string }>>(
          env,
          token,
          "occurrence_surveys",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Prefer: "return=representation",
            },
            body: JSON.stringify({
              occurrence_id: occurrenceId,
              title: surveyTitle,
              enabled: true,
              anonymous: true,
              welcome_text: survey.welcomeText ? String(survey.welcomeText) : null,
            }),
          },
        );
        surveyId = createdSurvey?.[0]?.id;
      }

      if (!surveyId) {
        return json(
          { success: false, error: "Unable to create occurrence survey" },
          500,
        );
      }

      await callSupabase(
        env,
        token,
        `occurrence_surveys?id=eq.${encodeURIComponent(surveyId)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({ title: surveyTitle }),
        },
      );

      const currentQuestions = await callSupabase<Array<{ order_index: number | null }>>(
        env,
        token,
        `survey_questions?survey_id=eq.${encodeURIComponent(surveyId)}&select=order_index&order=order_index.desc.nullslast&limit=1`,
      );
      let orderIndex =
        Math.max(0, Number(currentQuestions?.[0]?.order_index ?? 0)) + 1;
      let questionCount = 0;

      const sections = Array.isArray(survey.sections)
        ? (survey.sections as Array<Record<string, unknown>>)
        : [];

      for (const section of sections) {
        const questions = Array.isArray(section.questions)
          ? (section.questions as Array<Record<string, unknown>>)
          : [];

        for (const question of questions) {
          const questionText = String(question.title ?? "คำถามประเมิน").trim();
          if (!questionText) continue;

          const existingQuestion = await callSupabase<Array<{ id: string }>>(
            env,
            token,
            `survey_questions?survey_id=eq.${encodeURIComponent(surveyId)}&question_text=eq.${encodeURIComponent(questionText)}&limit=1&select=id`,
          );

          if (existingQuestion?.length) {
            continue;
          }

          await callSupabase(env, token, "survey_questions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Prefer: "return=minimal",
            },
            body: JSON.stringify({
              survey_id: surveyId,
              section_key: String(section.id ?? "general"),
              question_text: questionText,
              question_type: isAllowedSurveyQuestionType(
                String(question.questionType ?? "rating"),
              ),
              required: Boolean(question.required ?? true),
              order_index: orderIndex,
              scale_min: 1,
              scale_max: 5,
              active: true,
            }),
          });

          orderIndex += 1;
          questionCount += 1;
        }
      }

      const completedAt = new Date().toISOString();
      await updateExecution(env, token, execution.id, {
        status: "completed",
        completed_at: completedAt,
        output: {
          ...output,
          survey,
          surveyId,
          occurrenceId,
          attachedAt: completedAt,
          questionCount,
        },
      });

      await callSupabase(env, token, "audit_logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actor_id: user.id,
          action: "survey confirmed",
          table_name: "occurrence_surveys",
          record_id: surveyId,
          new_data: { activityId, occurrenceId, questionCount },
        }),
      }).catch(() => undefined);

      return json({
        success: true,
        status: "approved",
        executionTriggered: true,
        message: "ยืนยันแบบประเมินและผูกเข้ากับกิจกรรมแล้ว",
        data: {
          surveyId,
          occurrenceId,
          activityId,
        },
      });
    }

    const tools = await callSupabase<Array<{
      id: string;
      tool_key: string;
      name: string;
      endpoint?: string | null;
      method?: string | null;
      risk_level?: string | null;
      permission?: string | null;
      enabled?: boolean;
    }>>(
      env,
      token,
      `ai_tools?id=eq.${encodeURIComponent(execution.tool_id ?? "")}&enabled=eq.true&select=id,tool_key,name,endpoint,method,risk_level,permission,enabled&limit=1`,
    );
    const tool = tools?.[0];

    if (!tool) {
      return json({ success: false, error: "Tool no longer available" }, 404);
    }

    if (
      tool.permission &&
      !permissionsForRole(role).some((permission) => permission === tool.permission)
    ) {
      return json(
        { success: false, error: "Forbidden: reviewer lacks tool permission" },
        403,
      );
    }

    if (tool.risk_level === "critical" && role !== "SUPER_ADMIN") {
      return json(
        { success: false, error: "Forbidden: critical AI actions require SUPER_ADMIN" },
        403,
      );
    }

    const executionUrl = new URL("/api/admin/ai-execution", request.url);
    const executionResponse = await fetch(executionUrl.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Cookie: request.headers.get("Cookie") ?? "",
      },
      body: JSON.stringify({ executionId: execution.id }),
    });
    const executionResult = await executionResponse.json().catch(() => null);

    return json(
      {
        success: executionResponse.ok,
        status: executionResponse.ok ? "approved" : "failed",
        executionTriggered: executionResponse.ok,
        executionResult: executionResult?.data,
        error: executionResponse.ok
          ? undefined
          : executionResult?.error ?? "Execution trigger failed",
        message: executionResponse.ok
          ? "Execution approved and completed/started"
          : "Approval was recorded but execution failed",
      },
      executionResponse.ok ? 200 : 502,
    );
  } catch (error) {
    console.error(
      "/api/admin/ai-approval",
      error instanceof Error ? error.message : "AI approval processing failed",
    );
    return json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "AI approval processing failed",
      },
      500,
    );
  }
}
