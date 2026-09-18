-- Trigger-only SECURITY DEFINER functions must not be callable by clients.
REVOKE EXECUTE ON FUNCTION public.staff_profile_for_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.staff_profile_for_user() FROM authenticated;

REVOKE EXECUTE ON FUNCTION public.write_audit_log() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.write_audit_log() FROM authenticated;
