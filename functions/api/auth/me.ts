import { getSupabaseUser, isAdminRole, json, permissionsForRole, supabaseConfig } from "./_shared";

type PagesContext = { request: Request; env: Record<string, unknown> };

async function handleGet({ request, env }: PagesContext): Promise<Response> {
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

export async function onRequestGet(context: PagesContext) {
  return handleGet(context);
}

export async function onRequest(context: PagesContext) {
  if (context.request.method === "GET") return handleGet(context);
  return json({ error: "Method Not Allowed" }, 405, { Allow: "GET" });
}
