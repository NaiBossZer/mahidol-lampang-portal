-- Store occupation and prior shellac-rearing experience for the shellac workshop.
-- Nullable columns preserve compatibility with existing registrations and other activities.

ALTER TABLE public.activity_registrations
  ADD COLUMN IF NOT EXISTS occupation text,
  ADD COLUMN IF NOT EXISTS shellac_experience text;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'activity_registrations_shellac_experience_check'
      AND conrelid = 'public.activity_registrations'::regclass
  ) THEN
    ALTER TABLE public.activity_registrations
      ADD CONSTRAINT activity_registrations_shellac_experience_check
      CHECK (
        shellac_experience IS NULL
        OR shellac_experience IN ('no_experience', 'studied', 'trial', 'current', 'former')
      );
  END IF;
END
$$;
