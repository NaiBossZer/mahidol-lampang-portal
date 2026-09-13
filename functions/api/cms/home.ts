import { json, supabaseConfig } from "../auth/_shared";

type Env = Record<string, unknown>;

async function rest(env: Env, path: string) {
  const config = supabaseConfig(env);
  if (!config.configured) throw new Error("Supabase is not configured");
  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    headers: { apikey: config.key, Accept: "application/json" },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`Supabase REST ${response.status}`);
  return body;
}

export async function onRequest({ env }: { request: Request; env: Env }) {
  try {
    const [sections, services] = await Promise.all([
      rest(
        env,
        "home_sections?is_enabled=eq.true&select=section_key,title,subtitle,description,image,sort_order,is_enabled&order=sort_order.asc",
      ),
      rest(
        env,
        "services?status=eq.published&select=id,title,slug,summary,description,icon,featured_image,link_type,link_url,sort_order,status&order=sort_order.asc,created_at.desc",
      ),
    ]);
    return json({ success: true, data: { sections, services } }, 200, {
      "Cache-Control": "public, max-age=60, s-maxage=300",
    });
  } catch (error) {
    console.error("/api/cms/home", error);
    return json({ success: false, error: "ไม่สามารถโหลดเนื้อหาหน้าแรกได้" }, 500);
  }
}
