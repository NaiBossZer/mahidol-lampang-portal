import crypto from "node:crypto";
import type { ApiRequest, ApiResponse } from "./_http";
import { json } from "./_http";
import { hasAdminPermission, isAdminRole, type AdminRole } from "../src/auth/permissions";

function accessToken(req: ApiRequest): string | null {
  const match = (req.headers.cookie ?? "").match(/(?:^|;\s*)sb_access_token=([^;]+)/);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

function decodePart(value: string): Record<string, unknown> | null {
  try {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export type AdminIdentity = { id: string; email: string | null; role: AdminRole };

export function adminIdentity(req: ApiRequest): AdminIdentity | null {
  const raw = accessToken(req);
  if (!raw) return null;
  const [headerPart, payloadPart, signature] = raw.split(".");
  if (!headerPart || !payloadPart || !signature) return null;
  const header = decodePart(headerPart);
  const payload = decodePart(payloadPart);
  const secret = process.env.SUPABASE_JWT_SECRET ?? "";
  if (!header || !payload || header.alg !== "HS256" || !secret) return null;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${headerPart}.${payloadPart}`)
    .digest("base64url");
  const expectedBytes = Buffer.from(expected);
  const actualBytes = Buffer.from(signature);
  if (
    expectedBytes.length !== actualBytes.length ||
    !crypto.timingSafeEqual(expectedBytes, actualBytes)
  )
    return null;
  if (typeof payload.exp !== "number" || payload.exp <= Math.floor(Date.now() / 1000)) return null;
  if (typeof payload.sub !== "string" || !payload.sub) return null;
  const appMeta =
    payload.app_metadata && typeof payload.app_metadata === "object"
      ? (payload.app_metadata as Record<string, unknown>)
      : {};
  const roleValue = appMeta.role ?? payload.role;
  return isAdminRole(roleValue)
    ? {
        id: payload.sub,
        email: typeof payload.email === "string" ? payload.email : null,
        role: roleValue,
      }
    : null;
}

export function requireAdmin(req: ApiRequest, res: ApiResponse): AdminIdentity | null {
  const identity = adminIdentity(req);
  if (!identity) {
    json(res, 401, { error: "Unauthorized" });
    return null;
  }
  return identity;
}

export function requirePermission(
  req: ApiRequest,
  res: ApiResponse,
  permission: string,
): AdminIdentity | null {
  const identity = requireAdmin(req, res);
  if (!identity) return null;
  if (!hasAdminPermission(identity.role, permission)) {
    json(res, 403, { error: "Forbidden" });
    return null;
  }
  return identity;
}
