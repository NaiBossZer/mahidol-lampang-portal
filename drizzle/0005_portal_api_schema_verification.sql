-- Phase 7.4: reconcile public API contracts with the central Supabase schema.
-- This migration is additive and does not modify the existing activities schema.

CREATE TABLE IF NOT EXISTS public.learning_centers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(255) NOT NULL,
  slug varchar(255) NOT NULL UNIQUE,
  type text NOT NULL CHECK (type IN ('SOCIAL_CENTER','LEARNING_CENTER','RESEARCH_SITE','COMMUNITY','SCHOOL','PARTNER_SITE')),
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

CREATE TABLE IF NOT EXISTS public.social_projects (
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

CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(255) NOT NULL,
  description text,
  category varchar(100),
  price numeric(10,2) NOT NULL,
  unit varchar(50) NOT NULL,
  stock_quantity integer NOT NULL DEFAULT 0,
  image_url text,
  harvest_date timestamptz,
  is_preorder boolean NOT NULL DEFAULT false,
  research_tag varchar(100),
  plot_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.learning_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public can read active learning centers"
  ON public.learning_centers FOR SELECT TO anon, authenticated
  USING (status = 'active');

CREATE POLICY "public can read active social projects"
  ON public.social_projects FOR SELECT TO anon, authenticated
  USING (status = 'active');

CREATE POLICY "public can read products"
  ON public.products FOR SELECT TO anon, authenticated
  USING (true);
