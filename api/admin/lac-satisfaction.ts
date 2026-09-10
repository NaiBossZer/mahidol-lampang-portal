import { desc, eq, sql } from "drizzle-orm";
import { getDb } from "../../src/db/index";
import { activities } from "../../src/db/schema";
import { json, methodNotAllowed, readJson, type ApiRequest, type ApiResponse } from "../_http";
import { isAdmin } from "../_auth";

const PRIVILEGED_ROLES = ["admin", "dean", "deputy_dean", "finance_head", "section_head"];

function cleanOptionalDate(value: unknown): Date | null {
  if (value == null || value === "") return null;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!isAdmin(req)) return json(res, 401, { error: "Unauthorized" });
  if (req.method !== "GET" && req.method !== "PATCH") {
    return methodNotAllowed(res, ["GET", "PATCH"]);
  }

  try {
    const db = getDb();
    const activityId = new URL(req.url ?? "/", "http://localhost").searchParams.get("activity");

    if (req.method === "GET") {
      const rows = await db
        .select({
          id: activities.id,
          title: activities.title,
          activityDate: activities.activityDate,
          status: activities.status,
          featuredImage: activities.featuredImage,
          surveyEnabled: sql<boolean>`coalesce(${sql.identifier("survey_enabled")}, true)`,
          surveyOpenAt: sql<string | null>`${sql.identifier("survey_open_at")}`,
          surveyCloseAt: sql<string | null>`${sql.identifier("survey_close_at")}`,
          surveyWelcomeText: sql<string | null>`${sql.identifier("survey_welcome_text")}`,
          responseCount: sql<number>`(
            select count(*)::int from public.survey_responses sr where sr.activity_id = ${activities.id}
          )`,
        })
        .from(activities)
        .orderBy(desc(activities.activityDate));

      if (activityId) {
        const responses = await db.execute(sql`
          select *
          from public.survey_responses
          where activity_id = ${activityId}::uuid
          order by submitted_at desc
          limit 5000
        `);
        return json(res, 200, { success: true, data: { activities: rows, responses } });
      }

      return json(res, 200, { success: true, data: { activities: rows, responses: [] } });
    }

    const id = activityId;
    if (!id) return json(res, 400, { error: "ต้องระบุ activity" });
    const body = await readJson(req);
    const surveyEnabled = body && typeof body === "object" && "surveyEnabled" in body
      ? Boolean((body as { surveyEnabled?: unknown }).surveyEnabled)
      : true;
    const openAt = cleanOptionalDate(body && typeof body === "object" ? (body as any).surveyOpenAt : null);
    const closeAt = cleanOptionalDate(body && typeof body === "object" ? (body as any).surveyCloseAt : null);
    const welcome = body && typeof body === "object" && "surveyWelcomeText" in body
      ? String((body as { surveyWelcomeText?: unknown }).surveyWelcomeText ?? "").trim()
      : "";

    if (openAt && closeAt && openAt > closeAt) {
      return json(res, 400, { error: "วันเปิดแบบประเมินต้องไม่เกินวันปิด" });
    }

    await db.execute(sql`
      update public.activities
      set survey_enabled = ${surveyEnabled},
          survey_open_at = ${openAt},
          survey_close_at = ${closeAt},
          survey_welcome_text = ${welcome || null},
          updated_at = now()
      where id = ${id}::uuid
    `);

    const [updated] = await db.select().from(activities).where(eq(activities.id, id)).limit(1);
    return json(res, 200, { success: true, data: updated });
  } catch (error) {
    console.error(error);
    return json(res, 500, { error: "ไม่สามารถจัดการระบบประเมิน Lac ได้" });
  }
}
