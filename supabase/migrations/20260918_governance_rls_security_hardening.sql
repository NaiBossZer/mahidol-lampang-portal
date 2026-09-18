-- STEP 9: Governance RLS / Security Hardening
-- Tighten write paths for AI governance tables while preserving service-role
-- background jobs and existing authenticated admin read access.

-- ai_executions writes must not be available to arbitrary authenticated users.
DROP POLICY IF EXISTS "system can create executions" ON public.ai_executions;
CREATE POLICY "central admins create executions"
  ON public.ai_executions
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_central_admin());

DROP POLICY IF EXISTS "system can update executions" ON public.ai_executions;
CREATE POLICY "central admins update executions"
  ON public.ai_executions
  FOR UPDATE
  TO authenticated
  USING (public.is_central_admin())
  WITH CHECK (public.is_central_admin());

-- Notifications are an admin-generated system resource; recipients retain
-- their existing read/update access. Service-role workers bypass RLS.
DROP POLICY IF EXISTS "system can create notifications" ON public.admin_notifications;
CREATE POLICY "central admins create notifications"
  ON public.admin_notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_central_admin());

-- These helper RPCs are not intended for anonymous callers. Keep EXECUTE for
-- authenticated users where existing RLS/application flows depend on them.
REVOKE EXECUTE ON FUNCTION public.app_role() FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_manager() FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_central_admin() FROM anon;
REVOKE EXECUTE ON FUNCTION public.staff_profile_for_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.set_central_admin_role(uuid, text) FROM anon;
DO $
BEGIN
  IF to_regprocedure('public.sync_central_admin_role_to_auth()') IS NOT NULL THEN
    REVOKE EXECUTE ON FUNCTION public.sync_central_admin_role_to_auth() FROM anon;
  END IF;
END;
$;
REVOKE EXECUTE ON FUNCTION public.write_audit_log() FROM anon;

-- Security regression notes:
-- 1. Direct authenticated writes to ai_executions require a Central Admin role.
-- 2. Direct authenticated notification inserts require a Central Admin role.
-- 3. Existing admin read policies remain unchanged.
-- 4. Service-role/background workers remain able to perform system writes because
--    Supabase service_role bypasses RLS.

-- The user-management RPC is intentionally callable only through authenticated server flows.
REVOKE EXECUTE ON FUNCTION public.list_central_admin_users() FROM anon;
