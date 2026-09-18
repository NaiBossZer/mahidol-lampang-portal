import { getSupabaseUser, isAdminRole, json, supabaseConfig, hasAdminPermission } from "../auth/_shared";
type Env = Record<string, unknown>;
const cookie = (r: Request) => {
  const x = (r.headers.get("Cookie") ?? "")
    .split(";")
    .map((v) => v.trim())
    .find((v) => v.startsWith("sb_access_token="));
  return x ? decodeURIComponent(x.slice(17)) : null;
};
async function rpc<T>(env: Env, token: string, functionName: string, body: unknown): Promise<T> {
  const { url, key } = supabaseConfig(env);
  const r = await fetch(`${url}/rest/v1/rpc/${functionName}`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  const b = await r.json().catch(() => null);
  if (!r.ok) {
    const detail =
      typeof b?.message === "string"
        ? b.message
        : typeof b?.error_description === "string"
          ? b.error_description
          : typeof b?.error === "string"
            ? b.error
            : JSON.stringify(b);
    throw new Error(`Admin users RPC ${r.status}: ${detail?.slice(0, 300) || "request failed"}`);
  }
  return b as T;
}
export async function onRequest({ request, env }: { request: Request; env: Env }) {
  try {
    const u = await getSupabaseUser(request, env),
      actorRole = u?.app_metadata?.role,
      token = cookie(request);
    if (!u || !isAdminRole(actorRole) || !token)
      return json({ success: false, error: "Unauthorized" }, 401);
    if (!hasAdminPermission(actorRole, "system.read"))
      return json({ success: false, error: "Forbidden" }, 403);
    const { url, key } = supabaseConfig(env);
    const headers = { apikey: key, Authorization: `Bearer ${token}`, Accept: "application/json" };
    if (request.method === "GET") {
      const data = await rpc<unknown[]>(env, token, "list_central_admin_users", {});
      return json({ success: true, data });
    }
    if (request.method === "PATCH") {
      if (!hasAdminPermission(actorRole, "system.manage"))
        return json({ success: false, error: "Forbidden" }, 403);

      const body = (await request.json()) as { userId?: string; role?: unknown };
      if (!body.userId || typeof body.role !== "string")
        return json({ success: false, error: "userId and role required" }, 400);
      if (!isAdminRole(body.role))
        return json({ success: false, error: "Invalid central admin role" }, 400);

      // Never allow an administrator to remove their own last SUPER_ADMIN boundary
      // through the role-management UI/API. This prevents accidental self-lockout.
      if (body.userId === u.id && body.role !== "SUPER_ADMIN")
        return json(
          { success: false, error: "You cannot downgrade your own SUPER_ADMIN account from the active session." },
          409,
        );

      return json({
        success: true,
        data: await rpc(env, token, "set_central_admin_role", {
          target_user_id: body.userId,
          new_role: body.role,
        }),
      });
    }
    return json({ success: false, error: "Method Not Allowed" }, 405, { Allow: "GET, PATCH" });
  } catch (e) {
    console.error("/api/admin/users", e);
    return json(
      { success: false, error: e instanceof Error ? e.message : "Admin users failed" },
      500,
    );
  }
}
