# AI Studio Phase 2 — Workflow 1–5 Consolidation

## Scope

Phase 2 establishes one canonical contract for the Activity + AI Survey workflow:

1. Activity Brief
2. AI Analysis
3. AI Survey
4. Admin Review
5. Confirm

## Canonical contract

The workflow step definition is centralized in:

`src/features/ai-studio/activityWorkflow.ts`

The same module also owns the Activity lifecycle vocabulary:

- `draft` → Draft
- `published` → Published
- `archived` → Archived

No additional Activity lifecycle status is permitted.

## Runtime owner

`AIStudioUnifiedWorkspacePage` is the AI Studio control-plane entry point.

For Workflow steps 1–5, the existing production workflow implementation remains behind the unified workspace through `AIStudioWorkspacePage`. This preserves the current working API/service behavior while the workflow state and step contract are being consolidated.

## Why the legacy create page is not deleted in Phase 2

`ActivitySurveyStudioPage` contains the legacy activity-creation surface and is still a compatibility implementation. It is intentionally retained until the canonical workflow can absorb its creation-specific behavior without losing CRUD or AI workflow functionality.

Deleting it now would risk removing activity creation behavior before the replacement is proven end-to-end.

Its migration belongs to the later consolidation/migration stage, after the canonical workflow has passed E2E verification.

## Consolidation rules

- AI Studio owns workflow orchestration.
- Existing service/API functions remain the integration boundary.
- Supabase remains the source of truth.
- Activity lifecycle remains Draft / Published / Archived.
- Occurrence status remains separate from Activity status.
- Dashboard is outside this workflow and must remain unchanged.
- Legacy implementations must not introduce new business rules.

## Phase 2 acceptance criteria

- [x] Canonical Workflow 1–5 step contract exists.
- [x] Unified AI Studio consumes the canonical workflow contract.
- [x] Activity lifecycle vocabulary is centralized.
- [x] Existing workflow implementation remains functional and is not duplicated by a new implementation.
- [x] No database schema change.
- [x] No Dashboard change.
- [x] No Activity status expansion.
- [ ] Full E2E verification of creation + analysis + survey + review + confirm.
- [ ] Removal/migration of the legacy creation implementation after E2E proof.

The remaining unchecked items are deliberately deferred to the E2E/migration stages rather than being guessed or removed prematurely.
