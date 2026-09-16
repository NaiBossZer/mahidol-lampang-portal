-- Permissions System Migration
-- This migration creates the tables for dynamic permissions and seeds them with existing static data

-- Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  category VARCHAR(50),
  resource VARCHAR(50),
  action VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for permissions
CREATE INDEX IF NOT EXISTS permissions_name_idx ON permissions(name);
CREATE INDEX IF NOT EXISTS permissions_category_idx ON permissions(category);
CREATE INDEX IF NOT EXISTS permissions_resource_action_idx ON permissions(resource, action);

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  is_system BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for roles
CREATE INDEX IF NOT EXISTS roles_name_idx ON roles(name);
CREATE INDEX IF NOT EXISTS roles_is_system_idx ON roles(is_system);

-- Create role_permissions junction table
CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  granted_by UUID,
  granted_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(role_id, permission_id)
);

-- Create indexes for role_permissions
CREATE INDEX IF NOT EXISTS role_permissions_role_id_idx ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS role_permissions_permission_id_idx ON role_permissions(permission_id);
CREATE INDEX IF NOT EXISTS role_permissions_granted_at_idx ON role_permissions(granted_at);

-- Create permission_hierarchy table
CREATE TABLE IF NOT EXISTS permission_hierarchy (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  level INTEGER DEFAULT 1,
  UNIQUE(parent_id, child_id)
);

-- Create indexes for permission_hierarchy
CREATE INDEX IF NOT EXISTS permission_hierarchy_parent_id_idx ON permission_hierarchy(parent_id);
CREATE INDEX IF NOT EXISTS permission_hierarchy_child_id_idx ON permission_hierarchy(child_id);
CREATE INDEX IF NOT EXISTS permission_hierarchy_level_idx ON permission_hierarchy(level);

-- Seed permissions from existing static arrays
INSERT INTO permissions (name, description, category, resource, action) VALUES
  ('overview.read', 'Read overview dashboard', 'overview', 'overview', 'read'),
  ('cms.read', 'Read CMS content', 'cms', 'cms', 'read'),
  ('cms.create', 'Create CMS content', 'cms', 'cms', 'create'),
  ('cms.update', 'Update CMS content', 'cms', 'cms', 'update'),
  ('cms.publish', 'Publish CMS content', 'cms', 'cms', 'publish'),
  ('cms.archive', 'Archive CMS content', 'cms', 'cms', 'archive'),
  ('activities.read', 'Read activities', 'activities', 'activities', 'read'),
  ('activities.create', 'Create activities', 'activities', 'activities', 'create'),
  ('activities.update', 'Update activities', 'activities', 'activities', 'update'),
  ('activities.publish', 'Publish activities', 'activities', 'activities', 'publish'),
  ('activities.archive', 'Archive activities', 'activities', 'activities', 'archive'),
  ('projects.read', 'Read projects', 'projects', 'projects', 'read'),
  ('projects.create', 'Create projects', 'projects', 'projects', 'create'),
  ('projects.update', 'Update projects', 'projects', 'projects', 'update'),
  ('projects.publish', 'Publish projects', 'projects', 'projects', 'publish'),
  ('projects.archive', 'Archive projects', 'projects', 'projects', 'archive'),
  ('learning_centers.read', 'Read learning centers', 'learning_centers', 'learning_centers', 'read'),
  ('learning_centers.create', 'Create learning centers', 'learning_centers', 'learning_centers', 'create'),
  ('learning_centers.update', 'Update learning centers', 'learning_centers', 'learning_centers', 'update'),
  ('learning_centers.publish', 'Publish learning centers', 'learning_centers', 'learning_centers', 'publish'),
  ('learning_centers.archive', 'Archive learning centers', 'learning_centers', 'learning_centers', 'archive'),
  ('partners.read', 'Read partners', 'partners', 'partners', 'read'),
  ('partners.create', 'Create partners', 'partners', 'partners', 'create'),
  ('partners.update', 'Update partners', 'partners', 'partners', 'update'),
  ('partners.archive', 'Archive partners', 'partners', 'partners', 'archive'),
  ('services.read', 'Read services', 'services', 'services', 'read'),
  ('services.create', 'Create services', 'services', 'services', 'create'),
  ('services.update', 'Update services', 'services', 'services', 'update'),
  ('services.publish', 'Publish services', 'services', 'services', 'publish'),
  ('services.archive', 'Archive services', 'services', 'services', 'archive'),
  ('navigation.read', 'Read navigation', 'navigation', 'navigation', 'read'),
  ('navigation.create', 'Create navigation', 'navigation', 'navigation', 'create'),
  ('navigation.update', 'Update navigation', 'navigation', 'navigation', 'update'),
  ('navigation.archive', 'Archive navigation', 'navigation', 'navigation', 'archive'),
  ('footer.read', 'Read footer', 'footer', 'footer', 'read'),
  ('footer.update', 'Update footer', 'footer', 'footer', 'update'),
  ('facility.read', 'Read facility information', 'facility', 'facility', 'read'),
  ('facility.manage', 'Manage facility', 'facility', 'facility', 'manage'),
  ('store.read', 'Read store', 'store', 'store', 'read'),
  ('store.manage', 'Manage store', 'store', 'store', 'manage'),
  ('system.read', 'Read system information', 'system', 'system', 'read'),
  ('system.manage', 'Manage system', 'system', 'system', 'manage'),
  ('survey.read', 'Read surveys', 'survey', 'survey', 'read'),
  ('survey.create', 'Create surveys', 'survey', 'survey', 'create'),
  ('survey.update', 'Update surveys', 'survey', 'survey', 'update'),
  ('survey.archive', 'Archive surveys', 'survey', 'survey', 'archive'),
  ('survey.audit.read', 'Read survey audit logs', 'survey', 'survey', 'audit.read'),
  ('ai.command.read', 'Read AI commands', 'ai', 'ai', 'command.read'),
  ('ai.queue.read', 'Read AI queue', 'ai', 'ai', 'queue.read'),
  ('ai.execution.read', 'Read AI executions', 'ai', 'ai', 'execution.read'),
  ('ai.approval.read', 'Read AI approvals', 'ai', 'ai', 'approval.read')
