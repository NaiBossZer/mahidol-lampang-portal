import { asc, eq } from "drizzle-orm";
import { getDb } from "../../src/db/index";
import { learningCenters } from "../../src/db/schema";
import { idFromRequest, parseObject, requireAdmin, requiredString, stringValue, respondMethodNotAllowed } from "./_cms";
import { json, type ApiRequest, type ApiResponse } from "../_http";

const types = ["SOCIAL_CENTER", "LEARNING_CENTER", "RESEARCH_SITE", "COMMUNITY", "SCHOOL", "PARTNER_SITE"] as const;
export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!requireAdmin(req, res)) return;
  try {
    const db = getDb();
    if (req.method === "GET") return json(res, 200, { success: true, data: await db.select().from(learningCenters).orderBy(asc(learningCenters.name)) });
    const body = await parseObject(req);
    const type = String(body?.type ?? "LEARNING_CENTER");
    if (!body || !requiredString(body.name) || !requiredString(body.slug) || !types.includes(type as (typeof types)[number])) return json(res, 400, { error: "ข้อมูลศูนย์การเรียนรู้ไม่ถูกต้อง" });
    const values = { name: requiredString(body.name), slug: requiredString(body.slug), type: type as (typeof types)[number], description: stringValue(body.description), province: stringValue(body.province, 100), district: stringValue(body.district, 100), subdistrict: stringValue(body.subdistrict, 100), address: stringValue(body.address), latitude: body.latitude ? String(body.latitude) : null, longitude: body.longitude ? String(body.longitude) : null, coverImage: stringValue(body.coverImage), status: stringValue(body.status, 30) ?? "active", updatedAt: new Date() };
    if (req.method === "POST") { const [row] = await db.insert(learningCenters).values(values).returning(); return json(res, 201, { success: true, data: row }); }
    const id = idFromRequest(req);
    if ((req.method === "PUT" || req.method === "PATCH") && id) { const [row] = await db.update(learningCenters).set(values).where(eq(learningCenters.id, id)).returning(); if (!row) return json(res, 404, { error: "ไม่พบศูนย์การเรียนรู้" }); return json(res, 200, { success: true, data: row }); }
    return respondMethodNotAllowed(res, ["GET", "POST", "PUT", "PATCH"]);
  } catch (error) { console.error(error); return json(res, 500, { error: "ไม่สามารถจัดการศูนย์การเรียนรู้ได้" }); }
}
