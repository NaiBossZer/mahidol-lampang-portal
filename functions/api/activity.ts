import { getSupabaseRestConfig, json, methodNotAllowed, supabaseRest } from "./_supabase-rest";

const SELECT = "id,project_id,center_id,title,slug,summary,content,activity_date,location,participant_count,objective,process,outcome,impact,featured_image,published_at,created_at,updated_at";

export async function onRequestGet({ request, env }: { request: Request; env: Record<string, unknown> }) {
  if (!getSupabaseRestConfig(env).configured) return json({ error: "Supabase Auth is not configured" }, 503);
  const slug = new URL(request.url).searchParams.get("slug")?.trim();
  if (!slug) return json({ error: "slug is required" }, 400);

  try {
    const rows = await supabaseRest<Record<string, unknown>[]>(env, "activities", {
      select: SELECT,
      slug: `eq.${slug}`,
      status: "eq.published",
      limit: "1",
    });
    const activity = rows[0];
    if (!activity) return json({ error: "Activity not found" }, 404);

    const activityId = String(activity.id);
    const [photos, outcomes] = await Promise.all([
      supabaseRest<Record<string, unknown>[]>(env, "activity_photos", {
        select: "id,activity_id,image_url,thumbnail_url,caption,alt_text,sort_order,is_cover,created_at",
        activity_id: `eq.${activityId}`,
        order: "sort_order.asc",
      }),
      supabaseRest<Record<string, unknown>[]>(env, "activity_outcomes", {
        select: "id,activity_id,metric_name,metric_value,unit,description,created_at",
        activity_id: `eq.${activityId}`,
      }),
    ]);

    return json({ success: true, data: { ...activity, photos, outcomes } });
  } catch (error) {
    console.error("GET /api/activity", error);
    return json({ error: "ไม่สามารถโหลดรายละเอียดกิจกรรมได้" }, 500);
  }
}

export function onRequest({ request, env }: { request: Request; env: Record<string, unknown> }) {
  if (request.method === "GET") return onRequestGet({ request, env });
  return methodNotAllowed("GET");
}
