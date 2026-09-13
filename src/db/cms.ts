import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

export const cmsLinkTypeEnum = pgEnum("cms_link_type", ["INTERNAL", "EXTERNAL", "CONTACT"]);
export const cmsContentStatusEnum = pgEnum("cms_content_status", [
  "draft",
  "published",
  "archived",
]);

export const services = pgTable("services", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  summary: text("summary"),
  description: text("description"),
  icon: varchar("icon", { length: 100 }),
  featuredImage: text("featured_image"),
  linkType: cmsLinkTypeEnum("link_type").notNull().default("INTERNAL"),
  linkUrl: text("link_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  status: cmsContentStatusEnum("status").notNull().default("draft"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const homeSections = pgTable("home_sections", {
  id: uuid("id").defaultRandom().primaryKey(),
  sectionKey: varchar("section_key", { length: 80 }).notNull().unique(),
  title: varchar("title", { length: 255 }),
  subtitle: varchar("subtitle", { length: 500 }),
  description: text("description"),
  image: text("image"),
  sortOrder: integer("sort_order").notNull().default(0),
  isEnabled: boolean("is_enabled").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const navigationItems = pgTable("navigation_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  label: varchar("label", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  parentId: uuid("parent_id"),
  targetType: varchar("target_type", { length: 30 }).notNull().default("INTERNAL"),
  targetUrl: text("target_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  isEnabled: boolean("is_enabled").notNull().default(true),
  openNewTab: boolean("open_new_tab").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const footerSettings = pgTable("footer_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationName: varchar("organization_name", { length: 255 }),
  address: text("address"),
  phone: varchar("phone", { length: 100 }),
  email: varchar("email", { length: 255 }),
  facebookUrl: text("facebook_url"),
  lineUrl: text("line_url"),
  copyrightText: varchar("copyright_text", { length: 500 }),
  privacyUrl: text("privacy_url"),
  termsUrl: text("terms_url"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
