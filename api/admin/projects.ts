import { asc, eq } from "drizzle-orm";
import { getDb } from "../../src/db/index";
import { socialProjects } from "../../src/db/schema";
import {
  idFromRequest,
  parseObject,
  requireAdmin,
  requiredString,
  stringValue,
  respondMethodNotAllowed,
} from "./_cms";
import { json, type ApiRequest, type ApiResponse } from "../_http";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!requireAdmin(req, res)) return;
  try {
    const db = getDb();
    if (req.method === "GET")
      return json(res, 200, {
        success: true,
        data: await db.select().from(socialProjects).orderBy(asc(socialProjects.startDate)),
      });
    const body = await parseObject(req);
    if (!body || !requiredString(body.title) || !requiredString(body.slug))
      return json(res, 400, { error: "ข้อมูลโครงการไม่ถูกต้อง" });
    const values = {
      title: requiredString(body.title),
      slug: requiredString(body.slug),
      description: stringValue(body.description),
      objective: stringValue(body.objective),
      startDate: body.startDate ? new Date(String(body.startDate)) : null,
      endDate: body.endDate ? new Date(String(body.endDate)) : null,
      status: stringValue(body.status, 30) ?? "active",
      coverImage: stringValue(body.coverImage),
      updatedAt: new Date(),
    };
    if (req.method === "POST") {
      const [row] = await db.insert(socialProjects).values(values).returning();
      return json(res, 201, { success: true, data: row });
    }
    const id = idFromRequest(req);
    if ((req.method === "PUT" || req.method === "PATCH") && id) {
      const [row] = await db
        .update(socialProjects)
        .set(values)
        .where(eq(socialProjects.id, id))
        .returning();
      if (!row) return json(res, 404, { error: "ไม่พบโครงการ" });
      return json(res, 200, { success: true, data: row });
    }
    return respondMethodNotAllowed(res, ["GET", "POST", "PUT", "PATCH"]);
  } catch (error) {
    console.error(error);
    return json(res, 500, { error: "ไม่สามารถจัดการโครงการได้" });
  }
}
