import { getSupabaseUser, isAdminRole, json, permissionsForRole, supabaseConfig } from "./_shared";

export async function onRequestGet({ request, env }: { request: Request; env: Record<string, unknown> }) {
  if (!supabaseConfig(env).configured) {
    return json({ error: "Supabase Auth is not configured" }, 503);
  }

  const user = await getSupabaseUser(request, env);
  if (!user) return json({ success: false, data: { authenticated: false } }, 401);

  const roleValue = user.app_metadata?.role;
  if (!isAdminRole(roleValue)) {
    return json({ success: false, data: { authenticated: true, authorized: false } }, 403);
  }

  return json({
    success: true,
    data: {
      authenticated: true,
      authorized: true,
      user: { id: user.id, email: user.email ?? null },
      role: roleValue,
      permissions: permissionsForRole(roleValue),
    },
  });
}
