import { desc, eq, sql } from "drizzle-orm";
import { getDb } from "../src/db/index";
import { orders, orderItems, products } from "../src/db/schema";
import { json, methodNotAllowed, readJson, type ApiRequest, type ApiResponse } from "../_http";
import { isAdmin } from "./_auth";

const statuses = ["pending", "paid", "fulfilled", "cancelled"] as const;

async function signedSlipUrl(path: string | null) {
  if (!path) return null;
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "order-slips";
  if (!url || !key || !path.startsWith("orders/")) return null;
  try {
    const r = await fetch(`${url}/storage/v1/object/sign/${encodeURIComponent(bucket)}/${path}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, apikey: key, "Content-Type": "application/json" },
      body: JSON.stringify({ expiresIn: 3600 }),
    });
    if (!r.ok) return null;
    const payload = (await r.json()) as { signedURL?: string };
    return payload.signedURL ? `${url}/storage/v1${payload.signedURL}` : null;
  } catch (error) {
    console.error("signed slip URL failed", error);
    return null;
  }
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const url = new URL(req.url ?? "/", "http://localhost"), id = url.searchParams.get("id");
  try {
    if (req.method === "GET") {
      if (!isAdmin(req)) return json(res, 401, { error: "Unauthorized" });
      const rows = await getDb().select().from(orders).orderBy(desc(orders.createdAt));
      const items = rows.length ? await getDb().select({ orderId: orderItems.orderId, productId: orderItems.productId, productName: products.name, quantity: orderItems.quantity, pricePerUnit: orderItems.pricePerUnit }).from(orderItems).leftJoin(products, eq(orderItems.productId, products.id)) : [];
      const data = await Promise.all(rows.map(async (o) => ({ ...o, slipUrl: await signedSlipUrl(o.slipUrl), items: items.filter((i) => i.orderId === o.id) })));
      return json(res, 200, { success: true, data });
    }
    if (req.method === "POST") {
      const b = (await readJson(req)) as Record<string, unknown>;
      const name = String(b.customerName ?? "").trim(), phone = String(b.customerPhone ?? "").trim(), deliveryType = String(b.deliveryType ?? "");
      const raw = Array.isArray(b.items) ? b.items : [];
      if (!name || !phone || !["pickup", "delivery"].includes(deliveryType) || !raw.length) return json(res, 400, { error: "ข้อมูลคำสั่งซื้อไม่ครบถ้วน" });
      const db = getDb();
      let total = 0;
      const lines: { productId: string; quantity: number; pricePerUnit: string }[] = [];
      for (const x of raw) {
        if (!x || typeof x !== "object") return json(res, 400, { error: "รายการสินค้าไม่ถูกต้อง" });
        const p = String((x as Record<string, unknown>).productId ?? ""), q = Number((x as Record<string, unknown>).quantity);
        if (!p || !Number.isInteger(q) || q <= 0) return json(res, 400, { error: "จำนวนสินค้าไม่ถูกต้อง" });
        const [row] = await db.select().from(products).where(eq(products.id, p));
        if (!row || row.stockQuantity < q) return json(res, 409, { error: `สินค้า ${row?.name ?? p} มีสต็อกไม่เพียงพอ` });
        total += Number(row.price) * q;
        lines.push({ productId: p, quantity: q, pricePerUnit: row.price });
      }
      const result = await db.transaction(async (tx) => {
        const [order] = await tx.insert(orders).values({ customerName: name, customerPhone: phone, deliveryType, address: b.address ? String(b.address) : null, totalAmount: total.toFixed(2), slipUrl: b.slipUrl ? String(b.slipUrl) : null, status: "pending" }).returning();
        for (const l of lines) {
          const [updated] = await tx.update(products).set({ stockQuantity: sql`${products.stockQuantity} - ${l.quantity}` }).where(sql`${products.id} = ${l.productId} AND ${products.stockQuantity} >= ${l.quantity}`).returning({ id: products.id });
          if (!updated) throw new Error("STOCK_CONFLICT");
          await tx.insert(orderItems).values({ orderId: order.id, ...l });
        }
        return order;
      });
      return json(res, 201, { success: true, data: result });
    }
    if (!isAdmin(req)) return json(res, 401, { error: "Unauthorized" });
    if (req.method === "PATCH" && id) {
      const b = (await readJson(req)) as Record<string, unknown>;
      if (!statuses.includes(b.status as (typeof statuses)[number])) return json(res, 400, { error: "สถานะไม่ถูกต้อง" });
      const [row] = await getDb().update(orders).set({ status: b.status as (typeof statuses)[number] }).where(eq(orders.id, id)).returning();
      if (!row) return json(res, 404, { error: "ไม่พบคำสั่งซื้อ" });
      return json(res, 200, { success: true, data: row });
    }
    return methodNotAllowed(res, ["GET", "POST", "PATCH"]);
  } catch (error) {
    console.error("/api/orders", error);
    return json(res, error instanceof Error && error.message === "STOCK_CONFLICT" ? 409 : 500, { error: error instanceof Error && error.message === "STOCK_CONFLICT" ? "สต็อกมีการเปลี่ยนแปลง กรุณาลองใหม่" : "ไม่สามารถจัดการคำสั่งซื้อได้" });
  }
}
