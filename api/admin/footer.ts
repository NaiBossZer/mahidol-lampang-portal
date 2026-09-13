import { desc, eq } from "drizzle-orm";
import { getDb } from "../../src/db/index";
import { footerSettings } from "../../src/db/cms";
import {
  idFromRequest,
  parseObject,
  requireAdmin,
  stringValue,
  respondMethodNotAllowed,
} from "./_cms";
import { json, type ApiRequest, type ApiResponse } from "../_http";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!requireAdmin(req, res)) return;
  try {
    const db = getDb();
    if (req.method === "GET") {
      const rows = await db.select().from(footerSettings).orderBy(desc(footerSettings.updatedAt));
      return json(res, 200, { success: true, data: rows[0] ?? null });
    }
    const body = await parseObject(req);
    if (!body) return json(res, 400, { error: "ข้อมูล Footer ไม่ถูกต้อง" });
    const values = {
      organizationName: stringValue(body.organizationName, 255),
      address: stringValue(body.address),
      phone: stringValue(body.phone, 100),
      email: stringValue(body.email, 255),
      facebookUrl: stringValue(body.facebookUrl),
      lineUrl: stringValue(body.lineUrl),
      copyrightText: stringValue(body.copyrightText, 500),
      privacyUrl: stringValue(body.privacyUrl),
      termsUrl: stringValue(body.termsUrl),
      updatedAt: new Date(),
    };
    if (req.method === "POST") {
      const [row] = await db.insert(footerSettings).values(values).returning();
      return json(res, 201, { success: true, data: row });
    }
    const id = idFromRequest(req);
    if ((req.method === "PUT" || req.method === "PATCH") && id) {
      const [row] = await db
        .update(footerSettings)
        .set(values)
        .where(eq(footerSettings.id, id))
        .returning();
      if (!row) return json(res, 404, { error: "ไม่พบ Footer" });
      return json(res, 200, { success: true, data: row });
    }
    return respondMethodNotAllowed(res, ["GET", "POST", "PUT", "PATCH"]);
  } catch (error) {
    console.error(error);
    return json(res, 500, { error: "ไม่สามารถจัดการ Footer ได้" });
  }
}
