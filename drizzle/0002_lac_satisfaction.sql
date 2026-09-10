-- Lac Learning Game satisfaction fields on the canonical Social Engagement activity table.
-- The shared Supabase database already owns public.activities and public.survey_responses.

ALTER TABLE public.activities
  ADD COLUMN IF NOT EXISTS survey_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS survey_open_at timestamptz,
  ADD COLUMN IF NOT EXISTS survey_close_at timestamptz,
  ADD COLUMN IF NOT EXISTS survey_welcome_text text;

CREATE INDEX IF NOT EXISTS activities_survey_enabled_idx
  ON public.activities (survey_enabled);

CREATE TABLE IF NOT EXISTS public.survey_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id uuid NOT NULL REFERENCES public.activities(id) ON DELETE RESTRICT,
  contract_version text NOT NULL DEFAULT '7.3',
  submitted_at timestamptz NOT NULL DEFAULT now(),
  age_group text NOT NULL,
  affiliation text NOT NULL,
  ever_joined text NOT NULL,
  channels text NOT NULL,
  p2_location smallint NOT NULL CHECK (p2_location BETWEEN 1 AND 5),
  p2_schedule smallint NOT NULL CHECK (p2_schedule BETWEEN 1 AND 5),
  p2_readiness smallint NOT NULL CHECK (p2_readiness BETWEEN 1 AND 5),
  p2_reception smallint NOT NULL CHECK (p2_reception BETWEEN 1 AND 5),
  p2_overall smallint NOT NULL CHECK (p2_overall BETWEEN 1 AND 5),
  p3_interest smallint NOT NULL CHECK (p3_interest BETWEEN 1 AND 5),
  p3_content smallint NOT NULL CHECK (p3_content BETWEEN 1 AND 5),
  p3_clarity smallint NOT NULL CHECK (p3_clarity BETWEEN 1 AND 5),
  p3_benefit smallint NOT NULL CHECK (p3_benefit BETWEEN 1 AND 5),
  p3_application smallint NOT NULL CHECK (p3_application BETWEEN 1 AND 5),
  p4_knowledge smallint NOT NULL CHECK (p4_knowledge BETWEEN 1 AND 5),
  p4_inspiration smallint NOT NULL CHECK (p4_inspiration BETWEEN 1 AND 5),
  p4_community_resource smallint NOT NULL CHECK (p4_community_resource BETWEEN 1 AND 5),
  p4_future_return smallint NOT NULL CHECK (p4_future_return BETWEEN 1 AND 5),
  feedback text NOT NULL DEFAULT '',
  pdpa_consent boolean NOT NULL DEFAULT false CHECK (pdpa_consent = true),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS survey_responses_activity_id_idx ON public.survey_responses(activity_id);
CREATE INDEX IF NOT EXISTS survey_responses_submitted_at_idx ON public.survey_responses(submitted_at DESC);
