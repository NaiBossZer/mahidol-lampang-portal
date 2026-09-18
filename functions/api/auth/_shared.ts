const ACCESS_COOKIE = "sb_access_token";
const REFRESH_COOKIE = "sb_refresh_token";
const MAX_AGE = 60 * 60 * 8;
import {
  ADMIN_PERMISSIONS,
  ADMIN_ROLES,
  hasAdminPermission,
  isAdminRole,
  permissionsForRole,
  type AdminPermission,
  type AdminRole,
} from "../../../src/auth/permissions";

export { ADMIN_PERMISSIONS, ADMIN_ROLES, hasAdminPermission, isAdminRole, permissionsForRole };
export type { AdminPermission, AdminRole };

export function getCookie(request: Request, name: string): string | null {
  const header = request.headers.get("Cookie") ?? "";
  for (const part of header.split(";")) {
    const [key, ...value] = part.trim().split("=");
    if (key === name) return decodeURIComponent(value.join("="));
  }
  return null;
}

export function cookieHeaders(access: string, refresh: string, maxAge = MAX_AGE): string[] {
  return [
    `${ACCESS_COOKIE}=${encodeURIComponent(access)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`,
    `${REFRESH_COOKIE}=${encodeURIComponent(refresh)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge * 2}`,
  ];
}

export function clearCookieHeaders(): string[] {
  return [
    `${ACCESS_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
    `${REFRESH_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
  ];
}

export function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store, private",
      ...headers,
    },
  });
}

export function supabaseConfig(env: Record<string, unknown>) {
  const url = String(env.SUPABASE_URL ?? "").replace(/\/$/, "");
  const key = String(env.SUPABASE_ANON_KEY ?? "");
  return { url, key, configured: Boolean(url && key) };
}

export async function getSupabaseUser(request: Request, env: Record<string, unknown>) {
  const { url, key, configured } = supabaseConfig(env);
  if (!configured) return null;
  const accessToken = getCookie(request, ACCESS_COOKIE);
  if (!accessToken) return null;
  const response = await fetch(`${url}/auth/v1/user`, {
    headers: { apikey: key, Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) return null;
  return (await response.json()) as {
    id: string;
    email?: string;
    user_metadata?: Record<string, unknown>;
    app_metadata?: Record<string, unknown>;
  };
}
