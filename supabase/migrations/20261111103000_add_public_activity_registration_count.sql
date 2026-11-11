-- Return only the number of active registrations for a public activity detail page.
-- No registration names or other personal data are exposed by this function.
create or replace function public.get_public_activity_registration_count(target_activity_id uuid)
returns bigint
language sql
stable
security definer
set search_path = ''
as $$
  select count(*)::bigint
  from public.activity_registrations
  where activity_id = target_activity_id
    and status <> 'cancelled';
$$;

revoke all on function public.get_public_activity_registration_count(uuid) from public;
grant execute on function public.get_public_activity_registration_count(uuid) to anon, authenticated;
