import crypto from "node:crypto";
import type { ApiRequest, ApiResponse } from "./_http";
import { json } from "./_http";

export const ADMIN_ROLE = "ADMIN" as const;
function token(req: ApiRequest) { const m = (req.headers.cookie ?? "").match(/(?:^|;\s*)sb_access_token=([^;]+)/); return m?.[1] ? decodeURIComponent(m[1]) : null; }
function part(value: string) { try { return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as Record<string, unknown>; } catch { return null; } }
export function adminIdentity(req: ApiRequest) {
  const raw = token(req); if (!raw) return null;
  const [h, p, s] = raw.split("."); if (!h || !p || !s) return null;
  const header = part(h); const payload = part(p); const secret = process.env.SUPABASE_JWT_SECRET ?? "";
  if (!header || !payload || header.alg !== "HS256" || !secret) return null;
  const expected = crypto.createHmac("sha256", secret).update(`${h}.${p}`).digest("base64url");
  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(s))) return null;
  if (typeof payload.exp === "number" && payload.exp < Math.floor(Date.now() / 1000)) return null;
  if (typeof payload.sub !== "string" || !payload.sub) return null;
  return { id: payload.sub, email: typeof payload.email === "string" ? payload.email : null, role: ADMIN_ROLE };
}
export function requireAdmin(req: ApiRequest, res: ApiResponse) { const identity = adminIdentity(req); if (!identity) { json(res, 401, { error: "Unauthorized" }); return null; } return identity; }
export function requirePermission(req: ApiRequest, res: ApiResponse, _permission: string) { return requireAdmin(req, res); }
