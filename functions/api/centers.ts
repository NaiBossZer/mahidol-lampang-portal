import { getSupabaseRestConfig, json, methodNotAllowed, supabaseRest } from "./_supabase-rest";

export async function onRequestGet({ env }: { env: Record<string, unknown> }) {
  if (!getSupabaseRestConfig(env).configured) return json({ error: "Supabase is not configured" }, 503);
  try {
    const rows = await supabaseRest<Record<string, unknown>[]>(env, "learning_centers", { select: "*", status: "eq.active", order: "name.asc" });
    return json({ success: true, data: rows });
  } catch (error) {
    console.error("GET /api/centers", error);
    return json({ error: "ไม่สามารถโหลดศูนย์/พื้นที่ปฏิบัติการได้" }, 500);
  }
}

export function onRequest({ request, env }: { request: Request; env: Record<string, unknown> }) {
  if (request.method === "GET") return onRequestGet({ env });
  return methodNotAllowed("GET");
}
