import { asc, eq } from "drizzle-orm";
import { getDb } from "../../src/db/index";
import { partners } from "../../src/db/schema";
import { idFromRequest, parseObject, requireAdmin, requiredString, stringValue, respondMethodNotAllowed } from "./_cms";
import { json, type ApiRequest, type ApiResponse } from "../_http";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!requireAdmin(req, res)) return;
  try {
    const db = getDb();
    if (req.method === "GET") return json(res, 200, { success: true, data: await db.select().from(partners).orderBy(asc(partners.name)) });
    const body = await parseObject(req);
    if (!body || !requiredString(body.name)) return json(res, 400, { error: "ข้อมูลภาคีเครือข่ายไม่ถูกต้อง" });
    const values = { name: requiredString(body.name), type: stringValue(body.type, 100), logo: stringValue(body.logo), description: stringValue(body.description) };
    if (req.method === "POST") { const [row] = await db.insert(partners).values(values).returning(); return json(res, 201, { success: true, data: row }); }
    const id = idFromRequest(req);
    if ((req.method === "PUT" || req.method === "PATCH") && id) { const [row] = await db.update(partners).set(values).where(eq(partners.id, id)).returning(); if (!row) return json(res, 404, { error: "ไม่พบภาคีเครือข่าย" }); return json(res, 200, { success: true, data: row }); }
    return respondMethodNotAllowed(res, ["GET", "POST", "PUT", "PATCH"]);
  } catch (error) { console.error(error); return json(res, 500, { error: "ไม่สามารถจัดการภาคีเครือข่ายได้" }); }
}
