-- Phase 7.4: central admin identity/audit mapping. Supabase Auth app_metadata.role is the RBAC source of truth.
create table if not exists admin_users (
  user_id uuid primary key,
  role varchar(32) not null check (role in ('SUPER_ADMIN', 'CONTENT_ADMIN', 'OPERATIONS_ADMIN', 'FACILITY_ADMIN')),
  display_name varchar(255),
  email varchar(320),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  action varchar(64) not null,
  resource varchar(128) not null,
  resource_id varchar(255),
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists admin_audit_user_created_idx on admin_audit_log(user_id, created_at);
create index if not exists admin_audit_resource_created_idx on admin_audit_log(resource, created_at);

alter table admin_users enable row level security;
alter table admin_audit_log enable row level security;
-- No browser policies: server APIs are the controlled access boundary.
