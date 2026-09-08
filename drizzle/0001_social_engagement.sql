-- D3-B: Social Engagement database foundation (historical source migration)
-- Canonical shared-Supabase migration is now maintained at:
-- facility-safety-app/supabase/migrations/006_social_engagement_central.sql
-- Do not apply this file separately to the shared Supabase project.

CREATE TYPE activity_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE learning_center_type AS ENUM (
  'SOCIAL_CENTER', 'LEARNING_CENTER', 'RESEARCH_SITE',
  'COMMUNITY', 'SCHOOL', 'PARTNER_SITE'
);

CREATE TABLE social_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title varchar(255) NOT NULL,
  slug varchar(255) NOT NULL UNIQUE,
  description text,
  objective text,
  start_date timestamptz,
  end_date timestamptz,
  status varchar(30) NOT NULL DEFAULT 'active',
  cover_image text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE learning_centers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(255) NOT NULL,
  slug varchar(255) NOT NULL UNIQUE,
  type learning_center_type NOT NULL,
  description text,
  province varchar(100),
  district varchar(100),
  subdistrict varchar(100),
  address text,
  latitude numeric(10,7),
  longitude numeric(10,7),
  cover_image text,
  status varchar(30) NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES social_projects(id) ON DELETE SET NULL,
  center_id uuid REFERENCES learning_centers(id) ON DELETE SET NULL,
  title varchar(255) NOT NULL,
  slug varchar(255) NOT NULL UNIQUE,
  summary text,
  content text,
  activity_date timestamptz NOT NULL,
  location varchar(255),
  participant_count integer,
  objective text,
  process text,
  outcome text,
  impact text,
  featured_image text,
  status activity_status NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT activities_participant_count_check CHECK (participant_count IS NULL OR participant_count >= 0)
);

CREATE TABLE activity_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id uuid NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  thumbnail_url text,
  caption varchar(500),
  alt_text varchar(500),
  sort_order integer NOT NULL DEFAULT 0,
  is_cover boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(255) NOT NULL,
  type varchar(100),
  logo text,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE activity_partners (
  activity_id uuid NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  CONSTRAINT activity_partners_unique UNIQUE (activity_id, partner_id)
);

CREATE TABLE activity_outcomes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id uuid NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  metric_name varchar(255) NOT NULL,
  metric_value varchar(255),
  unit varchar(100),
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX activities_activity_date_idx ON activities (activity_date DESC);
CREATE INDEX activities_status_published_idx ON activities (status, published_at DESC);
CREATE INDEX activities_center_date_idx ON activities (center_id, activity_date DESC);
CREATE INDEX activity_photos_activity_sort_idx ON activity_photos (activity_id, sort_order);

-- Public activity queries should filter status = 'published'.
-- No seed content is inserted in D3-B; official activity records will be added in D3-E.
