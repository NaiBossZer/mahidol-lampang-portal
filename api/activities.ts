import { desc, eq } from "drizzle-orm";
import { getDb } from "../src/db/index";
import { activities, activityPhotos, learningCenters, socialProjects } from "../src/db/schema";
import { json, methodNotAllowed, type ApiRequest, type ApiResponse } from "./_http";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);
  try {
    const db = getDb();
    const rows = await db
      .select({
        id: activities.id,
        title: activities.title,
        slug: activities.slug,
        summary: activities.summary,
        activityDate: activities.activityDate,
        location: activities.location,
        participantCount: activities.participantCount,
        featuredImage: activities.featuredImage,
        publishedAt: activities.publishedAt,
        centerId: activities.centerId,
        centerName: learningCenters.name,
        projectId: activities.projectId,
        projectTitle: socialProjects.title,
      })
      .from(activities)
      .leftJoin(learningCenters, eq(activities.centerId, learningCenters.id))
      .leftJoin(socialProjects, eq(activities.projectId, socialProjects.id))
      .where(eq(activities.status, "published"))
      .orderBy(desc(activities.activityDate));
    return json(res, 200, { success: true, data: rows });
  } catch (error) {
    console.error("GET /api/activities", error);
    return json(res, 500, { error: "ไม่สามารถโหลดกิจกรรมได้" });
  }
}
