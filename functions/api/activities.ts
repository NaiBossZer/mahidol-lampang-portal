import { getSupabaseRestConfig, json, methodNotAllowed, supabaseRest } from "./_supabase-rest";

const SELECT = "id,title,slug,summary,activity_date,location,participant_count,featured_image,published_at,center_id,project_id,objective,process,outcome,impact";

export async function onRequestGet({ env }: { env: Record<string, unknown> }) {
  if (!getSupabaseRestConfig(env).configured) {
    return json({ error: "Supabase Auth is not configured" }, 503);
  }
  try {
    const rows = await supabaseRest<Record<string, unknown>[]>(env, "activities", {
      select: SELECT,
      status: "eq.published",
      order: "activity_date.desc",
    });
    return json({ success: true, data: rows });
  } catch (error) {
    console.error("GET /api/activities", error);
    return json({ error: "ไม่สามารถโหลดกิจกรรมได้" }, 500);
  }
}

export function onRequest({ request, env }: { request: Request; env: Record<string, unknown> }) {
  if (request.method === "GET") return onRequestGet({ env });
  return methodNotAllowed("GET");
}
