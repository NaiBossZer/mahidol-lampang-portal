import {
  getCookie,
  getSupabaseUser,
  isAdminRole,
  json,
  supabaseConfig,
} from "../auth/_shared";
import {
  generateWithPathumma,
  validateGeneratedSurvey,
  type GeneratedSurvey,
} from "../../../lib/survey-ai";

type Env = Record<string, unknown>;

const ALLOWED_ROLES = new Set(["SUPER_ADMIN", "CONTENT_ADMIN", "OPERATIONS_ADMIN"]);

async function callDb<T>(
  env: Env,
  token: string,
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const { url, key, configured } = supabaseConfig(env);
  if (!configured) throw new Error("Supabase is not configured");
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(`Supabase REST ${response.status}: ${JSON.stringify(body).slice(0, 300)}`);
  }
  return body as T;
}

async function getSurveyContext(env: Env, token: string, activityId: string, clientEntities: unknown[]) {
  const activities = await callDb<Record<string, unknown>[]>(
    env,
    token,
    `activities?id=eq.${encodeURIComponent(activityId)}&select=id,title,activity_date,location,objective,participant_count,summary,content,process,outcome,impact&limit=1`,
  );
  const activity = activities?.[0];
  if (!activity) throw new Error("ไม่พบกิจกรรม");

  const analyses = await callDb<Record<string, unknown>[]>(
    env,
    token,
    `ai_executions?intent=eq.document_analysis&input->>activityId=eq.${encodeURIComponent(activityId)}&order=created_at.desc&limit=1`,
  );
  const latest = analyses?.[0];
  const analysisOutput =
    latest?.output && typeof latest.output === "object"
      ? (latest.output as Record<string, unknown>)
      : {};

  const storedEntities = Array.isArray(analysisOutput.extractedEntities)
    ? analysisOutput.extractedEntities
    : [];

  return {
    activity,
    analysis: {
      summary: typeof analysisOutput.summary === "string" ? analysisOutput.summary : undefined,
      extractedEntities: [...storedEntities, ...clientEntities],
      primaryDoc:
        typeof analysisOutput.primaryDoc === "string" ? analysisOutput.primaryDoc : undefined,
    },
  };
}

export async function onRequest({ request, env }: { request: Request; env: Env }) {
  if (request.method !== "POST" && request.method !== "GET") {
    return json({ success: false, error: "Method Not Allowed" }, 405, {
      Allow: "GET, POST",
    });
  }

  const user = await getSupabaseUser(request, env);
  const role = String(user?.app_metadata?.role ?? "");
  const token = getCookie(request, "sb_access_token");

  if (!user || !isAdminRole(role) || !token) {
    return json({ success: false, error: "Unauthorized" }, 401);
  }
  if (!ALLOWED_ROLES.has(role)) {
    return json({ success: false, error: "Forbidden: role lacks AI survey permission" }, 403);
  }

  if (request.method === "GET") {
    const url = new URL(request.url);
    const activityId = url.searchParams.get("activityId")?.trim();
    if (!activityId) return json({ success: false, error: "activityId required" }, 400);

    try {
      const executions = await callDb<Record<string, unknown>[]>(
        env,
        token,
        `ai_executions?intent=eq.survey_generation&input->>activityId=eq.${encodeURIComponent(activityId)}&order=created_at.desc&limit=1`,
      );
      const execution = executions?.[0];
      if (!execution) return json({ success: true, data: null });

      return json({
        success: true,
        data: {
          id: execution.id,
          status: execution.status,
          survey: (execution.output as Record<string, unknown>)?.survey ?? null,
          validation: (execution.output as Record<string, unknown>)?.validation ?? null,
          provider: (execution.output as Record<string, unknown>)?.provider ?? null,
          model: (execution.output as Record<string, unknown>)?.model ?? null,
          error: execution.error ?? null,
          createdAt: execution.created_at,
          completedAt: execution.completed_at,
        },
      });
    } catch (error) {
      return json(
        { success: false, error: error instanceof Error ? error.message : "Load failed" },
        500,
      );
    }
  }

  let executionId = "";
  try {
    const body = (await request.json()) as {
      activityId?: string;
      entities?: unknown[];
      survey?: GeneratedSurvey;
      instruction?: string;
    };
    const activityId = body.activityId?.trim();
    if (!activityId) return json({ success: false, error: "activityId required" }, 400);

    const context = await getSurveyContext(
      env,
      token,
      activityId,
      Array.isArray(body.entities) ? body.entities : [],
    );

    const executionInsert = await callDb<Record<string, unknown>[]>(env, token, "ai_executions", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        actor_id: user.id,
        intent: "survey_generation",
        status: "running",
        risk_level: "medium",
        input: {
          activityId,
          activityTitle: context.activity.title,
          provider: "pathumma",
          operation: "generate",
          context: {
            objective: context.activity.objective ?? null,
            targetGroup: context.activity.participant_count ?? null,
            location: context.activity.location ?? null,
            analysisExecutionReferenced: true,
            primaryDoc: context.analysis.primaryDoc ?? null,
          },
        },
        started_at: new Date().toISOString(),
      }),
    });
    executionId = String(executionInsert?.[0]?.id ?? crypto.randomUUID());

    const result = await generateWithPathumma(env, {
      ...context,
      requestedInstruction: body.instruction,
    });

    const validation = validateGeneratedSurvey(result.survey);
    if (!validation.valid) {
      throw new Error(validation.errors.join("; "));
    }

    await callDb(env, token, `ai_executions?id=eq.${encodeURIComponent(executionId)}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        status: "awaiting_approval",
        output: {
          survey: result.survey,
          provider: result.provider,
          model: result.model,
          validation,
        },
        completed_at: new Date().toISOString(),
      }),
    });

    await callDb(env, token, "audit_logs", {
      method: "POST",
      body: JSON.stringify({
        actor_id: user.id,
        action: "survey generated",
        table_name: "ai_executions",
        record_id: executionId,
        new_data: {
          activityId,
          provider: result.provider,
          model: result.model,
          totalSections: result.survey.sections.length,
          validation,
        },
      }),
    }).catch(() => undefined);

    return json({
      success: true,
      data: {
        executionId,
        survey: result.survey,
        validation,
        provider: result.provider,
        model: result.model,
      },
    });
  } catch (error) {
    if (executionId) {
      await callDb(env, token, `ai_executions?id=eq.${encodeURIComponent(executionId)}`, {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          status: "failed",
          error: error instanceof Error ? error.message : "AI Survey Generation failed",
          completed_at: new Date().toISOString(),
        }),
      }).catch(() => undefined);
    }

    console.error("/api/admin/ai-survey-generate error:", error);
    return json(
      {
        success: false,
        error: error instanceof Error ? error.message : "AI Survey Generation failed",
        executionId: executionId || undefined,
      },
      500,
    );
  }
}