ON CONFLICT (name) DO NOTHING;

-- Seed roles
INSERT INTO roles (name, description, is_system) VALUES
  ('SUPER_ADMIN', 'Super administrator with all permissions', TRUE),
  ('CONTENT_ADMIN', 'Content administrator for CMS and projects', TRUE),
  ('OPERATIONS_ADMIN', 'Operations administrator for activities and learning centers', TRUE),
  ('FACILITY_ADMIN', 'Facility administrator for facility management', TRUE)
ON CONFLICT (name) DO NOTHING;

-- Seed role permissions based on existing static arrays
-- SUPER_ADMIN gets all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'SUPER_ADMIN'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- CONTENT_ADMIN permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'CONTENT_ADMIN'
AND p.name IN (
  'overview.read', 'cms.read', 'cms.create', 'cms.update', 'cms.publish', 'cms.archive',
  'projects.read', 'projects.create', 'projects.update', 'projects.publish', 'projects.archive',
  'partners.read', 'partners.create', 'partners.update', 'partners.archive',
  'services.read', 'services.create', 'services.update', 'services.publish', 'services.archive',
  'navigation.read', 'navigation.create', 'navigation.update', 'navigation.archive',
  'footer.read', 'footer.update',
  'survey.read', 'survey.create', 'survey.update', 'survey.archive', 'survey.audit.read',
  'ai.command.read', 'ai.queue.read', 'ai.execution.read', 'ai.approval.read'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- OPERATIONS_ADMIN permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'OPERATIONS_ADMIN'
AND p.name IN (
  'overview.read',
  'activities.read', 'activities.create', 'activities.update', 'activities.publish', 'activities.archive',
  'learning_centers.read', 'learning_centers.create', 'learning_centers.update', 'learning_centers.publish', 'learning_centers.archive',
  'store.read', 'store.manage',
  'survey.read', 'survey.create', 'survey.update', 'survey.archive', 'survey.audit.read',
  'ai.command.read', 'ai.queue.read', 'ai.execution.read', 'ai.approval.read'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- FACILITY_ADMIN permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'FACILITY_ADMIN'
AND p.name IN (
  'overview.read',
  'facility.read', 'facility.manage',
  'survey.read', 'survey.audit.read',
  'ai.command.read', 'ai.queue.read', 'ai.execution.read', 'ai.approval.read'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;