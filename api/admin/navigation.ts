import { asc, eq } from "drizzle-orm";
import { getDb } from "../../src/db/index";
import { navigationItems } from "../../src/db/cms";
import { idFromRequest, integerValue, linkTypeValue, parseObject, requiredString, requireAdmin, stringValue, respondMethodNotAllowed } from "./_cms";
import { json, type ApiRequest, type ApiResponse } from "../_http";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!requireAdmin(req, res)) return;
  try {
    const db = getDb();
    if (req.method === "GET") return json(res, 200, { success: true, data: await db.select().from(navigationItems).orderBy(asc(navigationItems.sortOrder)) });
    const id = idFromRequest(req);
    const body = await parseObject(req);
    const targetType = linkTypeValue(body?.targetType);
    const sortOrder = integerValue(body?.sortOrder);
    if (!body || !requiredString(body.label, 255) || !requiredString(body.slug, 255) || !targetType || sortOrder === null) return json(res, 400, { error: "ข้อมูลเมนูไม่ถูกต้อง" });
    const values = { label: requiredString(body.label, 255), slug: requiredString(body.slug, 255), parentId: stringValue(body.parentId, 80), targetType, targetUrl: stringValue(body.targetUrl), sortOrder, isEnabled: body.isEnabled !== false, openNewTab: body.openNewTab === true, updatedAt: new Date() };
    if (req.method === "POST") { const [row] = await db.insert(navigationItems).values(values).returning(); return json(res, 201, { success: true, data: row }); }
    if ((req.method === "PUT" || req.method === "PATCH") && id) { const [row] = await db.update(navigationItems).set(values).where(eq(navigationItems.id, id)).returning(); if (!row) return json(res, 404, { error: "ไม่พบเมนู" }); return json(res, 200, { success: true, data: row }); }
    return respondMethodNotAllowed(res, ["GET", "POST", "PUT", "PATCH"]);
  } catch (error) { console.error(error); return json(res, 500, { error: "ไม่สามารถจัดการเมนูได้" }); }
}
