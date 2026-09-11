import type { ApiRequest, ApiResponse } from "./_http";
import { json } from "./_http";
import { requireAuth } from "./_supabase-auth";

export const ADMIN_ROLE = "ADMIN" as const;

export async function requireAdmin(req: ApiRequest, res: ApiResponse) {
  const user = await requireAuth(req, res);
  if (!user) { json(res, 401, { error: "Unauthorized" }); return null; }
  return user;
}

export async function requirePermission(req: ApiRequest, res: ApiResponse, _permission: string) {
  return requireAdmin(req, res);
}
