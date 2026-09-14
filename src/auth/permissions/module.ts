import type { Permission, PermissionRepository } from "./repository";
import type { PermissionCache } from "./cache";
import { createPermissionCache } from "./cache";

/**
 * Permission Module
 * Provides permission checking with caching and repository pattern
 */
export class PermissionModule {
  constructor(
    private readonly repository: PermissionRepository,
    private readonly cache: PermissionCache = createPermissionCache(),
  ) {}

  /**
   * Check if a role has a specific permission
   * Uses cache for performance, falls back to repository
   */
  async hasPermission(roleName: string, permissionName: string): Promise<boolean> {
    // Try cache first
    const cachedPermissions = this.cache.get(roleName);
    if (cachedPermissions) {
      return cachedPermissions.some((p) => p.name === permissionName);
    }

    // Fall back to repository
    const hasPermission = await this.repository.roleHasPermission(roleName, permissionName);

    // If permission exists, cache the full permission set for future checks
    if (hasPermission) {
      const permissions = await this.repository.getPermissionsForRole(roleName);
      this.cache.set(roleName, permissions);
    }

    return hasPermission;
  }

  /**
   * Get all permissions for a role
   * Uses cache for performance
   */
  async getPermissions(roleName: string): Promise<Permission[]> {
    // Try cache first
    const cachedPermissions = this.cache.get(roleName);
    if (cachedPermissions) {
      return cachedPermissions;
    }

    // Fall back to repository
    const permissions = await this.repository.getPermissionsForRole(roleName);
    this.cache.set(roleName, permissions);

    return permissions;
  }

  /**
   * Refresh cache for a specific role
   */
  async refreshCache(roleName: string): Promise<void> {
    this.cache.clear(roleName);
    const permissions = await this.repository.getPermissionsForRole(roleName);
    this.cache.set(roleName, permissions);
  }

  /**
   * Clear all cache
   */
  clearAllCache(): void {
    this.cache.clearAll();
  }

  /**
   * Grant permission to a role and invalidate cache
   */
  async grantPermission(roleName: string, permissionName: string, grantedBy?: string): Promise<void> {
    await this.repository.grantPermissionToRole(roleName, permissionName, grantedBy);
    this.cache.clear(roleName);
  }

  /**
   * Revoke permission from a role and invalidate cache
   */
  async revokePermission(roleName: string, permissionName: string): Promise<void> {
    await this.repository.revokePermissionFromRole(roleName, permissionName);
    this.cache.clear(roleName);
  }

  /**
   * Batch grant permissions to a role and invalidate cache
   */
  async grantPermissions(roleName: string, permissionNames: string[], grantedBy?: string): Promise<void> {
    await this.repository.grantPermissionsToRole(roleName, permissionNames, grantedBy);
    this.cache.clear(roleName);
  }

  /**
   * Batch revoke permissions from a role and invalidate cache
   */
  async revokePermissions(roleName: string, permissionNames: string[]): Promise<void> {
    await this.repository.revokePermissionsFromRole(roleName, permissionNames);
    this.cache.clear(roleName);
  }

  /**
   * Get repository for direct access (for admin operations)
   */
  getRepository(): PermissionRepository {
    return this.repository;
  }

  /**
   * Get cache for direct access (for monitoring)
   */
  getCache(): PermissionCache {
    return this.cache;
  }
}

/**
 * Create a permission module instance
 * @param repository - Permission repository implementation
 * @param cache - Optional permission cache (default: in-memory cache with 5min TTL)
 * @returns PermissionModule instance
 */
export function createPermissionModule(
  repository: PermissionRepository,
  cache?: PermissionCache,
): PermissionModule {
  return new PermissionModule(repository, cache);
}