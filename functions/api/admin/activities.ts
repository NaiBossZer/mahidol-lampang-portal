import { getSupabaseUser, isAdminRole, json, supabaseConfig } from "../auth/_shared";

type Env = Record<string, unknown>;
type ActivityStatus =
  "draft" | "published" | "scheduled" | "ongoing" | "completed" | "cancelled" | "archived";
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
  images?: string[];
  status?: ActivityStatus;
};
type ActivityRow = Record<string, unknown>;
function cookieValue(request: Request, name: string) {
  const part = (request.headers.get("Cookie") ?? "")
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`));
  return part ? decodeURIComponent(part.slice(name.length + 1)) : null;
}
async function supabaseRequest<T>(
  env: Env,
  accessToken: string,
  path: string,
  init: RequestInit = {},
) {
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
    const detail =
      typeof body === "object" && body && "message" in body ? String(body.message) : "";
    throw new Error(`Supabase REST ${response.status}${detail ? `: ${detail.slice(0, 300)}` : ""}`);
  }
  return body as T;
}
function toActivity(row: ActivityRow) {
  const participantCount = Number(row.participant_count ?? row.participants ?? 0);
  const images = Array.isArray(row.images)
    ? row.images.filter(
        (item): item is string => typeof item === "string" && item.trim().length > 0,
      )
    : [];
  return {
    id: String(row.id),
    slug: String(row.slug ?? ""),
    title: String(row.title ?? ""),
    summary: String(row.summary ?? ""),
    content: String(row.content ?? ""),
    activityDate: String(row.activity_date ?? ""),
    location: String(row.location ?? ""),
    participantCount: Number.isFinite(participantCount) ? participantCount : 0,
    objective: String(row.objective ?? ""),
    process: Array.isArray(row.key_activities)
      ? row.key_activities.map(String).join("\n")
      : String(row.key_activities ?? ""),
    outcome: String(row.outcomes ?? ""),
    impact: String(row.impact ?? ""),
    featuredImage: String(row.featured_image ?? ""),
    images,
    status: String(row.status ?? "draft") as ActivityStatus,
    createdAt: String(row.created_at ?? ""),
    updatedAt: String(row.updated_at ?? ""),
  };
}
function toRow(input: ActivityInput) {
  const status: ActivityStatus = input.status ?? "draft";
  const keyActivities = String(input.process ?? "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
  const participantCount = Math.max(0, Number(input.participantCount ?? 0));
  const images = Array.isArray(input.images)
    ? input.images
        .map(String)
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
  return {
    title: String(input.title ?? "").trim(),
    slug: String(input.slug ?? "").trim(),
    summary: String(input.summary ?? "").trim(),
    content: String(input.content ?? "").trim(),
    activity_date: String(input.activityDate ?? "").slice(0, 10),
    location: String(input.location ?? "").trim(),
    participant_count: Number.isFinite(participantCount) ? participantCount : 0,
    participants: String(Number.isFinite(participantCount) ? participantCount : 0),
    objective: String(input.objective ?? input.summary ?? "").trim(),
    key_activities: keyActivities,
    outcomes: String(input.outcome ?? "").trim(),
    impact: String(input.impact ?? "").trim(),
    featured_image: String(input.featuredImage ?? "").trim(),
    images,
    status,
  };
}
async function authorize(request: Request, env: Env) {
  const user = await getSupabaseUser(request, env);
  const role = user?.app_metadata?.role;
  if (!user || !isAdminRole(role))
    return { error: json({ success: false, error: "Forbidden" }, 403) } as const;
  const accessToken = cookieValue(request, "sb_access_token");
  if (!accessToken) return { error: json({ success: false, error: "Unauthorized" }, 401) } as const;
  if (role !== "SUPER_ADMIN" && role !== "OPERATIONS_ADMIN")
    return { error: json({ success: false, error: "Forbidden" }, 403) } as const;
  return { accessToken } as const;
}
export async function onRequest({ request, env }: { request: Request; env: Env }) {
  const method = request.method.toUpperCase();
  if (!["GET", "POST", "PUT", "DELETE"].includes(method))
    return json({ error: "Method Not Allowed" }, 405, { Allow: "GET, POST, PUT, DELETE" });
  const auth = await authorize(request, env);
  if ("error" in auth) return auth.error;
  try {
    const id = new URL(request.url).searchParams.get("id");
    const select =
      "id,title,slug,summary,content,activity_date,location,participant_count,participants,featured_image,images,objective,key_activities,outcomes,impact,status,created_at,updated_at";
    if (method === "GET") {
      const rows = await supabaseRequest<ActivityRow[]>(
        env,
        auth.accessToken,
        `activities?select=${select}&order=activity_date.desc`,
      );
      return json({ success: true, data: rows.map(toActivity) });
    }
    if (method === "POST") {
      const input = (await request.json()) as ActivityInput;
      if (!input.title?.trim() || !input.activityDate)
        return json({ success: false, error: "กรุณาระบุชื่อกิจกรรมและวันที่" }, 400);
      const rows = await supabaseRequest<ActivityRow[]>(env, auth.accessToken, "activities", {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify(toRow(input)),
      });
      return json({ success: true, data: rows[0] ? toActivity(rows[0]) : null }, 201);
    }
    if (!id) return json({ success: false, error: "ต้องระบุ id ของกิจกรรม" }, 400);
    if (method === "PUT") {
      const input = (await request.json()) as ActivityInput;
      if (!input.title?.trim() || !input.activityDate)
        return json({ success: false, error: "กรุณาระบุชื่อกิจกรรมและวันที่" }, 400);
      const rows = await supabaseRequest<ActivityRow[]>(
        env,
        auth.accessToken,
        `activities?id=eq.${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          headers: { Prefer: "return=representation" },
          body: JSON.stringify(toRow(input)),
        },
      );
      if (!rows[0]) return json({ success: false, error: "ไม่พบกิจกรรม" }, 404);
      return json({ success: true, data: toActivity(rows[0]) });
    }
    const rows = await supabaseRequest<ActivityRow[]>(
      env,
      auth.accessToken,
      `activities?id=eq.${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({ status: "archived" }),
      },
    );
    if (!rows[0]) return json({ success: false, error: "ไม่พบกิจกรรม" }, 404);
    return json({ success: true, data: toActivity(rows[0]) });
  } catch (error) {
    console.error(`/api/admin/activities ${method}`, error);
    return json(
      {
        success: false,
        error: error instanceof Error ? error.message : "ไม่สามารถดำเนินการกับกิจกรรมได้",
      },
      500,
    );
  }
}
