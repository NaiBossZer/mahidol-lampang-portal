import { asc, desc, eq } from "drizzle-orm";
import { getDb } from "../../src/db/index";
import { services } from "../../src/db/cms";
import { idFromRequest, integerValue, linkTypeValue, parseObject, requiredString, requireAdmin, statusValue, stringValue, respondMethodNotAllowed } from "./_cms";
import { json, type ApiRequest, type ApiResponse } from "../_http";

function buildValues(body: Record<string, unknown> | null, existingPublishedAt?: Date | null) {
  const title = requiredString(body?.title);
  const slug = requiredString(body?.slug);
  const linkType = linkTypeValue(body?.linkType);
  const status = statusValue(body?.status);
  const sortOrder = integerValue(body?.sortOrder);
  if (!title || !slug || !linkType || !status || sortOrder === null) return null;
  return { title, slug, summary: stringValue(body?.summary), description: stringValue(body?.description), icon: stringValue(body?.icon, 100), featuredImage: stringValue(body?.featuredImage), linkType, linkUrl: stringValue(body?.linkUrl), sortOrder, status, publishedAt: status === "published" ? (existingPublishedAt ?? new Date()) : null, updatedAt: new Date() };
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!requireAdmin(req, res)) return;
  try {
    const db = getDb();
    if (req.method === "GET") return json(res, 200, { success: true, data: await db.select().from(services).orderBy(asc(services.sortOrder), desc(services.createdAt)) });
    const id = idFromRequest(req);
    const body = await parseObject(req);
    if (req.method === "POST") { const values = buildValues(body); if (!values) return json(res, 400, { error: "ข้อมูลบริการไม่ถูกต้อง" }); const [row] = await db.insert(services).values(values).returning(); return json(res, 201, { success: true, data: row }); }
    if ((req.method === "PUT" || req.method === "PATCH") && id) { const current = await db.select({ publishedAt: services.publishedAt }).from(services).where(eq(services.id, id)); const values = buildValues(body, current[0]?.publishedAt); if (!values) return json(res, 400, { error: "ข้อมูลบริการไม่ถูกต้อง" }); const [row] = await db.update(services).set(values).where(eq(services.id, id)).returning(); if (!row) return json(res, 404, { error: "ไม่พบบริการ" }); return json(res, 200, { success: true, data: row }); }
    if (req.method === "DELETE" && id) { const [row] = await db.update(services).set({ status: "archived", publishedAt: null, updatedAt: new Date() }).where(eq(services.id, id)).returning({ id: services.id, status: services.status }); if (!row) return json(res, 404, { error: "ไม่พบบริการ" }); return json(res, 200, { success: true, data: row }); }
    return respondMethodNotAllowed(res, ["GET", "POST", "PUT", "PATCH", "DELETE"]);
  } catch (error) { console.error(error); return json(res, 500, { error: "ไม่สามารถจัดการบริการได้" }); }
}
