import { authorize, clean, idFromUrl, methodNotAllowed, nullable, rest } from "./_cms";
import { json } from "../auth/_shared";
type Env = Record<string, unknown>;
type Row = Record<string, unknown>;
const KEYS = new Set([
  "HOME_HERO",
  "FEATURED_ACTIVITIES",
  "LEARNING_CENTERS",
  "SERVICES",
  "COMMUNITY_ACTION",
  "PARTNERS",
]);
function values(body: Record<string, unknown>) {
  const sectionKey = clean(body.sectionKey, 80);
  if (!KEYS.has(sectionKey)) return null;
  return {
    section_key: sectionKey,
    title: nullable(body.title, 255),
    subtitle: nullable(body.subtitle, 500),
    description: nullable(body.description),
    image: nullable(body.image),
    sort_order: Number.isInteger(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
    is_enabled: body.isEnabled !== false,
    updated_at: new Date().toISOString(),
  };
}
export async function onRequest({ request, env }: { request: Request; env: Env }) {
  const permission =
    request.method === "GET" ? "cms.read" : request.method === "POST" ? "cms.create" : "cms.update";
  const auth = await authorize(request, env, permission);
  if ("error" in auth) return auth.error;
  try {
    if (request.method === "GET")
      return json({
        success: true,
        data: await rest(env, auth.token, "home_sections?select=*&order=sort_order.asc"),
      });
    const id = idFromUrl(request);
    const body = (await request.json()) as Record<string, unknown>;
    const row = values(body);
    if (!row) return json({ success: false, error: "ข้อมูลหน้าแรกไม่ถูกต้อง" }, 400);
    if (request.method === "POST") {
      const rows = (await rest(env, auth.token, "home_sections", {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify(row),
      })) as Row[];
      return json({ success: true, data: rows[0] ?? null }, 201);
    }
    if (!["PUT", "PATCH"].includes(request.method) || !id)
      return methodNotAllowed(["GET", "POST", "PUT", "PATCH"]);
    const rows = (await rest(env, auth.token, `home_sections?id=eq.${id}`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(row),
    })) as Row[];
    if (!rows[0]) return json({ success: false, error: "ไม่พบส่วนหน้าแรก" }, 404);
    return json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("/api/admin/home", error);
    return json(
      {
        success: false,
        error: error instanceof Error ? error.message : "ไม่สามารถจัดการหน้าแรกได้",
      },
      500,
    );
  }
}
