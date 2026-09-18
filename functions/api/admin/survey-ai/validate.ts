import { getCookie, getSupabaseUser, isAdminRole, json, supabaseConfig } from "../../auth/_shared";
import { validateGeneratedSurvey, improveWithPathumma, type GeneratedSurvey } from "../../../../lib/survey-ai";

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

  try {
    const body = (await request.json()) as { executionId?: string; survey?: GeneratedSurvey };
    const executionId = body.executionId?.trim();
    if (!executionId || !body.survey) return json({ success: false, error: "executionId และ survey จำเป็น" }, 400);

    const executions = await db<Record<string, unknown>[]>(env, auth.token, `ai_executions?id=eq.${encodeURIComponent(executionId)}&select=id,status,input,output&limit=1`);
    const execution = executions?.[0];
    if (!execution) return json({ success: false, error: "ไม่พบ AI execution" }, 404);
    if (execution.status !== "awaiting_approval") {
      return json({ success: false, error: "แก้ไขได้เฉพาะ Survey ที่อยู่ระหว่าง Admin Review" }, 409);
    }

    const validation = validateGeneratedSurvey(body.survey);
    if (!validation.valid) {
      return json({ success: false, error: "Survey validation failed", data: validation }, 422);
    }

    const output = execution.output && typeof execution.output === "object"
      ? (execution.output as Record<string, unknown>)
      : {};

    await db(env, auth.token, `ai_executions?id=eq.${encodeURIComponent(executionId)}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        output: { ...output, survey: body.survey, validation, adminEdited: true, lastReviewedAt: new Date().toISOString() },
      }),
    });

    await db(env, auth.token, "audit_logs", {
      method: "POST",
      body: JSON.stringify({
        actor_id: auth.user.id,
        action: "survey draft reviewed",
        table_name: "ai_executions",
        record_id: executionId,
        new_data: { validation, adminEdited: true },
      }),
    }).catch(() => undefined);

    return json({ success: true, data: { survey: body.survey, validation } });
  } catch (error) {
    return json({ success: false, error: error instanceof Error ? error.message : "Survey validation failed" }, 500);
  }
}
