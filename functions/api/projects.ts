import { getSupabaseRestConfig, json, methodNotAllowed, supabaseRest } from "./_supabase-rest";

export async function onRequestGet({ env }: { env: Record<string, unknown> }) {
  if (!getSupabaseRestConfig(env).configured) return json({ error: "Supabase is not configured" }, 503);
  try {
    const rows = await supabaseRest<Record<string, unknown>[]>(env, "social_projects", {
      select: "*",
      status: "eq.active",
      order: "title.asc",
    });
    return json({ success: true, data: rows });
  } catch (error) {
    console.error("GET /api/projects", error);
    return json({ error: "ไม่สามารถโหลดโครงการเพื่อสังคมได้" }, 500);
  }
}

export function onRequest({ request, env }: { request: Request; env: Record<string, unknown> }) {
  if (request.method === "GET") return onRequestGet({ env });
  return methodNotAllowed("GET");
}
