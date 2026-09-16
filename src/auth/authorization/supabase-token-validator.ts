import crypto from "node:crypto";
import type { Identity, TokenValidator } from "./types";
import { extractEmail, extractRole, extractUserId, isExpired, type JwtPayload } from "./role-extraction";

/**
 * Supabase JWT token validator implementation
 * Validates Supabase JWT tokens and extracts user identity
 */
export class SupabaseTokenValidator implements TokenValidator {
  private readonly secret: string;

  /**
   * Create a Supabase token validator
   * @param secret - Supabase JWT secret (defaults to SUPABASE_JWT_SECRET env var)
   */
  constructor(secret?: string) {
    this.secret = secret ?? process.env.SUPABASE_JWT_SECRET ?? "";
    if (!this.secret) {
      throw new Error("SUPABASE_JWT_SECRET is required for SupabaseTokenValidator");
    }
  }

  /**
   * Validate a JWT token and extract identity
   * @param token - JWT token string
   * @returns Identity if token is valid, null otherwise
   */
  async validate(token: string): Promise<Identity | null> {
    try {
      const payload = this.decodeAndVerifyToken(token);
      if (!payload) return null;

      const userId = extractUserId(payload);
      if (!userId) return null;

      const role = extractRole(payload);
      if (!role) return null;

      if (isExpired(payload)) return null;

      return {
        id: userId,
        email: extractEmail(payload),
        role,
      };
    } catch {
      return null;
    }
  }

  /**
   * Decode and verify JWT token signature
   * @param token - JWT token string
   * @returns Decoded payload if valid, null otherwise
   */
  private decodeAndVerifyToken(token: string): JwtPayload | null {
    const [headerPart, payloadPart, signature] = token.split(".");
    if (!headerPart || !payloadPart || !signature) return null;

    const header = this.decodePart(headerPart);
    const payload = this.decodePart(payloadPart);

    if (!header || !payload || header.alg !== "HS256") return null;

    const expected = crypto
      .createHmac("sha256", this.secret)
      .update(`${headerPart}.${payloadPart}`)
      .digest("base64url");

    const expectedBytes = Buffer.from(expected);
    const actualBytes = Buffer.from(signature);

    if (
      expectedBytes.length !== actualBytes.length ||
      !crypto.timingSafeEqual(expectedBytes, actualBytes)
    ) {
      return null;
    }

    return payload as JwtPayload;
  }

  /**
   * Decode a base64url-encoded JWT part
   * @param value - Base64url-encoded string
   * @returns Decoded object or null if decoding fails
   */
  private decodePart(value: string): Record<string, unknown> | null {
    try {
      return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as Record<string, unknown>;
    } catch {
      return null;
    }
  }
}

/**
 * Create a Supabase token validator instance
 * @param secret - Optional Supabase JWT secret
 * @returns TokenValidator instance
 */
export function createSupabaseTokenValidator(secret?: string): TokenValidator {
  return new SupabaseTokenValidator(secret);
}