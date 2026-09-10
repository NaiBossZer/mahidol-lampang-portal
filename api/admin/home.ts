import { asc, eq } from "drizzle-orm";
import { getDb } from "../../src/db/index";
import { homeSections } from "../../src/db/cms";
import { HOME_SECTION_KEYS, idFromRequest, integerValue, parseObject, requiredString, requireAdmin, stringValue, respondMethodNotAllowed } from "./_cms";
import { json, type ApiRequest, type ApiResponse } from "../_http";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!requireAdmin(req, res)) return;
  try {
    const db = getDb();
    if (req.method === "GET") return json(res, 200, { success: true, data: await db.select().from(homeSections).orderBy(asc(homeSections.sortOrder)) });
    const id = idFromRequest(req);
    const body = await parseObject(req);
    if (req.method === "POST") {
      const sectionKey = requiredString(body?.sectionKey, 80);
      const sortOrder = integerValue(body?.sortOrder);
      if (!HOME_SECTION_KEYS.includes(sectionKey as (typeof HOME_SECTION_KEYS)[number]) || sortOrder === null) return json(res, 400, { error: "ข้อมูลส่วนหน้าแรกไม่ถูกต้อง" });
      const [row] = await db.insert(homeSections).values({ sectionKey, title: stringValue(body?.title, 255), subtitle: stringValue(body?.subtitle, 500), description: stringValue(body?.description), image: stringValue(body?.image), sortOrder, isEnabled: body?.isEnabled !== false, updatedAt: new Date() }).returning();
      return json(res, 201, { success: true, data: row });
    }
    if ((req.method === "PUT" || req.method === "PATCH") && id) {
      const sectionKey = requiredString(body?.sectionKey, 80);
      const sortOrder = integerValue(body?.sortOrder);
      if (!HOME_SECTION_KEYS.includes(sectionKey as (typeof HOME_SECTION_KEYS)[number]) || sortOrder === null) return json(res, 400, { error: "ข้อมูลส่วนหน้าแรกไม่ถูกต้อง" });
      const [row] = await db.update(homeSections).set({ sectionKey, title: stringValue(body?.title, 255), subtitle: stringValue(body?.subtitle, 500), description: stringValue(body?.description), image: stringValue(body?.image), sortOrder, isEnabled: body?.isEnabled !== false, updatedAt: new Date() }).where(eq(homeSections.id, id)).returning();
      if (!row) return json(res, 404, { error: "ไม่พบส่วนหน้าแรก" });
      return json(res, 200, { success: true, data: row });
    }
    return respondMethodNotAllowed(res, ["GET", "POST", "PUT", "PATCH"]);
  } catch (error) {
    console.error(error);
    return json(res, 500, { error: "ไม่สามารถจัดการหน้าแรกได้" });
  }
}
