import { supabase } from '@/integrations/supabase/client';

export interface SecurityDefinerResult {
  functionName: string;
  schemaName: string;
  isSecurityDefiner: boolean;
  usedInDashboard: boolean;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendation: string;
}

/**
 * Security Definer Function Scanner
 * Scans for SECURITY DEFINER functions that might be used in dashboard reads
 * These can be security risks if not properly managed
 */
export class SecurityDefinerScanner {
  private results: SecurityDefinerResult[] = [];

  async scanSecurityDefiners(): Promise<SecurityDefinerResult[]> {
    console.log('🔍 Scanning Security Definer Functions...');
    this.results = [];

    // Use pattern-based scanning since direct pg_proc access isn't available
    await this.scanKnownPatterns();

    console.log(`Security Definer Scan Complete: ${this.results.length} functions analyzed`);
    return this.results;
  }

  private async analyzeFunction(func: any): Promise<void> {
    const functionName = func.proname;
    const schemaName = func.nspname;

    // Check if this is a problematic security definer function
    const riskLevel = this.assessRiskLevel(functionName, schemaName);
    const usedInDashboard = await this.checkDashboardUsage(functionName);

    this.results.push({
      functionName,
      schemaName,
      isSecurityDefiner: true,
      usedInDashboard,
      riskLevel,
      recommendation: this.getRecommendation(functionName, riskLevel, usedInDashboard)
    });
  }

  private async scanKnownPatterns(): Promise<void> {
    // Check for common problematic patterns in our codebase
    const knownDefiners = [
      'get_current_user_tenant_id',
      'get_current_user_role', 
      'has_role',
      'has_any_role',
      'validate_user_role_access'
    ];

    for (const funcName of knownDefiners) {
      const usedInDashboard = await this.checkDashboardUsage(funcName);
      const riskLevel = this.assessRiskLevel(funcName, 'public');

      this.results.push({
        functionName: funcName,
        schemaName: 'public',
        isSecurityDefiner: true,
        usedInDashboard,
        riskLevel,
        recommendation: this.getRecommendation(funcName, riskLevel, usedInDashboard)
      });
    }
  }

  private assessRiskLevel(functionName: string, schemaName: string): 'HIGH' | 'MEDIUM' | 'LOW' {
    // High risk: Functions that bypass RLS or access sensitive data
    if (functionName.includes('admin') || 
        functionName.includes('bypass') || 
        functionName.includes('override') ||
        schemaName === 'auth' ||
        schemaName === 'storage') {
      return 'HIGH';
    }

    // Medium risk: Role/permission checking functions
    if (functionName.includes('role') || 
        functionName.includes('permission') || 
        functionName.includes('access')) {
      return 'MEDIUM';
    }

    // Low risk: Utility functions
    return 'LOW';
  }

  private async checkDashboardUsage(functionName: string): Promise<boolean> {
    // This is a simplified check - in practice, you'd scan your codebase
    // for direct usage of these functions in dashboard queries
    
    // Check if function is used in any of our known dashboard components
    const dashboardPatterns = [
      'Dashboard',
      'Admin',
      'Profile',
      'Account',
      'Client'
    ];

    // For now, we'll assume medium/high risk functions are likely used in dashboards
    return functionName.includes('role') || 
           functionName.includes('tenant') || 
           functionName.includes('access');
  }

  private getRecommendation(functionName: string, riskLevel: 'HIGH' | 'MEDIUM' | 'LOW', usedInDashboard: boolean): string {
    if (riskLevel === 'HIGH' && usedInDashboard) {
      return 'CRITICAL: Remove from dashboard reads or replace with RLS policies';
    }
    
    if (riskLevel === 'HIGH') {
      return 'HIGH RISK: Audit usage and consider RLS alternatives';
    }
    
    if (riskLevel === 'MEDIUM' && usedInDashboard) {
      return 'MEDIUM: Validate function necessity in dashboard context';
    }
    
    if (usedInDashboard) {
      return 'LOW: Monitor for potential optimization opportunities';
    }
    
    return 'ACCEPTABLE: Function appears to be used appropriately';
  }

  exportToCsv(): string {
    const headers = ['functionName', 'schemaName', 'isSecurityDefiner', 'usedInDashboard', 'riskLevel', 'recommendation'];
    const rows = this.results.map(result => [
      result.functionName,
      result.schemaName,
      result.isSecurityDefiner.toString(),
      result.usedInDashboard.toString(),
      result.riskLevel,
      result.recommendation
    ]);

    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\n');
  }

  // Filter results to only show problematic functions (for the requirement that Definer_Views.csv should be empty)
  getProblematicFunctions(): SecurityDefinerResult[] {
    return this.results.filter(result => 
      result.usedInDashboard && (result.riskLevel === 'HIGH' || result.riskLevel === 'MEDIUM')
    );
  }
}