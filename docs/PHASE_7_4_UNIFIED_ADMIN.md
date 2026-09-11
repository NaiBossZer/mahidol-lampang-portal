# Phase 7.4 — Central Supabase Admin Auth & RBAC

## Decision
The Central Admin retains four domain roles:

- `SUPER_ADMIN` — full Central Admin access.
- `CONTENT_ADMIN` — website/CMS content management.
- `OPERATIONS_ADMIN` — activities, learning centers and operational/store functions.
- `FACILITY_ADMIN` — Facility & Safety management.

Supabase Auth is the central identity boundary. Authorization remains domain-specific.

## Identity and authorization
- Supabase Auth is the identity provider.
- Email/password login stores access/refresh tokens in Secure, HttpOnly, SameSite=Lax cookies.
- Supabase `app_metadata.role` is the RBAC source of truth.
- `/api/auth/me` returns identity, role and effective permissions.
- `requirePermission()` enforces resource/action permissions server-side.
- `SUPER_ADMIN` bypasses domain permission checks.

## Permission domains
- Content: `cms.*`, `projects.*`, `partners.*`, `services.*`, `navigation.*`, `footer.*`
- Operations: `activities.*`, `learning_centers.*`, `store.*`
- Facility: `facility.*`
- Overview: `overview.read`
- System/governance: `system.*` for `SUPER_ADMIN`

## UI boundary
`AdminGuard` loads `/api/auth/me` once and shares role/permissions with `AdminAppShell`. Navigation is filtered by permission, so changing functions does not require hard-coded role logic throughout the menu.

UI visibility is convenience only; every protected API operation remains server-authorized.

## Legacy auth
`ADMIN_PASSWORD` and the HMAC `admin_session` are no longer an authentication path. The legacy helper is retained only for source compatibility and delegates `isAdmin()` to the Supabase-backed authorization boundary.

## Database migration order

```text
0001_social_engagement.sql
0002_canonical_cms.sql
0003_lac_satisfaction.sql
0004_unified_admin_auth.sql
```

The duplicate `0002` migration number has been removed. `admin_users` stores approved identity/profile mapping and `admin_audit_log` stores server-side audit events; Supabase Auth remains the identity/RBAC authority.

## Optimization
Shared role/permission definitions remove duplicated authorization logic. `AdminGuard` fetches `/api/auth/me` once and reuses the result in the shell, avoiding a second identity request.

## Security/E2E gate
Repository-side role/permission enforcement and migration ordering are implemented. Live Supabase Auth role configuration, live migration/RLS behavior, build and Vercel deployment still require environment execution evidence and are not marked passed here.
