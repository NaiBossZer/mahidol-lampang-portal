import { getCookie, getSupabaseUser, json } from "./_shared";

type PagesContext = { request: Request; env: Record<string, unknown> };

export async function onRequestGet({ request, env }: PagesContext) {
  const user = await getSupabaseUser(request, env);
  if (!user) return json({ success: false, data: { authenticated: false } }, 401);
  const accessToken = getCookie(request, "sb_access_token");
  const refreshToken = getCookie(request, "sb_refresh_token");
  if (!accessToken || !refreshToken) return json({ success: false, error: "Portal session is incomplete" }, 401);
  return json({ success: true, data: { authenticated: true, access_token: accessToken, refresh_token: refreshToken, user: { id: user.id, email: user.email ?? null } } });
}

export async function onRequest({ request, env }: PagesContext) {
  if (request.method === "GET") return onRequestGet({ request, env });
  return json({ error: "Method Not Allowed" }, 405, { Allow: "GET" });
}
