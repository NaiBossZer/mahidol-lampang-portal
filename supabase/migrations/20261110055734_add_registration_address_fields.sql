-- Add participant address fields to activity registrations.
-- Keep the columns nullable so existing registrations remain valid.

alter table public.activity_registrations
  add column if not exists subdistrict text,
  add column if not exists district text,
  add column if not exists province text,
  add column if not exists postal_code text;
