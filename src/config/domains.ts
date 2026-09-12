export const PORTAL_DOMAINS = {
  core: {
    id: "core",
    label: "Portal Core",
    purpose: "Identity, access, master data and platform services shared by every domain.",
    features: [
      "authentication",
      "rbac",
      "admin-users",
      "organizations",
      "audit-trail",
      "data-lifecycle",
      "global-search",
      "notifications",
      "system-settings",
    ],
  },
  activities: {
    id: "activities",
    label: "Programs & Activities",
    purpose: "Manage activities as the primary operational unit and their occurrences, relations and media.",
    features: [
      "activities",
      "activity-occurrences",
      "activity-photos",
      "activity-relations",
      "activity-lifecycle",
    ],
  },
  learning: {
    id: "learning",
    label: "Learning & Content",
    purpose: "Manage learning centers and public-facing content/resources as one content domain.",
    features: ["learning-centers", "cms", "partners", "content-media"],
  },
  engagement: {
    id: "engagement",
    label: "Engagement & Insights",
    purpose: "Capture engagement through surveys and turn normalized responses into analytics and reports.",
    features: [
      "surveys",
      "survey-question-builder",
      "survey-responses",
      "survey-analytics",
      "analytics",
      "reports",
    ],
  },
  ai: {
    id: "ai",
    label: "AI Workspace",
    purpose: "Governed AI orchestration over Portal APIs; never a direct database boundary.",
    features: [
      "ai-manager",
      "ai-agents",
      "ai-tool-registry",
      "ai-work-queue",
      "ai-execution",
      "ai-approval",
      "ai-history",
    ],
  },
} as const;

export type PortalDomainId = keyof typeof PORTAL_DOMAINS;
export const PORTAL_DOMAIN_ORDER: readonly PortalDomainId[] = [
  "core",
  "activities",
  "learning",
  "engagement",
  "ai",
];
