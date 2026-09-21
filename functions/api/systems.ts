import { json, supabaseConfig } from "./auth/_shared";

type Env = Record<string, unknown>;
type SystemRow = {
  system_key: string;
  system_name: string;
  system_type: string;
  base_url: string | null;
  status: string;
};

async function listSystems(env: Env) {
  const { url, key, configured } = supabaseConfig(env);
  if (!configured) throw new Error("Supabase is not configured");
  const response = await fetch(
    `${url}/rest/v1/system_registry?select=system_key,system_name,system_type,base_url,status&status=eq.active&base_url=not.is.null&order=system_name.asc`,
    { headers: { apikey: key, Authorization: `Bearer ${key}`, Accept: "application/json" } },
  );
  if (!response.ok) throw new Error(`Supabase REST ${response.status}`);
  return (await response.json()) as SystemRow[];
}

export async function onRequest({ request, env }: { request: Request; env: Env }) {
  if (request.method !== "GET") return json({ success: false, error: "Method Not Allowed" }, 405, { Allow: "GET" });
  try {
    const rows = await listSystems(env);
    const key = new URL(request.url).searchParams.get("systemKey")?.trim();
    const data = key ? rows.filter((row) => row.system_key === key) : rows;
    return json({ success: true, data });
  } catch (error) {
    console.error("GET /api/systems", error);
    return json({ success: false, error: "ไม่สามารถโหลดการตั้งค่าระบบได้" }, 500);
  }
}
