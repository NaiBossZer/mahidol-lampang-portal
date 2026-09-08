import { eq, sql } from "drizzle-orm";
import { getDb } from "../src/db/index";
import { products } from "../src/db/schema";
import { json, methodNotAllowed, readJson, type ApiRequest, type ApiResponse } from "../_http";
import { isAdmin } from "./_auth";
export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!isAdmin(req)) return json(res, 401, { error: "Unauthorized" });
  const id = new URL(req.url ?? "/", "http://localhost").searchParams.get("id");
  if (req.method !== "PATCH" || !id) return methodNotAllowed(res, ["PATCH"]);
  try {
    const b = (await readJson(req)) as any;
    const stock = Number(b.stock ?? b.stockQuantity);
    if (!Number.isInteger(stock) || stock < 0) return json(res, 400, { error: "สต็อกไม่ถูกต้อง" });
    const [row] = await getDb()
      .update(products)
      .set({ stockQuantity: stock })
      .where(eq(products.id, id))
      .returning();
    if (!row) return json(res, 404, { error: "ไม่พบสินค้า" });
    return json(res, 200, { success: true, data: row });
  } catch (e) {
    console.error(e);
    return json(res, 500, { error: "ไม่สามารถปรับสต็อกได้" });
  }
}
