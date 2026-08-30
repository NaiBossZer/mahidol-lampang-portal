import { createFileRoute } from "@tanstack/react-router";
import { getDb } from "../../../../../db";
import { orders } from "../../../../../db/schema";
import { eq } from "drizzle-orm";
import { isAdminRequest } from "../../../../../server/admin-auth";

export const Route = createFileRoute("/api/admin/orders/$id/status")({
  server: {
    handlers: {
      PATCH: async ({ request, params }) => {
        try {
          if (!(await isAdminRequest(request)))
            return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
          const { id } = params;
          const body: unknown = await request.json().catch(() => null);
          const status = isRecord(body) ? body["status"] : undefined;

          if (!isOrderStatus(status)) {
            return new Response(JSON.stringify({ success: false, error: "Invalid status" }), {
              status: 400,
            });
          }

          // 3. PATCH /api/admin/orders/:id/status: อัปเดตสถานะออเดอร์โดย Admin
          const [updatedOrder] = await getDb()
            .update(orders)
            .set({ status })
            .where(eq(orders.id, id))
            .returning();

          if (!updatedOrder) {
            return new Response(JSON.stringify({ success: false, error: "Order not found" }), {
              status: 404,
            });
          }

          return new Response(JSON.stringify({ success: true, data: updatedOrder }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: unknown) {
          console.error("Error updating order status:", error);
          return new Response(
            JSON.stringify({ success: false, error: "Failed to update status" }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      },
    },
  },
});

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isOrderStatus(value: unknown): value is "pending" | "paid" | "fulfilled" | "cancelled" {
  return value === "pending" || value === "paid" || value === "fulfilled" || value === "cancelled";
}
