/**
 * Client-side security audit service
 * Detects security violations in browser-accessible code
 */

import { auditLocalStorage } from '@/lib/storage-hygiene';

interface SecurityViolation {
  type: 'localStorage' | 'hardcoded_secret' | 'service_role' | 'api_key';
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  location?: string;
  recommendation: string;
}

/**
 * Comprehensive client security audit
 */
export class ClientSecurityAudit {
  private violations: SecurityViolation[] = [];

  /**
   * Run complete security audit
   */
  async runAudit(): Promise<{
    violations: SecurityViolation[];
    score: number;
    summary: string;
  }> {
    this.violations = [];

    // Audit localStorage usage
    await this.auditLocalStorage();
    
    // Check for hardcoded secrets (runtime detection)
    await this.auditHardcodedSecrets();
    
    // Verify no service_role keys in client
    await this.auditServiceRoleKeys();

    const score = this.calculateSecurityScore();
    const summary = this.generateSummary();

    return {
      violations: this.violations,
      score,
      summary
    };
  }

  /**
   * Audit localStorage for security violations
   */
  private async auditLocalStorage(): Promise<void> {
    const storageAudit = auditLocalStorage();
    
    storageAudit.violations.forEach(violation => {
      this.violations.push({
        type: 'localStorage',
        severity: violation.includes('Forbidden pattern') ? 'critical' : 'medium',
        message: violation,
        recommendation: 'Remove sensitive data from localStorage. Use secure session management.'
      });
    });
  }

  /**
   * Check for hardcoded secrets in runtime environment
   */
  private async auditHardcodedSecrets(): Promise<void> {
    // Check environment variables accessible to client
    const clientEnvKeys = Object.keys(import.meta.env || {});
    
    const forbiddenEnvPatterns = [
      /service_role/i,
      /secret/i,
      /_key$/i,
      /password/i,
      /credential/i
    ];

    clientEnvKeys.forEach(key => {
      const isForbidden = forbiddenEnvPatterns.some(pattern => pattern.test(key));
      if (isForbidden && !key.startsWith('VITE_PUBLIC_')) {
        this.violations.push({
          type: 'hardcoded_secret',
          severity: 'critical',
          message: `Potential secret in client environment: ${key}`,
          recommendation: 'Move to server-side Edge Function or remove from client bundle'
        });
      }
    });
  }

  /**
   * Verify no service_role keys are accessible to client
   */
  private async auditServiceRoleKeys(): Promise<void> {
    // Check if any service_role references exist in runtime
    const globalKeys = Object.keys(window as any);
    const suspiciousKeys = globalKeys.filter(key => 
      key.toLowerCase().includes('service_role') ||
      key.toLowerCase().includes('supabase_service')
    );

    suspiciousKeys.forEach(key => {
      this.violations.push({
        type: 'service_role',
        severity: 'critical',
        message: `Service role key detected in client runtime: ${key}`,
        location: 'window global scope',
        recommendation: 'Remove service_role keys from client. Use anon key and RLS policies.'
      });
    });
  }

  /**
   * Calculate security score (0-100)
   */
  private calculateSecurityScore(): number {
    let score = 100;
    
    this.violations.forEach(violation => {
      switch (violation.severity) {
        case 'critical':
          score -= 25;
          break;
        case 'high':
          score -= 15;
          break;
        case 'medium':
          score -= 10;
          break;
        case 'low':
          score -= 5;
          break;
      }
    });

    return Math.max(0, score);
  }

  /**
   * Generate audit summary
   */
  private generateSummary(): string {
    const criticalCount = this.violations.filter(v => v.severity === 'critical').length;
    const highCount = this.violations.filter(v => v.severity === 'high').length;
    const totalCount = this.violations.length;

    if (totalCount === 0) {
      return '✅ No client-side security violations detected';
    }

    let summary = `🔍 Security Audit: ${totalCount} violations found`;
    
    if (criticalCount > 0) {
      summary += ` (${criticalCount} critical)`;
    }
    if (highCount > 0) {
      summary += ` (${highCount} high)`;
    }

    return summary;
  }

  /**
   * Get remediation steps for all violations
   */
  getRemediationSteps(): string[] {
    const steps = new Set<string>();
    
    this.violations.forEach(violation => {
      steps.add(violation.recommendation);
    });

    return Array.from(steps);
  }
}

/**
 * Quick security check for localStorage violations
 */
export function quickSecurityCheck(): boolean {
  const audit = auditLocalStorage();
  const hasCriticalViolations = audit.violations.some(v => 
    v.includes('Forbidden pattern') || v.includes('token') || v.includes('secret')
  );
  
  if (hasCriticalViolations) {
    console.error('🚨 Critical localStorage security violations detected!');
    console.error('Violations:', audit.violations);
    return false;
  }
  
  return true;
}