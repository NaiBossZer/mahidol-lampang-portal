# Mahidol Lampang Portal — AI Studio Architecture Contract

## 1. Purpose

This document defines the Phase 1 architecture contract for AI Studio on the `feature/complete-ai-workspace` branch.

AI Studio is the central administrative UX/control plane for activity, survey, AI, outcome, governance, document, and system workflows. It is an orchestration and workspace layer; it is not a replacement database, a second authentication system, or a monolithic business-logic container.

The Executive Dashboard remains a separate executive read/overview experience and is explicitly outside the AI Studio refactor scope.

---

## 2. Architectural Decision

Target architecture:

```text
AdminGuard / AdminAppShell
        |
        +-------------------------------+
        |                               |
        v                               v
Executive Dashboard                AI Studio
(read / KPI / overview)             (control plane)
                                        |
             +--------------------------+--------------------------+
             |            |             |            |              |
          Workflow     Assistant     Documents    Survey        Governance
             |            |             |            |              |
             +------------+-------------+------------+--------------+
                                        |
                                  Existing Services
                                        |
                                  Existing APIs
                                        |
                                     Supabase
```

AI Studio must coordinate these capabilities without creating a competing source of truth.

---

## 3. Current-State Route Contract

The current branch contains the following relevant administrative entry points.

### Primary AI Studio entry point

```text
/admin/ai-studio-workspace
```

This route is protected by the existing `ProtectedRoute` / `AdminGuard` boundary and renders `AIStudioUnifiedWorkspacePage`.

### Current workflow implementation routes

```text
/admin/ai-studio-workspace/phase-1
    -> AIStudioWorkspacePage

/admin/ai-studio-workspace/phase-2
    -> AIStudioOutcomeWorkspacePage

/admin/activities/create
    -> ActivitySurveyStudioPage

/admin/survey-workflow
    -> ActivitySurveyStudioPage
```

### Existing supporting admin routes

```text
/admin/activities
/admin/activities/occurrences
/admin/activities/photos
/admin/activities/relations
/admin/surveys
/admin/surveys/analytics
/admin/surveys/response
/admin/organizations
/admin/audit-trail
/admin/analytics
/admin/governance
/admin/settings
/admin/cms
/admin/facility-safety
/admin/ai
/admin/ai/improvement
/admin/ai/work-queue
/admin/ai/execution
/admin/ai/approval
/admin/ai/history
```

These routes remain part of the compatibility surface during the migration. They are not to be deleted merely because AI Studio becomes the primary workspace.

---

## 4. Current-State AI Studio Composition

`AIStudioUnifiedWorkspacePage` currently provides:

- a 9-step visual workflow rail;
- permission-filtered module navigation;
- workflow selection for steps 1–5;
- workflow selection for steps 6–9;
- documents module;
- AI Assistant module;
- access module;
- notifications/governance module;
- system settings module.

The current implementation delegates the actual workflow/module content to existing page-level implementations.

This is accepted as the Phase 1 baseline, but it is not the final architecture.

The main architectural debt identified for Phase 2/3 is duplicated workflow implementation, especially the Activity + Survey workflow currently represented by both:

```text
ActivitySurveyStudioPage
AIStudioWorkspacePage
```

The outcome workflow is separately represented by:

```text
AIStudioOutcomeWorkspacePage
```

Phase 1 therefore establishes the contract without prematurely deleting these implementations.

---

## 5. Canonical 9-Step Workflow Contract

AI Studio owns one conceptual workflow consisting of nine steps:

```text
1. Activity Brief
2. AI Analysis
3. AI Survey
4. Admin Review
5. Confirm
6. Outcome Capture
7. AI Outcome Report
8. Publish Review
9. Publish & Close
```

The implementation may be split into maintainable modules, but the workflow state model must have one source of truth after consolidation.

### Phase 1

```text
Activity Brief
    -> AI Analysis
    -> AI Survey
    -> Admin Review
    -> Confirm
```

### Phase 2

```text
Outcome Capture
    -> AI Outcome Report
    -> Publish Review
    -> Publish & Close
```

The terms `Phase 1` and `Phase 2` refer to workflow grouping only. They must not become competing workflow engines.

---

## 6. Activity Status Contract

Activity lifecycle status is fixed and must not be expanded by the AI Studio refactor.

UI terminology:

```text
Draft
Published
Archived
```

Database values:

```text
draft
published
archived
```

The following values are explicitly forbidden for Activity lifecycle status:

```text
scheduled
ongoing
completed
cancelled
retired
```

