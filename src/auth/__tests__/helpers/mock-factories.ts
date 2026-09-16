import type { Identity, PermissionChecker, TokenValidator } from "../../authorization";

/**
 * Create a mock token validator for testing
 * @param options - Configuration options for the mock validator
 * @returns Mock TokenValidator implementation
 */
export function createMockTokenValidator(options: {
  validIdentity?: Identity | null;
  delay?: number;
}): TokenValidator {
  const { validIdentity = null, delay = 0 } = options;

  return {
    async validate(token: string): Promise<Identity | null> {
      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
      // Simple mock: return the configured identity for any non-empty token
      return token ? validIdentity : null;
    },
  };
}

/**
 * Create a mock permission checker for testing
 * @param options - Configuration options for the mock permission checker
 * @returns Mock PermissionChecker implementation
 */
export function createMockPermissionChecker(options: {
  grantedPermissions?: string[];
  defaultResult?: boolean;
}): PermissionChecker {
  const { grantedPermissions = [], defaultResult = false } = options;

  return {
    checkPermission(identity: Identity, permission: string): boolean {
      if (grantedPermissions.length === 0) {
        return defaultResult;
      }
      return grantedPermissions.includes(permission);
    },
  };
}

/**
 * Create a mock identity for testing
 * @param options - Configuration options for the mock identity
 * @returns Mock Identity object
 */
export function createMockIdentity(options: {
  id?: string;
  email?: string | null;
  role?: string;
}): Identity {
  const { id = "test-user-id", email = "test@example.com", role = "SUPER_ADMIN" } = options;
  return {
    id,
    email,
    role: role as any, // Type assertion for testing purposes
  };
}

/**
 * Create a valid mock token string
 * @returns Mock JWT token string
 */
export function createMockToken(): string {
  return "mock.jwt.token";
}

/**
 * Create a collection of test identities with different roles
 * @returns Object containing test identities for each role
 */
export function createTestIdentities(): Record<string, Identity> {
  return {
    superAdmin: createMockIdentity({ role: "SUPER_ADMIN" }),
    contentAdmin: createMockIdentity({ role: "CONTENT_ADMIN" }),
    operationsAdmin: createMockIdentity({ role: "OPERATIONS_ADMIN" }),
    facilityAdmin: createMockIdentity({ role: "FACILITY_ADMIN" }),
  };
}