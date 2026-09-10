# Mahidol Lampang Canonical CMS Model v1

## 1. Decision

This document locks the Phase 7.2 CMS architecture for `mahidol-lampang-portal`.

### Approved decisions

1. **Supabase Auth** is the target identity architecture.
2. **Semantic CMS V1** is the canonical content model. A generic page builder is explicitly out of scope for V1.
3. Central Admin is consolidated into one Admin Shell. Existing duplicate Admin implementations must not become parallel authorities.
4. Portal-owned content is managed centrally. Operational data remains owned by its domain system.
5. Existing canonical domain tables are reused where their semantics already match. Duplicate `cms_*` tables are prohibited for those entities.

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

The Central Admin may aggregate operational status for overview screens, but it must not create duplicate operational rows merely to make the dashboard easier to query.

## 3. Canonical CMS entities

| Entity | Canonical table/model | V1 ownership | Publishable |
|---|---|---|---|
| Activities | `activities` | Portal | Yes |
| Activity Photos | `activityPhotos` | Portal | Through activity |
| Activity Outcomes | `activityOutcomes` | Portal | Through activity |
| Activity Partners | `activityPartners` | Portal | Through activity |
| Projects | `socialProjects` | Portal | Yes |
| Learning Centers | `learningCenters` | Portal | Yes |
| Partners | `partners` | Portal | Yes |
| Services | `services` | Portal CMS | Yes |
| Home Sections | `home_sections` | Portal CMS | Yes |
| Navigation | `navigation_items` | Portal CMS | Yes |
| Footer | `footer_settings` | Portal CMS | Yes |

The following existing operational models remain outside CMS governance:

- `products`
- `orders`
- Facility/Safety operational entities
- Smart Farm operational entities
- Clean Energy / EV operational entities

## 4. Semantic CMS V1

### 4.1 Home composition

Home is a composition layer, not a single HTML document.

Canonical sections:

```text
HOME_HERO
FEATURED_ACTIVITIES
LEARNING_CENTERS
SERVICES
COMMUNITY_ACTION
PARTNERS
```

A section may reference an existing canonical entity rather than copying its content.

Example:

```text
Featured Activities -> activities
Learning Centers    -> learningCenters
Partners            -> partners
```

### 4.2 Home Sections

Conceptual model:

```text
home_sections
-------------
id
section_key
title
subtitle
description
image
sort_order
is_enabled
created_at
updated_at
```

`section_key` is a controlled semantic key, not arbitrary user-defined code.

### 4.3 Services

```text
services
--------
id
title
slug
summary
description
icon
featured_image
link_type
link_url
sort_order
status
published_at
created_at
updated_at
```

Allowed `link_type` values for V1:

```text
INTERNAL
EXTERNAL
CONTACT
```

### 4.4 Navigation

```text
navigation_items
----------------
id
label
slug
parent_id
target_type
target_url
sort_order
is_enabled
open_new_tab
created_at
updated_at
```

Navigation must support hierarchical items without allowing arbitrary executable content.

### 4.5 Footer

```text
footer_settings
---------------
organization_name
address
phone
email
facebook_url
line_url
copyright_text
privacy_url
terms_url
updated_at
```

Frontend owns presentation and layout; CMS owns editable content.

## 5. Existing entity mapping

### Activities

Reuse the existing `activities` model, including its status lifecycle:

```text
DRAFT -> PUBLISHED -> ARCHIVED
```

The existing activity relations remain canonical:

```text
activities
  ├── activityPhotos
  ├── activityPartners
  └── activityOutcomes
```

### Projects

Reuse `socialProjects`. Do not introduce `cms_projects`.

### Learning Centers

Reuse `learningCenters`. Do not introduce `cms_learning_centers`.

### Partners

Reuse `partners` and `activityPartners`.

Future CMS metadata may require additional fields such as ordering, visibility, website URL, and updated timestamp. Such schema changes must be made deliberately in an implementation migration; they are not introduced by this design document.

## 6. Content lifecycle

Publishable content follows an explicit workflow:

```text
CREATE
  |
  v
DRAFT
  |
  +--> EDIT
  |
  v
PREVIEW
  |
  v
PUBLISHED
  |
  v
ARCHIVED
```

Saving content does not implicitly publish it.

Publishing is a separate server-side mutation and must be permission checked.

## 7. RBAC target model

Supabase Auth provides identity. Application authorization maps authenticated identities to Portal roles and permissions.

Target roles:

