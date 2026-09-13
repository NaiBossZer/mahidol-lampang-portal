import { getCookie, getSupabaseUser, isAdminRole, json, permissionsForRole, supabaseConfig, type AdminRole } from "../auth/_shared";

type Env = Record<string, unknown>;

export async function authorize(request: Request, env: Env, permission: string) {
  const user = await getSupabaseUser(request, env);
  const role = user?.app_metadata?.role;
  const token = getCookie(request, "sb_access_token");
  if (!user || !isAdminRole(role) || !token) return { error: json({ success: false, error: "Unauthorized" }, 401) } as const;
  if (!permissionsForRole(role as AdminRole).includes(permission as never)) return { error: json({ success: false, error: "Forbidden" }, 403) } as const;
  return { user, role: role as AdminRole, token } as const;
}

export async function rest(env: Env, token: string, path: string, init: RequestInit = {}) {
  const config = supabaseConfig(env);
  if (!config.configured) throw new Error("Supabase is not configured");
  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: config.key, Authorization: `Bearer ${token}`, Accept: "application/json", "Content-Type": "application/json", ...(init.headers ?? {}) },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`Supabase REST ${response.status}`);
  return body;
}

export function methodNotAllowed(methods: string[]) { return json({ success: false, error: "Method Not Allowed" }, 405, { Allow: methods.join(", ") }); }
export function idFromUrl(request: Request) { return new URL(request.url).searchParams.get("id"); }
export function clean(value: unknown, max = 10000) { const text = value == null ? "" : String(value).trim(); return text.slice(0, max); }
export function nullable(value: unknown, max = 10000) { const text = clean(value, max); return text || null; }
