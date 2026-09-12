# Mahidol Lampang Central Portal — Master Feature Map

> Canonical product scope and ownership contract. The Portal is consolidated into five domains; individual screens, APIs and tables remain implementation details under their owning domain.

## Five canonical domains

### 1. Portal Core

**Purpose:** one shared identity, authorization, master-data and governance foundation.

- Authentication / session
- AdminGuard
- Admin Users / RBAC
- Organizations master data and hierarchy
- Audit Trail
- Data Lifecycle
- Global Search
- Notifications
- System Settings

### 2. Programs & Activities

**Purpose:** manage the complete activity lifecycle from definition through delivery and historical record.

- Activities
- Activity Occurrences
- Activity ↔ Learning Center ↔ Organization relations
- Activity Photos / Media
- Activity lifecycle
- Occurrence survey linkage

### 3. Learning & Content

**Purpose:** manage learning resources and public-facing content in one content domain.

- Learning Centers
- CMS
- Partners
- Content/media resources

### 4. Engagement & Insights

**Purpose:** collect structured engagement data and turn it into trustworthy insight.

- Surveys
- Survey Question Builder
- Survey Responses
- Response Detail
- Satisfaction calculation
- Analytics
- Reports

### 5. AI Workspace

**Purpose:** governed AI assistance over the four non-AI domains without creating a second data or authorization boundary.

- AI Manager
- AI Agent Registry
- Activity Agent
- Survey Agent
- Learning Center / CMS Agent
- Analytics Agent
- AI Tool Registry
- Intent / Plan
- Work Queue
- Approval
- Execution
- History

## Cross-domain presentation layer

The following are presentation/system UI capabilities, not additional business domains:

- Public Website
- PublicAppShell
- AdminAppShell
- AppNavbar
- Dashboard

Dashboard consumes domain data and does not own operational data.

## Infrastructure layer

Also not business domains:

- Supabase Auth
- PostgreSQL
- Supabase Storage
- RLS / database policies
- Cloudflare Pages / Functions
- CI Quality Gate

## Ownership rules

| Capability | Owner domain |
|---|---|
| Organizations | Portal Core / Master Data |
| Occurrences | Programs & Activities |
| Activity Photos | Programs & Activities |
| Activity Relations | Programs & Activities |
| Learning Centers | Learning & Content |
| CMS / Partners | Learning & Content |
| Survey + Question Builder + Responses | Engagement & Insights |
| Analytics + Reports | Engagement & Insights |
| Search + Notifications | Portal Core |
| Audit + Lifecycle + RBAC | Portal Core |
| AI Manager + Agents + Tools | AI Workspace |
| Dashboard + AppNavbar | Presentation layer |

## Core data model

```text
Organization
  └── Parent → Child hierarchy

Activity
  ├── Occurrence (1:N)
  │     ├── Survey (0:1)
  │     └── Responses (1:N)
  ├── Learning Centers (N:M)
  ├── Organizations / Organizers (N:M)
  └── Media → Supabase Storage

Survey
  ├── Questions (1:N)
  └── Answers / Responses (1:N)
```

Repeated delivery is one Activity with multiple Occurrences. Cancelled activity/occurrence records remain stored for audit/history but are hidden from normal views and excluded from KPI/satisfaction calculations where specified. No Survey response is a score of zero by absence.

## AI orchestration contract

```text
Admin Intent
  ↓
Context
  ↓
Supabase Auth
  ↓
AdminGuard
  ↓
RBAC / Permission
  ↓
Policy + Risk
  ↓
AI Plan
  ↓
Approval when required
  ↓
AI Tool Registry
  ↓
Portal API
  ↓
Supabase / Storage
  ↓
Verification
  ↓
Result + Audit
```

AI never accesses SQL directly and never bypasses the Portal API, Auth, AdminGuard, RBAC or policy checks.

## Security and system boundaries

- Supabase Auth `app_metadata.role` is the RBAC source of truth.
- Roles are exactly `SUPER_ADMIN`, `CONTENT_ADMIN`, `OPERATIONS_ADMIN`, `FACILITY_ADMIN`.
- No service-role key in frontend.
- Management endpoints require authenticated Central Admin session and server-side permission enforcement.
- Medium/high-risk AI actions require approval.
- Audit history is preserved.
- `NaiBossZer/Facility-Safety` is a separate system and remains untouched.
- `mahidol-rac` is read-only reference and remains untouched.
- Facility AI is deferred.

## Definition of done

- Each feature has one canonical domain owner.
- Operational data is managed through Supabase/Portal APIs rather than disconnected mock stores.
- Activity occurrences, media, relations and survey linkage are first-class records.
- Survey definitions/questions are data-driven and responses are normalized/reviewable.
- Learning and content capabilities share a coherent domain boundary.
- Analytics and reports share the Engagement & Insights boundary.
- Governance and shared services live in Portal Core.
- AI uses registered Portal APIs only and remains auditable/risk governed.
- Presentation surfaces consume domain services without becoming data owners.
- CI, runtime, visual, integration, security and production-readiness checks remain separate verification gates.
