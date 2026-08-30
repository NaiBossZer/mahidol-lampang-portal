import { createFileRoute } from "@tanstack/react-router";
import { getDb } from "../../db";
import { orders, orderItems, products } from "../../db/schema";
import { and, eq, gte, sql } from "drizzle-orm";

export const Route = createFileRoute("/api/orders")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body: unknown = await request.json().catch(() => null);
          if (!isRecord(body))
            return Response.json(
              { success: false, error: "ข้อมูลคำสั่งซื้อไม่ถูกต้อง" },
              { status: 400 },
            );
          const { customerName, customerPhone, deliveryType, address, slipUrl, items } = body;

          if (
            typeof customerName !== "string" ||
            customerName.trim().length < 2 ||
            customerName.length > 255 ||
            typeof customerPhone !== "string" ||
            !/^[0-9+ ()-]{8,20}$/.test(customerPhone) ||
            !isDeliveryType(deliveryType) ||
            (deliveryType === "delivery" &&
              (typeof address !== "string" || address.trim().length < 10)) ||
            !isValidSlipUrl(slipUrl) ||
            !Array.isArray(items) ||
            items.length === 0 ||
            items.length > 50
          ) {
            return Response.json(
              { success: false, error: "ข้อมูลคำสั่งซื้อไม่ถูกต้อง" },
              { status: 400 },
            );
          }
          const safeCustomerName = customerName.trim();
          const safeCustomerPhone = customerPhone.trim();
          const safeAddress = typeof address === "string" ? address.trim() : undefined;
          const safeSlipUrl = typeof slipUrl === "string" ? slipUrl : undefined;

          // 2. POST /api/orders: รับข้อมูลการสั่งซื้อ บันทึกออเดอร์ และลดจำนวนสต็อกสินค้าใน Transaction แบบ Atomic
          const newOrder = await getDb().transaction(async (tx) => {
            let calculatedTotal = 0;
            const normalizedItems: Array<{
              productId: string;
              quantity: number;
              pricePerUnit: string;
              isPreorder: boolean;
            }> = [];
            const requested = new Map<string, number>();

            // Resolve price and stock on the server. Never trust totals or prices from the browser.
            for (const item of items as Array<{ productId?: unknown; quantity?: unknown }>) {
              if (
                typeof item.productId !== "string" ||
                !/^[0-9a-f-]{36}$/i.test(item.productId) ||
                !Number.isInteger(item.quantity) ||
                Number(item.quantity) < 1 ||
                Number(item.quantity) > 100
              ) {
                throw new Error("Invalid order item");
              }
              requested.set(
                item.productId,
                (requested.get(item.productId) ?? 0) + Number(item.quantity),
              );
            }
            for (const [productId, quantity] of requested) {
              if (quantity > 100) throw new Error("Invalid order item");
              const [product] = await tx.select().from(products).where(eq(products.id, productId));
              if (!product) throw new Error("Product not found");
              if (!product.isPreorder && product.stockQuantity < quantity)
                throw new Error(`Insufficient stock for product: ${product.name}`);
              calculatedTotal += Number(product.price) * quantity;
              normalizedItems.push({
                productId,
                quantity,
                pricePerUnit: product.price,
                isPreorder: product.isPreorder,
              });
            }

            const [insertedOrder] = await tx
              .insert(orders)
              .values({
                customerName: safeCustomerName,
                customerPhone: safeCustomerPhone,
                deliveryType,
                address: safeAddress,
                totalAmount: calculatedTotal.toFixed(2),
                slipUrl: safeSlipUrl,
                status: "pending",
              })
              .returning();
            if (!insertedOrder) throw new Error("Order could not be created");

            // Process Items & Decrease Stock
            for (const item of normalizedItems) {
              // Insert Order Item
              await tx.insert(orderItems).values({
                orderId: insertedOrder.id,
                productId: item.productId,
                quantity: item.quantity,
                pricePerUnit: item.pricePerUnit,
              });

              // Decrease Stock only if it's not a pre-order (or according to business logic)
              if (!item.isPreorder) {
                const updated = await tx
                  .update(products)
                  .set({
                    stockQuantity: sql`${products.stockQuantity} - ${item.quantity}`,
                  })
                  .where(
                    and(
                      eq(products.id, item.productId),
                      gte(products.stockQuantity, item.quantity),
                    ),
                  )
                  .returning({ id: products.id });
                if (updated.length === 0) throw new Error("Insufficient stock");
              }
            }

            return insertedOrder;
          });

          return new Response(JSON.stringify({ success: true, data: newOrder }), {
            status: 201,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: unknown) {
          console.error("Transaction Error:", error);
          const message = error instanceof Error ? error.message : "Transaction failed";
          const clientMessage = /Invalid|not found|Insufficient/.test(message)
            ? message
            : "ไม่สามารถสร้างคำสั่งซื้อได้";
          return Response.json(
            { success: false, error: clientMessage },
            { status: /Invalid|not found|Insufficient/.test(message) ? 400 : 500 },
          );
        }
      },
    },
  },
});

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isDeliveryType(value: unknown): value is "pickup" | "delivery" {
  return value === "pickup" || value === "delivery";
}

function isValidSlipUrl(value: unknown): value is string | undefined {
  return (
    typeof value === "undefined" ||
    (typeof value === "string" &&
      value.length <= 2_800_000 &&
      /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(value))
  );
}
