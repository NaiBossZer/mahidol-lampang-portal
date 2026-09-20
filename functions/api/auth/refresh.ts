import { cookieHeaders, getCookie, json, supabaseConfig } from "./_shared";

type PagesContext = { request: Request; env: Record<string, unknown> };

async function handlePost({ request, env }: PagesContext): Promise<Response> {
  const { url, key, configured } = supabaseConfig(env);
  if (!configured) return json({ success: false, error: "Supabase Auth is not configured" }, 503);

  const refreshToken = getCookie(request, "sb_refresh_token");
  if (!refreshToken) return json({ success: false, error: "Refresh session not found" }, 401);

  const response = await fetch(url + "/auth/v1/token?grant_type=refresh_token", {
    method: "POST",
    headers: { apikey: key, "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  const result = (await response.json().catch(() => ({}))) as Record<string, unknown>;

  if (!response.ok) {
    const errorMessage = String(result.error_description ?? result.msg ?? "Session refresh failed");
    const headers = new Headers({
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store, private",
    });
    if (response.status === 400 || response.status === 401)
      for (const cookie of cookieHeaders("", "", 0)) headers.append("Set-Cookie", cookie);
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 401,
      headers,
    });
  }

  const accessToken = typeof result.access_token === "string" ? result.access_token : "";
  const nextRefreshToken = typeof result.refresh_token === "string" ? result.refresh_token : refreshToken;
  if (!accessToken) return json({ success: false, error: "Refresh response missing access token" }, 502);

  const expiresIn = Number(result.expires_in ?? 28800);
  const safeExpiresIn = Number.isFinite(expiresIn) && expiresIn > 0 ? expiresIn : 28800;
  const headers = new Headers({
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store, private",
  });
  for (const cookie of cookieHeaders(accessToken, nextRefreshToken, safeExpiresIn))
    headers.append("Set-Cookie", cookie);

  return new Response(JSON.stringify({ success: true, data: { authenticated: true } }), {
    status: 200,
    headers,
  });
}

export async function onRequestPost(context: PagesContext) {
  return handlePost(context);
}

export async function onRequest(context: PagesContext) {
  if (context.request.method === "POST") return handlePost(context);
  return json({ success: false, error: "Method Not Allowed" }, 405, { Allow: "POST" });
}