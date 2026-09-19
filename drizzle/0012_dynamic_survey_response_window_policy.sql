-- Dynamic Survey response security follows the Survey assigned to an occurrence.
-- Legacy activity-level submission remains supported when survey_id is absent.

drop policy if exists "public can submit satisfaction responses" on public.survey_responses;
create policy "public can submit satisfaction responses"
  on public.survey_responses
  for insert
  to anon, authenticated
  with check (
    pdpa_consent = true
    and (
      (
        survey_id is null
        and can_submit_survey(activity_id)
      )
      or exists (
        select 1
        from public.occurrence_surveys s
        join public.activity_occurrences o on o.id = s.occurrence_id
        join public.activities a on a.id = o.activity_id
        where s.id = survey_responses.survey_id
          and o.id = survey_responses.occurrence_id
          and a.id = survey_responses.activity_id
          and a.status in ('published','completed')
          and s.enabled = true
          and o.status not in ('cancelled','archived')
          and (s.open_at is null or now() >= s.open_at)
          and (s.close_at is null or now() <= s.close_at)
      )
    )
  );

drop policy if exists "public can submit survey answers" on public.survey_answers;
create policy "public can submit survey answers"
  on public.survey_answers
  for insert
  to anon, authenticated
  with check (
    exists (
      select 1
      from public.survey_responses r
      join public.occurrence_surveys s on s.id = r.survey_id
      join public.activity_occurrences o on o.id = s.occurrence_id
      join public.activities a on a.id = o.activity_id
      join public.survey_questions q on q.id = survey_answers.question_id
      where r.id = survey_answers.response_id
        and q.survey_id = r.survey_id
        and q.active = true
        and s.enabled = true
        and o.status not in ('cancelled','archived')
        and a.status in ('published','completed')
        and (s.open_at is null or now() >= s.open_at)
        and (s.close_at is null or now() <= s.close_at)
    )
  );
