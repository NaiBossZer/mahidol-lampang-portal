-- Phase 6: normalized Activity / Occurrence / Learning Center / Organization / Survey Audit foundation.
-- Additive only. Existing activities and survey_responses remain backward compatible.

CREATE TABLE IF NOT EXISTS public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(255) NOT NULL,
  organization_type text NOT NULL DEFAULT 'external' CHECK (organization_type IN ('internal','external')),
  parent_organization_id uuid REFERENCES public.organizations(id) ON DELETE RESTRICT,
  status varchar(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT organizations_name_key UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS public.activity_occurrences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id uuid NOT NULL REFERENCES public.activities(id) ON DELETE RESTRICT,
  occurrence_no integer NOT NULL,
  start_at timestamptz NOT NULL,
  end_at timestamptz,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('draft','scheduled','ongoing','completed','cancelled','archived')),
  cancellation_reason text,
  participant_count integer NOT NULL DEFAULT 0 CHECK (participant_count >= 0),
  location_type text CHECK (location_type IN ('center','learning_center','external','online','hybrid')),
  location_detail text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT activity_occurrences_activity_no_key UNIQUE (activity_id, occurrence_no),
  CONSTRAINT activity_occurrences_cancel_reason_check CHECK (status <> 'cancelled' OR cancellation_reason IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS public.activity_learning_centers (
  activity_id uuid NOT NULL REFERENCES public.activities(id) ON DELETE RESTRICT,
  learning_center_id uuid NOT NULL REFERENCES public.learning_centers(id) ON DELETE RESTRICT,
  PRIMARY KEY (activity_id, learning_center_id)
);

CREATE TABLE IF NOT EXISTS public.activity_organizers (
  activity_id uuid NOT NULL REFERENCES public.activities(id) ON DELETE RESTRICT,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
  organizer_role text NOT NULL CHECK (organizer_role IN ('primary','co')),
  PRIMARY KEY (activity_id, organization_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS activity_organizers_one_primary_idx
  ON public.activity_organizers(activity_id)
  WHERE organizer_role = 'primary';

CREATE TABLE IF NOT EXISTS public.occurrence_surveys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  occurrence_id uuid NOT NULL UNIQUE REFERENCES public.activity_occurrences(id) ON DELETE RESTRICT,
  enabled boolean NOT NULL DEFAULT true,
  anonymous boolean NOT NULL DEFAULT false,
  open_at timestamptz,
  close_at timestamptz,
  welcome_text text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT occurrence_surveys_window_check CHECK (close_at IS NULL OR open_at IS NULL OR close_at >= open_at)
);

ALTER TABLE public.survey_responses
  ADD COLUMN IF NOT EXISTS occurrence_id uuid,
  ADD COLUMN IF NOT EXISTS survey_id uuid,
  ADD COLUMN IF NOT EXISTS participant_organization_id uuid;

ALTER TABLE public.survey_responses
  ADD CONSTRAINT survey_responses_occurrence_id_fkey
  FOREIGN KEY (occurrence_id) REFERENCES public.activity_occurrences(id) ON DELETE RESTRICT;

ALTER TABLE public.survey_responses
  ADD CONSTRAINT survey_responses_survey_id_fkey
  FOREIGN KEY (survey_id) REFERENCES public.occurrence_surveys(id) ON DELETE RESTRICT;

ALTER TABLE public.survey_responses
  ADD CONSTRAINT survey_responses_participant_org_fkey
  FOREIGN KEY (participant_organization_id) REFERENCES public.organizations(id) ON DELETE RESTRICT;

-- Preserve the existing activity-level data model by creating one occurrence for each
-- existing activity. New writes should use occurrences explicitly.
INSERT INTO public.activity_occurrences (activity_id, occurrence_no, start_at, status, participant_count, location_detail)
SELECT a.id, 1, a.activity_date::timestamptz,
       CASE WHEN a.status = 'published' THEN 'completed' ELSE 'draft' END,
       CASE WHEN a.participants ~ '^[0-9]+$' THEN a.participants::integer ELSE 0 END,
       NULL
FROM public.activities a
WHERE NOT EXISTS (
  SELECT 1 FROM public.activity_occurrences o WHERE o.activity_id = a.id
);

-- Link legacy responses to the generated first occurrence and its survey where possible.
INSERT INTO public.occurrence_surveys (occurrence_id, enabled, anonymous, open_at, close_at, welcome_text)
SELECT o.id, a.survey_enabled, false, a.survey_open_at, a.survey_close_at, a.survey_welcome_text
FROM public.activity_occurrences o
JOIN public.activities a ON a.id = o.activity_id
WHERE o.occurrence_no = 1
  AND NOT EXISTS (SELECT 1 FROM public.occurrence_surveys s WHERE s.occurrence_id = o.id);

UPDATE public.survey_responses r
SET occurrence_id = o.id,
    survey_id = s.id
FROM public.activity_occurrences o
JOIN public.occurrence_surveys s ON s.occurrence_id = o.id
WHERE r.occurrence_id IS NULL
  AND r.activity_id = o.activity_id
  AND o.occurrence_no = 1;

CREATE INDEX IF NOT EXISTS activity_occurrences_activity_date_idx
  ON public.activity_occurrences(activity_id, start_at DESC);
CREATE INDEX IF NOT EXISTS activity_occurrences_status_date_idx
  ON public.activity_occurrences(status, start_at DESC);
CREATE INDEX IF NOT EXISTS survey_responses_occurrence_idx
  ON public.survey_responses(occurrence_id, submitted_at DESC);
CREATE INDEX IF NOT EXISTS survey_responses_participant_org_idx
  ON public.survey_responses(participant_organization_id);
CREATE INDEX IF NOT EXISTS activity_learning_centers_center_idx
  ON public.activity_learning_centers(learning_center_id, activity_id);

-- Central admin read boundary for analytics data. Public users must not read audit/response data.
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_occurrences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_learning_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_organizers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.occurrence_surveys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "central admins read organizations"
  ON public.organizations FOR SELECT TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('SUPER_ADMIN','CONTENT_ADMIN','OPERATIONS_ADMIN','FACILITY_ADMIN'));

CREATE POLICY "central admins read activity occurrences"
  ON public.activity_occurrences FOR SELECT TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('SUPER_ADMIN','CONTENT_ADMIN','OPERATIONS_ADMIN','FACILITY_ADMIN'));

