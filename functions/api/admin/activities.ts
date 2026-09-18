import { getCookie, getSupabaseUser, hasAdminPermission, isAdminRole, json, supabaseConfig } from "../auth/_shared";

type Env = Record<string, unknown>;
type ActivityStatus = "draft" | "published" | "archived";
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
type DeleteActivityResult = {
  deleted?: boolean;
  activity_id?: string;
  storage_paths?: unknown;
};


const ALLOWED_STATUS = new Set<ActivityStatus>(["draft", "published", "archived"]);
const ACTIVITY_MEDIA_BUCKET = "activity-media";

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
    const code = typeof body === "object" && body && "code" in body ? String(body.code) : "";
    const suffix = [code, detail].filter(Boolean).join(": ");
    const error = new Error(`Supabase REST ${response.status}${suffix ? `: ${suffix.slice(0, 350)}` : ""}`);
    (error as Error & { status?: number; code?: string }).status = response.status;
    (error as Error & { status?: number; code?: string }).code = code;
    throw error;
  }
  return body as T;
}

async function deleteActivityMediaObjects(env: Env, accessToken: string, paths: string[]) {
  const { url, key, configured } = supabaseConfig(env);
  if (!configured) throw new Error("Supabase is not configured");
  const failures: string[] = [];

  for (const path of paths) {
    try {
      const response = await fetch(
        `${url}/storage/v1/object/${ACTIVITY_MEDIA_BUCKET}/${path}`,
        {
          method: "DELETE",
          headers: {
            apikey: key,
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (!response.ok) failures.push(path);
    } catch {
      failures.push(path);
    }
  }

  return failures;
}

function normalizeActivityDate(value: unknown) {
  const raw = String(value ?? "").trim();
  const date = raw.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : "";
}

function normalizeParticipantCount(value: unknown, required = false) {
  if (value == null || value === "") return required ? 0 : undefined;
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0 || !Number.isInteger(number)) {
    throw new Error("จำนวนผู้เข้าร่วมต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป");
  }
  return number;
}

function makeSlug(title: string) {
  const base = title
    .toLowerCase()
    .replace(/[^\w\u0E00-\u0E7F]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${base || "activity"}-${Date.now()}`;
}

function toActivity(row: ActivityRow) {
  const participantCount = Number(row.participant_count ?? row.participants ?? 0);
  const images = Array.isArray(row.images)
    ? row.images.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
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
    process: Array.isArray(row.key_activities) ? row.key_activities.map(String).join("\n") : String(row.key_activities ?? ""),
    outcome: String(row.outcomes ?? ""),
    impact: String(row.impact ?? ""),
    featuredImage: String(row.featured_image ?? ""),
    images,
    status: String(row.status ?? "draft") as ActivityStatus,
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
  if (!partial || has("activityDate")) row.activity_date = normalizeActivityDate(input.activityDate);
  if (!partial || has("location")) row.location = String(input.location ?? "").trim();
  if (!partial || has("participantCount")) {
    const participantCount = normalizeParticipantCount(input.participantCount, false) ?? 0;
    row.participant_count = participantCount;
    row.participants = String(participantCount);
  }
  if (!partial || has("objective")) row.objective = String(input.objective ?? (partial ? "" : input.summary ?? "")).trim();
  if (!partial || has("process")) row.key_activities = String(input.process ?? "").split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
  if (!partial || has("outcome")) row.outcomes = String(input.outcome ?? "").trim();
  if (!partial || has("impact")) row.impact = String(input.impact ?? "").trim();
  if (!partial || has("featuredImage")) row.featured_image = String(input.featuredImage ?? "").trim();
  if (!partial || has("images")) row.images = Array.isArray(input.images) ? input.images.map(String).map((item) => item.trim()).filter(Boolean) : [];
  if (!partial || has("status")) row.status = input.status ?? "draft";
  return row;
}

async function authorize(request: Request, env: Env) {
  const user = await getSupabaseUser(request, env);
  const role = String(user?.app_metadata?.role ?? "");
  const accessToken = getCookie(request, "sb_access_token");
  if (!user || !isAdminRole(role) || !accessToken)
    return { error: json({ success: false, error: "Unauthorized" }, 401) } as const;

  const permission =
    request.method === "GET"
      ? "activities.read"
      : request.method === "POST"
        ? "activities.create"
        : request.method === "DELETE"
          ? "activities.archive"
          : "activities.update";
  if (!hasAdminPermission(role, permission))
    return { error: json({ success: false, error: "Forbidden" }, 403) } as const;

  return { accessToken, role } as const;
}

function friendlyError(error: unknown) {
  const value = error as { code?: string; message?: string } | null;
  if (value?.code === "23505") return "Slug นี้ถูกใช้งานแล้ว กรุณาเปลี่ยน Slug หรือเว้นว่างเพื่อให้ระบบสร้างให้อัตโนมัติ";
  if (value?.code === "23503") return "ข้อมูลที่เชื่อมโยงไม่ถูกต้องหรือไม่พบรายการอ้างอิง";
  if (String(value?.message ?? "").includes("ACTIVITY_NOT_FOUND")) return "ไม่พบกิจกรรม";
  if (String(value?.message ?? "").includes("FORBIDDEN")) return "ไม่มีสิทธิ์ลบกิจกรรม";
  return error instanceof Error ? error.message : "ไม่สามารถดำเนินการกับกิจกรรมได้";
}

export async function onRequest({ request, env }: { request: Request; env: Env }) {
  const method = request.method.toUpperCase();
  if (!["GET", "POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    return json({ error: "Method Not Allowed" }, 405, { Allow: "GET, POST, PUT, PATCH, DELETE" });
  }

  const auth = await authorize(request, env);
  if ("error" in auth) return auth.error;

  try {
    const id = new URL(request.url).searchParams.get("id");
    const select = "id,title,slug,summary,content,activity_date,location,participant_count,participants,featured_image,images,objective,key_activities,outcomes,impact,status,created_at,updated_at";

    if (method === "GET") {
      const rows = await supabaseRequest<ActivityRow[]>(env, auth.accessToken, `activities?select=${select}&order=activity_date.desc`);
      return json({ success: true, data: rows.map(toActivity) });
    }

    if (method === "POST") {
      const input = (await request.json()) as ActivityInput;
      const title = String(input.title ?? "").trim();
      const activityDate = normalizeActivityDate(input.activityDate);
      if (!title || !activityDate) return json({ success: false, error: "กรุณาระบุชื่อกิจกรรมและวันที่ให้ถูกต้อง" }, 400);

      const participantCount = normalizeParticipantCount(input.participantCount, false) ?? 0;
      const status = input.status ?? "draft";
      if (!ALLOWED_STATUS.has(status)) return json({ success: false, error: "สถานะกิจกรรมไม่ถูกต้อง" }, 400);

      const payload: ActivityInput = {
        ...input,
        title,
        activityDate,
        participantCount,
        slug: String(input.slug ?? "").trim() || makeSlug(title),
        status,
      };

      const rows = await supabaseRequest<ActivityRow[]>(env, auth.accessToken, "activities", {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify(toRow(payload)),
      });
      const created = rows[0] ? toActivity(rows[0]) : null;
      if (!created) return json({ success: false, error: "สร้างกิจกรรมไม่สำเร็จ: ไม่ได้รับข้อมูลรายการที่บันทึก" }, 500);
      return json({ success: true, data: created }, 201);
    }

    if (!id) return json({ success: false, error: "ต้องระบุ id ของกิจกรรม" }, 400);

    if (method === "PUT" || method === "PATCH") {
      const input = (await request.json()) as ActivityInput;
      if (input.title !== undefined && !String(input.title).trim()) return json({ success: false, error: "ชื่อกิจกรรมห้ามว่าง" }, 400);
      if (input.activityDate !== undefined && !normalizeActivityDate(input.activityDate)) return json({ success: false, error: "วันที่กิจกรรมไม่ถูกต้อง" }, 400);
      if (input.participantCount !== undefined) normalizeParticipantCount(input.participantCount, false);
      if (input.status !== undefined && !ALLOWED_STATUS.has(input.status)) return json({ success: false, error: "สถานะกิจกรรมไม่ถูกต้อง" }, 400);
      if (method === "PUT" && !input.title?.trim() && !input.activityDate) return json({ success: false, error: "ต้องระบุข้อมูลที่ต้องการอัปเดต" }, 400);
      if (method === "PATCH" && Object.keys(input).length === 0) return json({ success: false, error: "ต้องระบุข้อมูลที่ต้องการอัปเดต" }, 400);

      const patch = toRow(input, true);
      if (!Object.keys(patch).length) return json({ success: false, error: "ไม่พบ field ที่รองรับสำหรับการอัปเดต" }, 400);

      const rows = await supabaseRequest<ActivityRow[]>(env, auth.accessToken, `activities?id=eq.${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify(patch),
      });
      if (!rows[0]) return json({ success: false, error: "ไม่พบกิจกรรม" }, 404);
      return json({ success: true, data: toActivity(rows[0]) });
    }

    const result = await supabaseRequest<DeleteActivityResult>(env, auth.accessToken, "rpc/admin_delete_activity", {
      method: "POST",
      body: JSON.stringify({ p_activity_id: id }),
    });

    const storagePaths = Array.isArray(result?.storage_paths)
      ? result.storage_paths.filter((path): path is string => typeof path === "string" && path.trim().length > 0)
      : [];
    const cleanupFailures = await deleteActivityMediaObjects(env, auth.accessToken, storagePaths);

    return json({
      success: true,
      data: {
        id,
        deleted: result?.deleted === true,
        storageDeleted: storagePaths.length - cleanupFailures.length,
        storageCleanupFailed: cleanupFailures,
      },
    });
  } catch (error) {
    console.error(`/api/admin/activities ${method}`, error);
    return json({ success: false, error: friendlyError(error) }, 500);
  }
}
