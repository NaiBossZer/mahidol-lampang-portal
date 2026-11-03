-- Keep the privileged lookup implementation outside the exposed API schema.
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon;

create or replace function private.get_public_survey_occurrence(p_survey_id uuid)
returns table (
  occurrence_id uuid,
  activity_id uuid,
  occurrence_status text
)
language sql
security definer
set search_path = ''
as $function$
  select
    ao.id,
    ao.activity_id,
    ao.status
  from public.occurrence_surveys as os
  join public.activity_occurrences as ao
    on ao.id = os.occurrence_id
  where os.id = p_survey_id
    and os.enabled is true
    and (os.open_at is null or os.open_at <= now())
    and (os.close_at is null or os.close_at >= now())
    and ao.status not in ('cancelled', 'archived')
  limit 1;
$function$;

revoke all on function private.get_public_survey_occurrence(uuid) from public;
grant execute on function private.get_public_survey_occurrence(uuid) to anon;

create or replace function public.get_public_survey_occurrence(p_survey_id uuid)
returns table (
  occurrence_id uuid,
  activity_id uuid,
  occurrence_status text
)
language sql
security invoker
set search_path = ''
as $function$
  select *
  from private.get_public_survey_occurrence(p_survey_id);
$function$;

revoke all on function public.get_public_survey_occurrence(uuid) from public;
grant execute on function public.get_public_survey_occurrence(uuid) to anon;
revoke execute on function public.get_public_survey_occurrence(uuid) from authenticated;
