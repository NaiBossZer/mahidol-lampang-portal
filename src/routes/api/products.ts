import { createFileRoute } from "@tanstack/react-router";
import { db } from "../../db";
import { products } from "../../db/schema";
import { or, gt, eq } from "drizzle-orm";
import { isAdminRequest } from "../../server/admin-auth";

type ProductInput = {
  name: string;
  unit: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
  isPreorder?: boolean;
  harvestDate?: string;
  researchTag?: string;
};
function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
function productInput(value: unknown): value is ProductInput {
  if (!record(value)) return false;
  return (
    typeof value["name"] === "string" &&
    value["name"].trim().length >= 2 &&
    value["name"].length <= 255 &&
    typeof value["unit"] === "string" &&
    value["unit"].length <= 50 &&
    typeof value["price"] === "number" &&
    Number.isFinite(value["price"]) &&
    value["price"] >= 0 &&
    typeof value["stockQuantity"] === "number" &&
    Number.isInteger(value["stockQuantity"]) &&
    value["stockQuantity"] >= 0
  );
}

export const Route = createFileRoute("/api/products")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          // 1. GET /api/products: ดึงรายการสินค้าสดที่มี stock > 0 หรือเปิดให้ Pre-order
          const availableProducts = await db
            .select()
            .from(products)
            .where(or(gt(products.stockQuantity, 0), eq(products.isPreorder, true)));

          return new Response(JSON.stringify({ success: true, data: availableProducts }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.error("Error fetching products:", error);
          return new Response(
            JSON.stringify({ success: false, error: "Failed to fetch products" }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      },
      POST: async ({ request }) => {
        if (!(await isAdminRequest(request)))
          return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
        const body: unknown = await request.json().catch(() => null);
        if (!productInput(body))
          return Response.json(
            { success: false, error: "ข้อมูลสินค้าไม่ถูกต้อง" },
            { status: 400 },
          );
        const [created] = await db
          .insert(products)
          .values({
            name: body.name.trim(),
            unit: body.unit.trim(),
            price: body.price.toFixed(2),
            stockQuantity: body.stockQuantity,
            imageUrl: body.imageUrl ?? null,
            isPreorder: body.isPreorder === true,
            harvestDate: body.harvestDate ? new Date(body.harvestDate) : null,
            researchTag: body.researchTag ?? null,
          })
          .returning();
        return Response.json({ success: true, data: created }, { status: 201 });
      },
    },
  },
});
