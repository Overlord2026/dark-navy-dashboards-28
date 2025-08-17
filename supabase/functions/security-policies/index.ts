import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { bootEdgeFunction, handleCORS, successResponse, errorResponse } from "../_shared/edge-boot.ts"

interface RLSPolicy {
  table_name: string;
  policy_name: string;
  operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'ALL';
  using_expression: string;
  with_check_expression?: string;
  description: string;
  pattern: 'owner' | 'household' | 'tenant' | 'public' | 'admin';
}

interface StoragePolicy {
  bucket_name: string;
  policy_name: string;
  operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';
  using_expression: string;
  description: string;
}

serve(async (req) => {
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  try {
    const bootResult = await bootEdgeFunction({
      functionName: 'security-policies',
      requiredSecrets: ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'],
      enableCaching: true,
      enableMetrics: true
    });

    const supabase = createClient(
      bootResult.secrets.SUPABASE_URL,
      bootResult.secrets.SUPABASE_SERVICE_ROLE_KEY
    );

    // Get tables without proper RLS policies
    const { data: rlsStatus, error: rlsError } = await supabase.rpc('get_table_rls_status');
    
    if (rlsError) {
      console.error('Failed to get RLS status:', rlsError);
      return errorResponse('Failed to analyze RLS status', 500);
    }

    const missingPolicies = rlsStatus?.filter((table: any) => 
      table.rls_enabled && table.policy_count === 0
    ) || [];

    const policies: RLSPolicy[] = [];
    const storagePolicies: StoragePolicy[] = [];

    // Generate owner-based policies for user-specific tables
    const ownerTables = [
      'accounts', 'advisor_availability', 'advisor_client_links', 'advisor_email_templates',
      'advisor_invitations', 'bank_accounts', 'health_metrics', 'documents', 'profiles'
    ];

    ownerTables.forEach(tableName => {
      if (missingPolicies.some((t: any) => t.table_name === tableName)) {
        policies.push(
          {
            table_name: tableName,
            policy_name: `${tableName}_owner_select`,
            operation: 'SELECT',
            using_expression: 'user_id = auth.uid()',
            description: `Users can view their own ${tableName}`,
            pattern: 'owner'
          },
          {
            table_name: tableName,
            policy_name: `${tableName}_owner_insert`,
            operation: 'INSERT',
            using_expression: 'user_id = auth.uid()',
            with_check_expression: 'user_id = auth.uid()',
            description: `Users can create their own ${tableName}`,
            pattern: 'owner'
          },
          {
            table_name: tableName,
            policy_name: `${tableName}_owner_update`,
            operation: 'UPDATE',
            using_expression: 'user_id = auth.uid()',
            with_check_expression: 'user_id = auth.uid()',
            description: `Users can update their own ${tableName}`,
            pattern: 'owner'
          },
          {
            table_name: tableName,
            policy_name: `${tableName}_owner_delete`,
            operation: 'DELETE',
            using_expression: 'user_id = auth.uid()',
            description: `Users can delete their own ${tableName}`,
            pattern: 'owner'
          }
        );
      }
    });

    // Generate tenant-based policies for multi-tenant tables
    const tenantTables = [
      'ad_campaigns', 'ad_accounts', 'accounting_clients', 'accounting_entities',
      'advisor_applications', 'referrals'
    ];

    tenantTables.forEach(tableName => {
      if (missingPolicies.some((t: any) => t.table_name === tableName)) {
        policies.push(
          {
            table_name: tableName,
            policy_name: `${tableName}_tenant_access`,
            operation: 'ALL',
            using_expression: 'tenant_id = get_current_user_tenant_id()',
            with_check_expression: 'tenant_id = get_current_user_tenant_id()',
            description: `Tenant users can access their ${tableName}`,
            pattern: 'tenant'
          }
        );
      }
    });

    // Generate household-based policies for family office tables
    const householdTables = [
      'family_members', 'estate_requests', 'investment_accounts', 'trust_documents'
    ];

    householdTables.forEach(tableName => {
      if (missingPolicies.some((t: any) => t.table_name === tableName)) {
        policies.push(
          {
            table_name: tableName,
            policy_name: `${tableName}_household_access`,
            operation: 'SELECT',
            using_expression: 'household_id IN (SELECT household_id FROM family_members WHERE user_id = auth.uid())',
            description: `Family members can view household ${tableName}`,
            pattern: 'household'
          },
          {
            table_name: tableName,
            policy_name: `${tableName}_household_admin`,
            operation: 'ALL',
            using_expression: 'household_id IN (SELECT household_id FROM family_members WHERE user_id = auth.uid() AND role = \'admin\')',
            with_check_expression: 'household_id IN (SELECT household_id FROM family_members WHERE user_id = auth.uid() AND role = \'admin\')',
            description: `Household admins can manage ${tableName}`,
            pattern: 'household'
          }
        );
      }
    });

    // Generate admin-only policies for sensitive tables
    const adminTables = [
      'security_audit_logs', 'service_role_audit_logs', 'system_status', 'receipts'
    ];

    adminTables.forEach(tableName => {
      if (missingPolicies.some((t: any) => t.table_name === tableName)) {
        policies.push(
          {
            table_name: tableName,
            policy_name: `${tableName}_admin_only`,
            operation: 'ALL',
            using_expression: 'has_role(auth.uid(), \'admin\')',
            with_check_expression: 'has_role(auth.uid(), \'admin\')',
            description: `Only admins can access ${tableName}`,
            pattern: 'admin'
          }
        );
      }
    });

    // Generate public read policies for reference tables
    const publicTables = [
      'accountant_ce_providers', 'accountant_ce_requirements', 'education_resources'
    ];

    publicTables.forEach(tableName => {
      if (missingPolicies.some((t: any) => t.table_name === tableName)) {
        policies.push(
          {
            table_name: tableName,
            policy_name: `${tableName}_public_read`,
            operation: 'SELECT',
            using_expression: 'true',
            description: `Public read access to ${tableName}`,
            pattern: 'public'
          }
        );
      }
    });

    // Generate storage policies
    const storageBuckets = [
      { name: 'avatars', public: true },
      { name: 'documents', public: false },
      { name: 'reports', public: false },
      { name: 'health-documents', public: false }
    ];

    storageBuckets.forEach(bucket => {
      if (bucket.public) {
        storagePolicies.push(
          {
            bucket_name: bucket.name,
            policy_name: `${bucket.name}_public_read`,
            operation: 'SELECT',
            using_expression: 'bucket_id = \'' + bucket.name + '\'',
            description: `Public read access to ${bucket.name}`
          },
          {
            bucket_name: bucket.name,
            policy_name: `${bucket.name}_user_upload`,
            operation: 'INSERT',
            using_expression: 'bucket_id = \'' + bucket.name + '\' AND auth.uid()::text = (storage.foldername(name))[1]',
            description: `Users can upload to their ${bucket.name} folder`
          }
        );
      } else {
        storagePolicies.push(
          {
            bucket_name: bucket.name,
            policy_name: `${bucket.name}_user_access`,
            operation: 'SELECT',
            using_expression: 'bucket_id = \'' + bucket.name + '\' AND auth.uid()::text = (storage.foldername(name))[1]',
            description: `Users can access their own ${bucket.name}`
          },
          {
            bucket_name: bucket.name,
            policy_name: `${bucket.name}_user_upload`,
            operation: 'INSERT',
            using_expression: 'bucket_id = \'' + bucket.name + '\' AND auth.uid()::text = (storage.foldername(name))[1]',
            description: `Users can upload to their ${bucket.name}`
          }
        );
      }
    });

    // Generate SQL for all policies
    const policySQL = `-- RLS Policies Migration
-- Generated: ${new Date().toISOString()}
-- Creates ${policies.length} table policies and ${storagePolicies.length} storage policies

BEGIN;

-- Create helper functions if they don't exist
CREATE OR REPLACE FUNCTION public.get_current_user_tenant_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT tenant_id 
    FROM public.profiles 
    WHERE id = auth.uid()
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public, pg_temp;

CREATE OR REPLACE FUNCTION public.has_role(user_id UUID, role_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_roles.user_id = has_role.user_id 
    AND user_roles.role::text = role_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public, pg_temp;

-- Table RLS Policies
${policies.map(policy => `
-- ${policy.description} (${policy.pattern} pattern)
CREATE POLICY "${policy.policy_name}" ON public.${policy.table_name}
FOR ${policy.operation} TO authenticated
USING (${policy.using_expression})${policy.with_check_expression ? `
WITH CHECK (${policy.with_check_expression})` : ''};`).join('\n')}

-- Storage Policies
${storagePolicies.map(policy => `
-- ${policy.description}
CREATE POLICY "${policy.policy_name}" ON storage.objects
FOR ${policy.operation} TO authenticated
USING (${policy.using_expression});`).join('\n')}

-- Log policy creation
INSERT INTO public.security_audit_logs (
  event_type, details, severity
) VALUES (
  'rls_policies_created',
  jsonb_build_object(
    'table_policies', ${policies.length},
    'storage_policies', ${storagePolicies.length},
    'created_at', NOW()
  ),
  'info'
);

COMMIT;`;

    return successResponse({
      missing_policies_count: missingPolicies.length,
      generated_policies: policies.length,
      storage_policies: storagePolicies.length,
      patterns_used: {
        owner: policies.filter(p => p.pattern === 'owner').length,
        tenant: policies.filter(p => p.pattern === 'tenant').length,
        household: policies.filter(p => p.pattern === 'household').length,
        admin: policies.filter(p => p.pattern === 'admin').length,
        public: policies.filter(p => p.pattern === 'public').length
      },
      policies: policies,
      storage_policies: storagePolicies,
      policy_sql: policySQL,
      tables_addressed: missingPolicies.map((t: any) => t.table_name),
      validation_queries: [
        'SELECT * FROM get_table_rls_status() WHERE policy_count = 0;',
        'SELECT * FROM get_table_policies() ORDER BY table_name;',
        'SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = \'public\';'
      ],
      security_notes: [
        'Test policies thoroughly in development environment',
        'Verify user access patterns work as expected',
        'Monitor for performance impact on large tables',
        'Consider indexing on user_id and tenant_id columns',
        'Review household and tenant relationship patterns'
      ]
    });

  } catch (error) {
    console.error('Security policies generation failed:', error);
    return errorResponse('Security policies generation failed', 500, error.message);
  }
})