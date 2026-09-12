# Mahidol Lampang Central Admin — Master Feature Map

> Master scope for the Central Admin platform. This document is the planning and architecture contract for implementation. It does not authorize bypassing existing security boundaries.

## Product principle

**ZERO UNNECESSARY ADMIN WORK**

Admin defines the intent and makes decisions. The Portal executes the workflow through governed APIs and data services. AI assists with planning, preparation, analysis and execution where permitted. Every consequential action remains authenticated, authorized and traceable.

## System boundaries

- Portal is the Central Admin platform.
- Supabase is the central data and authentication source of truth.
- Supabase Auth `app_metadata.role` is the RBAC source of truth.
- `AdminGuard` is the protected route boundary.
- Portal API is the browser-to-server execution boundary.
- AI never accesses SQL directly and never bypasses Portal API, RBAC or policy checks.
- `NaiBossZer/Facility-Safety` is a separate system and is not modified by this feature map.
- AI Facility is deferred to a future integration track.
- AI Media is not a separate domain; media belongs inside each Activity workspace.
- AI Self-QA and AI-Native Admin are intentionally excluded; operational QA and final admin decisions remain human responsibilities.

## Feature domains

### CORE

1. **Dashboard**
   - Executive KPI overview
   - Satisfaction and evaluation insight
   - Activity outcome overview
   - Post-event activity photo gallery
   - Global filters
   - Empty/loading/error states

2. **AI Command Center**
   - Natural-language intent capture
   - Context-aware commands
   - Quick actions
   - Link to work queue, execution and history
   - Permission-aware AI entry point

### OPERATIONS

3. **Activities Management**
   - Activity list/search/filter
   - Create/edit/publish/archive
   - Activity information
   - Activity objectives/process/outcomes
   - Activity cover and post-event photos
   - Learning Center relationship
   - Organization relationship
   - Survey relationship

4. **Activity Occurrences**
   - One Activity → many Occurrences
   - Scheduled/ongoing/completed/cancelled/archived lifecycle
   - Per-occurrence location/date/organizer/participant context
   - Cancelled occurrences hidden from normal views but retained for history/audit

5. **Activity Photos**
   - Managed inside Activity/Occurrence workspace
   - Cover image and post-event images
   - Supabase Storage as file source of truth
   - Database stores references/metadata

6. **Survey Management**
   - Survey list
   - Create/edit/publish/archive
   - Anonymous/Identified mode
   - Open/close window
   - Survey-to-Activity/Occurrence relationship

7. **Survey Question Builder**
   - Dynamic sections/questions
   - 5-level rating scale support
   - Required/optional questions
   - Ordering
   - Question types/options
   - No hard-coded production question schema

8. **Survey Responses**
   - Response list
   - Identified/anonymous handling
   - Respondent data only when actually collected
   - Per-question answers
   - Comments/feedback
   - Historical response preservation

9. **Survey Analytics**
   - Average score
   - Satisfaction percentage
   - Respondent count
   - Evaluated activity count
   - Category/topic scores
   - Activity and occurrence drill-down
   - No response/no survey is not treated as score zero

10. **Learning Centers**
    - Learning Center list
    - Create/edit/publish/archive
    - Detail view
    - Activity relationships
    - Content relationships

11. **Organizations**
    - Parent/child organization structure
    - Organization metadata
    - Activity/survey respondent relationships

12. **CMS / Content**
    - Managed content
    - Draft/publish/archive lifecycle
    - Public website content blocks
    - Navigation/content relationships

13. **Partners / Network**
    - Partner records
    - Logo/media reference
    - Public presentation metadata
    - Archive lifecycle

14. **Analytics / Reports**
    - Operational reporting
    - Exportable views
    - Activity/survey aggregation
    - Executive reporting surfaces

15. **Global Search**
    - Search activities, occurrences, surveys, learning centers, organizations and content
    - Permission-aware result scope

16. **Notifications**
    - Admin task notifications
    - Approval requests
    - AI workflow updates
    - Important system notices

### AI WORKSPACE

17. **AI Work Queue**
    - Running work
    - Approval-required work
    - Needs-data work
    - Failed/recoverable work
    - No fake execution records

18. **AI Plan / Live Execution**
    - Intent
    - Context
    - Permission decision
    - Plan steps
    - Tool execution
    - Verification result

19. **AI Approval / Confirmation**
    - Reusable approval gate
    - Risk-aware confirmation
    - Clear impact summary
    - Explicit admin decision

20. **AI Execution History**
    - Completed AI workflows
    - Inputs/context references
    - Tools/actions used
    - Results
    - Audit linkage

21. **AI Activity Agent**
    - Document ingestion
    - Document completeness: `FOUND` / `NOT FOUND` only
    - Create/update Activity drafts
    - Detect duplicate candidates
    - Create Occurrence structures
    - Prepare survey drafts
    - Summarize outcomes

