import { asc, eq } from "drizzle-orm";
import { getDb } from "../src/db/index";
import { socialProjects } from "../src/db/schema";
import { json, methodNotAllowed, type ApiRequest, type ApiResponse } from "./_http";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(socialProjects)
      .where(eq(socialProjects.status, "active"))
      .orderBy(asc(socialProjects.title));
    return json(res, 200, { success: true, data: rows });
  } catch (error) {
    console.error("GET /api/projects", error);
    return json(res, 500, { error: "ไม่สามารถโหลดโครงการเพื่อสังคมได้" });
  }
}
