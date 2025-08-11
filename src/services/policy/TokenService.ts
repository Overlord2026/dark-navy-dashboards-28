// Policy Token Service - Mints ephemeral JWT tokens with scopes
// Signs tokens with server key and manages token lifecycle

import { supabase } from '@/integrations/supabase/client';

export interface PolicyTokenPayload {
  tenant_id: string;
  persona_id: string;
  user_id: string;
  scopes: string[];
  iat: number;
  exp: number;
  jti: string; // JWT ID for tracking
  aud: string; // Audience
  iss: string; // Issuer
}

export interface TokenOptions {
  expires_in_seconds?: number;
  max_scopes?: number;
  audience?: string;
  include_metadata?: boolean;
}

export interface TokenValidationResult {
  valid: boolean;
  payload?: PolicyTokenPayload;
  error?: string;
  expired?: boolean;
  revoked?: boolean;
}

export interface TokenRevocationResult {
  success: boolean;
  error?: string;
}

export class TokenService {
  private static readonly DEFAULT_EXPIRY = 3600; // 1 hour
  private static readonly MAX_EXPIRY = 86400; // 24 hours
  private static readonly ISSUER = 'multi-persona-os';
  private static readonly AUDIENCE = 'policy-engine';
  
  // Simple JWT implementation (in production, use a proper JWT library)
  private static base64UrlEncode(data: string): string {
    return btoa(data)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }
  
  private static base64UrlDecode(data: string): string {
    // Add padding if needed
    data += '='.repeat((4 - data.length % 4) % 4);
    return atob(data.replace(/-/g, '+').replace(/_/g, '/'));
  }
  
  private static async createSignature(data: string): Promise<string> {
    // In production, use proper HMAC or RSA signing
    // For demonstration, using a simple hash
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    try {
      const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
      const hashArray = new Uint8Array(hashBuffer);
      const hashHex = Array.from(hashArray)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      
      return this.base64UrlEncode(hashHex);
    } catch (error) {
      // Fallback for environments without crypto.subtle
      let hash = 0;
      for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      return this.base64UrlEncode(Math.abs(hash).toString(16));
    }
  }
  
  static async mintToken(
    userId: string,
    tenantId: string,
    personaId: string,
    scopes: string[],
    options: TokenOptions = {}
  ): Promise<{ token: string; expires_at: Date }> {
    
    // Validate inputs
    if (!userId || !tenantId || !personaId) {
      throw new Error('Missing required parameters: userId, tenantId, personaId');
    }
    
    if (scopes.length === 0) {
      throw new Error('At least one scope is required');
    }
    
    if (options.max_scopes && scopes.length > options.max_scopes) {
      throw new Error(`Too many scopes: ${scopes.length} > ${options.max_scopes}`);
    }
    
    // Minimize scopes before minting
    const minimizedScopes = ScopeUtils.minimizeScopes(scopes);
    
    // Generate token payload
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = Math.min(
      options.expires_in_seconds || this.DEFAULT_EXPIRY,
      this.MAX_EXPIRY
    );
    const expiresAt = now + expiresIn;
    
    const jti = this.generateJTI();
    
    const payload: PolicyTokenPayload = {
      tenant_id: tenantId,
      persona_id: personaId,
      user_id: userId,
      scopes: minimizedScopes,
      iat: now,
      exp: expiresAt,
      jti,
      aud: options.audience || this.AUDIENCE,
      iss: this.ISSUER
    };
    
    // Create JWT
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };
    
    const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
    const encodedPayload = this.base64UrlEncode(JSON.stringify(payload));
    const unsignedToken = `${encodedHeader}.${encodedPayload}`;
    
    const signature = await this.createSignature(unsignedToken);
    const token = `${unsignedToken}.${signature}`;
    
    // Store token metadata and body in database
    await this.storeTokenMetadata(payload, token);
    
