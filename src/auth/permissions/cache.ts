import type { Permission } from "./repository";

/**
 * Cache entry with timestamp
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * Permission Cache Interface
 * Provides caching for permission data to improve performance
 */
export interface PermissionCache {
  /**
   * Get cached permissions for a role
   */
  get(roleName: string): Permission[] | null;

  /**
   * Set cached permissions for a role
   */
  set(roleName: string, permissions: Permission[]): void;

  /**
   * Clear cache for a specific role
   */
  clear(roleName: string): void;

  /**
   * Clear all cache
   */
  clearAll(): void;

  /**
   * Check if cache entry is valid (not expired)
   */
  isValid(roleName: string): boolean;
}

/**
 * In-memory permission cache implementation
 */
export class InMemoryPermissionCache implements PermissionCache {
  private cache: Map<string, CacheEntry<Permission[]>> = new Map();
  private readonly ttl: number; // Time to live in milliseconds

  constructor(ttl: number = 5 * 60 * 1000) {
    // Default TTL: 5 minutes
    this.ttl = ttl;
  }

  get(roleName: string): Permission[] | null {
    const entry = this.cache.get(roleName);
    if (!entry) return null;

    if (!this.isValid(roleName)) {
      this.cache.delete(roleName);
      return null;
    }

    return entry.data;
  }

  set(roleName: string, permissions: Permission[]): void {
    this.cache.set(roleName, {
      data: permissions,
      timestamp: Date.now(),
    });
  }

  clear(roleName: string): void {
    this.cache.delete(roleName);
  }

  clearAll(): void {
    this.cache.clear();
  }

  isValid(roleName: string): boolean {
    const entry = this.cache.get(roleName);
    if (!entry) return false;

    const now = Date.now();
    return now - entry.timestamp < this.ttl;
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; hitRate: number } {
    return {
      size: this.cache.size,
      hitRate: 0, // Would need to track hits/misses for accurate rate
    };
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp >= this.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

/**
 * Create a permission cache instance
 * @param ttl - Time to live in milliseconds (default: 5 minutes)
 * @returns PermissionCache instance
 */
export function createPermissionCache(ttl?: number): PermissionCache {
  return new InMemoryPermissionCache(ttl);
}