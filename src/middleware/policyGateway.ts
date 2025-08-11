import jwt from 'jsonwebtoken';
import { supabase } from '@/integrations/supabase/client';

interface PolicyToken {
  tenant_id: string;
  persona_id: string;
  scopes: string[];
  iat: number;
  exp: number;
}

interface PolicyDenial {
  userId: string;
  resource: string;
  action: string;
  reason: string;
  requiredScopes: string[];
  userScopes: string[];
  timestamp: number;
}

export class PolicyGateway {
  private secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  async verifyPolicyToken(token: string, requiredScopes: string[]): Promise<{
    valid: boolean;
    payload?: PolicyToken;
    reason?: string;
  }> {
    try {
      // Verify JWT signature and expiration
      const payload = jwt.verify(token, this.secret) as PolicyToken;
      
      // Check if token has required scopes
      const hasRequiredScopes = this.checkScopes(payload.scopes, requiredScopes);
      
      if (!hasRequiredScopes) {
        await this.logPolicyDenial({
          userId: payload.persona_id,
          resource: 'api_endpoint',
          action: 'access',
          reason: 'insufficient_scopes',
          requiredScopes,
          userScopes: payload.scopes,
          timestamp: Date.now()
        });

        return {
          valid: false,
          reason: 'Insufficient scopes'
        };
      }

      return {
        valid: true,
        payload
      };
    } catch (error) {
      await this.logPolicyDenial({
        userId: 'unknown',
        resource: 'api_endpoint',
        action: 'access',
        reason: 'invalid_token',
        requiredScopes,
        userScopes: [],
        timestamp: Date.now()
      });

      return {
        valid: false,
        reason: error instanceof Error ? error.message : 'Invalid token'
      };
    }
  }

  private checkScopes(userScopes: string[], requiredScopes: string[]): boolean {
    return requiredScopes.every(required => {
      return userScopes.some(userScope => {
        // Exact match
        if (userScope === required) return true;
        
        // Wildcard match (e.g., 'admin:*' matches 'admin:read')
        if (userScope.endsWith(':*')) {
          const prefix = userScope.slice(0, -2);
          return required.startsWith(prefix + ':');
        }
        
        return false;
      });
    });
  }

  private async logPolicyDenial(denial: PolicyDenial): Promise<void> {
    try {
      // Log structured denial to persona_audit table
      const auditEntry = {
        tenant_id: '00000000-0000-0000-0000-000000000000', // Default tenant
        persona_id: denial.userId,
        event_type: 'policy_denial',
        inputs_hash: this.hashObject({
          resource: denial.resource,
          action: denial.action,
          requiredScopes: denial.requiredScopes
        }),
        outputs_hash: this.hashObject({
          denied: true,
          reason: denial.reason,
          userScopes: denial.userScopes
        }),
        narrative: `Policy denial: ${denial.reason} for ${denial.resource}:${denial.action}. Required: [${denial.requiredScopes.join(', ')}], User: [${denial.userScopes.join(', ')}]`
      };

      await supabase.from('persona_audit').insert(auditEntry);
    } catch (error) {
      console.error('Failed to log policy denial:', error);
    }
  }

  private hashObject(obj: any): string {
    const canonical = JSON.stringify(obj, Object.keys(obj).sort());
    // Simple hash (in production, use crypto.subtle)
    let hash = 0;
    for (let i = 0; i < canonical.length; i++) {
      const char = canonical.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  // Express/API middleware
  requireScopes(scopes: string[]) {
    return async (req: any, res: any, next: any) => {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid authorization header' });
      }

      const token = authHeader.slice(7);
      const verification = await this.verifyPolicyToken(token, scopes);

      if (!verification.valid) {
        return res.status(403).json({ 
          error: 'Access denied', 
          reason: verification.reason 
        });
      }

      req.policyToken = verification.payload;
      next();
    };
  }
}

// Export singleton instance
export const policyGateway = new PolicyGateway(
  process.env.JWT_SECRET || 'fallback-secret-for-development'
);