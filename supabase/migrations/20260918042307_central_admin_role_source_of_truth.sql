-- Central Admin role source-of-truth hardening.
-- Canonical authorization role: auth.users.raw_app_meta_data.role.
-- staff_profiles.central_role is a mirrored profile field only.

BEGIN;

DROP TRIGGER IF EXISTS trg_sync_central_admin_role_to_auth ON public.staff_profiles;
DROP FUNCTION IF EXISTS public.sync_central_admin_role_to_auth();

CREATE OR REPLACE FUNCTION public.staff_profile_for_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.staff_profiles (user_id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'staff'
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.app_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public', 'auth'
AS $function$
  SELECT COALESCE(
    CASE
      WHEN (auth.jwt() -> 'app_metadata' ->> 'role') IN (
        'SUPER_ADMIN',
        'CONTENT_ADMIN',
        'OPERATIONS_ADMIN',
        'FACILITY_ADMIN'
      )
      THEN auth.jwt() -> 'app_metadata' ->> 'role'
      ELSE NULL
    END,
    (
      SELECT sp.role
      FROM public.staff_profiles sp
      WHERE sp.user_id = auth.uid()
        AND sp.active
    ),
    'staff'
  );
$function$;

CREATE OR REPLACE FUNCTION public.set_central_admin_role(
  target_user_id uuid,
  new_role text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'auth'
AS $function$
DECLARE
  actor_role text := auth.jwt() -> 'app_metadata' ->> 'role';
  target_meta jsonb;
  old_auth_role text;
  old_profile_role text;
  target_email text;
BEGIN
  IF actor_role <> 'SUPER_ADMIN' THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  IF new_role NOT IN (
    'SUPER_ADMIN',
    'CONTENT_ADMIN',
    'OPERATIONS_ADMIN',
    'FACILITY_ADMIN'
  ) THEN
    RAISE EXCEPTION 'invalid role';
  END IF;

  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'user_id required';
  END IF;

  IF target_user_id = auth.uid() AND new_role <> 'SUPER_ADMIN' THEN
    RAISE EXCEPTION 'cannot downgrade own SUPER_ADMIN account';
  END IF;

  SELECT raw_app_meta_data, email
    INTO target_meta, target_email
  FROM auth.users
  WHERE id = target_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'user not found';
  END IF;

  old_auth_role := target_meta ->> 'role';

  SELECT central_role
    INTO old_profile_role
  FROM public.staff_profiles
  WHERE user_id = target_user_id
  FOR UPDATE;

  UPDATE auth.users
  SET raw_app_meta_data = jsonb_set(
    COALESCE(raw_app_meta_data, '{}'::jsonb),
    '{role}',
    to_jsonb(new_role),
    true
  ),
  updated_at = now()
  WHERE id = target_user_id;

  UPDATE public.staff_profiles
  SET central_role = new_role,
      updated_at = now()
  WHERE user_id = target_user_id;

  IF NOT FOUND THEN
    INSERT INTO public.staff_profiles (
      user_id,
      full_name,
      role,
      active,
      central_role
    )
    VALUES (
      target_user_id,
      COALESCE(target_email, target_user_id::text),
      'staff',
      true,
      new_role
    );
  END IF;

  INSERT INTO public.audit_logs (
    actor_id,
    action,
    table_name,
    record_id,
    old_data,
    new_data
  )
  VALUES (
    auth.uid(),
    'RBAC_ROLE_CHANGED',
    'auth.users',
    target_user_id::text,
    jsonb_build_object(
      'auth_role', old_auth_role,
      'profile_central_role', old_profile_role
    ),
    jsonb_build_object(
      'auth_role', new_role,
      'profile_central_role', new_role
    )
  );

  RETURN jsonb_build_object(
    'user_id', target_user_id,
    'role', new_role,
    'source_of_truth', 'auth.users.raw_app_meta_data.role'
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.list_central_admin_users()
RETURNS TABLE (
  user_id uuid,
  email text,
  full_name text,
  "position" text,
  department text,
  role text,
  active boolean,
  central_role text,
  profile_central_role text,
  personnel_id text,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public', 'auth'
AS $function$
DECLARE
  actor_role text := auth.jwt() -> 'app_metadata' ->> 'role';
BEGIN
  IF actor_role NOT IN (
    'SUPER_ADMIN',
    'CONTENT_ADMIN',
    'OPERATIONS_ADMIN',
    'FACILITY_ADMIN'
  ) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  RETURN QUERY
  SELECT
    u.id AS user_id,
    u.email::text,
    COALESCE(
      NULLIF(sp.full_name, ''),
      NULLIF(u.raw_user_meta_data ->> 'full_name', ''),
      u.email
    )::text AS full_name,
    sp.position,
    sp.department,
    sp.role,
    COALESCE(sp.active, true) AS active,
    (u.raw_app_meta_data ->> 'role')::text AS central_role,
    sp.central_role AS profile_central_role,
    sp.personnel_id,
    u.created_at,
    u.updated_at
  FROM auth.users u
  LEFT JOIN public.staff_profiles sp
    ON sp.user_id = u.id
  WHERE u.deleted_at IS NULL
  ORDER BY full_name ASC;
END;
$function$;

UPDATE public.staff_profiles sp
SET central_role = CASE
  WHEN (u.raw_app_meta_data ->> 'role') IN (
    'SUPER_ADMIN',
    'CONTENT_ADMIN',
    'OPERATIONS_ADMIN',
    'FACILITY_ADMIN'
  )
  THEN u.raw_app_meta_data ->> 'role'
  ELSE NULL
END,
updated_at = now()
FROM auth.users u
WHERE u.id = sp.user_id
  AND sp.central_role IS DISTINCT FROM CASE
    WHEN (u.raw_app_meta_data ->> 'role') IN (
      'SUPER_ADMIN',
      'CONTENT_ADMIN',
      'OPERATIONS_ADMIN',
      'FACILITY_ADMIN'
    )
    THEN u.raw_app_meta_data ->> 'role'
    ELSE NULL
  END;

REVOKE EXECUTE ON FUNCTION public.list_central_admin_users() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.list_central_admin_users() TO authenticated;

REVOKE EXECUTE ON FUNCTION public.set_central_admin_role(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.set_central_admin_role(uuid, text) TO authenticated;

COMMIT;
