import { getCookie, getSupabaseUser, hasAdminPermission, isAdminRole, json, supabaseConfig } from "../auth/_shared";

type Env = Record<string, unknown>;
type Row = Record<string, unknown>;

async function authorize(request: Request, env: Env, permission: string) {
  const user = await getSupabaseUser(request, env);
  const role = user?.app_metadata?.role;
  const token = getCookie(request, "sb_access_token");
  if (!user || !isAdminRole(role) || !hasAdminPermission(role, permission) || !token) return null;
  return { user, role, token };
}

async function sb<T>(env: Env, token: string, path: string, init: RequestInit = {}) {
  const { url, key, configured } = supabaseConfig(env);
  if (!configured) throw new Error("Supabase is not configured");
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: key, Authorization: `Bearer ${token}`, Accept: "application/json", "Content-Type": "application/json", ...(init.headers ?? {}) },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const detail = typeof body === "object" && body !== null ? String((body as Record<string, unknown>).message ?? (body as Record<string, unknown>).hint ?? "") : "";
    throw new Error(`Supabase REST ${response.status}${detail ? `: ${detail.slice(0, 220)}` : ""}`);
  }
  return body as T;
}

export async function onRequest({ request, env }: { request: Request; env: Env }) {
  const method = request.method.toUpperCase();
  if (!["GET", "DELETE"].includes(method))
    return json({ success: false, error: "Method Not Allowed" }, 405, { Allow: "GET, DELETE" });
  const auth = await authorize(request, env, method === "GET" ? "survey.read" : "survey.update");
  if (!auth) return json({ success: false, error: "Unauthorized" }, 401);
  const url = new URL(request.url);
  const surveyId = url.searchParams.get("surveyId");
  if (!surveyId) return json({ success: false, error: "ต้องระบุ surveyId" }, 400);

  try {
    if (method === "GET") {
      const rows = await sb<Row[]>(env, auth.token,
        `survey_test_responses?survey_id=eq.${encodeURIComponent(surveyId)}&select=id,survey_id,occurrence_id,submitted_by,answers,created_at&order=created_at.desc`);
      return json({ success: true, data: rows });
    }
    const responseId = url.searchParams.get("id");
    if (!responseId) return json({ success: false, error: "ต้องระบุ id ของรายการทดสอบ" }, 400);
    const deleted = await sb<Row[]>(env, auth.token,
      `survey_test_responses?id=eq.${encodeURIComponent(responseId)}&survey_id=eq.${encodeURIComponent(surveyId)}&select=id`,
      { method: "DELETE", headers: { Prefer: "return=representation" } });
    if (!deleted.length) return json({ success: false, error: "ไม่พบรายการทดสอบหรือไม่มีสิทธิ์ลบ" }, 404);
    return json({ success: true, data: { id: responseId } });
  } catch (error) {
    console.error("/api/admin/survey-tests", error);
    return json({ success: false, error: error instanceof Error ? error.message : "ไม่สามารถจัดการข้อมูลทดสอบได้" }, 500);
  }
}