    return {
      token,
      expires_at: new Date(expiresAt * 1000)
    };
  }
  
  static async validateToken(token: string): Promise<TokenValidationResult> {
    try {
      // Parse JWT
      const parts = token.split('.');
      if (parts.length !== 3) {
        return { valid: false, error: 'Invalid token format' };
      }
      
      const [headerB64, payloadB64, signatureB64] = parts;
      
      // Verify signature
      const unsignedToken = `${headerB64}.${payloadB64}`;
      const expectedSignature = await this.createSignature(unsignedToken);
      
      if (signatureB64 !== expectedSignature) {
        return { valid: false, error: 'Invalid signature' };
      }
      
      // Decode payload
      const payload: PolicyTokenPayload = JSON.parse(this.base64UrlDecode(payloadB64));
      
      // Check expiration
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp < now) {
        return { valid: false, expired: true, error: 'Token expired' };
      }
      
      // Check if token is revoked
      const isRevoked = await this.isTokenRevoked(payload.jti);
      if (isRevoked) {
        return { valid: false, revoked: true, error: 'Token revoked' };
      }
      
      return { valid: true, payload };
      
    } catch (error) {
      return { 
        valid: false, 
        error: `Token validation error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }
  
  static async revokeToken(jti: string): Promise<TokenRevocationResult> {
    try {
      const { error } = await supabase
        .from('policy_tokens')
        .update({ revoked_at: new Date().toISOString() })
        .eq('token_hash', this.hashJTI(jti));
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true };
      
    } catch (error) {
      return { 
        success: false, 
        error: `Revocation error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }
  
  static async revokeAllUserTokens(userId: string): Promise<TokenRevocationResult> {
    try {
      const { error } = await supabase
        .from('policy_tokens')
        .update({ revoked_at: new Date().toISOString() })
        .eq('user_id', userId)
        .is('revoked_at', null);
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true };
      
    } catch (error) {
      return { 
        success: false, 
        error: `Bulk revocation error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }
  
  static async cleanupExpiredTokens(): Promise<{ cleaned: number; error?: string }> {
    try {
      const { count, error } = await supabase
        .from('policy_tokens')
        .delete()
        .lt('expires_at', new Date().toISOString());
      
      if (error) {
        return { cleaned: 0, error: error.message };
      }
      
      return { cleaned: count || 0 };
      
    } catch (error) {
      return { 
        cleaned: 0, 
        error: `Cleanup error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }
  
  private static async storeTokenMetadata(
    payload: PolicyTokenPayload,
    token: string
  ): Promise<void> {
    const tokenHash = this.hashJTI(payload.jti);
    
    // Canonical token body for consistency
    const canonicalBody = this.canonicalizeTokenBody(payload);
    const bodyHash = await this.computeHash('sha256', canonicalBody);
    
    await supabase.from('policy_tokens').insert({
      user_id: payload.user_id,
      tenant_id: payload.tenant_id,
      persona_id: payload.persona_id,
      scopes: payload.scopes,
      issued_at: new Date(payload.iat * 1000).toISOString(),
      expires_at: new Date(payload.exp * 1000).toISOString(),
      hash_alg: 'sha256',
      token_body: canonicalBody,
      token_hash: bodyHash,
      metadata: {
        audience: payload.aud,
        issuer: payload.iss
      }
    });
  }

  private static canonicalizeTokenBody(payload: PolicyTokenPayload): string {
    // Create deterministic, sorted representation
    const canonical = {
      aud: payload.aud,
      exp: payload.exp,
      iat: payload.iat,
      iss: payload.iss,
      jti: payload.jti,
      persona_id: payload.persona_id,
      scopes: [...payload.scopes].sort(), // Sort scopes for consistency
      tenant_id: payload.tenant_id,
      user_id: payload.user_id
    };
    
    return JSON.stringify(canonical, Object.keys(canonical).sort());
  }

  private static async computeHash(algorithm: string, data: string): Promise<string> {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const encoder = new TextEncoder();
      const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    
    // Fallback for Node.js environments
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }
  
  private static async isTokenRevoked(jti: string): Promise<boolean> {
    try {
      const tokenHash = this.hashJTI(jti);
      
      const { data } = await supabase
        .from('policy_tokens')
        .select('revoked_at')
        .eq('token_hash', tokenHash)
        .single();
      
      return data?.revoked_at !== null;
      
    } catch (error) {
      // If token not found in database, consider it invalid
      return true;
    }
  }
  
  private static generateJTI(): string {
    // Generate a unique JWT ID
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2);
    return `${timestamp}-${random}`;
  }
  
  private static hashJTI(jti: string): string {
    // Create a hash of the JTI for database storage
    let hash = 0;
    for (let i = 0; i < jti.length; i++) {
      const char = jti.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }
}

// Token middleware for request validation
export class TokenMiddleware {
  static extractToken(authHeader: string): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    return authHeader.substring(7); // Remove 'Bearer ' prefix
  }
  
  static async verifyPolicyToken(
    authHeader: string,
    requiredScopes: string[] = []
  ): Promise<{ valid: boolean; payload?: PolicyTokenPayload; error?: string }> {
    
    const token = this.extractToken(authHeader);
    if (!token) {
      return { valid: false, error: 'Missing or invalid authorization header' };
    }
    
    const validation = await TokenService.validateToken(token);
    if (!validation.valid) {
      return validation;
    }
    
    // Check required scopes
    if (requiredScopes.length > 0 && validation.payload) {
      const hasRequiredScopes = requiredScopes.every(scope =>
        validation.payload!.scopes.includes(scope)
      );
      
      if (!hasRequiredScopes) {
        return { 
          valid: false, 
          error: `Insufficient scopes. Required: ${requiredScopes.join(', ')}` 
        };
      }
    }
    
    return validation;
  }
}

