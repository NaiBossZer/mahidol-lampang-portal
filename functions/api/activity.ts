import { getSupabaseRestConfig, json, methodNotAllowed, supabaseRest } from "./_supabase-rest";

type Env = Record<string, unknown>;
type ActivityRow = Record<string, unknown>;
type MediaRow = {
  activity_id: string;
  public_url: string | null;
  display_order: number;
  created_at: string;
};
const SELECT =
  "id,title,slug,summary,content,activity_date,category,location,featured_image,images,objective,key_activities,outcomes,impact,participant_count,participants,status,created_at,updated_at,survey_enabled,survey_open_at,survey_close_at,survey_welcome_text";
function canonicalParticipantCount(row: ActivityRow) {
  const canonical = Number(row.participant_count);
  if (Number.isFinite(canonical) && canonical >= 0) return canonical;
  const legacy = Number(row.participants);
  return Number.isFinite(legacy) && legacy >= 0 ? legacy : undefined;
}

function toActivity(row: ActivityRow, media: MediaRow[] = []) {
  const stored = media
    .filter((item) => item.public_url)
    .sort((a, b) => a.display_order - b.display_order || b.created_at.localeCompare(a.created_at))
    .map((item) => String(item.public_url));
  const images = [...stored, ...(Array.isArray(row.images) ? row.images.map(String) : [])].filter(
    (url, index, list) => url && list.indexOf(url) === index,
  );
  return {
    id: String(row.id),
    slug: String(row.slug ?? row.id),
    title: String(row.title ?? ""),
    summary: String(row.summary ?? ""),
    activityDate: String(row.activity_date ?? ""),
    location: String(row.location ?? ""),
    featuredImage: String(row.featured_image ?? "") || images[0] || "/main banner.jpg",
    objective: String(row.objective ?? ""),
    process: Array.isArray(row.key_activities)
      ? row.key_activities.join("\n")
      : String(row.key_activities ?? ""),
    outcome: String(row.outcomes ?? ""),
    impact: String(row.impact ?? ""),
    participantCount: canonicalParticipantCount(row),
    category: String(row.category ?? ""),
    status: String(row.status ?? "draft"),
    images,
    surveyEnabled: row.survey_enabled === true,
    surveyOpenAt: row.survey_open_at ?? null,
    surveyCloseAt: row.survey_close_at ?? null,
    surveyWelcomeText: row.survey_welcome_text ?? null,
    createdAt: String(row.created_at ?? ""),
    updatedAt: String(row.updated_at ?? ""),
  };
}
export async function onRequestGet({ request, env }: { request: Request; env: Env }) {
  if (!getSupabaseRestConfig(env).configured)
    return json({ error: "Supabase is not configured" }, 503);
  const slug = new URL(request.url).searchParams.get("slug")?.trim();
  if (!slug) return json({ error: "slug is required" }, 400);
  try {
    const rows = await supabaseRest<ActivityRow[]>(env, "activities", {
      select: SELECT,
      status: "eq.published",
      order: "activity_date.desc",
    });
    const raw = rows.find((row) => String(row.id) === slug || String(row.slug ?? "") === slug);
    if (!raw) return json({ error: "Activity not found" }, 404);
    const media = await supabaseRest<MediaRow[]>(env, "activity_media", {
      select: "activity_id,public_url,display_order,created_at",
      activity_id: `eq.${String(raw.id)}`,
      status: "eq.active",
      is_post_event: "eq.true",
    });
    return json({ success: true, data: toActivity(raw, media) });
  } catch (error) {
    console.error("GET /api/activity", error);
    return json({ error: "ไม่สามารถโหลดรายละเอียดกิจกรรมได้" }, 500);
  }
}
export function onRequest({ request, env }: { request: Request; env: Env }) {
  if (request.method === "GET") return onRequestGet({ request, env });
  return methodNotAllowed("GET");
}
