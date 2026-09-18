export const ADMIN_ROLES = [
  "SUPER_ADMIN",
  "CONTENT_ADMIN",
  "OPERATIONS_ADMIN",
  "FACILITY_ADMIN",
] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];
export const ADMIN_PERMISSIONS = [
  "overview.read",
  "cms.read",
  "cms.create",
  "cms.update",
  "cms.publish",
  "cms.archive",
  "activities.read",
  "activities.create",
  "activities.update",
  "activities.publish",
  "activities.archive",
  "projects.read",
  "projects.create",
  "projects.update",
  "projects.publish",
  "projects.archive",
  "learning_centers.read",
  "learning_centers.create",
  "learning_centers.update",
  "learning_centers.publish",
  "learning_centers.archive",
  "partners.read",
  "partners.create",
  "partners.update",
  "partners.archive",
  "services.read",
  "services.create",
  "services.update",
  "services.publish",
  "services.archive",
  "navigation.read",
  "navigation.create",
  "navigation.update",
  "navigation.archive",
  "footer.read",
  "footer.update",
  "facility.read",
  "facility.manage",
  "store.read",
  "store.manage",
  "system.read",
  "system.manage",
  "survey.read",
  "survey.create",
  "survey.update",
  "survey.archive",
  "survey.audit.read",
  "ai.command.read",
  "ai.queue.read",
  "ai.execution.read",
  "ai.approval.read",
] as const;
export type AdminPermission = (typeof ADMIN_PERMISSIONS)[number];

/**
 * Canonical metadata for the central-admin permission catalog.
 * This is the single code-level source of truth for Governance UI and API checks.
 */
export interface PermissionDefinition {
  key: AdminPermission;
  domain: string;
  action: string;
  label: string;
  description: string;
}

const permission = (
  key: AdminPermission,
  domain: string,
  action: string,
  label: string,
  description: string,
): PermissionDefinition => ({ key, domain, action, label, description });

