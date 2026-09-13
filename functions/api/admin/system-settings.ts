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
      t = cookie(request);
    if (request.method !== "GET")
      return json({ success: false, error: "Method Not Allowed" }, 405, { Allow: "GET" });
    if (!u || !isAdminRole(role) || !t) return json({ success: false, error: "Unauthorized" }, 401);
    const { url, key } = supabaseConfig(env);
    const r = await fetch(
      `${url}/rest/v1/system_registry?select=system_key,system_name,system_type,base_url,status,owner_domain,updated_at&order=system_name.asc`,
      { headers: { apikey: key, Authorization: `Bearer ${t}`, Accept: "application/json" } },
    );
    const b = await r.json().catch(() => null);
    return json({ success: r.ok, data: b }, r.ok ? 200 : r.status);
  } catch (e) {
    console.error("/api/admin/system-settings", e);
    return json({ success: false, error: e instanceof Error ? e.message : "Settings failed" }, 500);
  }
}
