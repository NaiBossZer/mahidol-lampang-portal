# Phase 7.4 — Central Supabase Admin Auth & RBAC

The Central Admin retains four roles: `SUPER_ADMIN`, `CONTENT_ADMIN`, `OPERATIONS_ADMIN`, and `FACILITY_ADMIN`.

Supabase Auth is the central identity boundary. Supabase `app_metadata.role` is the RBAC source of truth. Application permissions remain domain-specific.

- `SUPER_ADMIN`: full access.
- `CONTENT_ADMIN`: CMS, home, projects, partners, services, navigation and footer.
- `OPERATIONS_ADMIN`: activities, learning centers and store/operations.
- `FACILITY_ADMIN`: Facility & Safety.

`/api/auth/me` returns identity, role and effective permissions. `requirePermission()` enforces permissions server-side. `AdminGuard` loads identity once and shares the result with `AdminAppShell`, whose navigation is permission-driven.

Legacy `ADMIN_PASSWORD` / `admin_session` are no longer authentication paths. The compatibility helper delegates `isAdmin()` to the Supabase-backed authorization boundary.

Canonical migration order:

```text
0001_social_engagement.sql
0002_canonical_cms.sql
0003_lac_satisfaction.sql
0004_unified_admin_auth.sql
```

The duplicate `0002` migration collision has been removed. `admin_users` stores approved identity/profile mapping and `admin_audit_log` stores server-side audit events; Supabase Auth remains the identity/RBAC authority.

Optimization rule: prefer shared permission logic, avoid duplicate auth requests, preserve domain ownership boundaries, and avoid unnecessary dependencies or duplicated data paths on every implementation change.

Repository-side role/permission enforcement and migration ordering are implemented. Live Supabase role configuration, live migration/RLS behavior, build and Vercel deployment still require environment execution evidence and are not marked passed here.
