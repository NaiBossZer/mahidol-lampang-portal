# Authorization Module Documentation

## Overview

The Authorization Module is a centralized, dependency-injected authorization system for the Mahidol Lampang Portal. It provides a clean separation between authentication (token validation) and authorization (permission checking), making the system more testable, maintainable, and flexible.

## Design Rationale

### Problem Statement

The previous authorization implementation had several issues:

1. **Scattered Logic**: Authorization logic was mixed with HTTP handling in `api/_authorization.ts`
2. **Tight Coupling**: Token validation was directly coupled to HTTP request/response objects
3. **Limited Testability**: Hard to test authorization logic without HTTP context
4. **Inflexible**: Difficult to swap authentication providers or test with mock implementations

### Solution

The new module addresses these issues by:

1. **Separation of Concerns**: Clear boundaries between token validation, role extraction, and permission checking
2. **Dependency Injection**: Token validators and permission checkers are injected, making them easily replaceable
3. **Interface-Based Design**: Clear interfaces enable testing with mock implementations
4. **Functional Composition**: The main module composes sub-modules for maximum flexibility

## Architecture

### Module Structure

```
src/auth/authorization/
├── index.ts                      # Main module exports and factory functions
├── types.ts                      # Core types and error classes
├── role-extraction.ts            # Role extraction from JWT payloads
├── permission-checking.ts       # Permission checking implementation
├── supabase-token-validator.ts  # Supabase JWT token validator
└── README.md                     # Module-specific documentation
```

### Key Interfaces

#### TokenValidator
```typescript
interface TokenValidator {
  validate(token: string): Promise<Identity | null>;
}
```

Validates a token string and returns an `Identity` object if valid, or `null` if invalid.

#### PermissionChecker
```typescript
interface PermissionChecker {
  checkPermission(identity: Identity, permission: string): boolean;
}
```

Checks if a given identity has a specific permission.

#### Authorization
```typescript
interface Authorization {
  validateToken(token: string): Promise<Identity | null>;
  checkPermission(identity: Identity, permission: string): boolean;
  requireAuthentication(identity: Identity | null): Identity;
  requireAuthorization(identity: Identity | null, permission: string): Identity;
}
```

Main authorization interface combining token validation and permission checking.

### Core Types

#### Identity
```typescript
interface Identity {
  id: string;
  email: string | null;
  role: AdminRole;
}
```

Represents an authenticated user with their role information.

#### AdminRole
```typescript
type AdminRole = "SUPER_ADMIN" | "CONTENT_ADMIN" | "OPERATIONS_ADMIN" | "FACILITY_ADMIN";
```

Available administrative roles in the system.

### Error Classes

#### UnauthorizedError
Thrown when authentication fails (no valid token or invalid token).

#### ForbiddenError
Thrown when authentication succeeds but permission is denied.

## Implementation Details

### Token Validation

The `SupabaseTokenValidator` implements JWT token validation:

1. Splits the JWT into header, payload, and signature
2. Decodes and validates the header (must be HS256)
3. Verifies the signature using HMAC-SHA256
4. Checks token expiration
5. Extracts user identity from the payload

### Role Extraction

The `role-extraction.ts` module handles extracting user information from JWT payloads:

- `extractRole()`: Extracts role from `app_metadata.role` or `payload.role`
- `extractUserId()`: Extracts user ID from `sub` field
- `extractEmail()`: Extracts email from `email` field
- `isExpired()`: Checks if token has expired

### Permission Checking

The `DefaultPermissionChecker` implements role-based access control:

- SUPER_ADMIN: Has all permissions
- Other roles: Have specific permission sets defined in `src/auth/permissions.ts`

## Usage Patterns

### Basic Authorization

```typescript
import { createDefaultAuthorization } from "./src/auth/authorization";

const auth = createDefaultAuthorization();

// Validate token
const identity = await auth.validateToken(token);
if (!identity) {
  // Handle unauthorized
}

// Check permission
if (!auth.checkPermission(identity, "cms.read")) {
  // Handle forbidden
}
```

### With Error Handling

```typescript
import { createDefaultAuthorization, UnauthorizedError, ForbiddenError } from "./src/auth/authorization";

const auth = createDefaultAuthorization();

try {
  const identity = await auth.validateToken(token);
  const authorized = auth.requireAuthorization(identity, "cms.create");
  // Proceed with authorized operation
} catch (error) {
  if (error instanceof UnauthorizedError) {
    // Handle unauthorized
  } else if (error instanceof ForbiddenError) {
    // Handle forbidden
  }
}
```

### Custom Token Validator

```typescript
import { createAuthorization } from "./src/auth/authorization";
import { createPermissionChecker } from "./src/auth/authorization";

class CustomTokenValidator implements TokenValidator {
  async validate(token: string): Promise<Identity | null> {
    // Custom validation logic
  }
}

const auth = createAuthorization(
  new CustomTokenValidator(),
  createPermissionChecker()
);
```

## Migration Guide

### Phase 1: Module Creation (Complete)

All module files have been created without touching existing code.

### Phase 2: Legacy Wrappers

Update `api/_authorization.ts` and `api/_auth.ts` to use the new module internally while maintaining existing function signatures.

### Phase 3: Incremental Migration

Migrate API handlers one at a time:

1. Start with a simple handler (e.g., admin overview)
2. Replace legacy function calls with new module calls
3. Test thoroughly
4. Repeat for other handlers

### Phase 4: Cleanup

Remove legacy wrappers once all handlers are migrated.

## Testing Strategy

### Unit Tests

Each sub-module should have unit tests:

- `role-extraction.test.ts`: Test role extraction logic
- `permission-checking.test.ts`: Test permission checking
- `token-validation.test.ts`: Test token validation

### Integration Tests

Test the full authorization flow with the main module.

### Mock Implementations

Test helpers in `src/auth/__tests__/helpers/mock-factories.ts` provide:

- `createMockTokenValidator()`: Mock token validator
- `createMockPermissionChecker()`: Mock permission checker
- `createMockIdentity()`: Mock identity objects

## Benefits

1. **Locality**: All authorization logic centralized in one module
2. **Testability**: Dependency injection enables comprehensive testing without HTTP coupling
3. **Maintainability**: Clear module boundaries and interfaces
4. **Flexibility**: Easy to swap implementations for different auth providers
5. **Type Safety**: Full TypeScript support with clear interfaces
6. **Backward Compatibility**: Legacy wrappers ensure smooth migration

## Security Considerations

1. **Token Validation**: Uses constant-time comparison for signature verification to prevent timing attacks
2. **Expiration Checking**: Always validates token expiration
3. **Role Validation**: Strict type checking for role values
4. **Permission Checking**: Default-deny for unknown permissions

## Performance

The module is designed for performance:

- Asynchronous token validation to avoid blocking
- Efficient permission checking with pre-computed role-permission mappings
- Minimal memory footprint with functional composition

## Future Enhancements

Potential future improvements:

1. **Caching**: Add token validation caching to reduce overhead
2. **Multiple Providers**: Support for multiple authentication providers
3. **Fine-grained Permissions**: More granular permission system
4. **Session Management**: Built-in session management
5. **Audit Logging**: Authorization event logging

## References

- Module README: `src/auth/authorization/README.md`
- Permissions: `src/auth/permissions.ts`
- Legacy Implementation: `api/_authorization.ts`