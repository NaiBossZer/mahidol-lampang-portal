# Mahidol Lampang Central Admin — Master Feature Map

> Master scope and implementation contract for the Central Admin platform.

## Implementation status — Autonomous Vertical Implementation

| Domain | Status | Production boundary |
|---|---|---|
| Dashboard | FOUNDATION | Portal React + `/api/admin/dashboard` |
| Activities | FOUNDATION | Portal API + Supabase |
| Activity Occurrences | FOUNDATION | Portal API + Supabase |
| Activity Photos | FOUNDATION | Supabase Storage `activity-media` + `activity_media` metadata |
| Activity ↔ Learning Center ↔ Organization | FOUNDATION | Junction tables + Portal API |
| Surveys | FOUNDATION | Occurrence Survey + Portal API |
| Question Builder | FOUNDATION | Data-driven `survey_questions` |
| Survey Responses / Detail | FOUNDATION | `survey_responses` + `survey_answers` |
| Survey Analytics | FOUNDATION | Portal analytics API |
| Learning Centers | FOUNDATION | Portal API + Supabase |
| Organizations | FOUNDATION | Portal API + Supabase |
| CMS | FOUNDATION | Existing Portal CMS boundary |
| Analytics / Reports | FOUNDATION | Portal API |
| Global Search | FOUNDATION | Permission-aware Portal API |
| Notifications | FOUNDATION | `admin_notifications` + Portal API |
| AI Tool Registry | FOUNDATION | `ai_tools` |
| AI Manager | FOUNDATION | Governed Portal API execution |
| Activity Agent | FOUNDATION | Registered Activity tools |
| Survey Agent | FOUNDATION | Registered Survey tools |
| Learning Center / CMS Agent | FOUNDATION | Registered content tools |
| Analytics Agent | FOUNDATION | Read-only analytics tools |
| Admin Users / RBAC | FOUNDATION | Supabase Auth metadata + controlled role RPC |
| Audit Trail | FOUNDATION | Append-only `audit_logs` |
| Data Lifecycle | FOUNDATION | Active → Archived → Retired + lifecycle events |
| System Administration | FOUNDATION | System registry / health view |
| Facility Integration | FUTURE | Separate Facility-Safety system; untouched |

## Product principle

**ZERO UNNECESSARY ADMIN WORK** — Admin defines intent and makes consequential decisions. Portal APIs execute governed workflows. AI assists with planning, preparation, analysis and approved execution.

## System boundaries

- Portal is the Central Admin platform.
- Supabase is the central data and authentication source of truth.
- Supabase Auth `app_metadata.role` is the RBAC source of truth.
- `AdminGuard` is the protected route boundary.
- Portal API is the browser-to-server execution boundary.
- AI never accesses SQL directly and never bypasses Portal API, RBAC or policy checks.
- `NaiBossZer/Facility-Safety` is a separate system and is not modified by this feature map.
- `mahidol-rac` remains a read-only reference and is not modified by this implementation.
- AI Facility is deferred.
- AI Media is not a separate domain; media belongs inside Activity.
- AI Self-QA and AI-Native Admin are excluded; operational QA and final decisions remain human responsibilities.

## Core data model

```text
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

Organization
  └── Parent → Child hierarchy

Lifecycle
  Active → Archived → Retired
       └→ Cancelled (business state; retained for audit/history)
```

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

## Verification contract

Every vertical slice is verified independently at:

1. source code
2. commit/branch
3. CI Quality Gate
4. preview deployment
5. production only when independently evidenced

No branch state is treated as production evidence.

## Security contract

- Four roles only: `SUPER_ADMIN`, `CONTENT_ADMIN`, `OPERATIONS_ADMIN`, `FACILITY_ADMIN`.
- No service-role key in frontend.
- Auth cookies remain HttpOnly/Secure/SameSite=Lax.
- Management endpoints require authenticated Central Admin session.
- Role assignment is SUPER_ADMIN-only through a controlled database function.
- AI medium/high-risk actions require approval.
- Audit history is append-only by application policy.
- Historical activity/survey data is preserved.
- Storage uploads are authenticated and restricted to the activity-media bucket.

## Definition of done

- Operational data is managed in Supabase rather than Excel as the source of truth.
- Survey definitions and questions are data-driven.
- Responses are normalized and reviewable.
- Images use Supabase Storage with database metadata.
- Activity occurrences are first-class records.
- Historical records are preserved through lifecycle states.
- Server-side RBAC protects management actions.
- AI uses registered Portal APIs only.
- AI actions are auditable and risk governed.
- Public Portal and Central Admin share one identity boundary.
- Stitch remains a UX reference, not a production runtime dependency.