// Utility functions for scope management
export class ScopeUtils {
  static parseScope(scope: string): { action: string; resource: string } {
    const parts = scope.split(':');
    return {
      action: parts[0] || '*',
      resource: parts[1] || '*'
    };
  }
  
  static scopeMatches(grantedScope: string, requestedScope: string): boolean {
    const granted = this.parseScope(grantedScope);
    const requested = this.parseScope(requestedScope);
    
    const actionMatches = granted.action === '*' || granted.action === requested.action;
    const resourceMatches = granted.resource === '*' || 
                           granted.resource === requested.resource ||
                           (granted.resource.endsWith('*') && 
                            requested.resource.startsWith(granted.resource.slice(0, -1)));
    
    return actionMatches && resourceMatches;
  }
  
  static expandScopes(scopes: string[]): string[] {
    const expanded = new Set<string>();
    
    for (const scope of scopes) {
      expanded.add(scope);
      
      // Add implied scopes
      if (scope.startsWith('persona:')) {
        expanded.add('persona:*');
      }
      
      if (scope.startsWith('role:')) {
        expanded.add('role:*');
      }
      
      if (scope.includes(':write')) {
        // Write permission implies read permission
        const readScope = scope.replace(':write', ':read');
        expanded.add(readScope);
      }
    }
    
    return Array.from(expanded);
  }
  
  static minimizeScopes(scopes: string[]): string[] {
    // Enhanced minimal-scope algorithm with improved subsumption detection
    const deduplicated = [...new Set(scopes)]; // Remove exact duplicates
    const sorted = deduplicated.sort((a, b) => {
      // Sort by specificity (wildcards last) then alphabetically
      const aWildcard = a.includes('*') ? 1 : 0;
      const bWildcard = b.includes('*') ? 1 : 0;
      return aWildcard - bWildcard || a.localeCompare(b);
    });
    
    const minimal: string[] = [];
    
    for (const scope of sorted) {
      const isRedundant = minimal.some(existing => {
        // Check if existing scope subsumes this one
        return this.scopeSubsumes(existing, scope);
      });
      
      if (!isRedundant) {
        // Remove any existing scopes that this new scope subsumes
        const nonSubsumed = minimal.filter(existing => 
          !this.scopeSubsumes(scope, existing)
        );
        minimal.length = 0;
        minimal.push(...nonSubsumed, scope);
      }
    }
    
    return minimal.sort(); // Final alphabetical sort for determinism
  }

  static scopeSubsumes(broader: string, narrower: string): boolean {
    if (broader === narrower) return true;
    
    // Parse scopes
    const [broaderAction, broaderResource] = broader.split(':');
    const [narrowerAction, narrowerResource] = narrower.split(':');
    
    // Check action subsumption
    const actionSubsumes = broaderAction === '*' || 
                          broaderAction === narrowerAction ||
                          (broaderAction.endsWith('*') && 
                           narrowerAction.startsWith(broaderAction.slice(0, -1)));
    
    // Check resource subsumption
    const resourceSubsumes = broaderResource === '*' ||
                            broaderResource === narrowerResource ||
                            (broaderResource?.endsWith('*') && 
                             narrowerResource?.startsWith(broaderResource.slice(0, -1)));
    
    return actionSubsumes && resourceSubsumes;
  }
}
