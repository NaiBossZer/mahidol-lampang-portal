create table if not exists public.survey_questions (
  id uuid primary key default gen_random_uuid(),
  survey_id uuid not null references public.occurrence_surveys(id) on delete restrict,
  section_key text not null default 'general',
  question_text text not null,
  question_type text not null default 'rating' check (question_type in ('rating','text','single_choice','multi_choice')),
  required boolean not null default true,
  order_index integer not null default 0,
  options jsonb not null default '[]'::jsonb,
  scale_min smallint not null default 1 check (scale_min >= 1),
  scale_max smallint not null default 5 check (scale_max > scale_min),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists survey_questions_survey_order_idx on public.survey_questions(survey_id, order_index);
create table if not exists public.survey_answers (
  id uuid primary key default gen_random_uuid(),
  response_id uuid not null references public.survey_responses(id) on delete cascade,
  question_id uuid not null references public.survey_questions(id) on delete restrict,
  answer_number numeric,
  answer_text text,
  answer_options jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  unique(response_id, question_id),
  check (answer_number is not null or answer_text is not null or jsonb_array_length(answer_options) > 0)
);
create index if not exists survey_answers_response_idx on public.survey_answers(response_id);
create index if not exists survey_answers_question_idx on public.survey_answers(question_id);
alter table public.survey_questions enable row level security;
alter table public.survey_answers enable row level security;
create or replace function public.is_central_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') in ('SUPER_ADMIN','CONTENT_ADMIN','OPERATIONS_ADMIN','FACILITY_ADMIN'), false) $$;
revoke all on function public.is_central_admin() from public;
grant execute on function public.is_central_admin() to authenticated;
create policy survey_questions_admin_select on public.survey_questions for select to authenticated using (public.is_central_admin());
create policy survey_questions_admin_insert on public.survey_questions for insert to authenticated with check (public.is_central_admin());
create policy survey_questions_admin_update on public.survey_questions for update to authenticated using (public.is_central_admin()) with check (public.is_central_admin());
create policy survey_questions_admin_delete on public.survey_questions for delete to authenticated using (public.is_central_admin());
create policy survey_answers_admin_select on public.survey_answers for select to authenticated using (public.is_central_admin());
create policy survey_answers_admin_insert on public.survey_answers for insert to authenticated with check (public.is_central_admin());
create policy survey_answers_admin_update on public.survey_answers for update to authenticated using (public.is_central_admin()) with check (public.is_central_admin());
create or replace function public.touch_survey_question_updated_at()
returns trigger language plpgsql set search_path = public
as $$ begin new.updated_at = now(); return new; end $$;
drop trigger if exists survey_questions_touch_updated_at on public.survey_questions;
create trigger survey_questions_touch_updated_at before update on public.survey_questions for each row execute function public.touch_survey_question_updated_at();
create or replace function public.audit_survey_question_change()
returns trigger language plpgsql security definer set search_path = public
as $$ begin insert into public.audit_logs(actor_id, action, table_name, record_id, old_data, new_data) values (auth.uid(), tg_op, 'survey_questions', coalesce(new.id, old.id)::text, to_jsonb(old), to_jsonb(new)); return coalesce(new, old); end $$;
drop trigger if exists survey_questions_audit on public.survey_questions;
create trigger survey_questions_audit after insert or update or delete on public.survey_questions for each row execute function public.audit_survey_question_change();
revoke execute on function public.audit_survey_question_change() from anon, authenticated;
