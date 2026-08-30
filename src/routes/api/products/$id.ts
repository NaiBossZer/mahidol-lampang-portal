import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { products } from "../../../db/schema";
import { isAdminRequest } from "../../../server/admin-auth";

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
function validInput(value: unknown): value is ProductInput {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item["name"] === "string" &&
    item["name"].trim().length >= 2 &&
    item["name"].length <= 255 &&
    typeof item["unit"] === "string" &&
    item["unit"].length <= 50 &&
    typeof item["price"] === "number" &&
    Number.isFinite(item["price"]) &&
    item["price"] >= 0 &&
    typeof item["stockQuantity"] === "number" &&
    Number.isInteger(item["stockQuantity"]) &&
    item["stockQuantity"] >= 0
  );
}

export const Route = createFileRoute("/api/products/$id")({
  server: {
    handlers: {
      PUT: async ({ request, params }) => {
        if (!(await isAdminRequest(request)))
          return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
        const body: unknown = await request.json().catch(() => null);
        if (!validInput(body))
          return Response.json(
            { success: false, error: "ข้อมูลสินค้าไม่ถูกต้อง" },
            { status: 400 },
          );
        const [updated] = await getDb()
          .update(products)
          .set({
            name: body.name.trim(),
            unit: body.unit.trim(),
            price: body.price.toFixed(2),
            stockQuantity: body.stockQuantity,
            imageUrl: body.imageUrl ?? null,
            isPreorder: body.isPreorder === true,
            harvestDate: body.harvestDate ? new Date(body.harvestDate) : null,
            researchTag: body.researchTag ?? null,
          })
          .where(eq(products.id, params.id))
          .returning();
        return updated
          ? Response.json({ success: true, data: updated })
          : Response.json({ success: false, error: "ไม่พบสินค้า" }, { status: 404 });
      },
      DELETE: async ({ request, params }) => {
        if (!(await isAdminRequest(request)))
          return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
        const [deleted] = await getDb()
          .delete(products)
          .where(eq(products.id, params.id))
          .returning({ id: products.id });
        return deleted
          ? Response.json({ success: true, data: deleted })
          : Response.json({ success: false, error: "ไม่พบสินค้า" }, { status: 404 });
      },
    },
  },
});
