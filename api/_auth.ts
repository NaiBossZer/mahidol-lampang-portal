import crypto from "node:crypto";
import type { ApiRequest, ApiResponse } from "./_http";

const COOKIE = "admin_session";
const MAX_AGE = 60 * 60 * 8;

function secret(): string {
  return process.env["ADMIN_PASSWORD"] ?? "";
}

function signature(expires: number): string {
  return crypto.createHmac("sha256", secret()).update(`admin:${expires}`).digest("hex");
}

export function setAdminSession(res: ApiResponse): void {
  const expires = Math.floor(Date.now() / 1000) + MAX_AGE;
  const value = `${expires}.${signature(expires)}`;
  res.setHeader(
    "Set-Cookie",
    `${COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE}`,
  );
}

export function clearAdminSession(res: ApiResponse): void {
  res.setHeader("Set-Cookie", `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`);
}

export function isAdmin(req: ApiRequest): boolean {
  const configured = secret();
  if (!configured) return false;
  const cookie = req.headers.cookie ?? "";
  const match = cookie.match(/(?:^|;\s*)admin_session=([^;]+)/);
  const value = match?.[1];
  if (!value) return false;
  const [rawExpires, rawSignature] = value.split(".");
  const expires = Number(rawExpires);
  if (!Number.isSafeInteger(expires) || expires < Math.floor(Date.now() / 1000) || !rawSignature)
    return false;
  const expected = signature(expires);
  const actual = Buffer.from(rawSignature, "hex");
  const wanted = Buffer.from(expected, "hex");
  return actual.length === wanted.length && crypto.timingSafeEqual(actual, wanted);
}
