import { getSupabaseUser, isAdminRole, json, supabaseConfig, hasAdminPermission } from "../auth/_shared";
type Env = Record<string, unknown>;
const cookie = (r: Request) => {
  const x = (r.headers.get("Cookie") ?? "")
    .split(";")
    .map((v) => v.trim())
    .find((v) => v.startsWith("sb_access_token="));
  return x ? decodeURIComponent(x.slice("sb_access_token=".length)) : null;
};
export async function onRequest({ request, env }: { request: Request; env: Env }) {
  try {
    const u = await getSupabaseUser(request, env),
      role = u?.app_metadata?.role,
      t = cookie(request);
    if (!u || !isAdminRole(role) || !t)
      return json({ success: false, error: "Unauthorized" }, 401);

    const { url, key } = supabaseConfig(env);
    if (!url || !key) return json({ success: false, error: "Supabase is not configured" }, 503);

    if (request.method === "GET") {
      if (!hasAdminPermission(role, "system.read"))
        return json({ success: false, error: "Forbidden" }, 403);
      const r = await fetch(
        `${url}/rest/v1/system_registry?select=system_key,system_name,system_type,base_url,status,owner_domain,updated_at&order=system_name.asc`,
        { headers: { apikey: key, Authorization: `Bearer ${t}`, Accept: "application/json" } },
      );
      const b = await r.json().catch(() => null);
      return json({ success: r.ok, data: b }, r.ok ? 200 : r.status);
    }

    if (request.method === "PATCH") {
      if (!hasAdminPermission(role, "system.manage"))
        return json({ success: false, error: "Forbidden" }, 403);
      const body = (await request.json().catch(() => null)) as
        | { systemKey?: string; baseUrl?: string | null }
        | null;
      const systemKey = String(body?.systemKey ?? "").trim();
      const baseUrl = body?.baseUrl === null ? null : String(body?.baseUrl ?? "").trim();
      if (!systemKey) return json({ success: false, error: "systemKey is required" }, 400);
      if (baseUrl !== null && !/^https?:\/\/[^\s]+$/i.test(baseUrl))
        return json({ success: false, error: "baseUrl must be an http(s) URL" }, 400);

      const r = await fetch(
        `${url}/rest/v1/system_registry?system_key=eq.${encodeURIComponent(systemKey)}`,
        {
          method: "PATCH",
          headers: {
            apikey: key,
            Authorization: `Bearer ${t}`,
            Accept: "application/json",
            "Content-Type": "application/json",
            Prefer: "return=representation",
          },
          body: JSON.stringify({ base_url: baseUrl, updated_at: new Date().toISOString() }),
        },
      );
      const b = await r.json().catch(() => null);
      return json({ success: r.ok, data: b }, r.ok ? 200 : r.status);
    }

    return json({ success: false, error: "Method Not Allowed" }, 405, {
      Allow: "GET, PATCH",
    });
  } catch (e) {
    console.error("/api/admin/system-settings", e);
    return json({ success: false, error: e instanceof Error ? e.message : "Settings failed" }, 500);
  }
}
