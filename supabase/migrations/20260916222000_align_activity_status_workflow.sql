BEGIN;

-- Canonical activity lifecycle used by the Admin UI:
-- Draft / Published / Archived.
-- Normalize legacy lifecycle values before tightening the constraint.
ALTER TABLE public.activities
  DROP CONSTRAINT IF EXISTS activities_status_check;

UPDATE public.activities
SET status = CASE
  WHEN status = 'draft' THEN 'draft'
  WHEN status = 'archived' THEN 'archived'
  ELSE 'published'
END;

ALTER TABLE public.activities
  ADD CONSTRAINT activities_status_check
  CHECK (status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text]));

COMMIT;
