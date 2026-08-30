import { createFileRoute } from "@tanstack/react-router";
import { desc } from "drizzle-orm";
import { db } from "../../../db";
import { orders } from "../../../db/schema";
import { isAdminRequest } from "../../../server/admin-auth";

export const Route = createFileRoute("/api/admin/orders")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!(await isAdminRequest(request)))
          return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
        const rows = await db
          .select({
            id: orders.id,
            customerName: orders.customerName,
            createdAt: orders.createdAt,
            totalAmount: orders.totalAmount,
            status: orders.status,
            slipUrl: orders.slipUrl,
          })
          .from(orders)
          .orderBy(desc(orders.createdAt))
          .limit(100);
        return Response.json({ success: true, data: rows });
      },
    },
  },
});
