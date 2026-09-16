-- Activity relations are writable only by central admin roles.
ALTER TABLE public.activity_learning_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_organizers ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'activity_learning_centers'
      AND policyname = 'activity_learning_centers_admin_select'
  ) THEN
    CREATE POLICY activity_learning_centers_admin_select
      ON public.activity_learning_centers FOR SELECT TO authenticated
      USING ((select auth.jwt() -> 'app_metadata' ->> 'role') IN ('SUPER_ADMIN','CONTENT_ADMIN','OPERATIONS_ADMIN','FACILITY_ADMIN'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'activity_learning_centers'
      AND policyname = 'activity_learning_centers_admin_insert'
  ) THEN
    CREATE POLICY activity_learning_centers_admin_insert
      ON public.activity_learning_centers FOR INSERT TO authenticated
      WITH CHECK ((select auth.jwt() -> 'app_metadata' ->> 'role') IN ('SUPER_ADMIN','CONTENT_ADMIN','OPERATIONS_ADMIN'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'activity_learning_centers'
      AND policyname = 'activity_learning_centers_admin_delete'
  ) THEN
    CREATE POLICY activity_learning_centers_admin_delete
      ON public.activity_learning_centers FOR DELETE TO authenticated
      USING ((select auth.jwt() -> 'app_metadata' ->> 'role') IN ('SUPER_ADMIN','CONTENT_ADMIN','OPERATIONS_ADMIN'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'activity_organizers'
      AND policyname = 'activity_organizers_admin_select'
  ) THEN
    CREATE POLICY activity_organizers_admin_select
      ON public.activity_organizers FOR SELECT TO authenticated
      USING ((select auth.jwt() -> 'app_metadata' ->> 'role') IN ('SUPER_ADMIN','CONTENT_ADMIN','OPERATIONS_ADMIN','FACILITY_ADMIN'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'activity_organizers'
      AND policyname = 'activity_organizers_admin_insert'
  ) THEN
    CREATE POLICY activity_organizers_admin_insert
      ON public.activity_organizers FOR INSERT TO authenticated
      WITH CHECK ((select auth.jwt() -> 'app_metadata' ->> 'role') IN ('SUPER_ADMIN','CONTENT_ADMIN','OPERATIONS_ADMIN'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'activity_organizers'
      AND policyname = 'activity_organizers_admin_delete'
  ) THEN
    CREATE POLICY activity_organizers_admin_delete
      ON public.activity_organizers FOR DELETE TO authenticated
      USING ((select auth.jwt() -> 'app_metadata' ->> 'role') IN ('SUPER_ADMIN','CONTENT_ADMIN','OPERATIONS_ADMIN'));
  END IF;
END $$;

-- Replace both relation sets atomically. PostgREST executes this function as one transaction.
CREATE OR REPLACE FUNCTION public.replace_activity_relations(
  p_activity_id uuid,
  p_learning_center_ids uuid[] DEFAULT '{}',
  p_organizations jsonb DEFAULT '[]'::jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  invalid_role text;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.activities WHERE id = p_activity_id) THEN
    RAISE EXCEPTION 'Activity not found';
  END IF;

  IF (select auth.jwt() -> 'app_metadata' ->> 'role') NOT IN ('SUPER_ADMIN','CONTENT_ADMIN','OPERATIONS_ADMIN') THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;

  SELECT value->>'organizerRole'
    INTO invalid_role
  FROM jsonb_array_elements(COALESCE(p_organizations, '[]'::jsonb)) AS item(value)
  WHERE COALESCE(value->>'organizerRole', 'co') NOT IN ('primary', 'co')
  LIMIT 1;

  IF invalid_role IS NOT NULL THEN
    RAISE EXCEPTION 'Invalid organizer role';
  END IF;

  DELETE FROM public.activity_learning_centers
  WHERE activity_id = p_activity_id;

  INSERT INTO public.activity_learning_centers (activity_id, learning_center_id)
  SELECT p_activity_id, value
  FROM unnest(COALESCE(p_learning_center_ids, '{}'::uuid[])) AS value;

  DELETE FROM public.activity_organizers
  WHERE activity_id = p_activity_id;

  INSERT INTO public.activity_organizers (activity_id, organization_id, organizer_role)
  SELECT
    p_activity_id,
    (item.value->>'organizationId')::uuid,
    COALESCE(item.value->>'organizerRole', 'co')
  FROM jsonb_array_elements(COALESCE(p_organizations, '[]'::jsonb)) AS item(value);

  RETURN jsonb_build_object(
    'learningCenterIds', COALESCE((SELECT jsonb_agg(learning_center_id) FROM public.activity_learning_centers WHERE activity_id = p_activity_id), '[]'::jsonb),
    'organizations', COALESCE((SELECT jsonb_agg(jsonb_build_object('organizationId', organization_id, 'organizerRole', organizer_role)) FROM public.activity_organizers WHERE activity_id = p_activity_id), '[]'::jsonb)
  );
END;
$$;

REVOKE ALL ON FUNCTION public.replace_activity_relations(uuid, uuid[], jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.replace_activity_relations(uuid, uuid[], jsonb) TO authenticated;
