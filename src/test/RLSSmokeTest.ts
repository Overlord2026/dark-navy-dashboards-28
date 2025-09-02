import { supabase } from '@/integrations/supabase/client';

export interface RLSTestResult {
  table: string;
  policy: string;
  operation: string;
  status: 'PASS' | 'FAIL';
  error?: string;
  expectedBehavior: string;
  actualBehavior: string;
}

/**
 * RLS Policy smoke test harness
 * Tests all critical RLS policies to ensure proper access control
 */
export class RLSSmokeTest {
  private results: RLSTestResult[] = [];

  async runAllTests(): Promise<RLSTestResult[]> {
    console.log('🛡️ Starting RLS Smoke Tests...');
    this.results = [];

    // Test core tables with user-scoped data
    await this.testProfilesRLS();
    await this.testAccountsRLS();
    await this.testAccountingClientsRLS();
    await this.testAdvisorAssignmentsRLS();
    await this.testAdminAuditLogsRLS();

    console.log(`RLS Tests Complete: ${this.results.filter(r => r.status === 'PASS').length}/${this.results.length} passed`);
    return this.results;
  }

  private async testProfilesRLS(): Promise<void> {
    // Test unauthorized access to profiles
    await this.testUnauthorizedAccess('profiles', 'SELECT', 'Users should not access other profiles without auth');
    
    // Test that RLS blocks update/delete without ownership
    await this.testUnauthorizedAccess('profiles', 'UPDATE', 'Users should not update other profiles');
    await this.testUnauthorizedAccess('profiles', 'DELETE', 'Users should not delete other profiles');
  }

  private async testAccountsRLS(): Promise<void> {
    // Test that accounts are user-scoped
    await this.testUnauthorizedAccess('accounts', 'SELECT', 'Users should only see their own accounts');
    await this.testUnauthorizedAccess('accounts', 'INSERT', 'Users should only create accounts for themselves');
    await this.testUnauthorizedAccess('accounts', 'UPDATE', 'Users should only update their own accounts');
    await this.testUnauthorizedAccess('accounts', 'DELETE', 'Users should only delete their own accounts');
  }

  private async testAccountingClientsRLS(): Promise<void> {
    // Test client access controls
    await this.testUnauthorizedAccess('accounting_clients', 'SELECT', 'Users should only see their client records');
    await this.testUnauthorizedAccess('accounting_clients', 'INSERT', 'Users should only create their own client records');
  }

  private async testAdvisorAssignmentsRLS(): Promise<void> {
    // Test advisor assignment access
    await this.testUnauthorizedAccess('advisor_assignments', 'SELECT', 'Users should only see their assignments');
    await this.testUnauthorizedAccess('advisor_assignments', 'INSERT', 'Only advisors should create assignments');
  }

  private async testAdminAuditLogsRLS(): Promise<void> {
    // Test admin audit log access (should be admin-only)
    await this.testUnauthorizedAccess('admin_audit_logs', 'SELECT', 'Only admins should view audit logs');
    await this.testUnauthorizedAccess('admin_audit_logs', 'UPDATE', 'Audit logs should be immutable');
    await this.testUnauthorizedAccess('admin_audit_logs', 'DELETE', 'Audit logs should not be deletable');
  }

  private async testUnauthorizedAccess(table: string, operation: string, expectedBehavior: string): Promise<void> {
    try {
      let actualBehavior = '';

      // Use type assertion to work around strict typing
      const supabaseAny = supabase as any;
      let query;

      switch (operation) {
        case 'SELECT':
          query = supabaseAny.from(table).select('*').limit(1);
          break;
        case 'INSERT':
          query = supabaseAny.from(table).insert({});
          break;
        case 'UPDATE':
          query = supabaseAny.from(table).update({}).eq('id', 'fake-id');
          break;
        case 'DELETE':
          query = supabaseAny.from(table).delete().eq('id', 'fake-id');
          break;
        default:
          query = supabaseAny.from(table).select('*').limit(1);
      }

      const { data, error } = await query;

      if (error) {
        // Check if it's a proper RLS denial
        if (error.message.includes('permission denied') || 
            error.message.includes('row-level security') ||
            error.message.includes('insufficient_privilege') ||
            error.message.includes('violates row-level security')) {
          actualBehavior = 'Access denied by RLS (correct)';
          this.results.push({
            table,
            policy: 'RLS Protection',
            operation,
            status: 'PASS',
            expectedBehavior,
            actualBehavior
          });
        } else {
          // Some other error - could indicate RLS misconfiguration
          actualBehavior = `Unexpected error: ${error.message}`;
          this.results.push({
            table,
            policy: 'RLS Protection',
            operation,
            status: 'FAIL',
            expectedBehavior,
            actualBehavior,
            error: error.message
          });
        }
      } else {
        // No error - this could be a security issue unless it's expected
        if (operation === 'SELECT' && Array.isArray(data) && data.length === 0) {
          actualBehavior = 'Empty result set (acceptable)';
          this.results.push({
            table,
            policy: 'RLS Protection',
            operation,
            status: 'PASS',
            expectedBehavior,
            actualBehavior
          });
        } else {
          actualBehavior = `Operation succeeded unexpectedly (data: ${JSON.stringify(data).slice(0, 100)}...)`;
          this.results.push({
            table,
            policy: 'RLS Protection',
            operation,
            status: 'FAIL',
            expectedBehavior,
            actualBehavior,
            error: 'RLS may not be properly configured'
          });
        }
      }
    } catch (error) {
      this.results.push({
        table,
        policy: 'RLS Protection',
        operation,
        status: 'FAIL',
        expectedBehavior,
        actualBehavior: 'Test execution failed',
        error: String(error)
      });
    }
  }

  exportToCsv(): string {
    const headers = ['table', 'policy', 'operation', 'status', 'expectedBehavior', 'actualBehavior', 'error'];
    const rows = this.results.map(result => [
      result.table,
      result.policy,
      result.operation,
      result.status,
      result.expectedBehavior,
      result.actualBehavior,
      result.error || ''
    ]);

    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\n');
  }
}