CREATE POLICY "central admins read activity learning centers"
  ON public.activity_learning_centers FOR SELECT TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('SUPER_ADMIN','CONTENT_ADMIN','OPERATIONS_ADMIN','FACILITY_ADMIN'));

CREATE POLICY "central admins read activity organizers"
  ON public.activity_organizers FOR SELECT TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('SUPER_ADMIN','CONTENT_ADMIN','OPERATIONS_ADMIN','FACILITY_ADMIN'));

CREATE POLICY "central admins read occurrence surveys"
  ON public.occurrence_surveys FOR SELECT TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('SUPER_ADMIN','CONTENT_ADMIN','OPERATIONS_ADMIN','FACILITY_ADMIN'));

-- Response data is admin-only. Existing public survey submission policies remain in place;
-- this policy only adds the normalized occurrence-linked access path for signed-in admins.
CREATE POLICY "central admins read survey responses"
  ON public.survey_responses FOR SELECT TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('SUPER_ADMIN','CONTENT_ADMIN','OPERATIONS_ADMIN','FACILITY_ADMIN'));

-- System-wide change history for high-value domain records.
CREATE OR REPLACE FUNCTION public.dashboard_audit_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.audit_logs (actor_id, action, table_name, record_id, old_data, new_data)
  VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id::text, OLD.id::text),
    CASE WHEN TG_OP IN ('UPDATE','DELETE') THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT','UPDATE') THEN to_jsonb(NEW) ELSE NULL END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;

REVOKE ALL ON FUNCTION public.dashboard_audit_trigger() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS organizations_dashboard_audit ON public.organizations;
CREATE TRIGGER organizations_dashboard_audit AFTER INSERT OR UPDATE OR DELETE ON public.organizations
FOR EACH ROW EXECUTE FUNCTION public.dashboard_audit_trigger();

DROP TRIGGER IF EXISTS activity_occurrences_dashboard_audit ON public.activity_occurrences;
CREATE TRIGGER activity_occurrences_dashboard_audit AFTER INSERT OR UPDATE OR DELETE ON public.activity_occurrences
FOR EACH ROW EXECUTE FUNCTION public.dashboard_audit_trigger();

DROP TRIGGER IF EXISTS activity_learning_centers_dashboard_audit ON public.activity_learning_centers;
CREATE TRIGGER activity_learning_centers_dashboard_audit AFTER INSERT OR UPDATE OR DELETE ON public.activity_learning_centers
FOR EACH ROW EXECUTE FUNCTION public.dashboard_audit_trigger();

DROP TRIGGER IF EXISTS activity_organizers_dashboard_audit ON public.activity_organizers;
CREATE TRIGGER activity_organizers_dashboard_audit AFTER INSERT OR UPDATE OR DELETE ON public.activity_organizers
FOR EACH ROW EXECUTE FUNCTION public.dashboard_audit_trigger();

DROP TRIGGER IF EXISTS occurrence_surveys_dashboard_audit ON public.occurrence_surveys;
CREATE TRIGGER occurrence_surveys_dashboard_audit AFTER INSERT OR UPDATE OR DELETE ON public.occurrence_surveys
FOR EACH ROW EXECUTE FUNCTION public.dashboard_audit_trigger();
