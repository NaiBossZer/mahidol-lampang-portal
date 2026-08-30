import {
  pgTable,
  uuid,
  varchar,
  text,
  decimal,
  integer,
  boolean,
  timestamp,
  pgEnum,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "paid",
  "fulfilled",
  "cancelled",
]);
export const plotStatusEnum = pgEnum("plot_status", ["ready", "normal", "attention"]);
export const evBookingStatusEnum = pgEnum("ev_booking_status", [
  "pending",
  "confirmed",
  "cancelled",
]);

export const plots = pgTable(
  "plots",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    plotCode: varchar("plot_code", { length: 50 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    mapUrl: text("map_url"),
    status: plotStatusEnum("status").default("normal").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({ plotCodeUnique: unique("plots_plot_code_unique").on(table.plotCode) }),
);

export const sensorLogs = pgTable("sensor_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  plotId: uuid("plot_id")
    .notNull()
    .references(() => plots.id, { onDelete: "cascade" }),
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
  temperatureC: decimal("temperature_c", { precision: 5, scale: 2 }).notNull(),
  humidityPercent: decimal("humidity_percent", { precision: 5, scale: 2 }).notNull(),
  soilMoisturePercent: decimal("soil_moisture_percent", { precision: 5, scale: 2 }).notNull(),
  lightLux: integer("light_lux").notNull(),
});

export const evBookings = pgTable("ev_bookings", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 50 }).notNull(),
  vehiclePlate: varchar("vehicle_plate", { length: 30 }).notNull(),
  chargerId: varchar("charger_id", { length: 50 }).notNull(),
  startAt: timestamp("start_at").notNull(),
  endAt: timestamp("end_at").notNull(),
  status: evBookingStatusEnum("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 1. Products Table
export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  unit: varchar("unit", { length: 50 }).notNull(), // e.g., Kg, Pack
  stockQuantity: integer("stock_quantity").notNull().default(0),
  imageUrl: text("image_url"),
  harvestDate: timestamp("harvest_date"),
  isPreorder: boolean("is_preorder").default(false).notNull(),
  researchTag: varchar("research_tag", { length: 100 }), // e.g., P-01 (รอบที่ 3)
  plotId: uuid("plot_id").references(() => plots.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 2. Orders Table
export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 50 }).notNull(),
  deliveryType: varchar("delivery_type", { length: 50 }).notNull(), // pickup, delivery
  address: text("address"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  slipUrl: text("slip_url"),
  status: orderStatusEnum("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 3. Order Items Table
export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id),
  quantity: integer("quantity").notNull(),
  pricePerUnit: decimal("price_per_unit", { precision: 10, scale: 2 }).notNull(),
});

// Relations
export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const plotsRelations = relations(plots, ({ many }) => ({ sensorLogs: many(sensorLogs) }));
export const sensorLogsRelations = relations(sensorLogs, ({ one }) => ({
  plot: one(plots, { fields: [sensorLogs.plotId], references: [plots.id] }),
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
