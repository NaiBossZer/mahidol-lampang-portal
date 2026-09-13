import { json, methodNotAllowed, type ApiRequest, type ApiResponse } from "../_http";
import { getUser, supabaseConfigured } from "../_supabase-auth";
import { isAdminRole, permissionsForRole, type AdminRole } from "../../src/auth/permissions";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);
  if (!supabaseConfigured()) return json(res, 503, { error: "Supabase Auth is not configured" });
  const user = await getUser(req);
  if (!user) return json(res, 401, { success: false, data: { authenticated: false } });
  const roleValue = user.app_metadata?.role;
  const role: AdminRole | null = isAdminRole(roleValue) ? roleValue : null;
  if (!role)
    return json(res, 403, { success: false, data: { authenticated: true, authorized: false } });
  return json(res, 200, {
    success: true,
    data: {
      authenticated: true,
      authorized: true,
      user: { id: user.id, email: user.email ?? null },
      role,
      permissions: permissionsForRole(role),
    },
  });
}
