create or replace function public.admin_delete_activity(p_activity_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  storage_paths text[];
  activity_exists boolean;
begin
  if coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') not in ('SUPER_ADMIN', 'OPERATIONS_ADMIN') then
    raise exception 'FORBIDDEN';
  end if;

  select exists(select 1 from public.activities where id = p_activity_id)
    into activity_exists;

  if not activity_exists then
    raise exception 'ACTIVITY_NOT_FOUND';
  end if;

  select coalesce(
    array_agg(storage_path) filter (where storage_path is not null and btrim(storage_path) <> ''),
    array[]::text[]
  )
    into storage_paths
  from public.activity_media
  where activity_id = p_activity_id;

  delete from public.activity_media
  where activity_id = p_activity_id;

  delete from public.activity_learning_centers
  where activity_id = p_activity_id;

  delete from public.activity_organizers
  where activity_id = p_activity_id;

  delete from public.survey_responses
  where activity_id = p_activity_id
     or occurrence_id in (
       select id from public.activity_occurrences where activity_id = p_activity_id
     );

  delete from public.survey_questions
  where survey_id in (
    select id
    from public.occurrence_surveys
    where occurrence_id in (
      select id from public.activity_occurrences where activity_id = p_activity_id
    )
  );

  delete from public.occurrence_surveys
  where occurrence_id in (
    select id from public.activity_occurrences where activity_id = p_activity_id
  );

  delete from public.activity_occurrences
  where activity_id = p_activity_id;

  delete from public.activities
  where id = p_activity_id;

  return jsonb_build_object(
    'deleted', true,
    'activity_id', p_activity_id,
    'storage_paths', to_jsonb(storage_paths)
  );
end;
$$;

revoke all on function public.admin_delete_activity(uuid) from public;
revoke all on function public.admin_delete_activity(uuid) from anon;
grant execute on function public.admin_delete_activity(uuid) to authenticated;
