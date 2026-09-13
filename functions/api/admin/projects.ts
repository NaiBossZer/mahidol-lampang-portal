import { authorize, clean, idFromUrl, methodNotAllowed, nullable, rest } from "./_cms";
import { json } from "../auth/_shared";
type Env = Record<string, unknown>;
type Row = Record<string, unknown>;
export async function onRequest({ request, env }: { request: Request; env: Env }) {
  const permission =
    request.method === "GET"
      ? "projects.read"
      : request.method === "POST"
        ? "projects.create"
        : "projects.update";
  const auth = await authorize(request, env, permission);
  if ("error" in auth) return auth.error;
  try {
    if (request.method === "GET")
      return json({
        success: true,
        data: await rest(env, auth.token, "social_projects?select=*&order=start_date.asc"),
      });
    if (!["POST", "PUT", "PATCH"].includes(request.method))
      return methodNotAllowed(["GET", "POST", "PUT", "PATCH"]);
    const body = (await request.json()) as Record<string, unknown>;
    const title = clean(body.title, 255);
    const slug = clean(body.slug, 255);
    if (!title || !slug) return json({ success: false, error: "กรุณาระบุชื่อและ slug" }, 400);
    const row = {
      title,
      slug,
      description: nullable(body.description),
      objective: nullable(body.objective),
      start_date: body.startDate ? String(body.startDate) : null,
      end_date: body.endDate ? String(body.endDate) : null,
      status: clean(body.status, 30) || "active",
      cover_image: nullable(body.coverImage),
      updated_at: new Date().toISOString(),
    };
    if (request.method === "POST") {
      const rows = (await rest(env, auth.token, "social_projects", {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify(row),
      })) as Row[];
      return json({ success: true, data: rows[0] ?? null }, 201);
    }
    const id = idFromUrl(request);
    if (!id) return json({ success: false, error: "id required" }, 400);
    const rows = (await rest(env, auth.token, `social_projects?id=eq.${id}`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(row),
    })) as Row[];
    if (!rows[0]) return json({ success: false, error: "ไม่พบโครงการ" }, 404);
    return json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("/api/admin/projects", error);
    return json(
      {
        success: false,
        error: error instanceof Error ? error.message : "ไม่สามารถจัดการโครงการได้",
      },
      500,
    );
  }
}
