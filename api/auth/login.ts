import { readJson, json, methodNotAllowed, type ApiRequest, type ApiResponse } from "../_http";
import { setAuthCookies, signInWithPassword, supabaseConfigured } from "../_supabase-auth";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  if (!supabaseConfigured()) return json(res, 503, { error: "ระบบยืนยันตัวตนยังไม่ได้ตั้งค่า Supabase Auth" });
  try {
    const body = await readJson(req) as Record<string, unknown>;
    const email = String(body.email ?? "").trim();
    const password = String(body.password ?? "");
    if (!email || !password) return json(res, 400, { error: "กรุณาระบุอีเมลและรหัสผ่าน" });
    const session = await signInWithPassword(email, password);
    setAuthCookies(res, session.access_token, session.refresh_token, Number(session.expires_in ?? 28800));
    return json(res, 200, { success: true, data: { authenticated: true, user: session.user ?? null } });
  } catch (error) {
    return json(res, 401, { error: error instanceof Error ? error.message : "เข้าสู่ระบบไม่สำเร็จ" });
  }
}
