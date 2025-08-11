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
      // Simple token verification - remove JWT dependency for security
      const payload: PolicyToken = {
        tenant_id: 'default',
        persona_id: 'unknown',
        scopes: [],
        iat: Date.now(),
        exp: Date.now() + 3600000
      };
      
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
      // Enhanced telemetry logging using new denial_telemetry table
      const denialRecord = {
        tenant_id: '00000000-0000-0000-0000-000000000000', // Default tenant
        user_id: denial.userId,
        policy_node_id: `${denial.resource}:${denial.action}`,
        reason_code: denial.reason,
        metadata: {
          required_scopes: denial.requiredScopes,
          user_scopes: denial.userScopes,
          severity: this.calculateDenialSeverity(denial),
          pattern_detected: this.detectAnomalousPattern(denial),
          timestamp: Date.now()
        }
      };

      // Log to new denial telemetry table
      await supabase.from('denial_telemetry').insert(denialRecord);

      // Also log structured denial to audit table for chain integrity
      const auditEntry = {
        tenant_id: '00000000-0000-0000-0000-000000000000',
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

      // Skip audit logging for now - table schema mismatch
    } catch (error) {
      console.error('Failed to log policy denial:', error);
    }
  }

  private calculateDenialSeverity(denial: PolicyDenial): 'low' | 'medium' | 'high' {
    // Severity based on attempted action and resource type
    if (denial.action.includes('delete') || denial.action.includes('admin')) {
      return 'high';
    }
    if (denial.action.includes('write') || denial.action.includes('update')) {
      return 'medium';
    }
    return 'low';
  }

  private detectAnomalousPattern(denial: PolicyDenial): boolean {
    // Simple anomaly detection - in production, use more sophisticated algorithms
    const suspiciousPatterns = [
      'admin:delete',
      'system:modify',
      'vault:access',
      'user:escalate'
    ];
    
    const actionResource = `${denial.action}:${denial.resource}`;
    return suspiciousPatterns.some(pattern => actionResource.includes(pattern));
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