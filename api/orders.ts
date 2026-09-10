import { desc, eq, inArray, sql } from "drizzle-orm";
import { getDb } from "../src/db/index";
import { orders, orderItems, products } from "../src/db/schema";
import { json, methodNotAllowed, readJson, type ApiRequest, type ApiResponse } from "./_http";
import { isAdmin } from "./_auth";

const statuses = ["pending", "paid", "fulfilled", "cancelled"] as const;

type OrderItemRow = {
  orderId: string;
  productId: string;
  productName: string | null;
  quantity: number;
  pricePerUnit: string;
};

async function signedSlipUrl(path: string | null) {
  if (!path) return null;
  const url = process.env["SUPABASE_URL"]?.replace(/\/$/, "");
  const key = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  const bucket = process.env["SUPABASE_STORAGE_BUCKET"] || "order-slips";
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
  const url = new URL(req.url ?? "/", "http://localhost");
  const id = url.searchParams.get("id");
  try {
    if (req.method === "GET") {
      if (!isAdmin(req)) return json(res, 401, { error: "Unauthorized" });

      const db = getDb();
      const rows = await db.select().from(orders).orderBy(desc(orders.createdAt));
      const items: OrderItemRow[] = rows.length
        ? await db
            .select({
              orderId: orderItems.orderId,
              productId: orderItems.productId,
              productName: products.name,
              quantity: orderItems.quantity,
              pricePerUnit: orderItems.pricePerUnit,
            })
            .from(orderItems)
            .leftJoin(products, eq(orderItems.productId, products.id))
        : [];

      const itemsByOrder = new Map<string, OrderItemRow[]>();
      for (const item of items) {
        const existing = itemsByOrder.get(item.orderId);
        if (existing) existing.push(item);
        else itemsByOrder.set(item.orderId, [item]);
      }

      const data = await Promise.all(
        rows.map(async (o) => ({
          ...o,
          slipUrl: await signedSlipUrl(o.slipUrl),
          items: itemsByOrder.get(o.id) ?? [],
        })),
      );
      return json(res, 200, { success: true, data });
    }

    if (req.method === "POST") {
      const b = (await readJson(req)) as Record<string, unknown>;
      const name = String(b["customerName"] ?? "").trim();
      const phone = String(b["customerPhone"] ?? "").trim();
      const deliveryType = String(b["deliveryType"] ?? "");
      const raw = Array.isArray(b["items"]) ? b["items"] : [];
      if (!name || !phone || !["pickup", "delivery"].includes(deliveryType) || !raw.length)
        return json(res, 400, { error: "ข้อมูลคำสั่งซื้อไม่ครบถ้วน" });

      const db = getDb();
      const requested = new Map<string, number>();
      for (const x of raw) {
        if (!x || typeof x !== "object") return json(res, 400, { error: "รายการสินค้าไม่ถูกต้อง" });
        const item = x as Record<string, unknown>;
        const productId = String(item["productId"] ?? "");
        const quantity = Number(item["quantity"]);
        if (!productId || !Number.isInteger(quantity) || quantity <= 0)
          return json(res, 400, { error: "จำนวนสินค้าไม่ถูกต้อง" });
        requested.set(productId, (requested.get(productId) ?? 0) + quantity);
      }

      const productIds = [...requested.keys()];
      const productRows = await db.select().from(products).where(inArray(products.id, productIds));
      const productsById = new Map(productRows.map((product) => [product.id, product]));
      let total = 0;
      const lines: { productId: string; quantity: number; pricePerUnit: string }[] = [];

      for (const [productId, quantity] of requested) {
        const row = productsById.get(productId);
        if (!row || row.stockQuantity < quantity)
          return json(res, 409, { error: `สินค้า ${row?.name ?? productId} มีสต็อกไม่เพียงพอ` });
        total += Number(row.price) * quantity;
        lines.push({ productId, quantity, pricePerUnit: row.price });
      }

      const result = await db.transaction(async (tx) => {
        const [order] = await tx
          .insert(orders)
          .values({
            customerName: name,
            customerPhone: phone,
            deliveryType,
            address: b["address"] ? String(b["address"]) : null,
            totalAmount: total.toFixed(2),
            slipUrl: b["slipUrl"] ? String(b["slipUrl"]) : null,
            status: "pending",
          })
          .returning();
        if (!order) throw new Error("ORDER_CREATE_FAILED");
        for (const line of lines) {
          const [updated] = await tx
            .update(products)
            .set({ stockQuantity: sql`${products.stockQuantity} - ${line.quantity}` })
            .where(sql`${products.id} = ${line.productId} AND ${products.stockQuantity} >= ${line.quantity}`)
            .returning({ id: products.id });
          if (!updated) throw new Error("STOCK_CONFLICT");
          await tx.insert(orderItems).values({ orderId: order.id, ...line });
        }
        return order;
      });
      return json(res, 201, { success: true, data: result });
    }

    if (!isAdmin(req)) return json(res, 401, { error: "Unauthorized" });
    if (req.method === "PATCH" && id) {
      const b = (await readJson(req)) as Record<string, unknown>;
      const status = b["status"];
      if (!statuses.includes(status as (typeof statuses)[number])) return json(res, 400, { error: "สถานะไม่ถูกต้อง" });
      const db = getDb();
      const [row] = await db
        .update(orders)
        .set({ status: status as (typeof statuses)[number] })
        .where(eq(orders.id, id))
        .returning();
      if (!row) return json(res, 404, { error: "ไม่พบคำสั่งซื้อ" });
      return json(res, 200, { success: true, data: row });
    }
    return methodNotAllowed(res, ["GET", "POST", "PATCH"]);
  } catch (error) {
    console.error("/api/orders", error);
    const conflict = error instanceof Error && error.message === "STOCK_CONFLICT";
    return json(res, conflict ? 409 : 500, {
      error: conflict ? "สต็อกมีการเปลี่ยนแปลง กรุณาลองใหม่" : "ไม่สามารถจัดการคำสั่งซื้อได้",
    });
  }
}
