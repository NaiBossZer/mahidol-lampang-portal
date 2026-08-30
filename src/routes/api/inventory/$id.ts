import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { products } from "../../../db/schema";
import { isAdminRequest } from "../../../server/admin-auth";

export const Route = createFileRoute("/api/inventory/$id")({
  server: {
    handlers: {
      PATCH: async ({ request, params }) => {
        if (!(await isAdminRequest(request)))
          return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
        const body: unknown = await request.json().catch(() => null);
        const stock =
          typeof body === "object" && body !== null && "stock" in body ? body.stock : undefined;
        if (typeof stock !== "number" || !Number.isInteger(stock) || stock < 0 || stock > 1_000_000)
          return Response.json(
            { success: false, error: "จำนวน stock ไม่ถูกต้อง" },
            { status: 400 },
          );
        const [updated] = await db
          .update(products)
          .set({ stockQuantity: stock })
          .where(eq(products.id, params.id))
          .returning();
        return updated
          ? Response.json({ success: true, data: updated })
          : Response.json({ success: false, error: "ไม่พบสินค้า" }, { status: 404 });
      },
    },
  },
});
