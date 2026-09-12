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
      "learning-centers",
      "audit-trail",
      "data-lifecycle",
      "global-search",
      "notifications",
      "system-settings",
      "cms",
      "content-media",
    ],
  },
  activities: {
    id: "activities",
    label: "กิจกรรม",
    purpose: "Manage activities as the primary operational unit, including occurrences, learning-center selection, organizers and media.",
    features: ["activities", "activity-occurrences", "activity-lifecycle", "activity-photos", "activity-relations"],
  },
  engagement: {
    id: "engagement",
    label: "Engagement & Insights",
    purpose: "Capture engagement through surveys and turn normalized responses into analytics and reports.",
    features: ["surveys", "survey-question-builder", "survey-responses", "survey-analytics", "analytics", "reports"],
  },
  ai: {
    id: "ai",
    label: "AI Workspace",
    purpose: "Governed AI orchestration over Portal APIs; never a direct database boundary.",
    features: ["ai-manager", "ai-agents", "ai-tool-registry", "ai-work-queue", "ai-execution", "ai-approval", "ai-history"],
  },
} as const;

export type PortalDomainId = keyof typeof PORTAL_DOMAINS;
export const PORTAL_DOMAIN_ORDER: readonly PortalDomainId[] = ["core", "activities", "engagement", "ai"];
