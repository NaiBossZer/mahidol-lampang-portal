import { getSupabaseUser, isAdminRole, json, supabaseConfig } from "../auth/_shared";
type Env = Record<string, unknown>;
const cookie = (r: Request) => {
  const x = (r.headers.get("Cookie") ?? "")
    .split(";")
    .map((v) => v.trim())
    .find((v) => v.startsWith("sb_access_token="));
  return x ? decodeURIComponent(x.slice(17)) : null;
};
export async function onRequest({ request, env }: { request: Request; env: Env }) {
  try {
    const u = await getSupabaseUser(request, env),
      role = u?.app_metadata?.role,
      token = cookie(request);
    if (!u || !isAdminRole(role) || !token)
      return json({ success: false, error: "Unauthorized" }, 401);
    const { url, key } = supabaseConfig(env),
      headers = { apikey: key, Authorization: `Bearer ${token}`, Accept: "application/json" };
    if (request.method === "GET") {
      const r = await fetch(
        `${url}/rest/v1/admin_notifications?select=id,kind,title,body,link,read_at,created_at&recipient_user_id=eq.${u.id}&order=created_at.desc&limit=100`,
        { headers },
      );
      return json({ success: r.ok, data: r.ok ? await r.json() : [] }, r.ok ? 200 : r.status);
    }
    if (request.method === "PATCH") {
      const body = (await request.json()) as { id?: string };
      if (!body.id) return json({ success: false, error: "id required" }, 400);
      const r = await fetch(
        `${url}/rest/v1/admin_notifications?id=eq.${encodeURIComponent(body.id)}&recipient_user_id=eq.${u.id}`,
        {
          method: "PATCH",
          headers: {
            ...headers,
            "Content-Type": "application/json",
            Prefer: "return=representation",
          },
          body: JSON.stringify({ read_at: new Date().toISOString() }),
        },
      );
      return json({ success: r.ok, data: r.ok ? await r.json() : null }, r.ok ? 200 : r.status);
    }
    return json({ success: false, error: "Method Not Allowed" }, 405, { Allow: "GET, PATCH" });
  } catch (e) {
    console.error("/api/admin/notifications", e);
    return json(
      { success: false, error: e instanceof Error ? e.message : "Notifications failed" },
      500,
    );
  }
}
