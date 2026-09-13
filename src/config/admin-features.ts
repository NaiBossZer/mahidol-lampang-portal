import type { AdminPermission } from "@/auth/permissions";
import type { PortalDomainId } from "./domains";

export type AdminFeatureArea = PortalDomainId;
export type AdminFeatureStatus = "foundation" | "planned" | "future";
export interface AdminFeatureDefinition { id: string; label: string; area: AdminFeatureArea; status: AdminFeatureStatus; route?: string; permission?: AdminPermission; children?: readonly string[]; presentation?: boolean; }

export const ADMIN_FEATURES: readonly AdminFeatureDefinition[] = [
  { id: "dashboard", label: "Dashboard", area: "core", status: "foundation", route: "/dashboard", permission: "overview.read", presentation: true },

  // Domain 2 — กิจกรรม: one operational entry point; related data is managed inside the activity.
  { id: "activities", label: "กิจกรรม", area: "activities", status: "foundation", route: "/admin/activities", permission: "activities.read", children: ["activity-occurrences", "activity-photos", "activity-relations"] },
  { id: "activity-occurrences", label: "รอบการจัดกิจกรรม", area: "activities", status: "foundation", route: "/admin/activities/occurrences", permission: "activities.read" },
  { id: "activity-photos", label: "รูปภาพกิจกรรม", area: "activities", status: "foundation", permission: "activities.read" },
  { id: "activity-relations", label: "ข้อมูลที่เกี่ยวข้องของกิจกรรม", area: "activities", status: "foundation", permission: "activities.read" },

  // Domain 3 — Engagement & Insights
  { id: "surveys", label: "แบบสอบถาม", area: "engagement", status: "foundation", route: "/admin/surveys", permission: "survey.read", children: ["survey-question-builder", "survey-responses", "survey-analytics"] },
  { id: "survey-question-builder", label: "ตัวสร้างคำถาม", area: "engagement", status: "foundation", permission: "survey.create" },
  { id: "survey-responses", label: "คำตอบแบบสอบถาม", area: "engagement", status: "foundation", route: "/admin/surveys/response", permission: "survey.audit.read" },
  { id: "survey-analytics", label: "วิเคราะห์แบบสอบถาม", area: "engagement", status: "foundation", route: "/admin/surveys/analytics", permission: "survey.audit.read" },
  { id: "analytics", label: "Analytics", area: "engagement", status: "foundation", route: "/admin/analytics", permission: "overview.read" },
  { id: "reports", label: "Reports", area: "engagement", status: "foundation", route: "/admin/governance?tab=reports", permission: "overview.read" },

  // Domain 4 — AI Workspace
  { id: "ai-command-center", label: "ศูนย์สั่งการอัจฉริยะ", area: "ai", status: "foundation", route: "/admin/ai", permission: "ai.command.read" },
  { id: "ai-manager", label: "AI Manager", area: "ai", status: "foundation", route: "/admin/governance?tab=ai", permission: "ai.command.read" },
  { id: "ai-tool-registry", label: "AI Tool Registry", area: "ai", status: "foundation", route: "/admin/governance?tab=ai", permission: "ai.command.read" },
  { id: "ai-work-queue", label: "AI Work Queue", area: "ai", status: "foundation", route: "/admin/ai/work-queue", permission: "ai.queue.read" },
  { id: "ai-execution", label: "AI Execution", area: "ai", status: "foundation", route: "/admin/ai/execution", permission: "ai.execution.read" },
  { id: "ai-approval", label: "AI Approval", area: "ai", status: "foundation", route: "/admin/ai/approval", permission: "ai.approval.read" },
  { id: "ai-history", label: "AI History", area: "ai", status: "foundation", route: "/admin/ai/history", permission: "ai.execution.read" },
  { id: "ai-activity-agent", label: "AI Activity Agent", area: "ai", status: "foundation", permission: "ai.command.read" },
  { id: "ai-survey-agent", label: "AI Survey Agent", area: "ai", status: "foundation", permission: "ai.command.read" },
  { id: "ai-content-agent", label: "AI Content Agent", area: "ai", status: "foundation", permission: "ai.command.read" },
  { id: "ai-analytics-agent", label: "AI Analytics Agent", area: "ai", status: "foundation", permission: "ai.command.read" },

  // Portal Core — identity, master data and shared services
  { id: "organizations", label: "Organizations", area: "core", status: "foundation", route: "/admin/organizations", permission: "overview.read" },
  { id: "learning-centers", label: "Learning Centers", area: "core", status: "foundation", route: "/admin/learning-centers", permission: "learning_centers.read" },
  { id: "cms", label: "Content & CMS", area: "core", status: "foundation", route: "/admin/cms", permission: "cms.read" },
  { id: "admin-users", label: "Admin Users", area: "core", status: "foundation", route: "/admin/governance?tab=users", permission: "system.manage" },
  { id: "permissions", label: "Permissions", area: "core", status: "foundation", route: "/admin/governance?tab=users", permission: "system.manage" },
  { id: "audit-trail", label: "Audit Trail", area: "core", status: "foundation", route: "/admin/audit-trail", permission: "system.read" },
  { id: "data-lifecycle", label: "Data Lifecycle", area: "core", status: "foundation", route: "/admin/governance?tab=lifecycle", permission: "system.manage" },
  { id: "global-search", label: "Global Search", area: "core", status: "foundation", route: "/admin/governance?tab=search", permission: "overview.read" },
  { id: "notifications", label: "Notifications", area: "core", status: "foundation", route: "/admin/governance?tab=notifications", permission: "overview.read" },
  { id: "system-settings", label: "System Settings", area: "core", status: "foundation", route: "/admin/settings", permission: "system.read" },
  { id: "facility-future", label: "Facility Integration", area: "core", status: "future", permission: "facility.read" },
];

export function adminFeaturesForArea(area: AdminFeatureArea) { return ADMIN_FEATURES.filter((feature) => feature.area === area); }
