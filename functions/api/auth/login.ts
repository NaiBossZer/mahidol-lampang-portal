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

  const headers = new Headers({ "Content-Type": "application/json; charset=utf-8" });
  headers.append("Set-Cookie", cookieHeaders(
    String(result.access_token),
    String(result.refresh_token),
    Number(result.expires_in ?? 28800),
  )[0]);
  headers.append("Set-Cookie", cookieHeaders(
    String(result.access_token),
    String(result.refresh_token),
    Number(result.expires_in ?? 28800),
  )[1]);

  return new Response(JSON.stringify({
    success: true,
    data: { authenticated: true, user: result.user ?? null },
  }), { status: 200, headers });
}
