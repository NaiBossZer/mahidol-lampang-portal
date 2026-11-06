-- Generic activity registration for all published activities.
create table if not exists public.activity_registrations (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.activities(id) on delete cascade,
  registration_code text not null unique,
  full_name text not null,
  phone text not null,
  phone_normalized text not null,
  email text,
  organization text,
  position text,
  participant_type text not null default 'general',
  pdpa_consent boolean not null default false,
  pdpa_consent_at timestamptz,
  pdpa_notice_version text not null default '1.0',
  status text not null default 'registered'
    check (status in ('registered', 'checked_in', 'cancelled')),
  checked_in_at timestamptz,
  checked_in_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint activity_registrations_consent_check check (pdpa_consent = true),
  constraint activity_registrations_name_check check (length(btrim(full_name)) between 2 and 200),
  constraint activity_registrations_phone_check check (length(phone_normalized) between 8 and 20)
);

create unique index if not exists activity_registrations_activity_phone_unique
  on public.activity_registrations(activity_id, phone_normalized)
  where status <> 'cancelled';

create index if not exists activity_registrations_activity_created_idx
  on public.activity_registrations(activity_id, created_at desc);

create index if not exists activity_registrations_status_idx
  on public.activity_registrations(activity_id, status);

create or replace function public.set_activity_registration_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists activity_registrations_updated_at on public.activity_registrations;
create trigger activity_registrations_updated_at
before update on public.activity_registrations
for each row execute function public.set_activity_registration_updated_at();

alter table public.activity_registrations enable row level security;

drop policy if exists activity_registrations_public_insert on public.activity_registrations;
create policy activity_registrations_public_insert
on public.activity_registrations
for insert
to anon, authenticated
with check (
  pdpa_consent = true
  and status = 'registered'
  and exists (
    select 1 from public.activities a
    where a.id = activity_id
      and a.status = 'published'
  )
);

drop policy if exists activity_registrations_central_admin_read on public.activity_registrations;
create policy activity_registrations_central_admin_read
on public.activity_registrations
for select
to authenticated
using (
  ((auth.jwt() -> 'app_metadata' ->> 'role') = any (
    array['SUPER_ADMIN','CONTENT_ADMIN','OPERATIONS_ADMIN','FACILITY_ADMIN']
  ))
);

drop policy if exists activity_registrations_central_admin_update on public.activity_registrations;
create policy activity_registrations_central_admin_update
on public.activity_registrations
for update
to authenticated
using (
  ((auth.jwt() -> 'app_metadata' ->> 'role') = any (
    array['SUPER_ADMIN','CONTENT_ADMIN','OPERATIONS_ADMIN','FACILITY_ADMIN']
  ))
)
with check (
  ((auth.jwt() -> 'app_metadata' ->> 'role') = any (
    array['SUPER_ADMIN','CONTENT_ADMIN','OPERATIONS_ADMIN','FACILITY_ADMIN']
  ))
);

grant insert on public.activity_registrations to anon, authenticated;
grant select, update on public.activity_registrations to authenticated;
grant all on public.activity_registrations to service_role;
