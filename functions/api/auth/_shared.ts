const ACCESS_COOKIE = "sb_access_token";
const REFRESH_COOKIE = "sb_refresh_token";
const MAX_AGE = 60 * 60 * 8;

export const ADMIN_ROLES = [
  "SUPER_ADMIN",
  "CONTENT_ADMIN",
  "OPERATIONS_ADMIN",
  "FACILITY_ADMIN",
] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

const ADMIN_PERMISSIONS = [
  "overview.read", "cms.read", "cms.create", "cms.update", "cms.publish", "cms.archive",
  "activities.read", "activities.create", "activities.update", "activities.publish", "activities.archive",
  "projects.read", "projects.create", "projects.update", "projects.publish", "projects.archive",
  "learning_centers.read", "learning_centers.create", "learning_centers.update", "learning_centers.publish", "learning_centers.archive",
  "partners.read", "partners.create", "partners.update", "partners.archive",
  "services.read", "services.create", "services.update", "services.publish", "services.archive",
  "navigation.read", "navigation.create", "navigation.update", "navigation.archive",
  "footer.read", "footer.update", "facility.read", "facility.manage", "store.read", "store.manage",
  "survey.audit.read",
] as const;

type AdminPermission = (typeof ADMIN_PERMISSIONS)[number];

const ROLE_PERMISSIONS: Record<AdminRole, readonly AdminPermission[]> = {
  SUPER_ADMIN: ADMIN_PERMISSIONS,
  CONTENT_ADMIN: [
    "overview.read", "cms.read", "cms.create", "cms.update", "cms.publish", "cms.archive",
    "projects.read", "projects.create", "projects.update", "projects.publish", "projects.archive",
    "partners.read", "partners.create", "partners.update", "partners.archive",
    "services.read", "services.create", "services.update", "services.publish", "services.archive",
    "navigation.read", "navigation.create", "navigation.update", "navigation.archive",
    "footer.read", "footer.update", "survey.audit.read",
  ],
  OPERATIONS_ADMIN: [
    "overview.read", "activities.read", "activities.create", "activities.update", "activities.publish", "activities.archive",
    "learning_centers.read", "learning_centers.create", "learning_centers.update", "learning_centers.publish", "learning_centers.archive",
    "store.read", "store.manage", "survey.audit.read",
  ],
  FACILITY_ADMIN: ["overview.read", "facility.read", "facility.manage", "survey.audit.read"],
};

export function isAdminRole(value: unknown): value is AdminRole {
  return typeof value === "string" && (ADMIN_ROLES as readonly string[]).includes(value);
}

export function permissionsForRole(role: AdminRole): AdminPermission[] {
  return [...ROLE_PERMISSIONS[role]];
}

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
  return await response.json() as {
    id: string;
    email?: string;
    user_metadata?: Record<string, unknown>;
    app_metadata?: Record<string, unknown>;
  };
}
