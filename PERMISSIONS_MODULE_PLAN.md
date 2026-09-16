# Permissions System Deepening Implementation Plan

## Design Decisions Summary

### Module Structure
- Location: src/auth/permissions/
- Sub-modules: PermissionRepository, PermissionCache, PermissionHierarchy, PermissionModule
- Main interface: PermissionModule with repository injection
- Pattern: Repository pattern with caching layer

### Key Interfaces
- PermissionRepository: getPermissionsForRole(role): Promise<Permission[]>, updateRolePermissions(role, permissions): Promise<void>
- PermissionCache: get(role): Permission[] | null, set(role, permissions): void, clear(): void
- PermissionModule: hasPermission(role, permission): boolean, getPermissions(role): Permission[], refreshCache(role): Promise<void>

### Database Schema
- Table: permissions (id, name, description, category, created_at)
- Table: roles (id, name, description, created_at)
- Table: role_permissions (role_id, permission_id, granted_at)
- Table: permission_hierarchy (parent_id, child_id, level)

### Integration Strategy
- Legacy compatibility: Static arrays remain as fallback when database is empty
- Migration: Gradual migration from static to dynamic permissions
- Caching: In-memory cache with TTL for performance
- Backward compatibility: Existing functions continue to work

### Testing
- Unit tests: Repository implementations and cache layer
- Integration tests: Database operations
- Mock adapters: InMemoryRepository for testing

### Documentation
- PERMISSIONS_MODULE.md documentation
- Migration guide for existing permissions

## Implementation Steps

### 1. Database Schema Design
File: src/db/schema-permissions.ts
- Permissions table with metadata
- Roles table with metadata
- Role-Permissions junction table
- Permission hierarchy table for inheritance

### 2. PermissionRepository Interface
File: src/auth/permissions/repository.ts
- PermissionRepository interface
- Method signatures for CRUD operations
- Batch operations for performance

### 3. Postgres Repository Implementation
File: src/auth/permissions/postgres-repository.ts
- Database operations using Drizzle ORM
- Connection pooling
- Transaction support
- Error handling

### 4. InMemory Repository Implementation
File: src/auth/permissions/memory-repository.ts
- In-memory implementation for testing
- Same interface as Postgres repository
- No persistence

### 5. Permission Cache Layer
File: src/auth/permissions/cache.ts
- In-memory cache with TTL
- Cache invalidation strategies
- Performance monitoring

### 6. Permission Module
File: src/auth/permissions/module.ts
- Main PermissionModule class
- Repository and cache composition
- Permission checking logic
- Fallback to static arrays

### 7. Update Existing Permissions
File: src/auth/permissions.ts (modify existing)
- Add compatibility layer
- Static arrays as fallback
- Gradual migration path

### 8. Migration Script
File: src/db/migrations/add_permissions.sql
- Create permissions tables
- Seed initial permissions from static arrays
- Seed initial roles
- Create role-permission mappings

### 9. Admin UI Components
File: src/components/admin/permissions/
- Permission management UI
- Role management UI
- Permission assignment interface

### 10. Unit Tests
File: src/auth/permissions/__tests__/repository.test.ts
- Test repository implementations
- Test cache layer
- Test permission checking

### 11. Integration Tests
File: src/auth/permissions/__tests__/integration.test.ts
- Test database operations
- Test cache invalidation
- Test fallback behavior

### 12. Documentation
File: PERMISSIONS_MODULE.md
- Module overview and design rationale
- API documentation
- Migration guide
- Admin UI guide

## Database Schema

### Permissions Table
```sql
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  category VARCHAR(50),
  resource VARCHAR(50),
  action VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Roles Table
```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  is_system BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Role Permissions Table
```sql
CREATE TABLE role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
  granted_by UUID,
  granted_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(role_id, permission_id)
);
```

### Permission Hierarchy Table
```sql
CREATE TABLE permission_hierarchy (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
  child_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
  level INTEGER DEFAULT 1,
  UNIQUE(parent_id, child_id)
);
```

## File Structure

```
src/auth/permissions/
├── repository.ts              # Repository interface
├── postgres-repository.ts    # Postgres implementation
├── memory-repository.ts       # In-memory implementation
├── cache.ts                   # Cache layer
├── module.ts                  # Main permission module
├── __tests__/
│   ├── repository.test.ts
│   ├── cache.test.ts
│   └── integration.test.ts
├── permissions.ts             # Existing (with compatibility layer)
└── README.md                  # Module documentation

src/db/
├── schema-permissions.ts      # Drizzle schema for permissions
└── migrations/
    └── add_permissions.sql    # Migration script

src/components/admin/permissions/
├── index.tsx                  # Permission management page
├── roles.tsx                  # Role management page
└── assignment.tsx             # Permission assignment interface

PERMISSIONS_MODULE.md          # Main documentation
```

## Migration Plan

### Phase 1: Database Setup
1. Create database schema
2. Run migration script
3. Seed initial data from static arrays
4. Verify data integrity

### Phase 2: Module Implementation
1. Implement repository interfaces
2. Implement cache layer
3. Implement main permission module
4. Add backward compatibility layer

### Phase 3: Admin UI
1. Create permission management interface
2. Create role management interface
3. Create permission assignment interface
4. Test admin workflows

### Phase 4: Gradual Migration
1. Update one API handler to use dynamic permissions
2. Test thoroughly
3. Repeat for other handlers
4. Monitor performance

### Phase 5: Cleanup
1. Remove static array fallback (optional)
2. Update documentation
3. Final testing

## Key Benefits

1. **Dynamic Permissions**: Runtime permission adjustments without code changes
2. **Centralized Management**: Admin UI for permission management
3. **Performance**: Caching layer reduces database queries
4. **Flexibility**: Easy to add new roles and permissions
5. **Audit Trail**: Track permission changes with timestamps
6. **Hierarchy**: Support for permission inheritance
7. **Testability**: Repository pattern enables comprehensive testing

## Risk Mitigation

1. **Backward Compatibility**: Static arrays serve as fallback
2. **Gradual Migration**: One handler at a time
3. **Performance Monitoring**: Cache hit rates and query times
4. **Data Integrity**: Database constraints and transactions
5. **Rollback Plan**: Migration script can be reversed

## Success Criteria

1. Database schema created and seeded successfully
2. Repository implementations pass all tests
3. Cache layer improves performance (>90% hit rate)
4. Admin UI allows permission management
5. Existing API handlers continue to work
6. At least one handler migrated to dynamic permissions
7. Performance is not degraded
8. Documentation is complete

## Implementation Notes

### Permission Naming Convention
Current permissions use format: `resource.action` (e.g., `cms.read`)
This convention should be maintained in the database schema.

### Role Hierarchy
Initial implementation will have flat role structure.
Future enhancement could add role hierarchy for inheritance.

### Cache Invalidation
Cache should be invalidated when:
- Permissions are updated
- Role permissions are changed
- Cache TTL expires (default 5 minutes)

### Admin UI Priority
Focus on basic CRUD operations first:
- List/Create/Edit/Delete permissions
- List/Create/Edit/Delete roles
- Assign permissions to roles

Advanced features can be added later:
- Permission templates
- Bulk operations
- Import/export