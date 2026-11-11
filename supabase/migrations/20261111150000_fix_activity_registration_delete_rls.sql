-- Ensure activity administrators can permanently delete registrations.
-- Keep the database policy aligned with the API's activities.update permission.
drop policy if exists activity_registrations_central_admin_delete on public.activity_registrations;

create policy activity_registrations_central_admin_delete
on public.activity_registrations
for delete
to authenticated
using (
  (auth.jwt() -> 'app_metadata' ->> 'role') = any (
    array['SUPER_ADMIN', 'CONTENT_ADMIN', 'OPERATIONS_ADMIN']
  )
);

grant delete on public.activity_registrations to authenticated;
