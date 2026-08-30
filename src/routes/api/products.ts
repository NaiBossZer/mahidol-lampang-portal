import { createAPIFileRoute } from '@tanstack/react-start/api';
import { db } from '../../db';
import { products } from '../../db/schema';
import { or, gt, eq } from 'drizzle-orm';

export const APIRoute = createAPIFileRoute('/api/products')({
  GET: async ({ request }) => {
    try {
      // 1. GET /api/products: ดึงรายการสินค้าสดที่มี stock > 0 หรือเปิดให้ Pre-order
      const availableProducts = await db
        .select()
        .from(products)
        .where(
          or(
            gt(products.stockQuantity, 0),
            eq(products.isPreorder, true)
          )
        );

      return new Response(JSON.stringify({ success: true, data: availableProducts }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      return new Response(JSON.stringify({ success: false, error: 'Failed to fetch products' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
});
