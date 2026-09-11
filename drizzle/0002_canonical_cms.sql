CREATE TYPE "public"."cms_link_type" AS ENUM('INTERNAL', 'EXTERNAL', 'CONTACT');
CREATE TYPE "public"."cms_content_status" AS ENUM('draft', 'published', 'archived');

CREATE TABLE IF NOT EXISTS "public"."services" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "title" varchar(255) NOT NULL,
  "slug" varchar(255) NOT NULL UNIQUE,
  "summary" text,
  "description" text,
  "icon" varchar(100),
  "featured_image" text,
  "link_type" "public"."cms_link_type" DEFAULT 'INTERNAL' NOT NULL,
  "link_url" text,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "status" "public"."cms_content_status" DEFAULT 'draft' NOT NULL,
  "published_at" timestamptz,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);
CREATE TABLE IF NOT EXISTS "public"."home_sections" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "section_key" varchar(80) NOT NULL UNIQUE,
  "title" varchar(255), "subtitle" varchar(500), "description" text, "image" text,
  "sort_order" integer DEFAULT 0 NOT NULL, "is_enabled" boolean DEFAULT true NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL, "updated_at" timestamptz DEFAULT now() NOT NULL
);
CREATE TABLE IF NOT EXISTS "public"."navigation_items" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "label" varchar(255) NOT NULL, "slug" varchar(255) NOT NULL UNIQUE,
  "parent_id" uuid, "target_type" varchar(30) DEFAULT 'INTERNAL' NOT NULL, "target_url" text,
  "sort_order" integer DEFAULT 0 NOT NULL, "is_enabled" boolean DEFAULT true NOT NULL,
  "open_new_tab" boolean DEFAULT false NOT NULL, "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);
CREATE TABLE IF NOT EXISTS "public"."footer_settings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "organization_name" varchar(255), "address" text, "phone" varchar(100), "email" varchar(255),
  "facebook_url" text, "line_url" text, "copyright_text" varchar(500), "privacy_url" text,
  "terms_url" text, "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "services_status_sort_idx" ON "public"."services" ("status", "sort_order");
CREATE INDEX IF NOT EXISTS "home_sections_sort_idx" ON "public"."home_sections" ("sort_order");
CREATE INDEX IF NOT EXISTS "navigation_items_parent_sort_idx" ON "public"."navigation_items" ("parent_id", "sort_order");

INSERT INTO "public"."home_sections" ("section_key", "title", "sort_order", "is_enabled") VALUES
  ('HOME_HERO', 'Mahidol Lampang', 10, true),
  ('FEATURED_ACTIVITIES', 'กิจกรรมเด่น', 20, true),
  ('LEARNING_CENTERS', 'ศูนย์การเรียนรู้', 30, true),
  ('SERVICES', 'บริการและทรัพยากร', 40, true),
  ('COMMUNITY_ACTION', 'ร่วมสร้างสรรค์และบูรณาการชุมชนลำปาง', 50, true),
  ('PARTNERS', 'เครือข่ายความร่วมมือของเรา', 60, true)
ON CONFLICT ("section_key") DO NOTHING;

INSERT INTO "public"."navigation_items" ("label", "slug", "target_type", "target_url", "sort_order", "is_enabled") VALUES
  ('หน้าหลัก', 'home', 'INTERNAL', '/', 10, true),
  ('กิจกรรม', 'activities', 'INTERNAL', '/activities', 20, true),
  ('แผนที่พื้นที่', 'site-map', 'INTERNAL', '/site-map', 30, true),
  ('ร้านค้า', 'store', 'INTERNAL', '/storefront', 40, true)
ON CONFLICT ("slug") DO NOTHING;

ALTER TABLE "public"."services" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."home_sections" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."navigation_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."footer_settings" ENABLE ROW LEVEL SECURITY;
