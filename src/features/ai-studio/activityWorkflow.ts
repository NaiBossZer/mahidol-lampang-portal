export const ACTIVITY_WORKFLOW_STEPS = [
  { id: 1, title: "Activity Brief", subtitle: "บริบทกิจกรรม" },
  { id: 2, title: "AI Analysis", subtitle: "วิเคราะห์ข้อมูล" },
  { id: 3, title: "AI Survey", subtitle: "สร้างแบบประเมิน" },
  { id: 4, title: "Admin Review", subtitle: "ทวนสอบ" },
  { id: 5, title: "Confirm", subtitle: "ยืนยัน" },
] as const;

export type ActivityWorkflowStepId = (typeof ACTIVITY_WORKFLOW_STEPS)[number]["id"];

export const ACTIVITY_STATUS_LABELS = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
} as const;

export type ActivityLifecycleStatus = keyof typeof ACTIVITY_STATUS_LABELS;

export function isActivityWorkflowStep(value: number): value is ActivityWorkflowStepId {
  return Number.isInteger(value) && value >= 1 && value <= ACTIVITY_WORKFLOW_STEPS.length;
}

export function canAdvanceActivityWorkflow(
  step: ActivityWorkflowStepId,
  state: {
    activityReady?: boolean;
    analysisReady?: boolean;
    surveyReady?: boolean;
    reviewReady?: boolean;
  },
) {
  switch (step) {
    case 1:
      return Boolean(state.activityReady);
    case 2:
      return Boolean(state.analysisReady);
    case 3:
      return Boolean(state.surveyReady);
    case 4:
      return Boolean(state.reviewReady);
    case 5:
      return true;
    default:
      return false;
  }
}
