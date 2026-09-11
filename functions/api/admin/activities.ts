import { getSupabaseUser, isAdminRole, json, supabaseConfig } from "../auth/_shared";

type Env = Record<string, unknown>;
type ActivityInput = {
  id?: string;
  title?: string;
  slug?: string;
  summary?: string;
  content?: string;
  activityDate?: string;
  location?: string;
  participantCount?: number;
  objective?: string;
  process?: string;
  outcome?: string;
  impact?: string;
  featuredImage?: string;
  status?: "draft" | "published" | "archived";
};

type ActivityRow = Record<string, unknown>;

function cookieValue(request: Request, name: string) {
  const header = request.headers.get("Cookie") ?? "";
  const part = header.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${name}=`));
  return part ? decodeURIComponent(part.slice(name.length + 1)) : null;
}

async function supabaseRequest<T>(env: Env, accessToken: string, path: string, init: RequestInit = {}) {
  const { url, key, configured } = supabaseConfig(env);
  if (!configured) throw new Error("Supabase is not configured");
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const detail = typeof body === "object" && body && "message" in body ? String(body.message) : "";
    throw new Error(`Supabase REST ${response.status}${detail ? `: ${detail.slice(0, 300)}` : ""}`);
  }
  return body as T;
}

function toActivity(row: ActivityRow) {
  return {
    id: String(row.id),
    slug: String(row.id),
    title: String(row.title ?? ""),
    summary: String(row.objective ?? row.outcomes ?? ""),
    content: String(row.objective ?? ""),
    activityDate: String(row.activity_date ?? ""),
    location: "",
    participantCount: Number.isFinite(Number(row.participants)) ? Number(row.participants) : 0,
    objective: String(row.objective ?? ""),
    process: Array.isArray(row.key_activities) ? row.key_activities.map(String).join("\n") : String(row.key_activities ?? ""),
    outcome: String(row.outcomes ?? ""),
    impact: "",
    featuredImage: String(row.featured_image ?? ""),
    status: String(row.status ?? "draft") as "draft" | "published",
    createdAt: String(row.created_at ?? ""),
    updatedAt: String(row.updated_at ?? ""),
  };
}

function toRow(input: ActivityInput) {
  const status = input.status === "published" ? "published" : "draft";
  const keyActivities = String(input.process ?? "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
  return {
    title: String(input.title ?? "").trim(),
    activity_date: String(input.activityDate ?? "").slice(0, 10),
    featured_image: String(input.featuredImage ?? "").trim(),
    objective: String(input.objective ?? input.summary ?? "").trim(),
    key_activities: keyActivities,
    outcomes: String(input.outcome ?? "").trim(),
    participants: String(Math.max(0, Number(input.participantCount ?? 0))),
    status,
  };
}

async function authorize(request: Request, env: Env, permission: "activities.read" | "activities.create" | "activities.update" | "activities.archive") {
  const user = await getSupabaseUser(request, env);
  const role = user?.app_metadata?.role;
  if (!user || !isAdminRole(role)) return { error: json({ success: false, error: "Forbidden" }, 403) } as const;
  const accessToken = cookieValue(request, "sb_access_token");
  if (!accessToken) return { error: json({ success: false, error: "Unauthorized" }, 401) } as const;
  const allowed = role === "SUPER_ADMIN" || (permission === "activities.read" && role === "OPERATIONS_ADMIN") || (permission !== "activities.read" && role === "OPERATIONS_ADMIN");
  if (!allowed) return { error: json({ success: false, error: "Forbidden" }, 403) } as const;
  return { accessToken } as const;
}

export async function onRequest({ request, env }: { request: Request; env: Env }) {
  const method = request.method.toUpperCase();
  const permission = method === "GET" ? "activities.read" : method === "POST" ? "activities.create" : method === "PUT" ? "activities.update" : method === "DELETE" ? "activities.archive" : null;
  if (!permission) return json({ error: "Method Not Allowed" }, 405, { Allow: "GET, POST, PUT, DELETE" });

  const auth = await authorize(request, env, permission);
  if ("error" in auth) return auth.error;

  try {
    const id = new URL(request.url).searchParams.get("id");
    if (method === "GET") {
      const rows = await supabaseRequest<ActivityRow[]>(env, auth.accessToken, "activities?select=id,title,activity_date,featured_image,objective,key_activities,outcomes,participants,status,created_at,updated_at&order=activity_date.desc");
      return json({ success: true, data: rows.map(toActivity) });
    }

    if (method === "POST") {
      const input = await request.json() as ActivityInput;
      if (!input.title?.trim() || !input.activityDate) return json({ success: false, error: "กรุณาระบุชื่อกิจกรรมและวันที่" }, 400);
      const rows = await supabaseRequest<ActivityRow[]>(env, auth.accessToken, "activities", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify(toRow(input)) });
      return json({ success: true, data: rows[0] ? toActivity(rows[0]) : null }, 201);
    }

    if (!id) return json({ success: false, error: "ต้องระบุ id ของกิจกรรม" }, 400);

    if (method === "PUT") {
      const input = await request.json() as ActivityInput;
      if (!input.title?.trim() || !input.activityDate) return json({ success: false, error: "กรุณาระบุชื่อกิจกรรมและวันที่" }, 400);
      const rows = await supabaseRequest<ActivityRow[]>(env, auth.accessToken, `activities?id=eq.${encodeURIComponent(id)}`, { method: "PATCH", headers: { Prefer: "return=representation" }, body: JSON.stringify(toRow(input)) });
      if (!rows[0]) return json({ success: false, error: "ไม่พบกิจกรรม" }, 404);
      return json({ success: true, data: toActivity(rows[0]) });
    }

    const rows = await supabaseRequest<ActivityRow[]>(env, auth.accessToken, `activities?id=eq.${encodeURIComponent(id)}&select=id,title,activity_date,featured_image,objective,key_activities,outcomes,participants,status,created_at,updated_at`, { method: "DELETE", headers: { Prefer: "return=representation" } });
    if (!rows[0]) return json({ success: false, error: "ไม่พบกิจกรรม" }, 404);
    return json({ success: true, data: toActivity(rows[0]) });
  } catch (error) {
    console.error(`/${method} /api/admin/activities`, error);
    return json({ success: false, error: error instanceof Error ? error.message : "ไม่สามารถดำเนินการกับกิจกรรมได้" }, 500);
  }
}