```text
SUPER_ADMIN
CONTENT_ADMIN
OPERATIONS_ADMIN
FACILITY_ADMIN
VIEWER
```

Target permission shape:

```text
permission = resource + action
```

Examples:

```text
activities.read
activities.create
activities.update
activities.publish
activities.archive
partners.update
services.publish
navigation.update
facility.read
orders.update
```

Role assignment is separate from authentication. UI visibility is not the security boundary; every protected mutation must be checked server-side.

## 8. Permission matrix

| Resource | SUPER_ADMIN | CONTENT_ADMIN | OPERATIONS_ADMIN | FACILITY_ADMIN | VIEWER |
|---|---|---|---|---|---|
| Home CMS | CRUDP | CRUDP | Read | Read | Read |
| Activities | CRUDP | CRUDP | Read | Read | Read |
| Projects | CRUDP | CRUDP | Read | Read | Read |
| Learning Centers | CRUDP | CRUDP | Read | Read | Read |
| Partners | CRUDP | CRUDP | Read | Read | Read |
| Services | CRUDP | CRUDP | Read | Read | Read |
| Navigation | CRUDP | CRUDP | Read | Read | Read |
| Footer | CRUDP | CRUDP | Read | Read | Read |
| Store Products | CRUD | Read | CRUD | None | Read |
| Orders | CRUD | Read | CRUD | None | Read |
| Facility Operations | Full | Read | Full | Full | Read |
| Governance | Full | Read | Read | Read | Read |

Legend: `C` create, `R` read, `U` update, `D` delete, `P` publish.

The exact permission set may be refined during the RBAC implementation, but the ownership boundary must remain unchanged.

## 9. API contract

Canonical Admin API namespace:

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

Operational Admin APIs remain separated:

```text
/api/admin/facility-overview
/api/admin/store
/api/admin/orders
```

Each mutation must:

1. validate the session;
2. resolve the authenticated identity and role;
3. verify the resource/action permission;
4. validate the payload;
5. perform the mutation server-side;
6. write an audit event for important mutations;
7. return a safe response without secrets or service-role credentials.

## 10. Audit model

Canonical audit event shape:

```text
audit_logs
----------
id
actor_id
action
resource_type
resource_id
metadata
created_at
```

Important CMS actions include:

```text
CONTENT_CREATE
CONTENT_UPDATE
CONTENT_PUBLISH
CONTENT_ARCHIVE
CONTENT_DELETE
SETTINGS_UPDATE
NAVIGATION_UPDATE
```

Audit history is append-only from the client perspective.

## 11. Admin architecture

The target structure is:

```text
AdminGuard
   |
   v
AdminShell
   |
   +-- Overview
   |
   +-- CMS
   |    +-- Home
   |    +-- Activities
   |    +-- Projects
   |    +-- Learning Centers
   |    +-- Partners
   |    +-- Services
   |    +-- Navigation
   |    +-- Footer
   |
   +-- Operations
   |    +-- Facility
   |    +-- Smart Farm
   |    +-- Energy / EV
   |    +-- Store
   |
   +-- Governance
        +-- Users / Roles
        +-- Audit
        +-- System Registry
```

Existing duplicate Admin surfaces must be consolidated into this model rather than extended independently.

## 12. Explicit V1 exclusions

The following are intentionally excluded from Semantic CMS V1:

- generic drag-and-drop page builder;
- arbitrary HTML/JS blocks;
- CMS copies of operational Facility/Farm/Energy rows;
- duplicate activity/project/center/partner tables;
- client-side service-role access;
- implicit publish-on-save;
- a second independent administrator authentication system.

## 13. Implementation order

Phase 7.3 should implement in this order:

```text
1. Supabase Auth target integration boundary
2. Admin identity/role adapter
3. AdminShell consolidation
4. Server-side permission enforcement
5. CMS API contracts
6. Services / Navigation / Footer models
7. Home composition API
8. Activities / Projects / Learning Centers / Partners CMS screens
9. Publish / Archive workflow
10. Audit integration
11. Admin QA + lint/build/smoke verification
```

## 14. Security invariants

The implementation must preserve these invariants:

- No service-role secret in browser bundles.
- No admin authorization based only on UI state.
- No cross-domain operational duplication.
- No client-controlled audit history.
- No arbitrary executable CMS content.
- Publish and destructive actions require explicit permission.
- Supabase Auth is the target identity authority.
- Central Portal remains the single administrator entry point.
