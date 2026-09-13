create or replace function public.audit_media_asset_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.audit_logs (
    actor_id,
    action,
    table_name,
    record_id,
    old_data,
    new_data
  )
  values (
    coalesce(
      auth.uid(),
      case when tg_op = 'DELETE' then old.created_by else new.created_by end
    ),
    'media.' || lower(tg_op),
    tg_table_schema || '.' || tg_table_name,
    case when tg_op = 'DELETE' then old.id::text else new.id::text end,
    case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) else null end,
    case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) else null end
  );

  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

drop trigger if exists trg_audit_portal_media_assets on public.portal_media_assets;
create trigger trg_audit_portal_media_assets
after insert or update or delete on public.portal_media_assets
for each row execute function public.audit_media_asset_change();

drop trigger if exists trg_audit_activity_media on public.activity_media;
create trigger trg_audit_activity_media
after insert or update or delete on public.activity_media
for each row execute function public.audit_media_asset_change();

drop trigger if exists trg_audit_activity_photos on public.activity_photos;
create trigger trg_audit_activity_photos
after insert or update or delete on public.activity_photos
for each row execute function public.audit_media_asset_change();
