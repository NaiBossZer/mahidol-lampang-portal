-- Add a first-class survey title so the Portal and RAC share one canonical field.
ALTER TABLE public.occurrence_surveys
  ADD COLUMN IF NOT EXISTS title text;

UPDATE public.occurrence_surveys s
SET title = COALESCE(
  NULLIF(BTRIM(s.welcome_text), ''),
  NULLIF(BTRIM(a.title), ''),
  'แบบประเมินกิจกรรม'
)
FROM public.activity_occurrences o
JOIN public.activities a ON a.id = o.activity_id
WHERE s.occurrence_id = o.id
  AND NULLIF(BTRIM(s.title), '') IS NULL;

CREATE INDEX IF NOT EXISTS occurrence_surveys_title_idx
  ON public.occurrence_surveys(title);

ALTER TABLE public.occurrence_surveys
  ALTER COLUMN title SET DEFAULT 'แบบประเมินกิจกรรม';
