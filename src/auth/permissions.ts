export const ADMIN_ROLE = "ADMIN" as const;

export const ADMIN_PERMISSIONS = [
  "overview.read",
  "cms.read", "cms.create", "cms.update", "cms.publish", "cms.archive",
  "activities.read", "activities.create", "activities.update", "activities.publish", "activities.archive",
  "projects.read", "projects.create", "projects.update", "projects.publish", "projects.archive",
  "learning_centers.read", "learning_centers.create", "learning_centers.update", "learning_centers.publish", "learning_centers.archive",
  "partners.read", "partners.create", "partners.update", "partners.archive",
  "services.read", "services.create", "services.update", "services.publish", "services.archive",
  "navigation.read", "navigation.create", "navigation.update", "navigation.archive",
  "footer.read", "footer.update",
  "facility.read", "facility.manage",
  "store.read", "store.manage",
  "system.read", "system.manage",
] as const;

export type AdminPermission = (typeof ADMIN_PERMISSIONS)[number];

export function hasAdminPermission(permission: string): boolean {
  return (ADMIN_PERMISSIONS as readonly string[]).includes(permission);
}
