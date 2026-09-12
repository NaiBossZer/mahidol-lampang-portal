import type { AdminPermission } from "@/auth/permissions";

export type AdminFeatureArea = "core" | "operations" | "insights" | "ai" | "governance";
export type AdminFeatureStatus = "foundation" | "planned" | "future";

export interface AdminFeatureDefinition {
  id: string;
  label: string;
  area: AdminFeatureArea;
  status: AdminFeatureStatus;
  route?: string;
  permission?: AdminPermission;
  children?: readonly string[];
}

export const ADMIN_FEATURES: readonly AdminFeatureDefinition[] = [
  { id: "dashboard", label: "Dashboard", area: "core", status: "foundation", route: "/dashboard", permission: "overview.read" },
  { id: "ai-command-center", label: "ศูนย์สั่งการอัจฉริยะ", area: "ai", status: "foundation", route: "/admin/ai", permission: "ai.command.read" },
  { id: "activities", label: "กิจกรรม", area: "operations", status: "foundation", route: "/admin/activities", permission: "activities.read", children: ["activity-occurrences", "activity-photos"] },
  { id: "activity-occurrences", label: "กิจกรรมที่จัดจริง", area: "operations", status: "foundation", route: "/admin/activities/occurrences", permission: "activities.read" },
  { id: "activity-photos", label: "ภาพกิจกรรม", area: "operations", status: "foundation", permission: "activities.read" },
  { id: "surveys", label: "แบบสอบถาม", area: "operations", status: "planned", permission: "activities.read", children: ["survey-question-builder", "survey-responses", "survey-analytics"] },
  { id: "survey-question-builder", label: "ตัวสร้างคำถาม", area: "operations", status: "planned", permission: "activities.update" },
  { id: "survey-responses", label: "คำตอบแบบสอบถาม", area: "operations", status: "planned", permission: "survey.audit.read" },
  { id: "survey-analytics", label: "วิเคราะห์แบบสอบถาม", area: "insights", status: "foundation", permission: "survey.audit.read" },
  { id: "learning-centers", label: "Learning Centers", area: "operations", status: "foundation", route: "/admin/learning-centers", permission: "learning_centers.read" },
  { id: "organizations", label: "Organizations", area: "operations", status: "planned", permission: "overview.read" },
  { id: "cms", label: "Content / CMS", area: "operations", status: "foundation", route: "/admin/cms", permission: "cms.read" },
  { id: "partners", label: "Partners", area: "operations", status: "planned", permission: "partners.read" },
  { id: "analytics", label: "Analytics", area: "insights", status: "foundation", route: "/admin/analytics", permission: "overview.read" },
  { id: "reports", label: "Reports", area: "insights", status: "planned", permission: "overview.read" },
  { id: "global-search", label: "Global Search", area: "core", status: "planned", permission: "overview.read" },
  { id: "notifications", label: "Notifications", area: "core", status: "planned", permission: "overview.read" },
  { id: "ai-work-queue", label: "AI Work Queue", area: "ai", status: "foundation", route: "/admin/ai/work-queue", permission: "ai.queue.read" },
  { id: "ai-execution", label: "AI Execution", area: "ai", status: "foundation", route: "/admin/ai/execution", permission: "ai.execution.read" },
  { id: "ai-approval", label: "AI Approval", area: "ai", status: "foundation", route: "/admin/ai/approval", permission: "ai.approval.read" },
  { id: "ai-history", label: "AI History", area: "ai", status: "foundation", route: "/admin/ai/history", permission: "ai.execution.read" },
  { id: "ai-activity-agent", label: "AI Activity Agent", area: "ai", status: "planned", permission: "ai.command.read" },
  { id: "ai-survey-agent", label: "AI Survey Agent", area: "ai", status: "planned", permission: "ai.command.read" },
  { id: "ai-content-agent", label: "AI Learning Center + CMS Agent", area: "ai", status: "planned", permission: "ai.command.read" },
  { id: "ai-analytics-agent", label: "AI Analytics Agent", area: "ai", status: "planned", permission: "ai.command.read" },
  { id: "admin-users", label: "Admin Users", area: "governance", status: "planned", permission: "system.manage" },
  { id: "permissions", label: "Permissions", area: "governance", status: "foundation", permission: "system.manage" },
  { id: "audit-trail", label: "Audit Trail", area: "governance", status: "planned", permission: "system.read" },
  { id: "data-lifecycle", label: "Data Lifecycle", area: "governance", status: "planned", permission: "system.manage" },
  { id: "system-settings", label: "System Settings", area: "governance", status: "foundation", route: "/admin/settings", permission: "system.read" },
  { id: "facility-future", label: "Facility Integration", area: "governance", status: "future", permission: "facility.read" },
];

export function adminFeaturesForArea(area: AdminFeatureArea) {
  return ADMIN_FEATURES.filter((feature) => feature.area === area);
}
