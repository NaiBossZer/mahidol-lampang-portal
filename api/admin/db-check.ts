import { json, methodNotAllowed, type ApiRequest, type ApiResponse } from "../_http";
import { isAdmin } from "../_auth";
import { getDb } from "../../src/db";
import { sql } from "drizzle-orm";

const TABLES = [
  "social_projects",
  "learning_centers",
  "activities",
  "activity_photos",
  "partners",
  "activity_partners",
  "activity_outcomes",
  "products",
  "orders",
  "order_items",
];

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);
  if (!isAdmin(req)) return json(res, 401, { success: false, error: "Unauthorized" });
  try {
    const db = getDb();
    const result = await db.execute(sql`
      select table_name from information_schema.tables
      where table_schema = 'public'
      and table_name in (${sql.join(
        TABLES.map((name) => sql`${name}`),
        sql`, `,
      )})
      order by table_name
    `);
    const found = result.map((row) => String(row.table_name));
    const missing = TABLES.filter((name) => !found.includes(name));
    return json(res, 200, {
      success: missing.length === 0,
      data: { expected: TABLES.length, found, missing },
    });
  } catch (error) {
    console.error("[db-check]", error);
    return json(res, 500, { success: false, error: "Database check failed" });
  }
}
