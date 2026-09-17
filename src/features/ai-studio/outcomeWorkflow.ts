import { AI_STUDIO_WORKFLOW_STEPS } from "./activityWorkflow";

export const OUTCOME_WORKFLOW_STEPS = AI_STUDIO_WORKFLOW_STEPS.filter(
  (step) => step.phase === 2,
);

export type OutcomeWorkflowStepId = (typeof OUTCOME_WORKFLOW_STEPS)[number]["id"];

export const OUTCOME_STEP_IDS = {
  capture: 6,
  report: 7,
  review: 8,
  publish: 9,
} as const satisfies Record<string, OutcomeWorkflowStepId>;

export type OutcomeWorkflowState = {
  outcomeReady?: boolean;
  reportReady?: boolean;
  reviewReady?: boolean;
  published?: boolean;
};

export function isOutcomeWorkflowStep(value: number): value is OutcomeWorkflowStepId {
  return OUTCOME_WORKFLOW_STEPS.some((step) => step.id === value);
}

export function canAdvanceOutcomeWorkflow(
  step: OutcomeWorkflowStepId,
  state: OutcomeWorkflowState,
) {
  switch (step) {
    case OUTCOME_STEP_IDS.capture:
      return Boolean(state.outcomeReady);
    case OUTCOME_STEP_IDS.report:
      return Boolean(state.reportReady);
    case OUTCOME_STEP_IDS.review:
      return Boolean(state.reviewReady);
    case OUTCOME_STEP_IDS.publish:
      return Boolean(state.published);
    default:
      return false;
  }
}

export function getOutcomeWorkflowProgress(
  state: OutcomeWorkflowState,
) {
  return OUTCOME_WORKFLOW_STEPS.map((step) => ({
    ...step,
    complete: canAdvanceOutcomeWorkflow(step.id, state),
  }));
}
