import { and, eq } from "drizzle-orm";
import { getDb } from "../src/db/index";
import {
  activities,
  activityOutcomes,
  activityPartners,
  activityPhotos,
  learningCenters,
  partners,
  socialProjects,
} from "../src/db/schema";
import { json, methodNotAllowed, type ApiRequest, type ApiResponse } from "./_http";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);
  const slug = new URL(req.url ?? "/", "http://localhost").searchParams.get("slug");
  if (!slug) return json(res, 400, { error: "slug is required" });
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(activities)
      .where(and(eq(activities.slug, slug), eq(activities.status, "published")))
      .limit(1);
    const activity = rows[0];
    if (!activity) return json(res, 404, { error: "Activity not found" });

    const [photos, outcomes, partnerRows, centerRows, projectRows] = await Promise.all([
      db.select().from(activityPhotos).where(eq(activityPhotos.activityId, activity.id)),
      db.select().from(activityOutcomes).where(eq(activityOutcomes.activityId, activity.id)),
      db
        .select({ id: partners.id, name: partners.name, type: partners.type, logo: partners.logo })
        .from(activityPartners)
        .innerJoin(partners, eq(activityPartners.partnerId, partners.id))
        .where(eq(activityPartners.activityId, activity.id)),
      activity.centerId
        ? db
            .select()
            .from(learningCenters)
            .where(eq(learningCenters.id, activity.centerId))
            .limit(1)
        : Promise.resolve([]),
      activity.projectId
        ? db.select().from(socialProjects).where(eq(socialProjects.id, activity.projectId)).limit(1)
        : Promise.resolve([]),
    ]);

    return json(res, 200, {
      success: true,
      data: {
        ...activity,
        photos,
        outcomes,
        partners: partnerRows,
        center: centerRows[0] ?? null,
        project: projectRows[0] ?? null,
      },
    });
  } catch (error) {
    console.error("GET /api/activity", error);
    return json(res, 500, { error: "ไม่สามารถโหลดรายละเอียดกิจกรรมได้" });
  }
}
