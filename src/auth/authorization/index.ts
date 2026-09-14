import type { Identity, PermissionChecker, TokenValidator, AdminIdentity } from "./types";
import { UnauthorizedError, ForbiddenError } from "./types";
import { createPermissionChecker } from "./permission-checking";
import { createSupabaseTokenValidator } from "./supabase-token-validator";

/**
 * Authorization module interface
 * Provides comprehensive authorization functionality
 */
export interface Authorization {
  /**
   * Validate a token and return identity
   */
  validateToken(token: string): Promise<Identity | null>;

  /**
   * Check if an identity has a specific permission
   */
  checkPermission(identity: Identity, permission: string): boolean;

  /**
   * Require authentication - throws if not authenticated
   */
  requireAuthentication(identity: Identity | null): Identity;

  /**
   * Require authorization - throws if not authorized
   */
  requireAuthorization(identity: Identity | null, permission: string): Identity;
}

/**
 * Authorization module implementation
 */
class AuthorizationModule implements Authorization {
  constructor(
    private readonly tokenValidator: TokenValidator,
    private readonly permissionChecker: PermissionChecker,
  ) {}

  /**
   * Validate a token and return identity
   */
  async validateToken(token: string): Promise<Identity | null> {
    return this.tokenValidator.validate(token);
  }

  /**
   * Check if an identity has a specific permission
   */
  checkPermission(identity: Identity, permission: string): boolean {
    return this.permissionChecker.checkPermission(identity, permission);
  }

  /**
   * Require authentication - throws if not authenticated
   */
  requireAuthentication(identity: Identity | null): Identity {
    if (!identity) {
      throw new UnauthorizedError();
    }
    return identity;
  }

  /**
   * Require authorization - throws if not authorized
   */
  requireAuthorization(identity: Identity | null, permission: string): Identity {
    const authenticated = this.requireAuthentication(identity);
    if (!this.checkPermission(authenticated, permission)) {
      throw new ForbiddenError();
    }
    return authenticated;
  }
}

/**
 * Create an authorization module with custom dependencies
 * @param tokenValidator - Token validator implementation
 * @param permissionChecker - Permission checker implementation
 * @returns Authorization module instance
 */
export function createAuthorization(
  tokenValidator: TokenValidator,
  permissionChecker: PermissionChecker,
): Authorization {
  return new AuthorizationModule(tokenValidator, permissionChecker);
}

/**
 * Create an authorization module with default Supabase implementation
 * @param secret - Optional Supabase JWT secret
 * @returns Authorization module instance
 */
export function createDefaultAuthorization(secret?: string): Authorization {
  const tokenValidator = createSupabaseTokenValidator(secret);
  const permissionChecker = createPermissionChecker();
  return createAuthorization(tokenValidator, permissionChecker);
}

// Re-export types and errors for convenience
export type { Identity, TokenValidator, PermissionChecker, AdminIdentity } from "./types";
export { UnauthorizedError, ForbiddenError, AuthorizationError } from "./types";
export { createPermissionChecker, DefaultPermissionChecker } from "./permission-checking";
export { createSupabaseTokenValidator, SupabaseTokenValidator } from "./supabase-token-validator";
export {
  extractRole,
  extractUserId,
  extractEmail,
  isExpired,
  type JwtPayload,
} from "./role-extraction";