export const PERMISSION_CATALOG: readonly PermissionDefinition[] = [
  permission("overview.read", "overview", "read", "ดูภาพรวม", "ดูข้อมูลภาพรวมของระบบผู้ดูแล"),
  permission("cms.read", "cms", "read", "ดูคลังเอกสารราชการ / CMS", "ดูข้อมูลใน CMS"),
  permission("cms.create", "cms", "create", "สร้างเนื้อหา CMS", "สร้างรายการเนื้อหาใน CMS"),
  permission("cms.update", "cms", "update", "แก้ไขเนื้อหา CMS", "แก้ไขรายการเนื้อหาใน CMS"),
  permission("cms.publish", "cms", "publish", "เผยแพร่เนื้อหา CMS", "เผยแพร่เนื้อหา CMS"),
  permission("cms.archive", "cms", "archive", "เก็บถาวรเนื้อหา CMS", "เก็บถาวรเนื้อหา CMS"),
  permission("activities.read", "activities", "read", "ดูกิจกรรม", "ดูรายการและรายละเอียดกิจกรรม"),
  permission("activities.create", "activities", "create", "สร้างกิจกรรม", "สร้างกิจกรรมใหม่"),
  permission("activities.update", "activities", "update", "แก้ไขกิจกรรม", "แก้ไขข้อมูลกิจกรรม"),
  permission("activities.publish", "activities", "publish", "เผยแพร่กิจกรรม", "เผยแพร่กิจกรรม"),
  permission("activities.archive", "activities", "archive", "เก็บถาวรกิจกรรม", "เก็บถาวรกิจกรรม"),
  permission("projects.read", "projects", "read", "ดูโครงการ", "ดูรายการและรายละเอียดโครงการ"),
  permission("projects.create", "projects", "create", "สร้างโครงการ", "สร้างโครงการใหม่"),
  permission("projects.update", "projects", "update", "แก้ไขโครงการ", "แก้ไขข้อมูลโครงการ"),
  permission("projects.publish", "projects", "publish", "เผยแพร่โครงการ", "เผยแพร่โครงการ"),
  permission("projects.archive", "projects", "archive", "เก็บถาวรโครงการ", "เก็บถาวรโครงการ"),
  permission("learning_centers.read", "learning_centers", "read", "ดูศูนย์การเรียนรู้", "ดูข้อมูลศูนย์การเรียนรู้"),
  permission("learning_centers.create", "learning_centers", "create", "สร้างศูนย์การเรียนรู้", "สร้างข้อมูลศูนย์การเรียนรู้"),
  permission("learning_centers.update", "learning_centers", "update", "แก้ไขศูนย์การเรียนรู้", "แก้ไขข้อมูลศูนย์การเรียนรู้"),
  permission("learning_centers.publish", "learning_centers", "publish", "เผยแพร่ศูนย์การเรียนรู้", "เผยแพร่ข้อมูลศูนย์การเรียนรู้"),
  permission("learning_centers.archive", "learning_centers", "archive", "เก็บถาวรศูนย์การเรียนรู้", "เก็บถาวรข้อมูลศูนย์การเรียนรู้"),
  permission("partners.read", "partners", "read", "ดูภาคีเครือข่าย", "ดูข้อมูลภาคีเครือข่าย"),
  permission("partners.create", "partners", "create", "สร้างภาคีเครือข่าย", "สร้างข้อมูลภาคีเครือข่าย"),
  permission("partners.update", "partners", "update", "แก้ไขภาคีเครือข่าย", "แก้ไขข้อมูลภาคีเครือข่าย"),
  permission("partners.archive", "partners", "archive", "เก็บถาวรภาคีเครือข่าย", "เก็บถาวรข้อมูลภาคีเครือข่าย"),
  permission("services.read", "services", "read", "ดูบริการ", "ดูข้อมูลบริการ"),
  permission("services.create", "services", "create", "สร้างบริการ", "สร้างบริการใหม่"),
  permission("services.update", "services", "update", "แก้ไขบริการ", "แก้ไขข้อมูลบริการ"),
  permission("services.publish", "services", "publish", "เผยแพร่บริการ", "เผยแพร่บริการ"),
  permission("services.archive", "services", "archive", "เก็บถาวรบริการ", "เก็บถาวรบริการ"),
  permission("navigation.read", "navigation", "read", "ดูเมนูนำทาง", "ดูการตั้งค่าเมนูนำทาง"),
  permission("navigation.create", "navigation", "create", "สร้างเมนูนำทาง", "สร้างรายการเมนูนำทาง"),
  permission("navigation.update", "navigation", "update", "แก้ไขเมนูนำทาง", "แก้ไขรายการเมนูนำทาง"),
  permission("navigation.archive", "navigation", "archive", "เก็บถาวรเมนูนำทาง", "เก็บถาวรรายการเมนูนำทาง"),
  permission("footer.read", "footer", "read", "ดู Footer", "ดูข้อมูลส่วนท้ายเว็บไซต์"),
  permission("footer.update", "footer", "update", "แก้ไข Footer", "แก้ไขข้อมูลส่วนท้ายเว็บไซต์"),
  permission("facility.read", "facility", "read", "ดูอาคารและความปลอดภัย", "ดูข้อมูลอาคาร สถานที่ และความปลอดภัย"),
  permission("facility.manage", "facility", "manage", "จัดการอาคารและความปลอดภัย", "จัดการข้อมูลอาคาร สถานที่ และความปลอดภัย"),
  permission("store.read", "store", "read", "ดูคลังวัสดุ", "ดูข้อมูลคลังวัสดุ"),
  permission("store.manage", "store", "manage", "จัดการคลังวัสดุ", "จัดการข้อมูลคลังวัสดุ"),
  permission("system.read", "system", "read", "ดูการตั้งค่าระบบ", "ดูข้อมูลการตั้งค่าระบบ"),
  permission("system.manage", "system", "manage", "จัดการระบบ", "จัดการการตั้งค่าระบบและสิทธิ์ผู้ดูแล"),
  permission("survey.read", "survey", "read", "ดูแบบประเมิน", "ดูแบบประเมินและข้อมูลที่เกี่ยวข้อง"),
  permission("survey.create", "survey", "create", "สร้างแบบประเมิน", "สร้างแบบประเมิน"),
  permission("survey.update", "survey", "update", "แก้ไขแบบประเมิน", "แก้ไขแบบประเมิน"),
  permission("survey.archive", "survey", "archive", "เก็บถาวรแบบประเมิน", "เก็บถาวรแบบประเมิน"),
  permission("survey.audit.read", "survey", "audit.read", "ดูผลตรวจสอบแบบประเมิน", "ดูข้อมูล audit ของแบบประเมิน"),
  permission("ai.command.read", "ai", "command.read", "ดูคำสั่ง AI", "เข้าถึงคำสั่ง AI ที่ได้รับอนุญาต"),
  permission("ai.queue.read", "ai", "queue.read", "ดูคิว AI", "ดูงาน AI ที่อยู่ในคิว"),
  permission("ai.execution.read", "ai", "execution.read", "ดูประวัติการทำงาน AI", "ดู execution และผลการทำงานของ AI"),
  permission("ai.approval.read", "ai", "approval.read", "ดูการอนุมัติ AI", "ดูรายการ AI ที่ต้องผ่านการอนุมัติ"),
];

