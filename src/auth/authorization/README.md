# Authorization Module

A comprehensive authorization system for the Mahidol Lampang Portal, providing token validation, role-based access control, and permission checking with dependency injection support.

## Overview

The authorization module centralizes all authentication and authorization logic into a single, testable module with clear interfaces. It supports:

- **Token Validation**: Validate Supabase JWT tokens and extract user identity
- **Role Extraction**: Extract and validate user roles from JWT payloads
- **Permission Checking**: Role-based permission validation
- **Dependency Injection**: Easy to swap implementations for different auth providers

## Quick Start

### Basic Usage

```typescript
import { createDefaultAuthorization } from "./src/auth/authorization";

// Create authorization module with default Supabase implementation
const auth = createDefaultAuthorization();

// Validate a token
const identity = await auth.validateToken(token);

// Check permissions
if (auth.checkPermission(identity, "cms.read")) {
  // User has permission
}

// Require authentication (throws if not authenticated)
const authenticated = auth.requireAuthentication(identity);

// Require authorization (throws if not authorized)
const authorized = auth.requireAuthorization(identity, "cms.create");
```

### Custom Implementation

```typescript
import { createAuthorization } from "./src/auth/authorization";
import { createMockTokenValidator } from "./src/auth/__tests__/helpers/mock-factories";

// Create custom token validator
const customValidator = createMockTokenValidator({
  validIdentity: { id: "123", email: "test@example.com", role: "SUPER_ADMIN" }
});

// Create authorization module with custom validator
const auth = createAuthorization(customValidator, permissionChecker);
```

## API Reference

### Authorization Interface

The main `Authorization` interface provides:

- `validateToken(token: string): Promise<Identity | null>` - Validate a token and return identity
- `checkPermission(identity: Identity, permission: string): boolean` - Check if identity has permission
- `requireAuthentication(identity: Identity | null): Identity` - Require authentication (throws UnauthorizedError)
- `requireAuthorization(identity: Identity | null, permission: string): Identity` - Require authorization (throws ForbiddenError)

### Types

#### Identity
```typescript
interface Identity {
  id: string;
  email: string | null;
  role: AdminRole;
}
```

#### AdminRole
Available roles: `SUPER_ADMIN`, `CONTENT_ADMIN`, `OPERATIONS_ADMIN`, `FACILITY_ADMIN`

### Errors

- `UnauthorizedError` - Thrown when authentication fails
- `ForbiddenError` - Thrown when authorization fails

### Sub-modules

#### Token Validation
```typescript
import { createSupabaseTokenValidator } from "./src/auth/authorization";

const validator = createSupabaseTokenValidator();
const identity = await validator.validate(token);
```

#### Permission Checking
```typescript
import { createPermissionChecker } from "./src/auth/authorization";

const checker = createPermissionChecker();
const hasPermission = checker.checkPermission(identity, "cms.read");
```

#### Role Extraction
```typescript
import { extractRole, extractUserId, extractEmail } from "./src/auth/authorization";

const role = extractRole(jwtPayload);
const userId = extractUserId(jwtPayload);
const email = extractEmail(jwtPayload);
```

## Integration with Existing Code

The module includes legacy compatibility wrappers in `api/_authorization.ts` and `api/_auth.ts` to ensure existing code continues to work during migration.

### Migration Guide

1. **Phase 1**: Use the new module alongside existing code
2. **Phase 2**: Update one API handler at a time to use the new module
3. **Phase 3**: Remove legacy wrappers once all handlers are migrated

Example migration:

```typescript
// Before (using legacy wrapper)
import { requirePermission } from "./api/_authorization";

const identity = requirePermission(req, res, "cms.read");

// After (using new module)
import { createDefaultAuthorization } from "./src/auth/authorization";

const auth = createDefaultAuthorization();
const identity = await auth.validateToken(token);
auth.requireAuthorization(identity, "cms.read");
```

## Testing

The module includes test helpers in `src/auth/__tests__/helpers/mock-factories.ts` for creating mock implementations when a testing framework is added to the project:

```typescript
import { createMockTokenValidator, createMockPermissionChecker, createMockIdentity } from "./src/auth/__tests__/helpers/mock-factories";

const mockValidator = createMockTokenValidator({
  validIdentity: createMockIdentity({ role: "SUPER_ADMIN" })
});

const mockChecker = createMockPermissionChecker({
  grantedPermissions: ["cms.read", "cms.create"]
});
```

## File Structure

```
src/auth/authorization/
├── index.ts                      # Main module exports
├── types.ts                      # Core types and errors
├── token-validation.ts           # Token validation logic
├── role-extraction.ts            # Role extraction from JWT
├── permission-checking.ts       # Permission checking logic
├── supabase-token-validator.ts  # Supabase implementation
└── README.md                     # This file
```

## Design Principles

1. **Locality**: All authorization logic in one module
2. **Testability**: Dependency injection enables comprehensive testing
3. **Flexibility**: Easy to swap implementations
4. **Type Safety**: Full TypeScript support
5. **Backward Compatibility**: Legacy wrappers ensure smooth migration