Occurrence status is a separate domain and must not be mixed with Activity status.

---

## 7. Responsibility Boundaries

### AI Studio Shell

Responsible for:

- workspace context;
- module navigation;
- workflow navigation;
- high-level orchestration;
- permission-aware visibility;
- workspace-level status/context presentation.

Not responsible for:

- direct database credentials;
- duplicating API implementations;
- implementing every business rule inside one component;
- replacing existing server-side authorization.

### Workflow Modules

Responsible for:

- presenting the relevant workflow step;
- collecting user input;
- invoking existing services/actions;
- displaying workflow state and validation;
- requesting transitions through the established application boundaries.

### Services / APIs

Remain responsible for:

- business operations;
- persistence;
- server-side authorization;
- AI execution integration;
- survey/activity data operations;
- Supabase access.

### Supabase

Remains the central persistence/source-of-truth layer.

No second administrative database may be introduced.

---

## 8. Permission Contract

AI Studio must preserve the existing permission model.

Frontend permission checks control module visibility and UX.

Server-side authorization remains authoritative.

The current unified workspace already filters modules using the existing `useAdminAuth()` role/permission context and `AdminPermission` values. Future extraction must preserve that behavior rather than introducing a parallel permission system.

The AI Studio refactor must not weaken `AdminGuard`, `/api/auth/me`, or server-side `isAdmin`/permission checks.

---

## 9. Data Contract

AI Studio consumes existing canonical application data through existing services/APIs.

The refactor must not introduce duplicate activity identity, duplicate survey identity, or duplicate administrative state.

The existing central architecture remains authoritative:

```text
Portal Admin
    -> canonical activity identity
    -> survey / outcome / AI operations
    -> central Supabase data
```

Legacy database fields must not be reintroduced simply to support an old page implementation.

---

## 10. Migration Rules

Migration must occur incrementally.

### Rule A — Consolidate before deleting

Existing workflow implementations remain available until the replacement workflow has passed functional verification.

### Rule B — Preserve compatibility

Legacy routes may remain temporarily. Once the canonical AI Studio workflow is proven, legacy routes can redirect to the corresponding AI Studio context.

### Rule C — Extract, do not duplicate

New AI Studio modules should reuse existing services, types, API contracts, and shared UI primitives where appropriate.

### Rule D — No God Component

`AIStudioUnifiedWorkspacePage` must evolve toward a shell/orchestrator role. Business logic should be extracted into workflow/module components and existing service boundaries.

### Rule E — Dashboard isolation

The Executive Dashboard is outside this refactor. Do not redesign, restructure, or change its visual behavior as part of AI Studio migration.

---

## 11. Target Module Map

```text
AI Studio
|
+-- Workflow
|   +-- Activity Brief
|   +-- AI Analysis
|   +-- AI Survey
|   +-- Admin Review
|   +-- Confirm
|   +-- Outcome Capture
|   +-- AI Outcome Report
|   +-- Publish Review
|   +-- Publish & Close
|
+-- AI Assistant
|   +-- Command
|   +-- Queue
|   +-- Execution
|   +-- Approval
|   +-- History
|
+-- Documents
|
+-- Survey
|   +-- Questions
|   +-- Responses
|   +-- Analytics
|
+-- Governance
|   +-- Access
|   +-- Notifications
|   +-- Audit
|
+-- System
    +-- Organizations
    +-- Settings
```

This is a target information architecture, not permission to create duplicate pages for every item.

---

## 12. Phase 1 Acceptance Criteria

Phase 1 is complete when the following are true:

- AI Studio is formally defined as the administrative control plane.
- Current routes and workflow ownership are documented.
- The 9-step workflow is defined as one conceptual workflow.
- Activity lifecycle status is explicitly constrained to Draft/Published/Archived.
- Existing authentication and permission boundaries are preserved.
- Supabase remains the source of truth.
- Dashboard isolation is explicit.
- Existing workflow implementations are preserved for the consolidation phases.
- Phase 2 has a clear mandate to consolidate the duplicated Activity + Survey workflow.
- No database migration is required solely to establish this architecture contract.

---

## 13. Next Implementation Phase

Phase 2 begins with consolidation of workflow steps 1–5.

Primary objective:

```text
ActivitySurveyStudioPage
          +
AIStudioWorkspacePage
          |
          v
Canonical AI Studio Activity Workflow
```

The canonical workflow must preserve existing Activity CRUD, AI analysis, survey generation, review, confirmation, permissions, and API behavior.

Only after that workflow is verified should legacy implementations be removed or converted to compatibility routes.
