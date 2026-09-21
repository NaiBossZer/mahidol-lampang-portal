alter table public.system_registry
  add constraint if not exists system_registry_base_url_check
  check (base_url is null or base_url ~ '^https?://');

update public.system_registry
set base_url = case system_key
  when 'lac-learning' then 'https://mahidol-shellac.vercel.app'
  when 'smart-farm' then 'https://mahidol-smart-farm.vercel.app/'
  when 'clean-energy' then 'https://mahidol-clean-energy.vercel.app'
  when 'facility-safety' then 'https://mulpfacility-safety.vercel.app'
  else base_url
end,
updated_at = now()
where system_key in ('lac-learning','smart-farm','clean-energy','facility-safety');

drop policy if exists system_registry_public_read on public.system_registry;

create policy system_registry_public_read
  on public.system_registry
  for select
  to anon
  using (status = 'active' and base_url is not null);
