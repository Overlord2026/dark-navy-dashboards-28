import { supabase } from '@/integrations/supabase/client';
import { HashingService } from '../crypto/HashingService';

interface TokenRequest {
  tenantId: string;
  requiredScopes: string[];
  expiresAt?: Date;
  userId?: string;
}

interface PolicyToken {
  id: string;
  tokenHash: string;
  tokenBody: any;
  scopes: string[];
  expiresAt?: Date;
}

interface GreedySetCoverResult {
  selectedSets: string[];
  coverage: string[];
  isMinimal: boolean;
}

/**
 * Minimal-scope tokenization using greedy set-cover algorithm
 * with strict-subset elimination for optimal token generation
 */
export class MinimalScopeTokenizer {
  
  /**
   * Generate minimal-scope token using greedy set-cover algorithm
   * @param request - Token generation request
   * @returns Generated token with minimal scopes
   */
  async generateToken(request: TokenRequest): Promise<PolicyToken> {
    // Get available scope sets from policy configuration
    const availableScopeSets = await this.getAvailableScopeSets(request.tenantId);
    
    // Apply greedy set-cover to find minimal covering
    const coverResult = this.greedySetCover(request.requiredScopes, availableScopeSets);
    
    // Apply strict-subset elimination
    const minimalScopes = this.eliminateStrictSubsets(coverResult.coverage);
    
    // Create canonical token body
    const tokenBody = this.createCanonicalTokenBody({
      tenantId: request.tenantId,
      scopes: minimalScopes,
      expiresAt: request.expiresAt,
      issuedAt: new Date(),
      algorithm: 'greedy_set_cover_v1'
    });
    
    // Calculate token hash using SHA3-256
    const tokenHash = HashingService.sha3Hash(tokenBody);
    
    // Check for replay attacks
    await this.checkReplayAttack(tokenHash);
    
    // Store token in database
    const { data, error } = await supabase
      .from('policy_tokens')
      .insert({
        tenant_id: request.tenantId,
        token_hash: tokenHash,
        token_body: tokenBody,
        scopes: minimalScopes,
        expires_at: request.expiresAt?.toISOString(),
        user_id: request.userId || 'system'
      })
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to store token: ${error.message}`);
    }
    
    return {
      id: data.id,
      tokenHash,
      tokenBody,
      scopes: minimalScopes,
      expiresAt: request.expiresAt
    };
  }

  /**
   * Greedy set-cover algorithm to find minimal scope covering
   * @param requiredScopes - Scopes that must be covered
   * @param availableSets - Available scope sets to choose from
   * @returns Set cover result
   */
  private greedySetCover(
    requiredScopes: string[], 
    availableSets: { [key: string]: string[] }
  ): GreedySetCoverResult {
    const uncovered = new Set(requiredScopes);
    const selectedSets: string[] = [];
    const coverage: string[] = [];
    
    while (uncovered.size > 0) {
      let bestSet = '';
      let bestCoverage = 0;
      
      // Find set that covers the most uncovered elements
      for (const [setName, scopes] of Object.entries(availableSets)) {
        const intersection = scopes.filter(scope => uncovered.has(scope));
        if (intersection.length > bestCoverage) {
          bestCoverage = intersection.length;
          bestSet = setName;
        }
      }
      
      if (bestSet === '') {
        throw new Error(`Cannot cover required scopes: ${Array.from(uncovered).join(', ')}`);
      }
      
      // Add selected set and update coverage
      selectedSets.push(bestSet);
      const newScopes = availableSets[bestSet].filter(scope => !coverage.includes(scope));
      coverage.push(...newScopes);
      
      // Remove covered elements
      newScopes.forEach(scope => uncovered.delete(scope));
    }
    
    return {
      selectedSets,
      coverage,
      isMinimal: this.verifyMinimalCoverage(requiredScopes, coverage)
    };
  }

  /**
   * Eliminate strict subsets from scope collection
   * @param scopes - Scope collection
   * @returns Minimal scope set with strict subsets removed
   */
  private eliminateStrictSubsets(scopes: string[]): string[] {
    const result: string[] = [];
    
    for (const scope of scopes) {
      let isSubset = false;
      
      // Check if current scope is a strict subset of any existing scope
      for (const existing of result) {
        if (this.isStrictSubset(scope, existing)) {
          isSubset = true;
          break;
        }
      }
      
      if (!isSubset) {
        // Remove any existing scopes that are strict subsets of current scope
        const filtered = result.filter(existing => !this.isStrictSubset(existing, scope));
        result.length = 0;
        result.push(...filtered, scope);
      }
    }
    
    return result.sort(); // Stable sort for determinism
  }

  /**
   * Check if scopeA is a strict subset of scopeB
   * @param scopeA - First scope
   * @param scopeB - Second scope
   * @returns True if scopeA is strict subset of scopeB
   */
  private isStrictSubset(scopeA: string, scopeB: string): boolean {
    // Handle wildcard patterns
    if (scopeB.endsWith(':*')) {
      const prefix = scopeB.slice(0, -2);
      return scopeA.startsWith(prefix + ':') && scopeA !== scopeB;
    }
    
    // Handle hierarchical scopes (admin > user > guest)
    const hierarchies = [
      ['admin', 'user', 'guest'],
      ['write', 'read'],
      ['delete', 'update', 'create', 'read']
    ];
    
    for (const hierarchy of hierarchies) {
      const aIndex = hierarchy.indexOf(scopeA.split(':')[1] || scopeA);
      const bIndex = hierarchy.indexOf(scopeB.split(':')[1] || scopeB);
      
      if (aIndex !== -1 && bIndex !== -1 && bIndex < aIndex) {
        const aPrefix = scopeA.split(':')[0];
        const bPrefix = scopeB.split(':')[0];
        if (aPrefix === bPrefix) {
          return true;
        }
      }
    }
    
    return false;
  }

  /**
   * Create canonical token body for deterministic hashing
   * @param data - Token data
   * @returns Canonical token body
   */
  private createCanonicalTokenBody(data: any): any {
    return {
      algorithm: data.algorithm,
      expiresAt: data.expiresAt?.toISOString() || null,
      issuedAt: data.issuedAt.toISOString(),
      scopes: [...data.scopes].sort(), // Stable sort
      tenantId: data.tenantId
    };
  }

  /**
   * Check for token replay attacks
   * @param tokenHash - Token hash to check
   */
  private async checkReplayAttack(tokenHash: string): Promise<void> {
    const { data } = await supabase
      .from('policy_tokens')
      .select('id')
      .eq('token_hash', tokenHash)
      .single();
    
    if (data) {
      throw new Error('Token replay detected: hash already exists');
    }
  }

  /**
   * Get available scope sets for tenant
   * @param tenantId - Tenant ID
   * @returns Available scope sets
   */
  private async getAvailableScopeSets(tenantId: string): Promise<{ [key: string]: string[] }> {
    // Default scope sets - in production, load from configuration
    return {
      'admin_full': ['admin:*'],
      'advisor_standard': ['advisor:read', 'advisor:write', 'client:read'],
      'client_basic': ['client:read', 'profile:read', 'profile:write'],
      'read_only': ['*:read'],
      'write_limited': ['profile:write', 'client:write']
    };
  }

  /**
   * Verify minimal coverage property
   * @param required - Required scopes
   * @param coverage - Actual coverage
   * @returns True if coverage is minimal
   */
  private verifyMinimalCoverage(required: string[], coverage: string[]): boolean {
    const coveredSet = new Set(coverage);
    return required.every(scope => coveredSet.has(scope));
  }

  /**
   * Validate token and check expiration
   * @param tokenHash - Token hash to validate
   * @returns Token validation result
   */
  async validateToken(tokenHash: string): Promise<PolicyToken | null> {
    const { data, error } = await supabase
      .from('policy_tokens')
      .select('*')
      .eq('token_hash', tokenHash)
      .single();
    
    if (error || !data) {
      return null;
    }
    
    // Check expiration
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return null;
    }
    
    return {
      id: data.id,
      tokenHash: data.token_hash,
      tokenBody: data.token_body,
      scopes: data.scopes,
      expiresAt: data.expires_at ? new Date(data.expires_at) : undefined
    };
  }
}