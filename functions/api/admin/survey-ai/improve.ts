import { getCookie, getSupabaseUser, isAdminRole, json, supabaseConfig } from "../../auth/_shared";
import { validateGeneratedSurvey, improveWithPathumma, type GeneratedSurvey } from "../_survey-ai";

type Env = Record<string, unknown>;
const ALLOWED_ROLES = new Set(["SUPER_ADMIN", "CONTENT_ADMIN", "OPERATIONS_ADMIN"]);

async function db<T>(env: Env, token: string, path: string, init: RequestInit = {}): Promise<T> {
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
  if (!response.ok) throw new Error(`Supabase REST ${response.status}: ${JSON.stringify(body).slice(0, 300)}`);
  return body as T;
}

async function authorize(request: Request, env: Env) {
  const user = await getSupabaseUser(request, env);
  const role = String(user?.app_metadata?.role ?? "");
  const token = getCookie(request, "sb_access_token");
  if (!user || !isAdminRole(role) || !token) return null;
  if (!ALLOWED_ROLES.has(role)) return null;
  return { user, role, token };
}

export async function onRequest({ request, env }: { request: Request; env: Env }) {
  if (request.method !== "POST") return json({ success: false, error: "Method Not Allowed" }, 405);
  const auth = await authorize(request, env);
  if (!auth) return json({ success: false, error: "Unauthorized" }, 401);

  let executionId = "";
  try {
    const body = (await request.json()) as {
      executionId?: string;
      activityId?: string;
      instruction?: string;
      survey?: GeneratedSurvey;
    };
    const activityId = body.activityId?.trim();
    const instruction = body.instruction?.trim();
    if (!activityId || !instruction || !body.survey) {
      return json({ success: false, error: "activityId, instruction และ survey จำเป็น" }, 400);
    }

    const activities = await db<Record<string, unknown>[]>(env, auth.token, `activities?id=eq.${encodeURIComponent(activityId)}&select=id,title,activity_date,location,objective,participant_count,summary,content,process,outcome,impact&limit=1`);
    const activity = activities?.[0];
    if (!activity) return json({ success: false, error: "ไม่พบกิจกรรม" }, 404);

    const analyses = await db<Record<string, unknown>[]>(env, auth.token, `ai_executions?intent=eq.document_analysis&input->>activityId=eq.${encodeURIComponent(activityId)}&order=created_at.desc&limit=1`);
    const output = analyses?.[0]?.output && typeof analyses[0].output === "object" ? (analyses[0].output as Record<string, unknown>) : {};

    const created = await db<Record<string, unknown>[]>(env, auth.token, "ai_executions", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        actor_id: auth.user.id,
        intent: "survey_generation",
        status: "running",
        risk_level: "medium",
        input: { activityId, activityTitle: activity.title, provider: "pathumma", operation: "improve", instruction, parentExecutionId: body.executionId ?? null },
        started_at: new Date().toISOString(),
      }),
    });
    executionId = String(created?.[0]?.id ?? crypto.randomUUID());

    const result = await improveWithPathumma(
      env,
      {
        activity,
        analysis: {
          summary: typeof output.summary === "string" ? output.summary : "",
          extractedEntities: Array.isArray(output.extractedEntities) ? output.extractedEntities : [],
          primaryDoc: typeof output.primaryDoc === "string" ? output.primaryDoc : undefined,
        },
        requestedInstruction: instruction,
      },
      body.survey,
    );

    const validation = validateGeneratedSurvey(result.survey);
    if (!validation.valid) throw new Error(validation.errors.join("; "));

    await db(env, auth.token, `ai_executions?id=eq.${encodeURIComponent(executionId)}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        status: "awaiting_approval",
        output: {
          survey: result.survey,
          provider: result.provider,
          model: result.model,
          validation,
          parentExecutionId: body.executionId ?? null,
          instruction,
        },
        completed_at: new Date().toISOString(),
      }),
    });

    return json({ success: true, data: { executionId, survey: result.survey, validation, provider: result.provider, model: result.model } });
  } catch (error) {
    if (executionId) {
      await db(env, auth.token, `ai_executions?id=eq.${encodeURIComponent(executionId)}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "failed", error: error instanceof Error ? error.message : "AI Improve failed", completed_at: new Date().toISOString() }),
      }).catch(() => undefined);
    }
    return json({ success: false, error: error instanceof Error ? error.message : "AI Improve failed" }, 500);
  }
}
