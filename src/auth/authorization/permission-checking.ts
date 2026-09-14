import { hasAdminPermission, permissionsForRole, type AdminPermission, type AdminRole } from "../permissions";
import type { Identity, PermissionChecker } from "./types";

/**
 * Permission checker implementation using the existing permissions system
 */
export class DefaultPermissionChecker implements PermissionChecker {
  /**
   * Check if an identity has a specific permission
   * @param identity - User identity
   * @param permission - Permission to check
   * @returns true if permission is granted, false otherwise
   */
  checkPermission(identity: Identity, permission: string): boolean {
    return hasAdminPermission(identity.role, permission);
  }

  /**
   * Get all permissions for a given identity
   * @param identity - User identity
   * @returns Array of permissions for the identity's role
   */
  getPermissions(identity: Identity): AdminPermission[] {
    return permissionsForRole(identity.role);
  }

  /**
   * Check if an identity has any of the specified permissions
   * @param identity - User identity
   * @param permissions - Array of permissions to check
   * @returns true if any permission is granted, false otherwise
   */
  hasAnyPermission(identity: Identity, permissions: string[]): boolean {
    return permissions.some((permission) => this.checkPermission(identity, permission));
  }

  /**
   * Check if an identity has all of the specified permissions
   * @param identity - User identity
   * @param permissions - Array of permissions to check
   * @returns true if all permissions are granted, false otherwise
   */
  hasAllPermissions(identity: Identity, permissions: string[]): boolean {
    return permissions.every((permission) => this.checkPermission(identity, permission));
  }
}

/**
 * Create a permission checker instance
 * @returns PermissionChecker instance
 */
export function createPermissionChecker(): PermissionChecker {
  return new DefaultPermissionChecker();
}