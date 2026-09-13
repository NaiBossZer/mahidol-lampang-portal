create policy "central admins manage activity occurrences" on public.activity_occurrences for all to authenticated using (public.is_central_admin()) with check (public.is_central_admin());
create policy "central admins manage occurrence surveys" on public.occurrence_surveys for all to authenticated using (public.is_central_admin()) with check (public.is_central_admin());
create policy "central admins manage organizations" on public.organizations for all to authenticated using (public.is_central_admin()) with check (public.is_central_admin());
create policy "central admins manage learning centers" on public.learning_centers for all to authenticated using (public.is_central_admin()) with check (public.is_central_admin());
