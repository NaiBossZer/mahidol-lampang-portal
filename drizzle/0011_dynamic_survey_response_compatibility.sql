-- Dynamic survey responses must live in survey_answers.
-- Legacy p2/p3/p4 columns are retained for historical analytics compatibility
-- but are nullable for surveys whose question definitions are managed dynamically.

alter table public.survey_responses
  alter column p2_location drop not null,
  alter column p2_schedule drop not null,
  alter column p2_readiness drop not null,
  alter column p2_reception drop not null,
  alter column p2_overall drop not null,
  alter column p3_interest drop not null,
  alter column p3_content drop not null,
  alter column p3_clarity drop not null,
  alter column p3_benefit drop not null,
  alter column p3_application drop not null,
  alter column p4_knowledge drop not null,
  alter column p4_inspiration drop not null,
  alter column p4_community_resource drop not null,
  alter column p4_future_return drop not null;

alter table public.survey_responses
  drop constraint if exists survey_responses_p2_location_check,
  drop constraint if exists survey_responses_p2_schedule_check,
  drop constraint if exists survey_responses_p2_readiness_check,
  drop constraint if exists survey_responses_p2_reception_check,
  drop constraint if exists survey_responses_p2_overall_check,
  drop constraint if exists survey_responses_p3_interest_check,
  drop constraint if exists survey_responses_p3_content_check,
  drop constraint if exists survey_responses_p3_clarity_check,
  drop constraint if exists survey_responses_p3_benefit_check,
  drop constraint if exists survey_responses_p3_application_check,
  drop constraint if exists survey_responses_p4_knowledge_check,
  drop constraint if exists survey_responses_p4_inspiration_check,
  drop constraint if exists survey_responses_p4_community_resource_check,
  drop constraint if exists survey_responses_p4_future_return_check;

alter table public.survey_responses
  add constraint survey_responses_p2_location_check check (p2_location is null or p2_location between 1 and 5),
  add constraint survey_responses_p2_schedule_check check (p2_schedule is null or p2_schedule between 1 and 5),
  add constraint survey_responses_p2_readiness_check check (p2_readiness is null or p2_readiness between 1 and 5),
  add constraint survey_responses_p2_reception_check check (p2_reception is null or p2_reception between 1 and 5),
  add constraint survey_responses_p2_overall_check check (p2_overall is null or p2_overall between 1 and 5),
  add constraint survey_responses_p3_interest_check check (p3_interest is null or p3_interest between 1 and 5),
  add constraint survey_responses_p3_content_check check (p3_content is null or p3_content between 1 and 5),
  add constraint survey_responses_p3_clarity_check check (p3_clarity is null or p3_clarity between 1 and 5),
  add constraint survey_responses_p3_benefit_check check (p3_benefit is null or p3_benefit between 1 and 5),
  add constraint survey_responses_p3_application_check check (p3_application is null or p3_application between 1 and 5),
  add constraint survey_responses_p4_knowledge_check check (p4_knowledge is null or p4_knowledge between 1 and 5),
  add constraint survey_responses_p4_inspiration_check check (p4_inspiration is null or p4_inspiration between 1 and 5),
  add constraint survey_responses_p4_community_resource_check check (p4_community_resource is null or p4_community_resource between 1 and 5),
  add constraint survey_responses_p4_future_return_check check (p4_future_return is null or p4_future_return between 1 and 5);
