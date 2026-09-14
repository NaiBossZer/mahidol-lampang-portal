import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  unique,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Permissions Table
export const permissions = pgTable(
  "permissions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 100 }).notNull().unique(),
    description: text("description"),
    category: varchar("category", { length: 50 }),
    resource: varchar("resource", { length: 50 }),
    action: varchar("action", { length: 50 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    nameIdx: index("permissions_name_idx").on(table.name),
    categoryIdx: index("permissions_category_idx").on(table.category),
    resourceActionIdx: index("permissions_resource_action_idx").on(table.resource, table.action),
  }),
);

// Roles Table
export const roles = pgTable(
  "roles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 50 }).notNull().unique(),
    description: text("description"),
    isSystem: boolean("is_system").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    nameIdx: index("roles_name_idx").on(table.name),
    isSystemIdx: index("roles_is_system_idx").on(table.isSystem),
  }),
);

// Role Permissions Junction Table
export const rolePermissions = pgTable(
  "role_permissions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    permissionId: uuid("permission_id")
      .notNull()
      .references(() => permissions.id, { onDelete: "cascade" }),
    grantedBy: uuid("granted_by"),
    grantedAt: timestamp("granted_at").defaultNow().notNull(),
  },
  (table) => ({
    rolePermissionUnique: unique("role_permissions_unique").on(table.roleId, table.permissionId),
    roleIdIdx: index("role_permissions_role_id_idx").on(table.roleId),
    permissionIdIdx: index("role_permissions_permission_id_idx").on(table.permissionId),
    grantedAtIdx: index("role_permissions_granted_at_idx").on(table.grantedAt),
  }),
);

// Permission Hierarchy Table
export const permissionHierarchy = pgTable(
  "permission_hierarchy",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    parentId: uuid("parent_id")
      .notNull()
      .references(() => permissions.id, { onDelete: "cascade" }),
    childId: uuid("child_id")
      .notNull()
      .references(() => permissions.id, { onDelete: "cascade" }),
    level: integer("level").default(1).notNull(),
  },
  (table) => ({
    parentChildUnique: unique("permission_hierarchy_unique").on(table.parentId, table.childId),
    parentIdIdx: index("permission_hierarchy_parent_id_idx").on(table.parentId),
    childIdIdx: index("permission_hierarchy_child_id_idx").on(table.childId),
    levelIdx: index("permission_hierarchy_level_idx").on(table.level),
  }),
);

// Relations
export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, {
    fields: [rolePermissions.roleId],
    references: [roles.id],
  }),
  permission: one(permissions, {
    fields: [rolePermissions.permissionId],
    references: [permissions.id],
  }),
}));

export const permissionHierarchyRelations = relations(permissionHierarchy, ({ one }) => ({
  parent: one(permissions, {
    fields: [permissionHierarchy.parentId],
    references: [permissions.id],
  }),
  child: one(permissions, {
    fields: [permissionHierarchy.childId],
    references: [permissions.id],
  }),
}));