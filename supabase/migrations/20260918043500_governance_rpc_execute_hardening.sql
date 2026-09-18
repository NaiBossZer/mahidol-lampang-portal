-- Harden SECURITY DEFINER RPC execution privileges.
-- PUBLIC must not be able to execute admin/security helper functions.

REVOKE EXECUTE ON FUNCTION public.app_role() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.app_role() TO authenticated;

REVOKE EXECUTE ON FUNCTION public.is_manager() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_manager() TO authenticated;

REVOKE EXECUTE ON FUNCTION public.is_central_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_central_admin() TO authenticated;

REVOKE EXECUTE ON FUNCTION public.staff_profile_for_user() FROM PUBLIC;

REVOKE EXECUTE ON FUNCTION public.set_central_admin_role(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.set_central_admin_role(uuid, text) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.list_central_admin_users() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.list_central_admin_users() TO authenticated;

REVOKE EXECUTE ON FUNCTION public.write_audit_log() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.write_audit_log() TO authenticated;
