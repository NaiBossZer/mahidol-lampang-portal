import { desc } from "drizzle-orm";
import { getDb } from "../../src/db/index";
import { products } from "../../src/db/schema";
import { isAdmin } from "../_auth";
import { json, methodNotAllowed, type ApiRequest, type ApiResponse } from "../_http";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!isAdmin(req)) return json(res, 401, { error: "Unauthorized" });
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);
  try {
    const rows = await getDb().select().from(products).orderBy(desc(products.createdAt));
    return json(res, 200, { success: true, data: rows });
  } catch (error) {
    console.error("GET /api/admin/products", error);
    return json(res, 500, { error: "ไม่สามารถโหลดสินค้าได้" });
  }
}
