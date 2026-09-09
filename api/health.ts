import { json, methodNotAllowed, type ApiRequest, type ApiResponse } from "./_http";
import { getDb } from "../src/db";
import { sql } from "drizzle-orm";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);
  try {
    const db = getDb();
    const result = await db.execute(sql`select now() as server_time`);
    return json(res, 200, {
      success: true,
      data: {
        service: "social-engagement-api",
        database: "supabase",
        connected: true,
        serverTime: result[0]?.["server_time"] ?? null,
      },
    });
  } catch (error) {
    console.error("[health]", error);
    return json(res, 503, {
      success: false,
      data: { service: "social-engagement-api", database: "supabase", connected: false },
      error: "Database unavailable",
    });
  }
}
