-- Electricity Reporting domain
-- Source of truth:
--   private Supabase Storage -> electricity_source_documents
--   AI extraction -> bill/solar readings -> electricity_monthly_reports
-- AI never publishes a report; human review/approval remains required.

create extension if not exists pgcrypto;
create schema if not exists private;

create table if not exists public.electricity_sites (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  site_type text not null check (site_type in ('pea_meter','solar_meter','other')),
  account_number text,
  meter_number text,
  active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.electricity_source_documents (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references public.electricity_sites(id) on delete set null,
  source_type text not null check (source_type in ('pea_bill','solar_excel','report_pdf','report_pptx','other')),
  billing_period date,
  filename text not null,
  storage_bucket text not null default 'electricity-source-docs',
  storage_path text not null unique,
  mime_type text not null,
  file_size bigint check (file_size >= 0),
  sha256 text,
  status text not null default 'uploaded' check (status in ('uploaded','queued','processing','processed','needs_review','failed')),
  parser_version text,
  extracted_payload jsonb not null default '{}'::jsonb,
  validation_errors jsonb not null default '[]'::jsonb,
  error_message text,
  uploaded_by uuid references auth.users(id) on delete set null,
  uploaded_at timestamptz not null default now(),
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists electricity_source_documents_sha256_uq
  on public.electricity_source_documents(sha256) where sha256 is not null;

create table if not exists public.electricity_bill_readings (
  id uuid primary key default gen_random_uuid(),
  source_document_id uuid not null references public.electricity_source_documents(id) on delete restrict,
  site_id uuid not null references public.electricity_sites(id) on delete restrict,
  billing_period date not null,
  meter_number text,
  previous_reading numeric(14,3),
  current_reading numeric(14,3),
  billed_kwh numeric(14,3) not null check (billed_kwh >= 0),
  energy_charge_thb numeric(14,2),
  ft_charge_thb numeric(14,2),
  service_charge_thb numeric(14,2),
  subtotal_thb numeric(14,2),
  vat_thb numeric(14,2),
  total_amount_thb numeric(14,2) not null check (total_amount_thb >= 0),
  raw_fields jsonb not null default '{}'::jsonb,
  confidence numeric(5,4) check (confidence between 0 and 1),
  needs_review boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(source_document_id, billing_period, site_id)
);

create table if not exists public.electricity_solar_readings (
  id uuid primary key default gen_random_uuid(),
  source_document_id uuid not null references public.electricity_source_documents(id) on delete restrict,
  site_id uuid references public.electricity_sites(id) on delete set null,
  reading_period date not null,
  yield_kwh numeric(14,3) not null check (yield_kwh >= 0),
  operating_days numeric(10,2),
  raw_fields jsonb not null default '{}'::jsonb,
  confidence numeric(5,4) check (confidence between 0 and 1),
  needs_review boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(source_document_id, reading_period)
);

create table if not exists public.electricity_monthly_reports (
  id uuid primary key default gen_random_uuid(),
  report_month date not null unique,
  sobprab_kwh numeric(14,3) not null default 0 check (sobprab_kwh >= 0),
  sobprab_amount_thb numeric(14,2) not null default 0 check (sobprab_amount_thb >= 0),
  phalaad_kwh numeric(14,3) not null default 0 check (phalaad_kwh >= 0),
  phalaad_amount_thb numeric(14,2) not null default 0 check (phalaad_amount_thb >= 0),
  solar_yield_kwh numeric(14,3) not null default 0 check (solar_yield_kwh >= 0),
  total_pea_kwh numeric(14,3) generated always as (sobprab_kwh + phalaad_kwh) stored,
  total_amount_thb numeric(14,2) generated always as (sobprab_amount_thb + phalaad_amount_thb) stored,
  solar_ratio_pct numeric(8,2) generated always as (
    case when (sobprab_kwh + phalaad_kwh + solar_yield_kwh) > 0
      then round((solar_yield_kwh / (sobprab_kwh + phalaad_kwh + solar_yield_kwh)) * 100, 2)
      else 0
    end
  ) stored,
  co2_avoided_ton numeric(14,4),
  coal_saved_ton numeric(14,4),
  status text not null default 'draft' check (status in ('draft','processing','needs_review','approved','published','failed')),
  processed_at timestamptz,
  calculation_version text,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.electricity_monthly_report_sources (
  report_id uuid not null references public.electricity_monthly_reports(id) on delete cascade,
  source_document_id uuid not null references public.electricity_source_documents(id) on delete restrict,
  source_role text not null check (source_role in ('pea_sobprab','pea_phalaad','solar','calculation','report_pdf','report_pptx','other')),
  created_at timestamptz not null default now(),
  primary key (report_id, source_document_id, source_role)
);

create table if not exists public.electricity_processing_runs (
  id uuid primary key default gen_random_uuid(),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status text not null default 'queued' check (status in ('queued','running','completed','needs_review','failed')),
  agent_name text not null default 'electricity-report-agent',
  agent_version text,
  trigger_source text not null default 'admin',
  triggered_by uuid references auth.users(id) on delete set null,
  input_document_ids uuid[] not null default '{}'::uuid[],
  output_report_id uuid references public.electricity_monthly_reports(id) on delete set null,
  metrics jsonb not null default '{}'::jsonb,
  error_message text,
  created_at timestamptz not null default now()
);

create index if not exists electricity_source_documents_site_idx on public.electricity_source_documents(site_id);
create index if not exists electricity_source_documents_uploaded_by_idx on public.electricity_source_documents(uploaded_by);
create index if not exists electricity_source_documents_period_idx on public.electricity_source_documents(billing_period desc, site_id);
create index if not exists electricity_source_documents_status_idx on public.electricity_source_documents(status, uploaded_at desc);
create index if not exists electricity_bill_readings_source_document_idx on public.electricity_bill_readings(source_document_id);
create index if not exists electricity_bill_readings_site_idx on public.electricity_bill_readings(site_id);
create index if not exists electricity_bill_readings_period_idx on public.electricity_bill_readings(billing_period desc, site_id);
create index if not exists electricity_solar_readings_source_document_idx on public.electricity_solar_readings(source_document_id);
create index if not exists electricity_solar_readings_site_idx on public.electricity_solar_readings(site_id);
create index if not exists electricity_solar_readings_period_idx on public.electricity_solar_readings(reading_period desc);
create index if not exists electricity_monthly_reports_created_by_idx on public.electricity_monthly_reports(created_by);
create index if not exists electricity_monthly_reports_updated_by_idx on public.electricity_monthly_reports(updated_by);
create index if not exists electricity_monthly_report_sources_report_idx on public.electricity_monthly_report_sources(report_id);
create index if not exists electricity_monthly_report_sources_source_idx on public.electricity_monthly_report_sources(source_document_id);
create index if not exists electricity_processing_runs_triggered_by_idx on public.electricity_processing_runs(triggered_by);
create index if not exists electricity_processing_runs_output_report_idx on public.electricity_processing_runs(output_report_id);
create index if not exists electricity_processing_runs_status_idx on public.electricity_processing_runs(status, started_at desc);

insert into public.electricity_sites (code,name,site_type)
values
  ('SOBPRAB','กฟภ. สถานีสบปราบ','pea_meter'),
  ('PHALAAD','กฟภ. ผาลาด','pea_meter'),
  ('SOLAR','Solar Cell','solar_meter')
on conflict (code) do update
set name=excluded.name, site_type=excluded.site_type, updated_at=now();

create or replace function private.write_electricity_audit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.audit_logs(actor_id, action, table_name, record_id, old_data, new_data)
  values (
    auth.uid(),
    tg_op,
    tg_table_name,
    coalesce(new.id::text, old.id::text),
    case when tg_op in ('UPDATE','DELETE') then to_jsonb(old) else null end,
    case when tg_op in ('INSERT','UPDATE') then to_jsonb(new) else null end
  );
  return coalesce(new, old);
end;
$$;

revoke execute on function private.write_electricity_audit() from public, anon, authenticated;

drop trigger if exists audit_electricity_source_documents on public.electricity_source_documents;
create trigger audit_electricity_source_documents after insert or update or delete on public.electricity_source_documents
for each row execute function private.write_electricity_audit();

drop trigger if exists audit_electricity_bill_readings on public.electricity_bill_readings;
create trigger audit_electricity_bill_readings after insert or update or delete on public.electricity_bill_readings
for each row execute function private.write_electricity_audit();

drop trigger if exists audit_electricity_solar_readings on public.electricity_solar_readings;
create trigger audit_electricity_solar_readings after insert or update or delete on public.electricity_solar_readings
for each row execute function private.write_electricity_audit();

drop trigger if exists audit_electricity_monthly_reports on public.electricity_monthly_reports;
create trigger audit_electricity_monthly_reports after insert or update or delete on public.electricity_monthly_reports
for each row execute function private.write_electricity_audit();

drop trigger if exists audit_electricity_report_sources on public.electricity_monthly_report_sources;
create trigger audit_electricity_report_sources after insert or update or delete on public.electricity_monthly_report_sources
for each row execute function private.write_electricity_audit();

drop trigger if exists electricity_sites_select on public.electricity_sites;
drop policy if exists electricity_sites_select on public.electricity_sites;
drop policy if exists electricity_sites_read on public.electricity_sites;
drop policy if exists electricity_sites_write on public.electricity_sites;
create policy electricity_sites_select on public.electricity_sites for select to authenticated
using ((select public.app_role()) in ('SUPER_ADMIN','FACILITY_ADMIN'));
create policy electricity_sites_insert on public.electricity_sites for insert to authenticated
with check ((select public.app_role()) in ('SUPER_ADMIN','FACILITY_ADMIN'));
create policy electricity_sites_update on public.electricity_sites for update to authenticated
using ((select public.app_role()) in ('SUPER_ADMIN','FACILITY_ADMIN'))
with check ((select public.app_role()) in ('SUPER_ADMIN','FACILITY_ADMIN'));
create policy electricity_sites_delete on public.electricity_sites for delete to authenticated
using ((select public.app_role()) in ('SUPER_ADMIN','FACILITY_ADMIN'));

do $$
declare t text;
begin
  foreach t in array ARRAY[
    'electricity_source_documents','electricity_bill_readings',
    'electricity_solar_readings','electricity_monthly_reports',
    'electricity_monthly_report_sources','electricity_processing_runs'
  ] loop
    execute format('drop policy if exists %I_select on public.%I', t, t);
    execute format('drop policy if exists %I_insert on public.%I', t, t);
    execute format('drop policy if exists %I_update on public.%I', t, t);
    execute format('drop policy if exists %I_delete on public.%I', t, t);
    execute format('drop policy if exists %I_read on public.%I', t, t);
    execute format('drop policy if exists %I_write on public.%I', t, t);

    execute format(
      'create policy %I_select on public.%I for select to authenticated using ((select public.app_role()) in (''SUPER_ADMIN'',''FACILITY_ADMIN''))',
      t || '_select', t
    );
    execute format(
      'create policy %I_insert on public.%I for insert to authenticated with check ((select public.app_role()) in (''SUPER_ADMIN'',''FACILITY_ADMIN''))',
      t || '_insert', t
    );
    execute format(
      'create policy %I_update on public.%I for update to authenticated using ((select public.app_role()) in (''SUPER_ADMIN'',''FACILITY_ADMIN'')) with check ((select public.app_role()) in (''SUPER_ADMIN'',''FACILITY_ADMIN''))',
      t || '_update', t
    );
    execute format(
      'create policy %I_delete on public.%I for delete to authenticated using ((select public.app_role()) in (''SUPER_ADMIN'',''FACILITY_ADMIN''))',
      t || '_delete', t
    );
  end loop;
end $$;

alter table public.electricity_sites enable row level security;
alter table public.electricity_source_documents enable row level security;
alter table public.electricity_bill_readings enable row level security;
alter table public.electricity_solar_readings enable row level security;
alter table public.electricity_monthly_reports enable row level security;
alter table public.electricity_monthly_report_sources enable row level security;
alter table public.electricity_processing_runs enable row level security;

grant select, insert, update, delete on public.electricity_sites to authenticated;
grant select, insert, update, delete on public.electricity_source_documents to authenticated;
grant select, insert, update, delete on public.electricity_bill_readings to authenticated;
grant select, insert, update, delete on public.electricity_solar_readings to authenticated;
grant select, insert, update, delete on public.electricity_monthly_reports to authenticated;
grant select, insert, update, delete on public.electricity_monthly_report_sources to authenticated;
grant select, insert, update, delete on public.electricity_processing_runs to authenticated;

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values (
  'electricity-source-docs',
  'electricity-source-docs',
  false,
  52428800,
  array[
    'application/pdf',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ]::text[]
)
on conflict (id) do update
set public=false, file_size_limit=52428800, allowed_mime_types=excluded.allowed_mime_types, updated_at=now();

drop policy if exists electricity_storage_select on storage.objects;
drop policy if exists electricity_storage_insert on storage.objects;
drop policy if exists electricity_storage_update on storage.objects;
drop policy if exists electricity_storage_delete on storage.objects;

create policy electricity_storage_select on storage.objects for select to authenticated
using (bucket_id='electricity-source-docs' and (select public.app_role()) in ('SUPER_ADMIN','FACILITY_ADMIN'));

create policy electricity_storage_insert on storage.objects for insert to authenticated
with check (bucket_id='electricity-source-docs' and (select public.app_role()) in ('SUPER_ADMIN','FACILITY_ADMIN'));

create policy electricity_storage_update on storage.objects for update to authenticated
using (bucket_id='electricity-source-docs' and (select public.app_role()) in ('SUPER_ADMIN','FACILITY_ADMIN'))
with check (bucket_id='electricity-source-docs' and (select public.app_role()) in ('SUPER_ADMIN','FACILITY_ADMIN'));

create policy electricity_storage_delete on storage.objects for delete to authenticated
using (bucket_id='electricity-source-docs' and (select public.app_role()) in ('SUPER_ADMIN','FACILITY_ADMIN'));

grant select, insert, update, delete on storage.objects to authenticated;
