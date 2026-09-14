import type {
  Permission,
  PermissionHierarchy,
  PermissionRepository,
  Role,
  RolePermission,
} from "./repository";

/**
 * In-memory permission repository for testing
 * Implements the same interface as the Postgres repository
 */
export class InMemoryPermissionRepository implements PermissionRepository {
  private permissions: Map<string, Permission> = new Map();
  private roles: Map<string, Role> = new Map();
  private rolePermissions: Map<string, Set<string>> = new Map(); // roleId -> Set of permissionIds
  private permissionHierarchy: PermissionHierarchy[] = [];

  constructor(initialData?: {
    permissions?: Permission[];
    roles?: Role[];
    rolePermissions?: RolePermission[];
  }) {
    if (initialData?.permissions) {
      initialData.permissions.forEach((p) => this.permissions.set(p.id, p));
    }
    if (initialData?.roles) {
      initialData.roles.forEach((r) => this.roles.set(r.id, r));
    }
    if (initialData?.rolePermissions) {
      initialData.rolePermissions.forEach((rp) => {
        const key = rp.roleId;
        if (!this.rolePermissions.has(key)) {
          this.rolePermissions.set(key, new Set());
        }
        this.rolePermissions.get(key)!.add(rp.permissionId);
      });
    }
  }

  async getAllPermissions(): Promise<Permission[]> {
    return Array.from(this.permissions.values());
  }

  async getPermissionByName(name: string): Promise<Permission | null> {
    return Array.from(this.permissions.values()).find((p) => p.name === name) || null;
  }

  async getPermissionsForRole(roleName: string): Promise<Permission[]> {
    const role = Array.from(this.roles.values()).find((r) => r.name === roleName);
    if (!role) return [];

    const permissionIds = this.rolePermissions.get(role.id);
    if (!permissionIds) return [];

    return Array.from(permissionIds)
      .map((id) => this.permissions.get(id))
      .filter((p): p is Permission => p !== undefined);
  }

  async getAllRoles(): Promise<Role[]> {
    return Array.from(this.roles.values());
  }

  async getRoleByName(name: string): Promise<Role | null> {
    return Array.from(this.roles.values()).find((r) => r.name === name) || null;
  }

  async roleHasPermission(roleName: string, permissionName: string): Promise<boolean> {
    const permissions = await this.getPermissionsForRole(roleName);
    return permissions.some((p) => p.name === permissionName);
  }

  async grantPermissionToRole(roleName: string, permissionName: string, grantedBy?: string): Promise<void> {
    const role = Array.from(this.roles.values()).find((r) => r.name === roleName);
    const permission = Array.from(this.permissions.values()).find((p) => p.name === permissionName);

    if (!role || !permission) {
      throw new Error(`Role ${roleName} or permission ${permissionName} not found`);
    }

    if (!this.rolePermissions.has(role.id)) {
      this.rolePermissions.set(role.id, new Set());
    }
    this.rolePermissions.get(role.id)!.add(permission.id);
  }

  async revokePermissionFromRole(roleName: string, permissionName: string): Promise<void> {
    const role = Array.from(this.roles.values()).find((r) => r.name === roleName);
    const permission = Array.from(this.permissions.values()).find((p) => p.name === permissionName);

    if (!role || !permission) {
      throw new Error(`Role ${roleName} or permission ${permissionName} not found`);
    }

    this.rolePermissions.get(role.id)?.delete(permission.id);
  }

  async createPermission(permission: Omit<Permission, "id" | "createdAt" | "updatedAt">): Promise<Permission> {
    const newPermission: Permission = {
      ...permission,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.permissions.set(newPermission.id, newPermission);
    return newPermission;
  }

  async updatePermission(id: string, updates: Partial<Omit<Permission, "id" | "createdAt" | "updatedAt">>): Promise<Permission> {
    const existing = this.permissions.get(id);
    if (!existing) {
      throw new Error(`Permission with id ${id} not found`);
    }

    const updated: Permission = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.permissions.set(id, updated);
    return updated;
  }

  async deletePermission(id: string): Promise<void> {
    this.permissions.delete(id);
    // Remove from all role permissions
    for (const [roleId, permissionIds] of this.rolePermissions.entries()) {
      permissionIds.delete(id);
    }
  }

  async createRole(role: Omit<Role, "id" | "createdAt" | "updatedAt">): Promise<Role> {
    const newRole: Role = {
      ...role,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.roles.set(newRole.id, newRole);
    return newRole;
  }

  async updateRole(id: string, updates: Partial<Omit<Role, "id" | "createdAt" | "updatedAt">>): Promise<Role> {
    const existing = this.roles.get(id);
    if (!existing) {
      throw new Error(`Role with id ${id} not found`);
    }

    const updated: Role = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.roles.set(id, updated);
    return updated;
  }

  async deleteRole(id: string): Promise<void> {
    this.roles.delete(id);
    this.rolePermissions.delete(id);
  }

  async grantPermissionsToRole(roleName: string, permissionNames: string[], grantedBy?: string): Promise<void> {
    const role = Array.from(this.roles.values()).find((r) => r.name === roleName);
    if (!role) {
      throw new Error(`Role ${roleName} not found`);
    }

    for (const permissionName of permissionNames) {
      await this.grantPermissionToRole(roleName, permissionName, grantedBy);
    }
  }

  async revokePermissionsFromRole(roleName: string, permissionNames: string[]): Promise<void> {
    const role = Array.from(this.roles.values()).find((r) => r.name === roleName);
    if (!role) {
      throw new Error(`Role ${roleName} not found`);
    }

    for (const permissionName of permissionNames) {
      await this.revokePermissionFromRole(roleName, permissionName);
    }
  }

  async getPermissionHierarchy(): Promise<PermissionHierarchy[]> {
    return [...this.permissionHierarchy];
  }

  async addPermissionHierarchy(parentId: string, childId: string, level?: number): Promise<void> {
    this.permissionHierarchy.push({
      parentId,
      childId,
      level: level ?? 1,
    });
  }

  async removePermissionHierarchy(parentId: string, childId: string): Promise<void> {
    this.permissionHierarchy = this.permissionHierarchy.filter(
      (h) => h.parentId !== parentId || h.childId !== childId,
    );
  }
}

/**
 * Create an in-memory permission repository for testing
 * @param initialData - Optional initial data
 * @returns InMemoryPermissionRepository instance
 */
export function createInMemoryPermissionRepository(initialData?: {
  permissions?: Permission[];
  roles?: Role[];
  rolePermissions?: RolePermission[];
}): PermissionRepository {
  return new InMemoryPermissionRepository(initialData);
}