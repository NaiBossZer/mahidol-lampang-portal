# Phase 7.4 — Central Supabase Admin Auth & RBAC

## Decision
The Central Admin keeps four operational roles rather than collapsing them into one role:

- `SUPER_ADMIN` — full Central Admin access.
- `CONTENT_ADMIN` — website/CMS content management.
- `OPERATIONS_ADMIN` — activities, learning centers and operational/store functions.
- `FACILITY_ADMIN` — Facility & Safety management.

Supabase Auth is the central identity boundary. Authorization remains domain-specific so adding or changing a menu/function does not require redesigning the whole role model.

## 7.4.1–7.4.3 Identity and role
- Supabase Auth is the identity provider.
- Admin login accepts email/password and stores auth tokens in Secure, HttpOnly, SameSite=Lax cookies.
- Supabase `app_metadata.role` is the RBAC source of truth.
- `/api/auth/me` returns authenticated identity, role and effective permissions.
- `admin_users` records the approved admin identity/profile mapping and supports the audit boundary; it does not replace Supabase Auth role claims.

## 7.4.4–7.4.5 Authorization and RLS
- Server APIs enforce permissions, not only authentication.
- `SUPER_ADMIN` bypasses domain permission checks.
- CMS APIs require `cms.*` permissions; Activities/LAC require `activities.*`; Facility overview requires `facility.read`.
- CMS/admin identity and audit tables have RLS enabled and no browser write policies.
- Operational data remains owned by its domain system; Central Admin does not duplicate operational rows.

## 7.4.6–7.4.8 API/UI boundary
- Admin APIs use the Supabase-backed authorization helper.
- Legacy `isAdmin()` callers are compatibility-routed through the Supabase identity boundary rather than the old `admin_session` cookie.
- `AdminGuard` checks authorization once and shares role/permissions with `AdminAppShell`.
- `AdminAppShell` filters navigation by effective permissions; the backend remains the security boundary.

## 7.4.9 Audit trail
`admin_audit_log` captures user, action, resource, resource id, metadata and timestamp. Domain APIs should record mutations as they are migrated to the audit helper.

## 7.4.10 Legacy auth migration
`ADMIN_PASSWORD` and the HMAC `admin_session` are no longer the target authentication path. Legacy helper exports remain only for source compatibility; they no longer establish an admin identity.

## 7.4.11 Architecture and optimization
The target is one Central Admin identity boundary with domain-specific RBAC. Shared permission definitions avoid duplicated role logic. The frontend reuses the single `/api/auth/me` result through `AdminGuard` instead of issuing a second identity request from the shell.

## 7.4.12 Security/E2E gate
Repository-side authorization and migration ordering are implemented. Live Supabase Auth, live migration/RLS behavior, build and Vercel deployment still require environment execution evidence and are not marked passed here.