export function permissionDefinition(permission: AdminPermission): PermissionDefinition {
  return PERMISSION_CATALOG.find((item) => item.key === permission)!;
}

const CONTENT: readonly AdminPermission[] = [
  "overview.read",
  "cms.read",
  "cms.create",
  "cms.update",
  "cms.publish",
  "cms.archive",
  "projects.read",
  "projects.create",
  "projects.update",
  "projects.publish",
  "projects.archive",
  "partners.read",
  "partners.create",
  "partners.update",
  "partners.archive",
  "services.read",
  "services.create",
  "services.update",
  "services.publish",
  "services.archive",
  "navigation.read",
  "navigation.create",
  "navigation.update",
  "navigation.archive",
  "footer.read",
  "footer.update",
  "survey.read",
  "survey.create",
  "survey.update",
  "survey.archive",
  "survey.audit.read",
  "ai.command.read",
  "ai.queue.read",
  "ai.execution.read",
  "ai.approval.read",
];
const OPERATIONS: readonly AdminPermission[] = [
  "overview.read",
  "activities.read",
  "activities.create",
  "activities.update",
  "activities.publish",
  "activities.archive",
  "learning_centers.read",
  "learning_centers.create",
  "learning_centers.update",
  "learning_centers.publish",
  "learning_centers.archive",
  "store.read",
  "store.manage",
  "survey.read",
  "survey.create",
  "survey.update",
  "survey.archive",
  "survey.audit.read",
  "ai.command.read",
  "ai.queue.read",
  "ai.execution.read",
  "ai.approval.read",
];
const FACILITY: readonly AdminPermission[] = [
  "overview.read",
  "facility.read",
  "facility.manage",
  "survey.read",
  "survey.audit.read",
  "ai.command.read",
  "ai.queue.read",
  "ai.execution.read",
  "ai.approval.read",
];
const ROLE_PERMISSIONS: Record<AdminRole, readonly AdminPermission[]> = {
  SUPER_ADMIN: ADMIN_PERMISSIONS,
  CONTENT_ADMIN: CONTENT,
  OPERATIONS_ADMIN: OPERATIONS,
  FACILITY_ADMIN: FACILITY,
};

export function isAdminRole(value: unknown): value is AdminRole {
  return typeof value === "string" && (ADMIN_ROLES as readonly string[]).includes(value);
}
export function hasAdminPermission(
  role: AdminRole | null | undefined,
  permission: string,
): boolean {
  return (
    role === "SUPER_ADMIN" ||
    Boolean(role && ROLE_PERMISSIONS[role].includes(permission as AdminPermission))
  );
}
export function permissionsForRole(role: AdminRole | null | undefined): AdminPermission[] {
  return role ? [...ROLE_PERMISSIONS[role]] : [];
}
