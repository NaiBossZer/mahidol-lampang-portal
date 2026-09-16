import { getSupabaseUser, isAdminRole, json, supabaseConfig } from "../auth/_shared";

type Env = Record<string, unknown>;
type ActivityStatus =
  | "draft"
  | "published"
  | "scheduled"
  | "ongoing"
  | "completed"
  | "cancelled"
  | "archived";
type ActivityInput = {
  id?: string;
  projectId?: string | null;
  centerId?: string | null;
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
    projectId: row.project_id ? String(row.project_id) : undefined,
    centerId: row.center_id ? String(row.center_id) : undefined,
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
    publishedAt: row.published_at ? String(row.published_at) : null,
    createdAt: String(row.created_at ?? ""),
    updatedAt: String(row.updated_at ?? ""),
  };
}

function toRow(input: ActivityInput, partial = false) {
  const row: Record<string, unknown> = {};
  const has = (key: keyof ActivityInput) => Object.prototype.hasOwnProperty.call(input, key);

  if (!partial || has("title")) row.title = String(input.title ?? "").trim();
  if (!partial || has("slug")) row.slug = String(input.slug ?? "").trim();
  if (!partial || has("summary")) row.summary = String(input.summary ?? "").trim();
  if (!partial || has("content")) row.content = String(input.content ?? "").trim();
  if (!partial || has("activityDate")) row.activity_date = String(input.activityDate ?? "").slice(0, 10);
  if (!partial || has("location")) row.location = String(input.location ?? "").trim();
  if (!partial || has("participantCount")) {
    const participantCount = Math.max(0, Number(input.participantCount ?? 0));
    row.participant_count = Number.isFinite(participantCount) ? participantCount : 0;
    row.participants = String(Number.isFinite(participantCount) ? participantCount : 0);
  }
  if (!partial || has("projectId")) row.project_id = input.projectId ?? null;
  if (!partial || has("centerId")) row.center_id = input.centerId ?? null;
  if (!partial || has("objective")) row.objective = String(input.objective ?? (partial ? "" : input.summary ?? "")).trim();
  if (!partial || has("process")) {
    row.key_activities = String(input.process ?? "")
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  if (!partial || has("outcome")) row.outcomes = String(input.outcome ?? "").trim();
  if (!partial || has("impact")) row.impact = String(input.impact ?? "").trim();
  if (!partial || has("featuredImage")) row.featured_image = String(input.featuredImage ?? "").trim();
  if (!partial || has("images")) {
    row.images = Array.isArray(input.images)
      ? input.images.map(String).map((item) => item.trim()).filter(Boolean)
      : [];
  }
  if (!partial || has("status")) row.status = input.status ?? "draft";
  return row;
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
  if (!["GET", "POST", "PUT", "PATCH", "DELETE"].includes(method))
    return json({ error: "Method Not Allowed" }, 405, { Allow: "GET, POST, PUT, PATCH, DELETE" });
  const auth = await authorize(request, env);
  if ("error" in auth) return auth.error;
  try {
    const id = new URL(request.url).searchParams.get("id");
    const select =
      "id,project_id,center_id,title,slug,summary,content,activity_date,location,participant_count,participants,featured_image,images,objective,key_activities,outcomes,impact,status,published_at,created_at,updated_at";
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
    if (method === "PUT" || method === "PATCH") {
      const input = (await request.json()) as ActivityInput;
      const partial = method === "PATCH" || method === "PUT";
      if (method === "PUT" && !input.title?.trim() && !input.activityDate)
        return json({ success: false, error: "ต้องระบุข้อมูลที่ต้องการอัปเดต" }, 400);
      if (method === "PATCH" && Object.keys(input).length === 0)
        return json({ success: false, error: "ต้องระบุข้อมูลที่ต้องการอัปเดต" }, 400);
      if (input.status && !["draft", "published", "scheduled", "ongoing", "completed", "cancelled", "archived"].includes(input.status))
        return json({ success: false, error: "สถานะกิจกรรมไม่ถูกต้อง" }, 400);
      const patch = toRow(input, partial);
      if (!Object.keys(patch).length)
        return json({ success: false, error: "ไม่พบ field ที่รองรับสำหรับการอัปเดต" }, 400);
      const rows = await supabaseRequest<ActivityRow[]>(
        env,
        auth.accessToken,
        `activities?id=eq.${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          headers: { Prefer: "return=representation" },
          body: JSON.stringify(patch),
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
