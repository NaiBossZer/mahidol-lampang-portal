# AI Studio Phase 3 — Outcome Workflow Consolidation

## Scope

Phase 3 consolidates AI Studio Workflow 6–9 into a canonical outcome-workflow contract while preserving the existing outcome implementation and API/data boundaries.

## Canonical workflow

| Step | ID | Purpose |
|---|---:|---|
| Outcome Capture | 6 | Collect real participation, outcome and post-event evidence |
| AI Outcome Report | 7 | Synthesize a report from activity data and evidence |
| Publish Review | 8 | Human/admin verification of narrative, metrics, media and PDPA |
| Publish & Close | 9 | Confirm publication and close the workflow |

The canonical step definitions are derived from `AI_STUDIO_WORKFLOW_STEPS` in `src/features/ai-studio/activityWorkflow.ts` through `OUTCOME_WORKFLOW_STEPS` in `src/features/ai-studio/outcomeWorkflow.ts`.

## Contract rules

- AI is an assistant for synthesis; it does not invent or decide outcome numbers.
- Human/Admin review remains a required gate before publication.
- Activity lifecycle remains exactly `Draft`, `Published`, `Archived`.
- Supabase remains the source of truth.
- Existing API/service boundaries are retained.
- Dashboard UI and its layout are out of scope and must not be changed.

## Readiness gates

- Step 6 requires outcome evidence/readiness.
- Step 7 requires an AI report or report content before moving to review.
- Step 8 requires all admin review checks before publication.
- Step 9 is the publication/close state and reports the published activity state.

## Implementation status

- [x] Canonical outcome step contract created.
- [x] Outcome step IDs centralized.
- [x] Outcome readiness contract defined.
- [x] Outcome progress helper defined.
- [x] Existing outcome workflow behavior preserved.
- [ ] Full browser E2E verification of steps 6–9.
- [ ] Remove the remaining local step definition from the legacy outcome page after E2E verification.

The final two items intentionally remain open until runtime verification proves that the migration does not regress evidence upload, AI synthesis, review gates, draft saving, or publication.
