import type { ApiRequest, ApiResponse } from "./_http";
import { json } from "./_http";
import { adminIdentity } from "./_authorization";
export const ADMIN_ROLE = "ADMIN" as const;
export function requireAdmin(req: ApiRequest, res: ApiResponse) { const identity = adminIdentity(req); if (!identity) { json(res, 401, { error: "Unauthorized" }); return null; } return identity; }
export function requirePermission(req: ApiRequest, res: ApiResponse, _permission: string) { return requireAdmin(req, res); }
