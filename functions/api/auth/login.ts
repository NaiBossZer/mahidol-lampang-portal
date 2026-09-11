import { cookieHeaders, json, supabaseConfig } from "./_shared";

export async function onRequestPost({ request, env }: { request: Request; env: Record<string, unknown> }) {
  const { url, key, configured } = supabaseConfig(env);
  if (!configured) return json({ error: "ระบบยืนยันตัวตนยังไม่ได้ตั้งค่า Supabase Auth" }, 503);

  let body: Record<string, unknown>;
  try {
    body = await request.json() as Record<string, unknown>;
  } catch {
    return json({ error: "ข้อมูลการเข้าสู่ระบบไม่ถูกต้อง" }, 400);
  }

  const email = String(body.email ?? "").trim();
  const password = String(body.password ?? "");
  if (!email || !password) return json({ error: "กรุณาระบุอีเมลและรหัสผ่าน" }, 400);

  const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: key, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const result = await response.json().catch(() => ({})) as Record<string, unknown>;

  if (!response.ok) {
    return json({ error: String(result.error_description ?? result.msg ?? "เข้าสู่ระบบไม่สำเร็จ") }, 401);
  }

  const accessToken = String(result.access_token ?? "");
  const refreshToken = String(result.refresh_token ?? "");
  if (!accessToken || !refreshToken) return json({ error: "ระบบยืนยันตัวตนส่ง session กลับมาไม่ครบ" }, 502);

  const headers = new Headers({ "Content-Type": "application/json; charset=utf-8" });
  for (const cookie of cookieHeaders(accessToken, refreshToken, Number(result.expires_in ?? 28800))) {
    headers.append("Set-Cookie", cookie);
  }

  return new Response(JSON.stringify({
    success: true,
    data: { authenticated: true, user: result.user ?? null },
  }), { status: 200, headers });
}
