# Phase 7.4 — Unified Central Admin Auth & Authorization

## Decision
Because the Central Admin team is small, `SUPER_ADMIN`, `CONTENT_ADMIN`, `OPERATIONS_ADMIN`, and `FACILITY_ADMIN` are consolidated into one role: `ADMIN`. Every approved staff account can use every Central Admin function.

This is intentionally not a permission split by department. The security boundary is still enforced: authentication is required, server authorization is required, the browser never receives service-role/database credentials, and direct anonymous access is denied.

## 7.4.1–7.4.3 Identity and role
- Supabase Auth is the identity provider.
- Admin login accepts email/password and stores short-lived auth tokens in Secure, HttpOnly, SameSite=Lax cookies.
- `/api/auth/me` returns authenticated identity and unified `ADMIN` role.
- A canonical `admin_users` table records approved admin identities and only permits role `ADMIN`.

## 7.4.4–7.4.5 Authorization and RLS
- All Central Admin permissions are available to `ADMIN`.
- Server APIs use a single authorization helper.
- CMS/admin identity and audit tables have RLS enabled and no browser write policies.
- Operational data remains owned by its domain system; Central Admin does not duplicate operational rows.

## 7.4.6–7.4.8 API/UI boundary
- Admin APIs require a valid Supabase Auth access token.
- AdminGuard continues to gate the frontend through `/api/auth/me`.
- AdminAppShell remains the single shell for dashboard, CMS, LAC satisfaction, Facility & Safety and Storefront administration.
- CMS actions are available to the unified `ADMIN` role.

## 7.4.9 Audit trail
`admin_audit_log` captures user, action, resource, resource id, metadata and timestamp. Domain APIs should record mutations as they are migrated to the unified audit helper.

## 7.4.10 Legacy auth migration
`ADMIN_PASSWORD` and the HMAC `admin_session` are no longer the target authentication path. They remain in source only for backward-compatibility inspection and are not used by the new login flow.

## 7.4.11 Architecture consolidation
The target is one Central Admin architecture with one identity boundary and one role. Duplicate role-specific admin surfaces are not introduced.

## 7.4.12 Security/E2E gate
Repository-side checks are implemented, but live Supabase Auth, live migration/RLS behavior, build and Vercel deployment require environment execution evidence. Therefore this document does not falsely mark those external checks as passed.
