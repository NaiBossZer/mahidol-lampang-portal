import { getSupabaseRestConfig, json, methodNotAllowed, supabaseRest } from "./_supabase-rest";

export async function onRequestGet({ env }: { env: Record<string, unknown> }) {
  const startedAt = Date.now();
  const config = getSupabaseRestConfig(env);
  if (!config.configured) return json({ success: false, data: { service: "social-engagement-api", database: "supabase", connected: false }, error: "Supabase is not configured" }, 503);
  try {
    await supabaseRest<Record<string, unknown>[]>(env, "activities", { select: "id", limit: "1" });
    return json({ success: true, data: { service: "social-engagement-api", database: "supabase", connected: true, responseTimeMs: Date.now() - startedAt } });
  } catch (error) {
    console.error("GET /api/health", error);
    return json({ success: false, data: { service: "social-engagement-api", database: "supabase", connected: false }, error: "Database unavailable" }, 503);
  }
}

export function onRequest({ request, env }: { request: Request; env: Record<string, unknown> }) {
  if (request.method === "GET") return onRequestGet({ env });
  return methodNotAllowed("GET");
}
