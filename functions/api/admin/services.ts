import { authorize, clean, idFromUrl, methodNotAllowed, nullable, rest } from "./_cms";
import { json } from "../auth/_shared";

type Env = Record<string, unknown>;
type Row = Record<string, unknown>;

function values(body: Record<string, unknown>) {
  const title = clean(body.title, 255);
  const slug = clean(body.slug, 255);
  const linkType = clean(body.linkType, 30) || "INTERNAL";
  const status = clean(body.status, 30) || "draft";
  if (
    !title ||
    !slug ||
    !["INTERNAL", "EXTERNAL", "CONTACT"].includes(linkType) ||
    !["draft", "published", "archived"].includes(status)
  )
    return null;
  return {
    title,
    slug,
    summary: nullable(body.summary),
    description: nullable(body.description),
    icon: nullable(body.icon, 100),
    featured_image: nullable(body.featuredImage),
    link_type: linkType,
    link_url: nullable(body.linkUrl),
    sort_order: Number.isInteger(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
    status,
    published_at: status === "published" ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  };
}
export async function onRequest({ request, env }: { request: Request; env: Env }) {
  const permission =
    request.method === "GET"
      ? "services.read"
      : request.method === "POST"
        ? "services.create"
        : request.method === "DELETE"
          ? "services.archive"
          : "services.update";
  const auth = await authorize(request, env, permission);
  if ("error" in auth) return auth.error;
  try {
    if (request.method === "GET")
      return json({
        success: true,
        data: await rest(env, auth.token, "services?select=*&order=sort_order.asc,created_at.desc"),
      });
    const id = idFromUrl(request);
    if (!id && request.method !== "POST")
      return json({ success: false, error: "id required" }, 400);
    if (request.method === "DELETE") {
      const rows = (await rest(env, auth.token, `services?id=eq.${id}`, {
        method: "PATCH",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({
          status: "archived",
          published_at: null,
          updated_at: new Date().toISOString(),
        }),
      })) as Row[];
      if (!rows[0]) return json({ success: false, error: "ไม่พบบริการ" }, 404);
      return json({ success: true, data: rows[0] });
    }
    if (!["POST", "PUT", "PATCH"].includes(request.method))
      return methodNotAllowed(["GET", "POST", "PUT", "PATCH", "DELETE"]);
    const body = (await request.json()) as Record<string, unknown>;
    const row = values(body);
    if (!row) return json({ success: false, error: "ข้อมูลบริการไม่ถูกต้อง" }, 400);
    if (request.method === "POST") {
      const rows = (await rest(env, auth.token, "services", {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify(row),
      })) as Row[];
      return json({ success: true, data: rows[0] ?? null }, 201);
    }
    const rows = (await rest(env, auth.token, `services?id=eq.${id}`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(row),
    })) as Row[];
    if (!rows[0]) return json({ success: false, error: "ไม่พบบริการ" }, 404);
    return json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("/api/admin/services", error);
    return json(
      {
        success: false,
        error: error instanceof Error ? error.message : "ไม่สามารถจัดการบริการได้",
      },
      500,
    );
  }
}
