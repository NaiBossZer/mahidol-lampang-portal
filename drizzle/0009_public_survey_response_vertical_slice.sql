create policy "public can read enabled occurrence surveys" on public.occurrence_surveys for select to anon, authenticated using (enabled = true);
create policy "public can read active survey questions" on public.survey_questions for select to anon, authenticated using (active = true and exists (select 1 from public.occurrence_surveys s where s.id = survey_questions.survey_id and s.enabled = true));
create policy "public can submit survey answers" on public.survey_answers for insert to anon, authenticated with check (
  exists (
    select 1 from public.survey_responses r
    join public.occurrence_surveys s on s.id = r.survey_id
    join public.survey_questions q on q.id = survey_answers.question_id
    where r.id = survey_answers.response_id and q.survey_id = r.survey_id and q.active = true and s.enabled = true
  )
);
