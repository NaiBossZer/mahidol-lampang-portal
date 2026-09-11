import type { ApiRequest, ApiResponse } from "./_http";

const ACCESS_COOKIE = "sb_access_token";
const REFRESH_COOKIE = "sb_refresh_token";
const MAX_AGE = 60 * 60 * 8;

function env(name: string): string { return process.env[name] ?? ""; }
function baseUrl(): string { return env("SUPABASE_URL").replace(/\/$/, ""); }
function anonKey(): string { return env("SUPABASE_ANON_KEY"); }

function cookies(req: ApiRequest): Record<string, string> {
  return Object.fromEntries((req.headers.cookie ?? "").split(";").map(v => v.trim()).filter(Boolean).map(v => {
    const i = v.indexOf("="); return i > 0 ? [v.slice(0, i), decodeURIComponent(v.slice(i + 1))] : [v, ""];
  }));
}

export function supabaseConfigured(): boolean { return Boolean(baseUrl() && anonKey()); }

export async function signInWithPassword(email: string, password: string) {
  if (!supabaseConfigured()) throw new Error("Supabase Auth is not configured");
  const response = await fetch(`${baseUrl()}/auth/v1/token?grant_type=password`, {
    method: "POST", headers: { apikey: anonKey(), "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(String(body.error_description ?? body.msg ?? "เข้าสู่ระบบไม่สำเร็จ"));
  return body as { access_token: string; refresh_token: string; expires_in?: number; user?: { id: string; email?: string } };
}

export async function getUser(req: ApiRequest) {
  if (!supabaseConfigured()) return null;
  const token = cookies(req)[ACCESS_COOKIE];
  if (!token) return null;
  const response = await fetch(`${baseUrl()}/auth/v1/user`, { headers: { apikey: anonKey(), Authorization: `Bearer ${token}` } });
  if (!response.ok) return null;
  return (await response.json()) as { id: string; email?: string; user_metadata?: Record<string, unknown> };
}

export function setAuthCookies(res: ApiResponse, access: string, refresh: string, maxAge = MAX_AGE) {
  res.setHeader("Set-Cookie", [
    `${ACCESS_COOKIE}=${encodeURIComponent(access)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`,
    `${REFRESH_COOKIE}=${encodeURIComponent(refresh)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge * 2}`,
  ]);
}

export function clearAuthCookies(res: ApiResponse) {
  res.setHeader("Set-Cookie", [
    `${ACCESS_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
    `${REFRESH_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
  ]);
}

export async function requireAuth(req: ApiRequest, res: ApiResponse) {
  const user = await getUser(req);
  if (!user) { res.statusCode = 401; return null; }
  return user;
}
