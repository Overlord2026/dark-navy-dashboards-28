import { HashingService } from '../crypto/HashingService';

export interface CacheKey {
  tenantId: string;
  policyVersion: string;
  jurisdiction: string;
  structuralHash: string;
}

export interface CachedPolicy {
  compiledPolicy: any;
  structuralHash: string;
  cachedAt: Date;
  expiresAt: Date;
}

/**
 * Policy compiler cache with structural hash-based invalidation
 * Implements content-based caching for policy compilation optimization
 */
export class PolicyCompilerCache {
  private cache = new Map<string, CachedPolicy>();
  private readonly DEFAULT_TTL = 3600000; // 1 hour

  /**
   * Generate cache key from policy context
   */
  async generateCacheKey(
    tenantId: string,
    policyVersion: string,
    jurisdiction: string,
    policyGraph: any
  ): Promise<string> {
    const structuralHash = await HashingService.structuralHash(policyGraph);
    return HashingService.generateCacheKey(tenantId, policyVersion, jurisdiction, structuralHash);
  }

  /**
   * Get compiled policy from cache
   */
  get(cacheKey: string): CachedPolicy | null {
    const cached = this.cache.get(cacheKey);
    
    if (!cached) {
      return null;
    }
    
    // Check expiration
    if (new Date() > cached.expiresAt) {
      this.cache.delete(cacheKey);
      return null;
    }
    
    return cached;
  }

  /**
   * Store compiled policy in cache
   */
  set(
    cacheKey: string,
    compiledPolicy: any,
    structuralHash: string,
    ttlMs: number = this.DEFAULT_TTL
  ): void {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + ttlMs);
    
    this.cache.set(cacheKey, {
      compiledPolicy,
      structuralHash,
      cachedAt: now,
      expiresAt
    });
  }

  /**
   * Invalidate cache entries by tenant
   */
  invalidateByTenant(tenantId: string): void {
    for (const [key, value] of this.cache.entries()) {
      if (key.startsWith(`${tenantId}:`)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Invalidate cache entries by structural hash
   */
  invalidateByStructuralHash(structuralHash: string): void {
    for (const [key, value] of this.cache.entries()) {
      if (value.structuralHash === structuralHash) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    hitRate: number;
    expired: number;
  } {
    const now = new Date();
    let expired = 0;
    
    for (const [key, value] of this.cache.entries()) {
      if (now > value.expiresAt) {
        expired++;
      }
    }
    
    return {
      size: this.cache.size,
      hitRate: 0, // Would need hit/miss tracking for accurate calculation
      expired
    };
  }

  /**
   * Cleanup expired entries
   */
  cleanup(): void {
    const now = new Date();
    
    for (const [key, value] of this.cache.entries()) {
      if (now > value.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}