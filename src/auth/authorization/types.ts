import type { AdminRole } from "../permissions";

/**
 * Core identity interface for authorization system
 * Represents a user who has been authenticated and has a role
 */
export interface Identity {
  id: string;
  email: string | null;
  role: AdminRole;
}

/**
 * Legacy admin identity type for backward compatibility
 * @deprecated Use Identity instead
 */
export type AdminIdentity = Identity;

/**
 * Base class for authorization errors
 */
export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}

/**
 * Error thrown when authentication fails (no valid token or invalid token)
 */
export class UnauthorizedError extends AuthorizationError {
  constructor(message: string = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

/**
 * Error thrown when authentication succeeds but permission is denied
 */
export class ForbiddenError extends AuthorizationError {
  constructor(message: string = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

/**
 * Token validator interface
 * Validates a token and returns identity if valid
 */
export interface TokenValidator {
  validate(token: string): Promise<Identity | null>;
}

/**
 * Permission checker interface
 * Checks if an identity has a specific permission
 */
export interface PermissionChecker {
  checkPermission(identity: Identity, permission: string): boolean;
}