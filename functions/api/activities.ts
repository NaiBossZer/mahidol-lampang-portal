import { getSupabaseRestConfig, json, methodNotAllowed, supabaseRest } from "./_supabase-rest";

type Env = Record<string, unknown>;
type ActivityRow = Record<string, unknown>;

const SELECT =
  "id,title,activity_date,category,featured_image,images,objective,key_activities,outcomes,participants,status,created_at,updated_at,survey_enabled,survey_open_at,survey_close_at,survey_welcome_text";

function toActivity(row: ActivityRow) {
  return {
    id: String(row.id),
    slug: String(row.id),
    title: String(row.title ?? ""),
    summary: String(row.objective ?? row.outcomes ?? "กิจกรรมพันธกิจเพื่อสังคม"),
    activityDate: String(row.activity_date ?? ""),
    location: "พื้นที่ปฏิบัติการลำปาง",
    featuredImage: String(row.featured_image ?? "") || "/main banner.jpg",
    objective: String(row.objective ?? ""),
    process: Array.isArray(row.key_activities) ? row.key_activities.join("\n") : String(row.key_activities ?? ""),
    outcome: String(row.outcomes ?? ""),
    impact: "",
    participantCount: Number.isFinite(Number(row.participants)) ? Number(row.participants) : undefined,
    category: String(row.category ?? ""),
    status: String(row.status ?? "draft"),
    images: Array.isArray(row.images) ? row.images : [],
    surveyEnabled: row.survey_enabled === true,
    surveyOpenAt: row.survey_open_at ?? null,
    surveyCloseAt: row.survey_close_at ?? null,
    surveyWelcomeText: row.survey_welcome_text ?? null,
    createdAt: String(row.created_at ?? ""),
    updatedAt: String(row.updated_at ?? ""),
  };
}

export async function onRequestGet({ env }: { env: Env }) {
  if (!getSupabaseRestConfig(env).configured) return json({ error: "Supabase is not configured" }, 503);

  try {
    const rows = await supabaseRest<ActivityRow[]>(env, "activities", {
      select: SELECT,
      status: "eq.published",
      order: "activity_date.desc",
    });
    return json({ success: true, data: rows.map(toActivity) });
  } catch (error) {
    console.error("GET /api/activities", error);
    return json({ error: "ไม่สามารถโหลดกิจกรรมได้" }, 500);
  }
}

export function onRequest({ request, env }: { request: Request; env: Env }) {
  if (request.method === "GET") return onRequestGet({ env });
  return methodNotAllowed("GET");
}
