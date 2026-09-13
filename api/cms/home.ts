import { asc, eq } from "drizzle-orm";
import { getDb } from "../../src/db/index";
import { homeSections, services } from "../../src/db/cms";
import { json, methodNotAllowed, type ApiRequest, type ApiResponse } from "../_http";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);
  try {
    const db = getDb();
    const [sections, serviceRows] = await Promise.all([
      db
        .select()
        .from(homeSections)
        .where(eq(homeSections.isEnabled, true))
        .orderBy(asc(homeSections.sortOrder)),
      db
        .select()
        .from(services)
        .where(eq(services.status, "published"))
        .orderBy(asc(services.sortOrder)),
    ]);
    return json(res, 200, { success: true, data: { sections, services: serviceRows } });
  } catch (error) {
    console.error(error);
    return json(res, 500, { error: "ไม่สามารถโหลดเนื้อหาหน้าแรกได้" });
  }
}
