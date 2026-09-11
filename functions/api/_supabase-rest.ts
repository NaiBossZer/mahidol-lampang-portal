type Env = Record<string, unknown>;

export function getSupabaseRestConfig(env: Env) {
  const rawUrl = env.SUPABASE_URL ?? env.VITE_SUPABASE_URL;
  const rawKey = env.SUPABASE_ANON_KEY ?? env.VITE_SUPABASE_ANON_KEY;
  const url = typeof rawUrl === "string" ? rawUrl.replace(/\/$/, "") : "";
  const key = typeof rawKey === "string" ? rawKey : "";
  return { url, key, configured: Boolean(url && key) };
}

export async function supabaseRest<T>(
  env: Env,
  table: string,
  params: Record<string, string> = {},
): Promise<T> {
  const { url, key, configured } = getSupabaseRestConfig(env);
  if (!configured) throw new Error("Supabase is not configured");
  const query = new URLSearchParams(params);
  const response = await fetch(`${url}/rest/v1/${table}?${query.toString()}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}`, Accept: "application/json" },
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Supabase REST ${response.status}${detail ? `: ${detail.slice(0, 300)}` : ""}`);
  }
  return await response.json() as T;
}

export function json(body: unknown, status = 200, extraHeaders: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...extraHeaders },
  });
}

export function methodNotAllowed(allow: string) {
  return json({ error: "Method not allowed" }, 405, { Allow: allow });
}
