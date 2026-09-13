import { eq } from "drizzle-orm";
import { getDb } from "../src/db/index";
import { products } from "../src/db/schema";
import { json, methodNotAllowed, readJson, type ApiRequest, type ApiResponse } from "./_http";
import { isAdmin } from "./_auth";

function validBody(body: unknown) {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  const name = String(b["name"] ?? "").trim();
  const unit = String(b["unit"] ?? "").trim();
  const price = Number(b["price"]);
  const stock = Number(b["stockQuantity"] ?? b["stock"] ?? 0);
  if (
    !name ||
    !unit ||
    !Number.isFinite(price) ||
    price < 0 ||
    !Number.isInteger(stock) ||
    stock < 0
  )
    return null;
  return {
    name,
    description: b["description"] ? String(b["description"]) : null,
    category: b["category"] ? String(b["category"]) : null,
    price: price.toFixed(2),
    unit,
    stockQuantity: stock,
    imageUrl: b["imageUrl"] ? String(b["imageUrl"]) : null,
    harvestDate: b["harvestDate"] ? new Date(String(b["harvestDate"])) : null,
    isPreorder: Boolean(b["isPreorder"]),
    researchTag: b["researchTag"] ? String(b["researchTag"]) : null,
    plotId: b["plotId"] ? String(b["plotId"]) : null,
  };
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const url = new URL(req.url ?? "/", "http://localhost");
  const id = url.searchParams.get("id");
  try {
    if (req.method === "GET") {
      const rows = await getDb().select().from(products).orderBy(products.createdAt);
      return json(res, 200, { success: true, data: rows });
    }
    if (!isAdmin(req)) return json(res, 401, { error: "Unauthorized" });
    const db = getDb();
    if (req.method === "POST") {
      const data = validBody(await readJson(req));
      if (!data) return json(res, 400, { error: "ข้อมูลสินค้าไม่ถูกต้อง" });
      const [row] = await db.insert(products).values(data).returning();
      return json(res, 201, { success: true, data: row });
    }
    if ((req.method === "PUT" || req.method === "PATCH") && id) {
      const data = validBody(await readJson(req));
      if (!data) return json(res, 400, { error: "ข้อมูลสินค้าไม่ถูกต้อง" });
      const [row] = await db.update(products).set(data).where(eq(products.id, id)).returning();
      if (!row) return json(res, 404, { error: "ไม่พบสินค้า" });
      return json(res, 200, { success: true, data: row });
    }
    if (req.method === "DELETE" && id) {
      const [row] = await db
        .delete(products)
        .where(eq(products.id, id))
        .returning({ id: products.id });
      if (!row) return json(res, 404, { error: "ไม่พบสินค้า" });
      return json(res, 200, { success: true, data: row });
    }
    return methodNotAllowed(res, ["GET", "POST", "PUT", "PATCH", "DELETE"]);
  } catch (error) {
    console.error("/api/products", error);
    return json(res, 500, { error: "ไม่สามารถจัดการสินค้าได้" });
  }
}
