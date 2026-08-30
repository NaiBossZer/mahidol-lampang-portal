import { createAPIFileRoute } from '@tanstack/react-start/api';
import { db } from '../../db';
import { orders, orderItems, products } from '../../db/schema';
import { eq, sql } from 'drizzle-orm';

export const APIRoute = createAPIFileRoute('/api/orders')({
  POST: async ({ request }) => {
    try {
      const body = await request.json();
      const { customerName, customerPhone, deliveryType, address, totalAmount, slipUrl, items } = body;

      if (!items || items.length === 0) {
        return new Response(JSON.stringify({ success: false, error: 'Order items are required' }), { status: 400 });
      }

      // 2. POST /api/orders: รับข้อมูลการสั่งซื้อ บันทึกออเดอร์ และลดจำนวนสต็อกสินค้าใน Transaction แบบ Atomic
      const newOrder = await db.transaction(async (tx) => {
        // Create Order
        const [insertedOrder] = await tx
          .insert(orders)
          .values({
            customerName,
            customerPhone,
            deliveryType,
            address,
            totalAmount,
            slipUrl,
            status: 'pending',
          })
          .returning();

        // Process Items & Decrease Stock
        for (const item of items) {
          // Check current product stock
          const [product] = await tx
            .select()
            .from(products)
            .where(eq(products.id, item.productId));

          if (!product) {
            throw new Error(`Product ${item.productId} not found`);
          }

          if (!product.isPreorder && product.stockQuantity < item.quantity) {
            throw new Error(`Insufficient stock for product: ${product.name}`);
          }

          // Insert Order Item
          await tx.insert(orderItems).values({
            orderId: insertedOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            pricePerUnit: item.pricePerUnit || product.price,
          });

          // Decrease Stock only if it's not a pre-order (or according to business logic)
          if (!product.isPreorder) {
            await tx
              .update(products)
              .set({
                stockQuantity: sql`${products.stockQuantity} - ${item.quantity}`,
              })
              .where(eq(products.id, item.productId));
          }
        }

        return insertedOrder;
      });

      return new Response(JSON.stringify({ success: true, data: newOrder }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error: any) {
      console.error('Transaction Error:', error);
      return new Response(JSON.stringify({ success: false, error: error.message || 'Transaction failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
});
