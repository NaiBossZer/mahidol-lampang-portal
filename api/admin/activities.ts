import { desc, eq } from "drizzle-orm";
import { getDb } from "../../src/db/index";
import {
  activities,
  activityPhotos,
  activityOutcomes,
  learningCenters,
  socialProjects,
} from "../../src/db/schema";
import { json, methodNotAllowed, readJson, type ApiRequest, type ApiResponse } from "../_http";
import { isAdmin } from "../_auth";
function bodyOf(value: unknown) {
  if (!value || typeof value !== "object") return null;
  const b = value as any;
  const title = String(b.title ?? "").trim(),
    slug = String(b.slug ?? "").trim(),
    date = new Date(String(b.activityDate ?? ""));
  const status = String(b.status ?? "draft");
  const participant =
    b.participantCount == null || b.participantCount === "" ? null : Number(b.participantCount);
  if (
    !title ||
    !slug ||
    Number.isNaN(date.getTime()) ||
    !["draft", "published", "archived"].includes(status) ||
    (participant !== null && (!Number.isInteger(participant) || participant < 0))
  )
    return null;
  return {
    projectId: b.projectId ? String(b.projectId) : null,
    centerId: b.centerId ? String(b.centerId) : null,
    title,
    slug,
    summary: b.summary ? String(b.summary) : null,
    content: b.content ? String(b.content) : null,
    activityDate: date,
    location: b.location ? String(b.location) : null,
    participantCount: participant,
    objective: b.objective ? String(b.objective) : null,
    process: b.process ? String(b.process) : null,
    outcome: b.outcome ? String(b.outcome) : null,
    impact: b.impact ? String(b.impact) : null,
    featuredImage: b.featuredImage ? String(b.featuredImage) : null,
    status,
    publishedAt: status === "published" ? new Date() : null,
    updatedAt: new Date(),
  };
}
export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!isAdmin(req)) return json(res, 401, { error: "Unauthorized" });
  const id = new URL(req.url ?? "/", "http://localhost").searchParams.get("id");
  try {
    const db = getDb();
    if (req.method === "GET") {
      const rows = await db.select().from(activities).orderBy(desc(activities.activityDate));
      return json(res, 200, { success: true, data: rows });
    }
    if (req.method === "POST") {
      const d = bodyOf(await readJson(req));
      if (!d) return json(res, 400, { error: "ข้อมูลกิจกรรมไม่ถูกต้อง" });
      const [r] = await db
        .insert(activities)
        .values(d as any)
        .returning();
      return json(res, 201, { success: true, data: r });
    }
    if ((req.method === "PUT" || req.method === "PATCH") && id) {
      const d = bodyOf(await readJson(req));
      if (!d) return json(res, 400, { error: "ข้อมูลกิจกรรมไม่ถูกต้อง" });
      const [r] = await db
        .update(activities)
        .set(d as any)
        .where(eq(activities.id, id))
        .returning();
      if (!r) return json(res, 404, { error: "ไม่พบกิจกรรม" });
      return json(res, 200, { success: true, data: r });
    }
    if (req.method === "DELETE" && id) {
      const [r] = await db
        .delete(activities)
        .where(eq(activities.id, id))
        .returning({ id: activities.id });
      if (!r) return json(res, 404, { error: "ไม่พบกิจกรรม" });
      return json(res, 200, { success: true, data: r });
    }
    return methodNotAllowed(res, ["GET", "POST", "PUT", "PATCH", "DELETE"]);
  } catch (e) {
    console.error(e);
    return json(res, 500, { error: "ไม่สามารถจัดการกิจกรรมได้" });
  }
}
