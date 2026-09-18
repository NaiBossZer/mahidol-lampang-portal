import { isAdminRole, type AdminRole } from "../permissions";

/**
 * JWT payload structure for role extraction
 */
export interface JwtPayload {
  sub?: string;
  email?: string;
  exp?: number;
  role?: unknown;
  app_metadata?: {
    role?: unknown;
  };
}

/**
 * Extract role from JWT payload
 * Reads only app_metadata.role. The JWT top-level `role` claim is not an application RBAC role.
 * @param payload - JWT payload
 * @returns AdminRole if valid, null otherwise
 */
export function extractRole(payload: JwtPayload): AdminRole | null {
  const appMeta =
    payload.app_metadata && typeof payload.app_metadata === "object"
      ? (payload.app_metadata as Record<string, unknown>)
      : {};
  const roleValue = appMeta.role;
  return isAdminRole(roleValue) ? roleValue : null;
}

/**
 * Extract user ID from JWT payload
 * @param payload - JWT payload
 * @returns User ID if present and valid, null otherwise
 */
export function extractUserId(payload: JwtPayload): string | null {
  return typeof payload.sub === "string" && payload.sub ? payload.sub : null;
}

/**
 * Extract email from JWT payload
 * @param payload - JWT payload
 * @returns Email if present and valid, null otherwise
 */
export function extractEmail(payload: JwtPayload): string | null {
  return typeof payload.email === "string" ? payload.email : null;
}

/**
 * Check if JWT payload is expired
 * @param payload - JWT payload
 * @returns true if expired, false otherwise
 */
export function isExpired(payload: JwtPayload): boolean {
  if (typeof payload.exp !== "number") return true;
  return payload.exp <= Math.floor(Date.now() / 1000);
}