alter table public.survey_responses alter column pdpa_consent drop not null;
alter table public.survey_responses drop constraint if exists survey_responses_pdpa_consent_check;
alter table public.survey_responses add constraint survey_responses_pdpa_consent_check check (pdpa_consent is null or pdpa_consent = true);
