# Phase 7.4 — Central Supabase Admin Auth & RBAC

## Decision
The Central Admin retains four domain roles: `SUPER_ADMIN`, `CONTENT_ADMIN`, `OPERATIONS_ADMIN`, and `FACILITY_ADMIN`. Supabase Auth is the central identity boundary; authorization remains domain-specific.

## Identity and authorization
- Supabase Auth is the identity provider.
- Access/refresh tokens use Secure, HttpOnly, SameSite=Lax cookies.
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
`AdminGuard` loads `/api/auth/me` once and shares role/permissions with `AdminAppShell`. Navigation is permission-driven. UI visibility is not the security boundary; protected APIs enforce authorization independently.

## Legacy auth
`ADMIN_PASSWORD` and HMAC `admin_session` are no longer authentication paths. The legacy helper remains only for source compatibility and delegates `isAdmin()` to the Supabase-backed identity boundary.

## Database migration order

```text
0001_social_engagement.sql
0002_canonical_cms.sql
0003_lac_satisfaction.sql
0004_unified_admin_auth.sql
```

The duplicate `0002` migration number has been removed. `admin_users` stores approved identity/profile mapping and `admin_audit_log` stores server-side audit events; Supabase Auth remains the identity/RBAC authority.

## Optimization rule
Every implementation change in this phase should prefer shared permission logic, avoid duplicate auth requests, preserve domain ownership boundaries, and avoid unnecessary dependencies or duplicated data paths.

## Security/E2E gate
Repository-side role/permission enforcement and migration ordering are implemented. Live Supabase Auth role configuration, live migration/RLS behavior, build and Vercel deployment require environment execution evidence and are not marked passed here.
