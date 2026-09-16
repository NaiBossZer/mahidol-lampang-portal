import type { ApiRequest, ApiResponse } from "./_http";
import { clearAuthCookies } from "./_supabase-auth";
import { adminIdentity } from "./_authorization";
import { createDefaultAuthorization } from "../src/auth/authorization";

/**
 * Legacy compatibility layer for authentication.
 * These functions maintain the existing API while internally using the new authorization module.
 * Gradually migrate API handlers to use the new module directly.
 */

// Initialize authorization module for internal use
const auth = createDefaultAuthorization();

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

/**
 * Internal async function to get admin identity using new authorization module.
 */
async function getAdminIdentityAsync(req: ApiRequest) {
  const cookie = req.headers.cookie ?? "";
  const match = cookie.match(/(?:^|;\s*)sb_access_token=([^;]+)/);
  const token = match?.[1] ? decodeURIComponent(match[1]) : null;
  if (!token) return null;
  return auth.validateToken(token);
}

/**
 * Async version of isAdmin using new authorization module.
 * @deprecated Use auth.validateToken() directly for new code
 */
export async function isAdminAsync(req: ApiRequest): Promise<boolean> {
  const identity = await getAdminIdentityAsync(req);
  return identity !== null;
}
