# Mahidol Lampang Central Admin — AI Production UX

## Status

Production UX baseline for the Autonomous AI Workspace. Stitch is the design reference; Portal architecture remains the production source of truth.

## Principles

- ZERO UNNECESSARY ADMIN WORK.
- AI works; Admin decides.
- One intent should become one traceable workflow.
- AI never bypasses Supabase Auth, AdminGuard, RBAC, Portal API, or policy checks.
- AI never writes SQL directly.
- No confidence score is used for document completeness. Document fields are only `FOUND` or `NOT FOUND`.
- No fake execution data is shown as real production history.
- Facility AI remains deferred and `NaiBossZer/Facility-Safety` is out of scope.
- AI Media is not a separate domain; media remains inside each domain workflow.

## Production Workspace

```text
AdminAppShell
└── AI Workspace
    ├── Command Center       /admin/ai
    ├── Work Queue           /admin/ai/work-queue
    ├── Plan / Execution     /admin/ai/execution
    ├── Approval             /admin/ai/approval
    └── Execution History    /admin/ai/history
```

## Shared UI Components

- `AICommandBar` — captures a user intent and provides the primary AI entry point.
- `AIWorkQueue` — renders real AI work items by lifecycle state.
- `AIExecutionPlan` — renders execution steps and verification state.
- `AIApprovalDialog` — reusable human approval boundary for high-impact actions.
- `AIAccessGuard` — client-side route/UI gate using the existing AdminGuard permission context.

Client-side permission gating is UX protection only. Production mutations and AI tools must enforce authorization again at the server/API boundary.

## Permission Model

AI Workspace permissions are explicit:

- `ai.command.read`
- `ai.queue.read`
- `ai.execution.read`
- `ai.approval.read`

They are mapped to the existing four admin roles and are not a replacement for domain permissions such as `activities.create` or `cms.publish`.

## AI Request Lifecycle

```text
Intent
  ↓
Context
  ↓
AdminGuard / RBAC
  ↓
Policy + risk evaluation
  ↓
Plan
  ↓
Approval when required
  ↓
Tool Registry / Portal API
  ↓
Verification
  ↓
Result
  ↓
Audit Trail
```

## Stitch Integration Rule

Use Stitch for:

- information architecture
- layout patterns
- interaction patterns
- component behavior
- visual hierarchy
- workflow visualization

Do not copy Stitch `code.html` into production. Rebuild the approved UX using the existing React/TypeScript Portal design system, shared components, API layer, Auth, RBAC, and Supabase architecture.
