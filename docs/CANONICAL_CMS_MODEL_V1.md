# Mahidol Lampang Canonical CMS Model v1

## 1. Decision

This document locks the Phase 7.2 CMS architecture for `mahidol-lampang-portal`.

1. Supabase Auth is the central identity architecture.
2. Semantic CMS V1 is canonical; a generic page builder is out of scope.
3. Central Admin uses one Admin Shell; duplicate admin authorities are not introduced.
4. Portal-owned content is managed centrally; operational data remains owned by its domain system.
5. Existing canonical domain tables are reused where semantics already match.
6. RBAC retains four management roles: `SUPER_ADMIN`, `CONTENT_ADMIN`, `OPERATIONS_ADMIN`, `FACILITY_ADMIN`.

## 2. Ownership boundary

```text
Central Portal / CMS
  ├── Home composition
  ├── Activities
  ├── Projects
  ├── Learning Centers
  ├── Partners
  ├── Services
  ├── Navigation
  └── Footer

Domain Operations
  ├── Facility & Safety
  ├── Smart Farm
  ├── Clean Energy / EV
  └── Store Operations
```

The Portal may aggregate operational status for overview screens, but must not duplicate operational rows.

## 3. Canonical entities

| Entity | Canonical model |
|---|---|
| Activities | `activities` |
| Activity Photos | `activityPhotos` |
| Activity Outcomes | `activityOutcomes` |
| Activity Partners | `activityPartners` |
| Projects | `socialProjects` |
| Learning Centers | `learningCenters` |
| Partners | `partners` |
| Services | `services` |
| Home Sections | `home_sections` |
| Navigation | `navigation_items` |
| Footer | `footer_settings` |

Operational models such as products, orders, Facility/Safety, Smart Farm and Clean Energy remain outside CMS governance.

## 4. Content lifecycle

Publishable content follows:

```text
CREATE -> DRAFT -> EDIT -> PREVIEW -> PUBLISHED -> ARCHIVED
```

Saving does not implicitly publish. Publish/archive/delete mutations require server-side permission checks.

## 5. RBAC

Supabase Auth provides identity. The role is read from Supabase `app_metadata.role` and mapped to application permissions.

```text
SUPER_ADMIN       full access
CONTENT_ADMIN     CMS/content management
OPERATIONS_ADMIN  activities, learning centers, store/operations
FACILITY_ADMIN    Facility & Safety
```

Permission format is `resource.action`.

| Domain | Primary role | Examples |
|---|---|---|
| Overview | All roles | `overview.read` |
| CMS / Home | CONTENT_ADMIN | `cms.read`, `cms.update`, `cms.publish` |
| Projects / Partners / Services | CONTENT_ADMIN | `projects.update`, `partners.update`, `services.publish` |
| Navigation / Footer | CONTENT_ADMIN | `navigation.update`, `footer.update` |
| Activities | OPERATIONS_ADMIN | `activities.create`, `activities.update`, `activities.publish` |
| Learning Centers | OPERATIONS_ADMIN | `learning_centers.update`, `learning_centers.publish` |
| Store | OPERATIONS_ADMIN | `store.read`, `store.manage` |
| Facility & Safety | FACILITY_ADMIN | `facility.read`, `facility.manage` |
| System / Governance | SUPER_ADMIN | `system.read`, `system.manage` |

`SUPER_ADMIN` bypasses domain permission checks. Other roles receive only their domain permissions.

## 6. API contract

Canonical CMS namespace:

```text
/api/admin/home
/api/admin/activities
/api/admin/projects
/api/admin/learning-centers
/api/admin/partners
/api/admin/services
/api/admin/navigation
/api/admin/footer
```

Operational APIs remain separated, for example:

```text
/api/admin/facility-overview
/api/admin/orders
/api/admin/products
```

Each protected mutation must validate the Supabase-backed identity, resolve the role, verify the action permission, validate input, mutate server-side and record an audit event where required.

## 7. Admin architecture

```text
Supabase Auth
    |
    v
AdminGuard
    |
    v
AdminShell
    +-- Overview
    +-- CMS
    +-- Activities / Learning Centers
    +-- Facility & Safety
    +-- Store / Operations
    +-- Governance
```

`AdminGuard` loads identity/permissions once and shares them with `AdminAppShell`. Menu visibility is derived from permissions; it is not a security boundary.

## 8. Audit model

`admin_audit_log` records actor, action, resource, resource id, metadata and timestamp. Client-side callers cannot write audit history directly.

## 9. Explicit exclusions

- generic drag-and-drop page builder;
- arbitrary HTML/JS CMS blocks;
- duplicate operational tables;
- duplicate activity/project/center/partner tables;
- client-side service-role credentials;
- implicit publish-on-save;
- a second independent administrator authentication system.

## 10. Security invariants

- Supabase Auth is the central identity authority.
- Browser clients never receive service-role/database credentials.
- Authorization is enforced server-side.
- Domain permissions remain separated even though authentication is centralized.
- Publish and destructive actions require explicit permissions.
- Central Portal remains the single administrator entry point.
