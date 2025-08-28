-- Phase 1: Fix Critical RLS Infinite Recursion Issues

-- Create security definer functions to prevent recursion
CREATE OR REPLACE FUNCTION public.get_current_user_tenant_id()
RETURNS UUID AS $$
  SELECT tenant_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = '';

CREATE OR REPLACE FUNCTION public.get_current_user_firm_id()
RETURNS UUID AS $$
  SELECT firm_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = '';

CREATE OR REPLACE FUNCTION public.get_user_organization_id(user_uuid uuid)
RETURNS UUID AS $$
  SELECT organization_id FROM public.organization_admins 
  WHERE user_id = user_uuid AND is_active = true
  LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = '';

CREATE OR REPLACE FUNCTION public.jwt_tenant_id()
RETURNS UUID AS $$
  SELECT tenant_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = '';

CREATE OR REPLACE FUNCTION public.current_tenant_id()
RETURNS UUID AS $$
  SELECT tenant_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = '';

-- Fix infinite recursion in organization_admins
DROP POLICY IF EXISTS "Organization admins can manage their organization" ON public.organization_admins;
DROP POLICY IF EXISTS "Users can view their organization admin status" ON public.organization_admins;

CREATE POLICY "Users can view their own admin records"
ON public.organization_admins FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own admin records"
ON public.organization_admins FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Fix infinite recursion in compliance_profiles
DROP POLICY IF EXISTS "Users can access compliance profiles in their tenant" ON public.compliance_profiles;
DROP POLICY IF EXISTS "Tenant isolation for compliance profiles" ON public.compliance_profiles;

CREATE POLICY "Users can view compliance profiles in their tenant"
ON public.compliance_profiles FOR SELECT
TO authenticated
USING (tenant_id = public.get_current_user_tenant_id());

CREATE POLICY "Users can manage compliance profiles in their tenant"
ON public.compliance_profiles FOR ALL
TO authenticated
USING (tenant_id = public.get_current_user_tenant_id())
WITH CHECK (tenant_id = public.get_current_user_tenant_id());

-- Fix infinite recursion in vault_members
DROP POLICY IF EXISTS "Vault members can access vault membership" ON public.vault_members;

CREATE POLICY "Users can view their vault memberships"
ON public.vault_members FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can manage their vault memberships"
ON public.vault_members FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Fix infinite recursion in vault_items
DROP POLICY IF EXISTS "Vault members can access vault items" ON public.vault_items;

CREATE POLICY "Vault owners can manage their vault items"
ON public.vault_items FOR ALL
TO authenticated
USING (vault_id IN (
  SELECT id FROM public.family_vaults WHERE owner_id = auth.uid()
));

-- Fix infinite recursion in vip_organizations
DROP POLICY IF EXISTS "VIP organization access control" ON public.vip_organizations;

CREATE POLICY "Users can view VIP organizations in their tenant"
ON public.vip_organizations FOR SELECT
TO authenticated
USING (tenant_id = public.get_current_user_tenant_id());

-- Fix infinite recursion in vip_organization_members
DROP POLICY IF EXISTS "VIP organization members access control" ON public.vip_organization_members;

CREATE POLICY "Users can view their VIP organization memberships"
ON public.vip_organization_members FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Phase 2: Secure PII-sensitive tables with proper RLS

-- Remove overly permissive policies and add user-scoped ones
DROP POLICY IF EXISTS "Service role full access" ON public.accounting_clients;
DROP POLICY IF EXISTS "Users can access their client records" ON public.accounting_clients;

CREATE POLICY "Users can manage their own client records"
ON public.accounting_clients FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Secure service role access - remove blanket permissions
DROP POLICY IF EXISTS "Service role full access" ON public.accounting_documents;
DROP POLICY IF EXISTS "Service role full access" ON public.accounting_engagements;
DROP POLICY IF EXISTS "Service role full access" ON public.accounting_entities;
DROP POLICY IF EXISTS "Service role full access" ON public.accounting_invoices;
DROP POLICY IF EXISTS "Service role full access" ON public.accounting_payments;
DROP POLICY IF EXISTS "Service role full access" ON public.accounting_receipts;
DROP POLICY IF EXISTS "Service role full access" ON public.accounting_referrals;
DROP POLICY IF EXISTS "Service role full access" ON public.accounting_returns;
DROP POLICY IF EXISTS "Service role full access" ON public.accounting_tasks;
DROP POLICY IF EXISTS "Service role full access" ON public.accounting_time_entries;
DROP POLICY IF EXISTS "Service role full access" ON public.accounting_outsourcing_routes;

-- Add audit logging for service role usage
CREATE OR REPLACE FUNCTION public.log_service_role_usage(
  p_function_name text,
  p_operation_type text,
  p_execution_context text,
  p_success boolean,
  p_request_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  audit_id uuid;
BEGIN
  INSERT INTO public.security_audit_logs (
    event_type,
    severity,
    details,
    user_id,
    created_at
  ) VALUES (
    'service_role_usage',
    CASE WHEN p_success THEN 'info' ELSE 'warning' END,
    jsonb_build_object(
      'function_name', p_function_name,
      'operation_type', p_operation_type,
      'execution_context', p_execution_context,
      'success', p_success,
      'request_metadata', p_request_metadata,
      'timestamp', now()
    ),
    auth.uid(),
    now()
  ) RETURNING id INTO audit_id;
  
  RETURN audit_id;
END;
$$;