# Mahidol Lampang Central Portal — Five-Domain Architecture

## 1. Architectural goal

The Portal is the central application boundary for public content, Central Admin, operational workflows, analytics and governed AI. Features are grouped into five canonical domains to prevent one feature from becoming one independent system.

```text
MAHIDOL LAMPANG PORTAL
│
├── 1. PORTAL CORE
├── 2. PROGRAMS & ACTIVITIES
├── 3. LEARNING & CONTENT
├── 4. ENGAGEMENT & INSIGHTS
└── 5. AI WORKSPACE
```

Presentation (Public Website, Admin UI, Dashboard and AppNavbar) is a cross-domain layer, not a sixth business domain. Infrastructure (Supabase, Cloudflare and CI/CD) is a platform layer, not a business domain.

## 2. Domain responsibilities

### Domain 1 — Portal Core

Owns capabilities shared by every other domain:

- Supabase Auth identity boundary
- AdminGuard protected-route boundary
- RBAC and permission enforcement
- Admin Users
- Organizations as master data, including hierarchy
- Audit Trail
- Data Lifecycle
- Global Search
- Notifications
- System Settings

Organizations are a master-data entity, not a standalone application domain.

### Domain 2 — Programs & Activities

Owns the complete activity lifecycle:

```text
Activity
 ├── Occurrences (1:N)
 ├── Learning Center relations (N:M)
 ├── Organizer / Organization relations (N:M)
 ├── Media / Photos
 ├── Activity lifecycle
 └── Occurrence Survey linkage
```

Repeated delivery is represented by one Activity with multiple Occurrences. Media and relationship management remain inside this domain.

### Domain 3 — Learning & Content

Owns learning resources and public content:

- Learning Centers
- CMS / public content
- Partners
- Content media/resources

Learning Centers and CMS remain distinct entities and APIs, but belong to the same business domain.

### Domain 4 — Engagement & Insights

Owns the feedback-to-insight lifecycle:

```text
Survey
 ↓
Question Builder
 ↓
Occurrence Response
 ↓
Answers
 ↓
Satisfaction / Analytics
 ↓
Reports
```

No response is treated as score zero. Cancelled/archived records are excluded from operational KPI calculations where specified, while historical records remain auditable.

### Domain 5 — AI Workspace

Owns governed AI orchestration:

```text
Intent → Context → Auth → AdminGuard → RBAC → Policy/Risk
→ Plan → Approval → Tool Registry → Portal API
→ Supabase/Storage → Verification → Result/Audit
```

AI is an application consumer of Portal capabilities. It is never a second database boundary and never executes SQL directly.

## 3. Cross-domain presentation layer

```text
PRESENTATION
├── Public Website
├── PublicAppShell
├── AdminAppShell
├── AppNavbar
└── Dashboard
```

Dashboard is a presentation surface over domain data. It does not own operational data. AppNavbar is a global UI system shared by public/admin experiences where applicable.

## 4. Platform and infrastructure layer

```text
PLATFORM
├── Supabase Auth
├── PostgreSQL
├── Supabase Storage
├── RLS / database policies
├── Cloudflare Pages / Functions
└── CI Quality Gate
```

Browser dependency direction:

```text
Presentation → Domain UI → Services → Portal API → Supabase
```

AI dependency direction:

```text
AI Workspace → governed Tool Registry → Portal API → Supabase/Storage
```

No browser component may access PostgreSQL, Drizzle, service-role credentials or Supabase management credentials directly.

## 5. Security boundaries

- Supabase Auth is the central identity source.
- `app_metadata.role` is the RBAC source of truth.
- Roles remain exactly `SUPER_ADMIN`, `CONTENT_ADMIN`, `OPERATIONS_ADMIN`, `FACILITY_ADMIN`.
- `AdminGuard` protects admin routes.
- Server endpoints enforce authentication and permissions independently of UI visibility.
- Service-role credentials never reach the browser.
- AI never bypasses Auth, AdminGuard, RBAC, policy checks or Portal API.
- AI medium/high-risk actions require approval.
- Audit history is preserved for consequential operations.
- `NaiBossZer/Facility-Safety` remains a separate system and is untouched.
- `mahidol-rac` remains a read-only reference and is untouched.

## 6. Lifecycle contract

```text
Draft → Scheduled → Ongoing → Completed
                 └──────────→ Cancelled

Active → Archived → Retired
```

Cancelled records are retained for audit/history and hidden from normal operational views. Archived/retired records remain available for history and governance according to policy.

## 7. Repository organization rule

The current physical repository structure is intentionally not mass-moved merely to rename folders. Domain ownership is established first through the machine-readable registry in `src/config/domains.ts` and `src/config/admin-features.ts`. This avoids destructive churn while establishing a stable boundary for incremental refactoring.

Feature folders/files may remain under the existing `pages`, `components`, `services` and `functions/api/admin` layout while each feature has exactly one canonical domain owner.

## 8. Canonical feature ownership

| Domain | Canonical capabilities |
|---|---|
| Portal Core | Auth, RBAC, Admin Users, Organizations, Audit, Lifecycle, Search, Notifications, Settings |
| Programs & Activities | Activities, Occurrences, Relations, Photos/Media |
| Learning & Content | Learning Centers, CMS, Partners, Content Media |
| Engagement & Insights | Surveys, Question Builder, Responses, Satisfaction, Analytics, Reports |
| AI Workspace | AI Manager, Agents, Tools, Queue, Execution, Approval, History |

## 9. Implementation and verification order

1. Establish domain contract and registry.
2. Keep central Auth/RBAC/API boundaries intact.
3. Complete each domain as a vertical production slice against Supabase.
4. Verify source and type contracts.
5. Verify CI Build/Lint/Typecheck/Smoke.
6. Verify Cloudflare preview runtime separately.
7. Verify visual QA separately from CI/runtime QA.
8. Verify integration, RLS, RBAC and audit behavior.
9. Production readiness review.
10. Merge to `main` only after explicit user approval.

The five domains are a consolidation of product ownership, not permission to delete existing functionality. Existing features are preserved and assigned to their canonical domain.
