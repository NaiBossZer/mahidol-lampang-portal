-- Store administrator-only draft survey tests separately from real public responses.
create table if not exists public.survey_test_responses (
  id uuid primary key default gen_random_uuid(),
  survey_id uuid not null references public.occurrence_surveys(id) on delete cascade,
  occurrence_id uuid not null references public.activity_occurrences(id) on delete cascade,
  activity_id uuid not null references public.activities(id) on delete cascade,
  submitted_by uuid not null references auth.users(id) on delete restrict,
  answers jsonb not null default '[]'::jsonb check (jsonb_typeof(answers) = 'array'),
  created_at timestamptz not null default now()
);

create index if not exists survey_test_responses_survey_created_idx
  on public.survey_test_responses (survey_id, created_at desc);

alter table public.survey_test_responses enable row level security;

revoke all on public.survey_test_responses from anon;
grant select, insert, delete on public.survey_test_responses to authenticated;

create policy "admins can read survey test responses"
  on public.survey_test_responses
  for select
  to authenticated
  using (
    (auth.jwt() -> 'app_metadata' ->> 'role') in
      ('SUPER_ADMIN', 'CONTENT_ADMIN', 'OPERATIONS_ADMIN', 'FACILITY_ADMIN')
  );

create policy "admins can create own survey test responses"
  on public.survey_test_responses
  for insert
  to authenticated
  with check (
    submitted_by = (select auth.uid())
    and (auth.jwt() -> 'app_metadata' ->> 'role') in
      ('SUPER_ADMIN', 'CONTENT_ADMIN', 'OPERATIONS_ADMIN', 'FACILITY_ADMIN')
  );

create policy "admins can delete survey test responses"
  on public.survey_test_responses
  for delete
  to authenticated
  using (
    (auth.jwt() -> 'app_metadata' ->> 'role') in
      ('SUPER_ADMIN', 'CONTENT_ADMIN', 'OPERATIONS_ADMIN', 'FACILITY_ADMIN')
  );

comment on table public.survey_test_responses is
  'Administrator-only survey test submissions. Never included in public survey response reporting.';
