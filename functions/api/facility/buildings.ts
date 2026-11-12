import { getCookie, getSupabaseUser, json, supabaseConfig } from "../auth/_shared";

type Env = Record<string, unknown>;
type BuildingAnchor = {
  id: string;
  name: string;
  code: string | null;
  model_anchor: { x: number; y: number; z: number } | null;
  model_node_name: string | null;
  model_node_path: string | null;
  mapping_status: string;
};

export async function onRequestGet({ request, env }: { request: Request; env: Env }) {
  const user = await getSupabaseUser(request, env);
  const token = getCookie(request, "sb_access_token");
  const { url, key, configured } = supabaseConfig(env);
  if (!configured) return json({ success: false, error: "Supabase is not configured" }, 503);
  if (!user || !token) return json({ success: false, error: "Authentication required" }, 401);

  try {
    const response = await fetch(
      `${url}/rest/v1/buildings?select=id,name,code,model_anchor,model_node_name,model_node_path,mapping_status&active=eq.true&mapping_status=eq.verified&model_anchor=not.is.null&order=name.asc`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      // The additive Facility Mapping migration may not have been applied yet.
      // Treat missing mapping columns as an unconfigured overlay, not as fake data.
      if (response.status === 400 && /model_anchor|mapping_status|column/i.test(detail)) {
        return json({ success: true, mapping_ready: false, data: [] });
      }
      console.error("GET /api/facility/buildings", response.status, detail.slice(0, 300));
      return json({ success: false, error: "Unable to load verified facility anchors" }, 502);
    }

    const rows = (await response.json()) as BuildingAnchor[];
    const data = rows.filter((row) => {
      const anchor = row.model_anchor;
      return anchor && Number.isFinite(anchor.x) && Number.isFinite(anchor.y) && Number.isFinite(anchor.z);
    });
    return json({ success: true, mapping_ready: true, data });
  } catch (error) {
    console.error("GET /api/facility/buildings", error);
    return json({ success: false, error: "Unable to load facility anchors" }, 500);
  }
}

export function onRequest({ request, env }: { request: Request; env: Env }) {
  if (request.method === "GET") return onRequestGet({ request, env });
  return json({ success: false, error: "Method Not Allowed" }, 405, { Allow: "GET" });
}