22. **AI Survey Agent**
    - Generate question drafts from activity context
    - Build sections
    - Detect duplicate/ambiguous questions
    - Prepare survey preview
    - Analyze responses and feedback
    - Never publish without the required governance decision

23. **AI Learning Center + CMS Agent**
    - Prepare structured content
    - Map activities to learning centers
    - Draft public-facing content
    - Reuse approved content context

24. **AI Analytics Agent**
    - Query approved analytics through tools
    - Explain KPI movement
    - Summarize trends and anomalies
    - Read/explain only unless an explicit governed action is introduced later

### GOVERNANCE

25. **Admin / User Management**
    - Admin identity visibility
    - Role assignment workflow
    - Account lifecycle
    - No duplicate admin identity system

26. **RBAC / Permissions**
    - `SUPER_ADMIN`
    - `CONTENT_ADMIN`
    - `OPERATIONS_ADMIN`
    - `FACILITY_ADMIN`
    - Permission-driven navigation and actions
    - Server-side authorization required

27. **Audit Trail**
    - System-wide append-only important-change log
    - Survey/activity/occurrence/learning-center/organization/RBAC/admin actions
    - Privacy-sensitive and high-risk data access where required
    - AI action linkage
    - Not used for satisfaction calculation

28. **Data Lifecycle**
    - Active → Archived → Retired
    - Preserve historical records
    - No hard delete where historical survey/response relationships exist
    - Cancelled is a business state, hidden from normal operational views but retained for audit/history

29. **System Administration**
    - System configuration
    - Integration configuration
    - Operational health information
    - Policy/configuration management

## AI orchestration contract

```text
Admin Intent
  ↓
Context Collection
  ↓
Authentication
  ↓
AdminGuard
  ↓
RBAC / Permission
  ↓
Policy + Risk
  ↓
AI Plan
  ↓
Approval (when required)
  ↓
AI Tool Registry
  ↓
Portal API
  ↓
Supabase / Storage
  ↓
Verification
  ↓
Result
  ↓
Audit Trail
```

## Domain data model direction

```text
Activity
  ├── Occurrence (1:N)
  │     ├── Survey (0:1 or 1:1 depending on business rule)
  │     └── Responses (1:N)
  ├── Learning Centers (N:M)
  ├── Organizers (N:M)
  ├── Organizations (relationships as required)
  └── Media references

Survey
  ├── Sections
  │    └── Questions
  └── Answers / Responses

Organization
  └── Parent → Child hierarchy
```

## UX navigation target

```text
CORE
  Dashboard
  AI Command Center

OPERATIONS
  Activities
  Surveys
  Learning Centers
  Organizations
  Content / CMS
  Partners

INSIGHTS
  Analytics
  Reports

AI WORKSPACE
  Work Queue
  Execution
  History

GOVERNANCE
  Admin Users
  Permissions
  Audit Trail
  System Settings
```

## Implementation sequence

### Phase 0 — Architecture Baseline
Auth, AdminGuard, RBAC, API boundary, central Supabase, data/policy boundaries.

### Phase 1 — Admin Design System
Shared shell, navigation, filters, tables, forms, cards, drawers, dialogs, empty/loading/error states and AI workspace primitives.

### Phase 2 — Domain Architecture
Normalize Activity, Occurrence, Learning Center, Organization, Survey, Question, Response, Content, Partner and lifecycle contracts.

### Phase 3 — Portal API + AI Tool Registry
Create typed server-side domain tools. AI calls tools; tools call Portal API/data services. No direct SQL from AI.

### Phase 4 — AI Admin Manager
Intent → context → permission → plan → risk → approval → execution → verification → result → audit.

### Phase 5 — Activity Vertical Slice
Activity management + Occurrences + photos + organizations/learning centers + AI Activity Agent.

### Phase 6 — Survey Vertical Slice
Survey management + Question Builder + Responses + Analytics + AI Survey Agent.

### Phase 7 — Learning Center + CMS
Learning Center management, public content management and AI content assistance.

### Phase 8 — Analytics + Reports
Executive reporting, filters, exports and AI analytics explanations.

### Phase 9 — Governance + Audit
Admin management, permissions, lifecycle enforcement and system-wide audit trail.

### Future — Facility Integration
Integrate with the existing Facility Safety system later. Do not modify or merge its internal architecture as part of this roadmap.

## Definition of done for the platform

- Admin can manage core operational data without Excel as a source of truth.
- Surveys and questions are data-driven rather than hard-coded.
- Images are stored in object storage with database references.
- Activity occurrences are first-class records.
- Historical records are preserved.
- Server-side RBAC protects every management action.
- AI reduces repetitive admin work without bypassing governance.
- AI actions are traceable.
- Public Portal and Central Admin share one identity boundary.
- Stitch remains a UX/design reference; production behavior lives in the Portal React/API architecture.
