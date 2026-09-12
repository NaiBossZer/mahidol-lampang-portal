import { getSupabaseUser, isAdminRole, json, supabaseConfig } from "../auth/_shared";

type Env = Record<string, unknown>;
type RestParams = Record<string, string>;

async function supabaseUserRest<T>(env: Env, accessToken: string, table: string, params: RestParams = {}): Promise<T> {
  const { url, key, configured } = supabaseConfig(env);
  if (!configured) throw new Error("Supabase is not configured");
  const query = new URLSearchParams(params);
  const response = await fetch(`${url}/rest/v1/${table}?${query.toString()}`, {
    headers: { apikey: key, Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Supabase REST ${response.status}${detail ? `: ${detail.slice(0, 300)}` : ""}`);
  }
  return await response.json() as T;
}

function cookieValue(request: Request, name: string) {
  const header = request.headers.get("Cookie") ?? "";
  const part = header.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${name}=`));
  return part ? decodeURIComponent(part.slice(name.length + 1)) : null;
}

export async function onRequestGet({ request, env }: { request: Request; env: Env }) {
  const user = await getSupabaseUser(request, env);
  const role = user?.app_metadata?.role;
  if (!user || !isAdminRole(role)) return json({ success: false, error: "Forbidden" }, 403);
  const accessToken = cookieValue(request, "sb_access_token");
  if (!accessToken) return json({ success: false, error: "Unauthorized" }, 401);

  try {
    const [activities, occurrences, centers, organizations, surveys, responses, activityCenters, activityOrganizers, activityMedia] = await Promise.all([
      supabaseUserRest(env, accessToken, "activities", { select: "id,title,activity_date,category,status,participants,featured_image", order: "activity_date.desc" }),
      supabaseUserRest(env, accessToken, "activity_occurrences", { select: "id,activity_id,occurrence_no,start_at,end_at,status,cancellation_reason,participant_count,location_type,location_detail", order: "start_at.desc" }),
      supabaseUserRest(env, accessToken, "learning_centers", { select: "id,name,slug,type,status", status: "eq.active", order: "name.asc" }),
      supabaseUserRest(env, accessToken, "organizations", { select: "id,name,organization_type,parent_organization_id,status,display_order", status: "eq.active", order: "display_order.asc,name.asc" }),
      supabaseUserRest(env, accessToken, "occurrence_surveys", { select: "id,occurrence_id,enabled,anonymous,open_at,close_at,welcome_text" }),
      supabaseUserRest(env, accessToken, "survey_responses", { select: "id,activity_id,occurrence_id,survey_id,participant_organization_id,submitted_at,age_group,affiliation,p2_location,p2_schedule,p2_readiness,p2_reception,p2_overall,p3_interest,p3_content,p3_clarity,p3_benefit,p3_application,p4_knowledge,p4_inspiration,p4_community_resource,p4_future_return,feedback", order: "submitted_at.desc" }),
      supabaseUserRest(env, accessToken, "activity_learning_centers", { select: "activity_id,learning_center_id" }),
      supabaseUserRest(env, accessToken, "activity_organizers", { select: "activity_id,organization_id,organizer_role" }),
      supabaseUserRest(env, accessToken, "activity_media", { select: "id,activity_id,occurrence_id,public_url,media_type,caption,is_post_event,display_order,status,created_at", is_post_event: "eq.true", status: "neq.archived", order: "display_order.asc,created_at.desc" }),
    ]);
    return json({ success: true, data: { activities, occurrences, learningCenters: centers, organizations, surveys, responses, activityLearningCenters: activityCenters, activityOrganizers, activityMedia } });
  } catch (error) {
    console.error("GET /api/admin/dashboard", error);
    return json({ success: false, error: "ไม่สามารถโหลดข้อมูล Dashboard ได้" }, 500);
  }
}

export function onRequest({ request, env }: { request: Request; env: Env }) {
  if (request.method === "GET") return onRequestGet({ request, env });
  return json({ error: "Method Not Allowed" }, 405, { Allow: "GET" });
}
