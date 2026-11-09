create schema if not exists private;

create or replace function private.enforce_activity_registration_capacity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  configured_capacity integer;
  current_count bigint;
begin
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(new.activity_id::text, 0)
  );

  select s.capacity into configured_capacity
  from public.activity_registration_settings s
  where s.activity_id = new.activity_id;

  if configured_capacity is null then
    return new;
  end if;

  select count(*) into current_count
  from public.activity_registrations r
  where r.activity_id = new.activity_id and r.status <> 'cancelled';

  if current_count >= configured_capacity then
    raise exception 'REGISTRATION_CAPACITY_REACHED' using errcode = '23514';
  end if;

  return new;
end;
$$;

revoke all on function private.enforce_activity_registration_capacity() from public, anon, authenticated;

drop trigger if exists activity_registration_capacity_guard on public.activity_registrations;
create trigger activity_registration_capacity_guard
before insert on public.activity_registrations
for each row execute function private.enforce_activity_registration_capacity();
