/**
 * Permission data types
 */
export interface Permission {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  resource: string | null;
  action: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Role data types
 */
export interface Role {
  id: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Role-Permission mapping
 */
export interface RolePermission {
  roleId: string;
  permissionId: string;
  grantedBy: string | null;
  grantedAt: Date;
}

/**
 * Permission hierarchy for inheritance
 */
export interface PermissionHierarchy {
  parentId: string;
  childId: string;
  level: number;
}

/**
 * Permission Repository Interface
 * Provides data access operations for permissions and roles
 */
export interface PermissionRepository {
  /**
   * Get all permissions
   */
  getAllPermissions(): Promise<Permission[]>;

  /**
   * Get permission by name
   */
  getPermissionByName(name: string): Promise<Permission | null>;

  /**
   * Get permissions for a specific role
   */
  getPermissionsForRole(roleName: string): Promise<Permission[]>;

  /**
   * Get all roles
   */
  getAllRoles(): Promise<Role[]>;

  /**
   * Get role by name
   */
  getRoleByName(name: string): Promise<Role | null>;

  /**
   * Check if a role has a specific permission
   */
  roleHasPermission(roleName: string, permissionName: string): Promise<boolean>;

  /**
   * Grant permission to a role
   */
  grantPermissionToRole(roleName: string, permissionName: string, grantedBy?: string): Promise<void>;

  /**
   * Revoke permission from a role
   */
  revokePermissionFromRole(roleName: string, permissionName: string): Promise<void>;

  /**
   * Create a new permission
   */
  createPermission(permission: Omit<Permission, "id" | "createdAt" | "updatedAt">): Promise<Permission>;

  /**
   * Update an existing permission
   */
  updatePermission(id: string, updates: Partial<Omit<Permission, "id" | "createdAt" | "updatedAt">>): Promise<Permission>;

  /**
   * Delete a permission
   */
  deletePermission(id: string): Promise<void>;

  /**
   * Create a new role
   */
  createRole(role: Omit<Role, "id" | "createdAt" | "updatedAt">): Promise<Role>;

  /**
   * Update an existing role
   */
  updateRole(id: string, updates: Partial<Omit<Role, "id" | "createdAt" | "updatedAt">>): Promise<Role>;

  /**
   * Delete a role
   */
  deleteRole(id: string): Promise<void>;

  /**
   * Batch grant permissions to a role
   */
  grantPermissionsToRole(roleName: string, permissionNames: string[], grantedBy?: string): Promise<void>;

  /**
   * Batch revoke permissions from a role
   */
  revokePermissionsFromRole(roleName: string, permissionNames: string[]): Promise<void>;

  /**
   * Get permission hierarchy
   */
  getPermissionHierarchy(): Promise<PermissionHierarchy[]>;

  /**
   * Add permission hierarchy relationship
   */
  addPermissionHierarchy(parentId: string, childId: string, level?: number): Promise<void>;

  /**
   * Remove permission hierarchy relationship
   */
  removePermissionHierarchy(parentId: string, childId: string): Promise<void>;
}