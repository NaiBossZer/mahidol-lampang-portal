-- Registration settings per activity. The existing registration rows remain unchanged.
create table if not exists public.activity_registration_settings (
  activity_id uuid primary key references public.activities(id) on delete cascade,
  enabled boolean not null default true,
  opens_at timestamptz,
  closes_at timestamptz,
  capacity integer check (capacity is null or capacity > 0),
  form_fields jsonb not null default '{"email":true,"organization":true,"position":true,"participantType":true}'::jsonb,
  confirmation_message text not null default 'ลงทะเบียนสำเร็จ ขอบคุณที่สนใจเข้าร่วมกิจกรรม',
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint activity_registration_settings_window_check
    check (opens_at is null or closes_at is null or opens_at < closes_at),
  constraint activity_registration_settings_fields_check
    check (jsonb_typeof(form_fields) = 'object')
);

create index if not exists activity_registration_settings_updated_at_idx
  on public.activity_registration_settings(updated_at desc);

alter table public.activity_registration_settings enable row level security;
grant select on public.activity_registration_settings to anon, authenticated;
grant insert, update on public.activity_registration_settings to authenticated;

create policy activity_registration_settings_public_read
  on public.activity_registration_settings for select to anon, authenticated
  using (exists (
    select 1 from public.activities a
    where a.id = activity_registration_settings.activity_id and a.status = 'published'
  ));

create policy activity_registration_settings_admin_read
  on public.activity_registration_settings for select to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = any (
    array['SUPER_ADMIN','CONTENT_ADMIN','OPERATIONS_ADMIN','FACILITY_ADMIN']
  ));

create policy activity_registration_settings_admin_insert
  on public.activity_registration_settings for insert to authenticated
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = any (
    array['SUPER_ADMIN','CONTENT_ADMIN','OPERATIONS_ADMIN','FACILITY_ADMIN']
  ));

create policy activity_registration_settings_admin_update
  on public.activity_registration_settings for update to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = any (
    array['SUPER_ADMIN','CONTENT_ADMIN','OPERATIONS_ADMIN','FACILITY_ADMIN']
  ))
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = any (
    array['SUPER_ADMIN','CONTENT_ADMIN','OPERATIONS_ADMIN','FACILITY_ADMIN']
  ));
