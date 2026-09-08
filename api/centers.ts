import { asc, eq } from "drizzle-orm";
import { getDb } from "../src/db/index";
import { learningCenters } from "../src/db/schema";
import { json, methodNotAllowed, type ApiRequest, type ApiResponse } from "./_http";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(learningCenters)
      .where(eq(learningCenters.status, "active"))
      .orderBy(asc(learningCenters.name));
    return json(res, 200, { success: true, data: rows });
  } catch (error) {
    console.error("GET /api/centers", error);
    return json(res, 500, { error: "ไม่สามารถโหลดศูนย์/พื้นที่ปฏิบัติการได้" });
  }
}
