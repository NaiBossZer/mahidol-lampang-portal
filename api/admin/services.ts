import { desc, eq } from "drizzle-orm";
import { getDb } from "../../src/db/index";
import { services } from "../../src/db/cms";
import { isAdmin } from "../_auth";
import { json, methodNotAllowed, readJson, type ApiRequest, type ApiResponse } from "../_http";

const statuses = ["draft", "published", "archived"] as const;
const linkTypes = ["INTERNAL", "EXTERNAL", "CONTACT"] as const;

type Input = {
  title?: unknown;
  slug?: unknown;
  summary?: unknown;
  description?: unknown;
  icon?: unknown;
  featuredImage?: unknown;
  linkType?: unknown;
  linkUrl?: unknown;
  sortOrder?: unknown;
  status?: unknown;
};

function parseBody(value: unknown) {
  if (!value || typeof value !== "object") return null;
  const b = value as Input;
  const title = String(b.title ?? "").trim();
  const slug = String(b.slug ?? "").trim();
  const linkType = String(b.linkType ?? "INTERNAL");
  const status = String(b.status ?? "draft");
  const sortOrder = Number(b.sortOrder ?? 0);
  if (!title || !slug || !linkTypes.includes(linkType as (typeof linkTypes)[number]) || !statuses.includes(status as (typeof statuses)[number]) || !Number.isInteger(sortOrder)) return null;
  return {
    title,
    slug,
    summary: b.summary ? String(b.summary) : null,
    description: b.description ? String(b.description) : null,
    icon: b.icon ? String(b.icon) : null,
    featuredImage: b.featuredImage ? String(b.featuredImage) : null,
    linkType: linkType as (typeof linkTypes)[number],
    linkUrl: b.linkUrl ? String(b.linkUrl) : null,
    sortOrder,
    status: status as (typeof statuses)[number],
    publishedAt: status === "published" ? new Date() : null,
    updatedAt: new Date(),
  };
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!isAdmin(req)) return json(res, 401, { error: "Unauthorized" });
  const id = new URL(req.url ?? "/", "http://localhost").searchParams.get("id");
  try {
    const db = getDb();
    if (req.method === "GET") {
      const rows = await db.select().from(services).orderBy(services.sortOrder, desc(services.createdAt));
      return json(res, 200, { success: true, data: rows });
    }
    if (req.method === "POST") {
      const body = parseBody(await readJson(req));
      if (!body) return json(res, 400, { error: "ข้อมูลบริการไม่ถูกต้อง" });
      const [row] = await db.insert(services).values(body).returning();
      return json(res, 201, { success: true, data: row });
    }
    if ((req.method === "PUT" || req.method === "PATCH") && id) {
      const body = parseBody(await readJson(req));
      if (!body) return json(res, 400, { error: "ข้อมูลบริการไม่ถูกต้อง" });
      const [row] = await db.update(services).set(body).where(eq(services.id, id)).returning();
      if (!row) return json(res, 404, { error: "ไม่พบบริการ" });
      return json(res, 200, { success: true, data: row });
    }
    if (req.method === "DELETE" && id) {
      const [row] = await db.delete(services).where(eq(services.id, id)).returning({ id: services.id });
      if (!row) return json(res, 404, { error: "ไม่พบบริการ" });
      return json(res, 200, { success: true, data: row });
    }
    return methodNotAllowed(res, ["GET", "POST", "PUT", "PATCH", "DELETE"]);
  } catch (error) {
    console.error(error);
    return json(res, 500, { error: "ไม่สามารถจัดการบริการได้" });
  }
}
