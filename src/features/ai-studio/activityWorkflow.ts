export const AI_STUDIO_WORKFLOW_STEPS = [
  { id: 1, title: "Activity Brief", subtitle: "บริบทกิจกรรม", phase: 1 },
  { id: 2, title: "AI Analysis", subtitle: "วิเคราะห์ข้อมูล", phase: 1 },
  { id: 3, title: "AI Survey", subtitle: "สร้างแบบประเมิน", phase: 1 },
  { id: 4, title: "Admin Review", subtitle: "ทวนสอบ", phase: 1 },
  { id: 5, title: "Confirm", subtitle: "ยืนยัน", phase: 1 },
  { id: 6, title: "Outcome Capture", subtitle: "รวบรวมผลจริง", phase: 2 },
  { id: 7, title: "AI Outcome Report", subtitle: "สังเคราะห์รายงาน", phase: 2 },
  { id: 8, title: "Publish Review", subtitle: "ตรวจสอบก่อนเผยแพร่", phase: 2 },
  { id: 9, title: "Publish & Close", subtitle: "เผยแพร่และปิดงาน", phase: 2 },
] as const;

export const ACTIVITY_WORKFLOW_STEPS = AI_STUDIO_WORKFLOW_STEPS.filter(
  (step) => step.phase === 1,
);

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
