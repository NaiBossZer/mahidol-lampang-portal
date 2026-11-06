-- Fix public dynamic-survey answer inserts without exposing response rows to anon.
-- The answer INSERT policy previously joined survey_responses directly. Since anon
-- intentionally has no SELECT policy on survey_responses, that EXISTS check could
-- not see the newly inserted response and rejected valid answers.

create or replace function private.can_submit_survey_answer(
  p_response_id uuid,
  p_question_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $function$
  select exists (
    select 1
    from public.survey_responses as r
    join public.occurrence_surveys as s
      on s.id = r.survey_id
    join public.activity_occurrences as o
      on o.id = s.occurrence_id
    join public.activities as a
      on a.id = o.activity_id
    join public.survey_questions as q
      on q.id = p_question_id
    where r.id = p_response_id
      and r.pdpa_consent is true
      and q.survey_id = r.survey_id
      and q.active is true
      and s.enabled is true
      and o.status not in ('cancelled', 'archived')
      and a.status in ('published', 'completed')
      and (s.open_at is null or now() >= s.open_at)
      and (s.close_at is null or now() <= s.close_at)
  );
$function$;

revoke all on function private.can_submit_survey_answer(uuid, uuid) from public;
grant usage on schema private to anon, authenticated;
grant execute on function private.can_submit_survey_answer(uuid, uuid) to anon, authenticated;

drop policy if exists "public can submit survey answers" on public.survey_answers;
create policy "public can submit survey answers"
  on public.survey_answers
  for insert
  to anon, authenticated
  with check (
    private.can_submit_survey_answer(response_id, question_id)
  );
