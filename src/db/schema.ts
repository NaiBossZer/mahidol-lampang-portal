import { pgTable, uuid, varchar, text, decimal, integer, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const orderStatusEnum = pgEnum('order_status', ['pending', 'paid', 'fulfilled', 'cancelled']);

// 1. Products Table
export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 100 }),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  unit: varchar('unit', { length: 50 }).notNull(), // e.g., Kg, Pack
  stockQuantity: integer('stock_quantity').notNull().default(0),
  imageUrl: text('image_url'),
  harvestDate: timestamp('harvest_date'),
  isPreorder: boolean('is_preorder').default(false).notNull(),
  researchTag: varchar('research_tag', { length: 100 }), // e.g., P-01 (รอบที่ 3)
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 2. Orders Table
export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  customerPhone: varchar('customer_phone', { length: 50 }).notNull(),
  deliveryType: varchar('delivery_type', { length: 50 }).notNull(), // pickup, delivery
  address: text('address'),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  slipUrl: text('slip_url'),
  status: orderStatusEnum('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 3. Order Items Table
export const orderItems = pgTable('order_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').notNull().references(() => products.id),
  quantity: integer('quantity').notNull(),
  pricePerUnit: decimal('price_per_unit', { precision: 10, scale: 2 }).notNull(),
});

// Relations
export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));
