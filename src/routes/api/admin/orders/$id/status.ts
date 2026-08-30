import { createAPIFileRoute } from '@tanstack/react-start/api';
import { db } from '../../../../db';
import { orders } from '../../../../db/schema';
import { eq } from 'drizzle-orm';

export const APIRoute = createAPIFileRoute('/api/admin/orders/$id/status')({
  PATCH: async ({ request, params }) => {
    try {
      const { id } = params;
      const body = await request.json();
      const { status } = body;

      if (!status || !['pending', 'paid', 'fulfilled', 'cancelled'].includes(status)) {
        return new Response(JSON.stringify({ success: false, error: 'Invalid status' }), { status: 400 });
      }

      // 3. PATCH /api/admin/orders/:id/status: อัปเดตสถานะออเดอร์โดย Admin
      const [updatedOrder] = await db
        .update(orders)
        .set({ status })
        .where(eq(orders.id, id))
        .returning();

      if (!updatedOrder) {
        return new Response(JSON.stringify({ success: false, error: 'Order not found' }), { status: 404 });
      }

      return new Response(JSON.stringify({ success: true, data: updatedOrder }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error: any) {
      console.error('Error updating order status:', error);
      return new Response(JSON.stringify({ success: false, error: 'Failed to update status' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
});
