import type { ApiRequest, ApiResponse } from "./_http";
import { clearAuthCookies } from "./_supabase-auth";
import { adminIdentity } from "./_authorization";

/** Compatibility layer for legacy APIs; authentication is now Supabase-backed. */
export function setAdminSession(_res: ApiResponse): void {
  // Legacy login no longer creates admin_session. Kept only for source compatibility.
}

export function clearAdminSession(res: ApiResponse): void {
  clearAuthCookies(res);
}

export function isAdmin(req: ApiRequest): boolean {
  return adminIdentity(req) !== null;
}
