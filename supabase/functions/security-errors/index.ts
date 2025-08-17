import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { bootEdgeFunction, handleCORS, successResponse, errorResponse } from "../_shared/edge-boot.ts"

interface SecurityError {
  id: string;
  severity: 'critical' | 'high';
  category: string;
  description: string;
  table_name?: string;
  function_name?: string;
  sql_fix: string;
  impact: string;
}

serve(async (req) => {
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  try {
    const bootResult = await bootEdgeFunction({
      functionName: 'security-errors',
      requiredSecrets: ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'],
      enableCaching: true,
      enableMetrics: true
    });

    const supabase = createClient(
      bootResult.secrets.SUPABASE_URL,
      bootResult.secrets.SUPABASE_SERVICE_ROLE_KEY
    );

    const securityErrors: SecurityError[] = [];

    // 1. Check for tables with RLS disabled
    const { data: rlsStatus, error: rlsError } = await supabase.rpc('get_table_rls_status');
    
    if (!rlsError && rlsStatus) {
      rlsStatus.forEach((table: any) => {
        if (!table.rls_enabled && table.table_name !== 'audit_logs') {
          securityErrors.push({
            id: `rls_disabled_${table.table_name}`,
            severity: 'critical',
            category: 'RLS_DISABLED',
            description: `Table ${table.table_name} has RLS disabled`,
            table_name: table.table_name,
            sql_fix: `ALTER TABLE public.${table.table_name} ENABLE ROW LEVEL SECURITY;`,
            impact: 'Complete data exposure - all users can access all data'
          });
        }

        if (table.rls_enabled && table.policy_count === 0) {
          securityErrors.push({
            id: `no_policies_${table.table_name}`,
            severity: 'high',
            category: 'NO_RLS_POLICIES',
            description: `Table ${table.table_name} has RLS enabled but no policies`,
            table_name: table.table_name,
            sql_fix: `-- Add appropriate RLS policies for ${table.table_name}
CREATE POLICY "Users can access their own data" ON public.${table.table_name}
FOR ALL USING (user_id = auth.uid());`,
            impact: 'Data inaccessible - RLS enabled but no access policies defined'
          });
        }
      });
    }

    // 2. Check for unsafe SECURITY DEFINER functions
    const { data: functions, error: functionsError } = await supabase
      .from('pg_proc')
      .select('proname, prosecdef')
      .eq('prosecdef', true);

    if (!functionsError && functions) {
      functions.forEach((func: any) => {
        securityErrors.push({
          id: `security_definer_${func.proname}`,
          severity: 'high',
          category: 'SECURITY_DEFINER',
          description: `Function ${func.proname} uses SECURITY DEFINER without proper validation`,
          function_name: func.proname,
          sql_fix: `-- Review and secure function ${func.proname}
CREATE OR REPLACE FUNCTION public.${func.proname}_secure()
RETURNS [return_type] AS $$
BEGIN
  -- Add proper access control checks
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Insufficient permissions';
  END IF;
  -- Original function logic here
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;`,
          impact: 'Privilege escalation risk - function executes with elevated permissions'
        });
      });
    }

    // 3. Check for unsafe grants to public role
    const unsafeGrants = [
      {
        id: 'public_schema_usage',
        severity: 'critical' as const,
        category: 'UNSAFE_GRANTS',
        description: 'Public schema has overly permissive grants',
        sql_fix: `-- Revoke dangerous public grants
REVOKE ALL ON SCHEMA public FROM public;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM public;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM public;

-- Grant minimal necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;`,
        impact: 'Complete database exposure via public role'
      }
    ];

    securityErrors.push(...unsafeGrants);

    // 4. Check for exposed sensitive columns
    const sensitiveColumns = [
      { table: 'accounting_clients', column: 'email' },
      { table: 'advisor_applications', column: 'email' },
      { table: 'profiles', column: 'phone' },
      { table: 'leads', column: 'email' }
    ];

    sensitiveColumns.forEach(({ table, column }) => {
      securityErrors.push({
        id: `sensitive_exposure_${table}_${column}`,
        severity: 'critical',
        category: 'PII_EXPOSURE',
        description: `Sensitive ${column} column in ${table} may be exposed`,
        table_name: table,
        sql_fix: `-- Add data masking for sensitive column
CREATE OR REPLACE FUNCTION public.mask_${column}(input_${column} TEXT)
RETURNS TEXT AS $$
BEGIN
  IF has_role(auth.uid(), 'admin') THEN
    RETURN input_${column};
  ELSE
    RETURN CASE 
      WHEN input_${column} IS NOT NULL THEN '***@***.***'
      ELSE NULL
    END;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create view with masked data
CREATE VIEW public.${table}_safe AS
SELECT 
  *,
  mask_${column}(${column}) as ${column}_masked
FROM public.${table};`,
        impact: 'PII data exposure - sensitive personal information accessible'
      });
    });

    // Generate complete migration script
    const migrationSQL = `-- Security Hardening Migration
-- Generated: ${new Date().toISOString()}
-- Fixes ${securityErrors.length} security issues

BEGIN;

${securityErrors.map(error => `
-- Fix: ${error.description}
-- Impact: ${error.impact}
${error.sql_fix}
`).join('\n')}

-- Add security audit logging
CREATE TABLE IF NOT EXISTS public.security_fixes_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fix_id TEXT NOT NULL,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  applied_by UUID REFERENCES auth.users(id)
);

INSERT INTO public.security_fixes_log (fix_id, applied_by)
VALUES ('security_hardening_${Date.now()}', auth.uid());

COMMIT;`;

    return successResponse({
      total_errors: securityErrors.length,
      critical_errors: securityErrors.filter(e => e.severity === 'critical').length,
      high_errors: securityErrors.filter(e => e.severity === 'high').length,
      errors: securityErrors,
      migration_sql: migrationSQL,
      categories: {
        rls_disabled: securityErrors.filter(e => e.category === 'RLS_DISABLED').length,
        no_policies: securityErrors.filter(e => e.category === 'NO_RLS_POLICIES').length,
        security_definer: securityErrors.filter(e => e.category === 'SECURITY_DEFINER').length,
        unsafe_grants: securityErrors.filter(e => e.category === 'UNSAFE_GRANTS').length,
        pii_exposure: securityErrors.filter(e => e.category === 'PII_EXPOSURE').length
      },
      recommendations: [
        'Run the generated migration SQL immediately',
        'Review all SECURITY DEFINER functions manually',
        'Implement data classification and masking policies',
        'Set up regular security audits',
        'Monitor RLS policy effectiveness'
      ]
    });

  } catch (error) {
    console.error('Security errors scan failed:', error);
    return errorResponse('Security scan failed', 500, error.message);
  }
})