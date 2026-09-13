import { authorize, clean, idFromUrl, methodNotAllowed, nullable, rest } from "./_cms";
import { json } from "../auth/_shared";
type Env = Record<string, unknown>;
type Row = Record<string, unknown>;
export async function onRequest({ request, env }: { request: Request; env: Env }) {
  const permission =
    request.method === "GET"
      ? "partners.read"
      : request.method === "POST"
        ? "partners.create"
        : "partners.update";
  const auth = await authorize(request, env, permission);
  if ("error" in auth) return auth.error;
  try {
    if (request.method === "GET")
      return json({
        success: true,
        data: await rest(env, auth.token, "partners?select=*&order=name.asc"),
      });
    if (!["POST", "PUT", "PATCH"].includes(request.method))
      return methodNotAllowed(["GET", "POST", "PUT", "PATCH"]);
    const body = (await request.json()) as Record<string, unknown>;
    const name = clean(body.name, 255);
    if (!name) return json({ success: false, error: "กรุณาระบุชื่อภาคี" }, 400);
    const row = {
      name,
      type: nullable(body.type, 100),
      logo: nullable(body.logo),
      description: nullable(body.description),
    };
    if (request.method === "POST") {
      const rows = (await rest(env, auth.token, "partners", {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify(row),
      })) as Row[];
      return json({ success: true, data: rows[0] ?? null }, 201);
    }
    const id = idFromUrl(request);
    if (!id) return json({ success: false, error: "id required" }, 400);
    const rows = (await rest(env, auth.token, `partners?id=eq.${id}`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(row),
    })) as Row[];
    if (!rows[0]) return json({ success: false, error: "ไม่พบภาคี" }, 404);
    return json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("/api/admin/partners", error);
    return json(
      { success: false, error: error instanceof Error ? error.message : "ไม่สามารถจัดการภาคีได้" },
      500,
    );
  }
}
