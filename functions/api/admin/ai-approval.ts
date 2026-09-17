/**
 * AI Approval API
 * Handles governed approval decisions and triggers the shared execution endpoint.
 */

import { getSupabaseUser, isAdminRole, json, permissionsForRole, supabaseConfig } from "../auth/_shared";

type Env = Record<string, unknown>;

const cookie = (request: Request): string | null => {
  const cookies = (request.headers.get("Cookie") ?? "").split(";").map((v) => v.trim());
  const found = cookies.find((v) => v.startsWith("sb_access_token="));
  return found ? decodeURIComponent(found.slice("sb_access_token=".length)) : null;
};

async function callSupabase(env: Env, token: string, path: string, init: RequestInit = {}) {
  const { url, key, configured } = supabaseConfig(env);
  if (!configured) throw new Error("Supabase environment is not configured");
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: key, Authorization: `Bearer ${token}`, Accept: "application/json", ...(init.headers || {}) },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`Supabase REST ${response.status}`);
  return body;
}

export async function onRequest({ request, env }: { request: Request; env: Env }) {
  try {
    const user = await getSupabaseUser(request, env);
    const role = user?.app_metadata?.role;
    const token = cookie(request);
    if (!user || !isAdminRole(role) || !token) return json({ success: false, error: "Unauthorized" }, 401);

    if (request.method === "GET") {
      const executions = await callSupabase(
        env,
        token,
        "ai_executions?status=eq.awaiting_approval&select=id,tool_id,intent,status,risk_level,input,execution_plan,steps,created_at&order=created_at.desc&limit=100",
      );
      if (executions?.length) {
        const toolIds = executions.map((exec: { tool_id?: string | null }) => exec.tool_id).filter((id): id is string => Boolean(id));
        if (toolIds.length) {
          const tools = await callSupabase(env, token, `ai_tools?id=in.(${toolIds.join(",")})&select=id,tool_key,name,description,domain,risk_level,permission`);
          const toolMap = new Map((tools || []).map((tool: { id: string }) => [tool.id, tool]));
          for (const execution of executions) execution.tool = execution.tool_id ? toolMap.get(execution.tool_id) : undefined;
        }
      }
      return json({ success: true, data: executions });
    }

    if (request.method !== "POST") return json({ success: false, error: "Method Not Allowed" }, 405, { Allow: "GET, POST" });

    const body = (await request.json()) as { executionId?: string; decision?: "approved" | "rejected"; reason?: string };
    if (!body.executionId || !body.decision) return json({ success: false, error: "executionId and decision are required" }, 400);

    const execRows = await callSupabase(
      env,
      token,
      `ai_executions?id=eq.${encodeURIComponent(body.executionId)}&select=id,tool_id,intent,status,risk_level,input,output,execution_plan,steps&limit=1`,
    );
    const execution = execRows?.[0];
    if (!execution || execution.status !== "awaiting_approval") return json({ success: false, error: "Execution is not awaiting approval" }, 409);

    const existingApprovals = await callSupabase(env, token, `ai_approvals?execution_id=eq.${encodeURIComponent(execution.id)}&select=id,decision,reviewer_id,decided_at&order=decided_at.desc&limit=1`);
    if (existingApprovals?.length) return json({ success: false, error: "Execution already has an approval decision" }, 409);

    // Record approval decision
    await callSupabase(env, token, "ai_approvals", {
      method: "POST",
      headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ execution_id: execution.id, reviewer_id: user.id, decision: body.decision, reason: body.reason?.trim() || null, decided_at: new Date().toISOString() }),
    });

    if (body.decision === "rejected") {
      await callSupabase(env, token, `ai_executions?id=eq.${encodeURIComponent(execution.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected", completed_at: new Date().toISOString() }),
      });
      return json({ success: true, status: "rejected", executionTriggered: false, message: "Execution rejected" });
    }

    // Audit survey review
    await callSupabase(env, token, "audit_logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        actor_id: user.id,
        action: "survey reviewed",
        table_name: "ai_executions",
        record_id: execution.id,
        new_data: { decision: body.decision },
      }),
    }).catch(() => undefined);

    // Special handling for survey_generation intent: bind survey directly to activity occurrence
    if (execution.intent === "survey_generation") {
      const input = (execution.input as Record<string, unknown>) ?? {};
      const output = (execution.output as Record<string, unknown>) ?? {};
      const survey = (output.survey as Record<string, unknown>) ?? {};
      const activityId = String(input.activityId ?? "");

      if (!activityId) return json({ success: false, error: "activityId missing from execution input" }, 400);

      // Find or create occurrence for this activity
      const occurrences = await callSupabase(env, token, `activity_occurrences?activity_id=eq.${encodeURIComponent(activityId)}&order=occurrence_no.asc&limit=1`);
      let occurrenceId = occurrences?.[0]?.id;
      if (!occurrenceId) {
        const actRows = await callSupabase(env, token, `activities?id=eq.${encodeURIComponent(activityId)}&select=activity_date&limit=1`);
        const act = actRows?.[0];
        const newOcc = await callSupabase(env, token, "activity_occurrences", {
          method: "POST",
          headers: { "Content-Type": "application/json", Prefer: "return=representation" },
          body: JSON.stringify({
            activity_id: activityId,
            occurrence_no: 1,
            start_at: act?.activity_date ? `${act.activity_date}T09:00:00Z` : new Date().toISOString(),
            status: "scheduled",
            participant_count: 0,
          }),
        });
        occurrenceId = newOcc?.[0]?.id;
      }

      // Check if survey already exists for this occurrence
      const existingSurveys = await callSupabase(env, token, `occurrence_surveys?occurrence_id=eq.${encodeURIComponent(occurrenceId)}&limit=1`);
      let surveyId = existingSurveys?.[0]?.id;
      if (!surveyId) {
        const newSurvey = await callSupabase(env, token, "occurrence_surveys", {
          method: "POST",
          headers: { "Content-Type": "application/json", Prefer: "return=representation" },
          body: JSON.stringify({
            occurrence_id: occurrenceId,
            enabled: true,
            anonymous: true,
            welcome_text: String(survey.welcomeText ?? survey.surveyTitle ?? "แบบประเมินความพึงพอใจและผลสัมฤทธิ์"),
          }),
        });
        surveyId = newSurvey?.[0]?.id;
      }

      // Add survey questions
      const sections = Array.isArray(survey.sections) ? (survey.sections as Array<Record<string, unknown>>) : [];
      let orderIndex = 1;
      for (const sec of sections) {
        const questions = Array.isArray(sec.questions) ? (sec.questions as Array<Record<string, unknown>>) : [];
        for (const q of questions) {
          const rawType = String(q.questionType ?? "rating");
          const type = rawType === "likert5" ? "rating" : rawType;
          await callSupabase(env, token, "survey_questions", {
            method: "POST",
            headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
            body: JSON.stringify({
              survey_id: surveyId,
              section_key: String(sec.id ?? "general"),
              question_text: String(q.title ?? "คำถามประเมิน"),
              question_type: ["rating", "text", "single_choice", "multi_choice"].includes(type) ? type : "rating",
              required: Boolean(q.required ?? true),
              order_index: orderIndex++,
              scale_min: 1,
              scale_max: 5,
              active: true,
            }),
          }).catch(() => undefined);
        }
      }

      // Audit survey confirmed and attached
      await callSupabase(env, token, "audit_logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actor_id: user.id,
          action: "survey confirmed",
          table_name: "occurrence_surveys",
          record_id: String(surveyId),
          new_data: { activityId, occurrenceId },
        }),
      }).catch(() => undefined);

      await callSupabase(env, token, "audit_logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actor_id: user.id,
          action: "survey attached to activity",
          table_name: "occurrence_surveys",
          record_id: String(surveyId),
          new_data: { activityId, occurrenceId, questionCount: orderIndex - 1 },
        }),
      }).catch(() => undefined);

      // Mark execution as completed
      const completedAt = new Date().toISOString();
      await callSupabase(env, token, `ai_executions?id=eq.${encodeURIComponent(execution.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "completed",
          completed_at: completedAt,
          output: {
            ...output,
            surveyId,
            occurrenceId,
            attachedAt: completedAt,
          },
        }),
      });

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

    // Standard tool execution flow
    const tools = await callSupabase(env, token, `ai_tools?id=eq.${encodeURIComponent(execution.tool_id ?? "")}&enabled=eq.true&select=id,tool_key,name,description,domain,endpoint,method,risk_level,permission,enabled&limit=1`);
    const tool = tools?.[0];
    if (!tool) return json({ success: false, error: "Tool no longer available" }, 404);

    if (tool.permission && !permissionsForRole(role).some((permission) => permission === tool.permission)) {
      return json({ success: false, error: "Forbidden: reviewer lacks tool permission" }, 403);
    }
    if (tool.risk_level === "critical" && role !== "SUPER_ADMIN") return json({ success: false, error: "Forbidden: critical AI actions require SUPER_ADMIN" }, 403);

    const executionUrl = new URL("/api/admin/ai-execution", request.url);
    const executionResponse = await fetch(executionUrl.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", Cookie: request.headers.get("Cookie") ?? "" },
      body: JSON.stringify({ executionId: execution.id }),
    });
    const executionResult = await executionResponse.json().catch(() => null);

    return json(
      {
        success: executionResponse.ok,
        status: executionResponse.ok ? "approved" : "failed",
        executionTriggered: executionResponse.ok,
        executionResult: executionResult?.data,
        error: executionResponse.ok ? undefined : executionResult?.error ?? "Execution trigger failed",
        message: executionResponse.ok ? "Execution approved and completed/started" : "Approval was recorded but execution failed",
      },
      executionResponse.ok ? 200 : 502,
    );
  } catch (error) {
    console.error("/api/admin/ai-approval", error instanceof Error ? error.message : "AI approval processing failed");
    return json({ success: false, error: error instanceof Error ? error.message : "AI approval processing failed" }, 500);
  }
}
