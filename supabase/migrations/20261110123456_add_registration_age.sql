-- Add participant age to activity registrations.
-- Keep nullable for existing registration rows.

alter table public.activity_registrations
  add column if not exists age integer;
