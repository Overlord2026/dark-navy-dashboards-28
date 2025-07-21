
-- Phase 1: Database Security Hardening - Critical Fixes
-- Day 1-2: Database Function Security and Search Path Vulnerabilities

-- 1. Fix all database functions with missing search path security
-- These functions are vulnerable to search_path attacks

-- Fix get_current_user_tenant_id function (already has search_path but ensuring consistency)
CREATE OR REPLACE FUNCTION public.get_current_user_tenant_id()
RETURNS UUID
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = 'public'
AS $$
  SELECT tenant_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- Fix get_current_user_role function
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = 'public'
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- Fix has_role function
CREATE OR REPLACE FUNCTION public.has_role(required_role TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = 'public'
AS $$
  SELECT COALESCE(role = required_role, false) FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- Fix has_any_role function
CREATE OR REPLACE FUNCTION public.has_any_role(roles TEXT[])
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = 'public'
AS $$
  SELECT COALESCE(role = ANY(roles), false) FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- Fix is_tenant_admin function
CREATE OR REPLACE FUNCTION public.is_tenant_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = 'public'
AS $$
  SELECT COALESCE(role = ANY(ARRAY['admin', 'tenant_admin', 'system_administrator']), false)
  FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- 2. Add missing RLS policy for sync_conflicts table
CREATE POLICY "Users can manage sync conflicts in their tenant" 
ON public.sync_conflicts FOR ALL 
USING (tenant_id = get_current_user_tenant_id());

-- 3. Create comprehensive audit logging system for sensitive tables
-- Enable audit logging on critical tables

-- Create audit log table if not exists
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL, -- INSERT, UPDATE, DELETE
  record_id UUID,
  user_id UUID,
  tenant_id UUID,
  old_data JSONB,
  new_data JSONB,
  changed_fields TEXT[],
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  severity TEXT DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),
  compliance_flags TEXT[] DEFAULT '{}',
  retention_date TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '7 years')
);

-- Enable RLS on audit logs
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

-- Only allow service role and system administrators to access audit logs
CREATE POLICY "Only service role and system admins can access audit logs" 
ON public.security_audit_logs FOR ALL 
USING (
  auth.role() = 'service_role' OR 
  has_role('system_administrator')
);

-- Create audit trigger function
CREATE OR REPLACE FUNCTION public.create_audit_log()
RETURNS TRIGGER AS $$
DECLARE
  old_data JSONB;
  new_data JSONB;
  changed_fields TEXT[];
  current_user_id UUID;
  current_tenant_id UUID;
  severity_level TEXT := 'info';
BEGIN
  -- Get current user context
  current_user_id := auth.uid();
  current_tenant_id := get_current_user_tenant_id();
  
  -- Determine severity based on table and operation
  IF TG_TABLE_NAME IN ('profiles', 'tenant_admin_credentials', 'client_assignments') THEN
    severity_level := 'critical';
  ELSIF TG_TABLE_NAME IN ('bank_accounts', 'transfers', 'professionals') THEN
    severity_level := 'warning';
  END IF;
  
  -- Handle different trigger operations
  IF TG_OP = 'DELETE' THEN
    old_data := to_jsonb(OLD);
    new_data := NULL;
  ELSIF TG_OP = 'INSERT' THEN
    old_data := NULL;
    new_data := to_jsonb(NEW);
  ELSIF TG_OP = 'UPDATE' THEN
    old_data := to_jsonb(OLD);
    new_data := to_jsonb(NEW);
    
    -- Calculate changed fields
    SELECT array_agg(key) INTO changed_fields
    FROM jsonb_each(old_data) old_val
    JOIN jsonb_each(new_data) new_val ON old_val.key = new_val.key
    WHERE old_val.value != new_val.value;
  END IF;
  
  -- Insert audit log
  INSERT INTO public.security_audit_logs (
    table_name, operation, record_id, user_id, tenant_id,
    old_data, new_data, changed_fields, severity,
    ip_address, session_id
  ) VALUES (
    TG_TABLE_NAME,
    TG_OP,
    COALESCE(NEW.id, OLD.id),
    current_user_id,
    current_tenant_id,
    old_data,
    new_data,
    changed_fields,
    severity_level,
    inet_client_addr(),
    current_setting('application_name', true)
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- Create audit triggers for sensitive tables
-- User management tables
DROP TRIGGER IF EXISTS audit_profiles ON public.profiles;
CREATE TRIGGER audit_profiles
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.create_audit_log();

-- Client data tables
DROP TRIGGER IF EXISTS audit_client_assignments ON public.client_assignments;
CREATE TRIGGER audit_client_assignments
  AFTER INSERT OR UPDATE OR DELETE ON public.client_assignments
  FOR EACH ROW EXECUTE FUNCTION public.create_audit_log();

-- Financial transaction tables
DROP TRIGGER IF EXISTS audit_bank_accounts ON public.bank_accounts;
CREATE TRIGGER audit_bank_accounts
  AFTER INSERT OR UPDATE OR DELETE ON public.bank_accounts
  FOR EACH ROW EXECUTE FUNCTION public.create_audit_log();

DROP TRIGGER IF EXISTS audit_transfers ON public.transfers;
CREATE TRIGGER audit_transfers
  AFTER INSERT OR UPDATE OR DELETE ON public.transfers
  FOR EACH ROW EXECUTE FUNCTION public.create_audit_log();

-- Professional access tables
DROP TRIGGER IF EXISTS audit_professionals ON public.professionals;
CREATE TRIGGER audit_professionals
  AFTER INSERT OR UPDATE OR DELETE ON public.professionals
  FOR EACH ROW EXECUTE FUNCTION public.create_audit_log();

-- Admin access tables
DROP TRIGGER IF EXISTS audit_tenant_admin_credentials ON public.tenant_admin_credentials;
CREATE TRIGGER audit_tenant_admin_credentials
  AFTER INSERT OR UPDATE OR DELETE ON public.tenant_admin_credentials
  FOR EACH ROW EXECUTE FUNCTION public.create_audit_log();

-- 4. Create security monitoring functions
CREATE OR REPLACE FUNCTION public.get_security_metrics()
RETURNS TABLE (
  metric_name TEXT,
  metric_value NUMERIC,
  status TEXT,
  last_updated TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    'total_users'::TEXT,
    (SELECT COUNT(*)::NUMERIC FROM auth.users),
    'healthy'::TEXT,
    now()
  UNION ALL
  SELECT 
    'privileged_users'::TEXT,
    (SELECT COUNT(*)::NUMERIC FROM public.profiles WHERE role IN ('admin', 'tenant_admin', 'system_administrator')),
    'healthy'::TEXT,
    now()
  UNION ALL
  SELECT 
    'audit_logs_today'::TEXT,
    (SELECT COUNT(*)::NUMERIC FROM public.security_audit_logs WHERE timestamp > CURRENT_DATE),
    CASE WHEN (SELECT COUNT(*) FROM public.security_audit_logs WHERE timestamp > CURRENT_DATE) > 0 
         THEN 'healthy' ELSE 'warning' END::TEXT,
    now()
  UNION ALL
  SELECT 
    'critical_operations_today'::TEXT,
    (SELECT COUNT(*)::NUMERIC FROM public.security_audit_logs WHERE timestamp > CURRENT_DATE AND severity = 'critical'),
    CASE WHEN (SELECT COUNT(*) FROM public.security_audit_logs WHERE timestamp > CURRENT_DATE AND severity = 'critical') = 0 
         THEN 'healthy' ELSE 'attention' END::TEXT,
    now();
END;
$$;

-- 5. Create function to detect suspicious activities
CREATE OR REPLACE FUNCTION public.detect_suspicious_activities()
RETURNS TABLE (
  alert_type TEXT,
  description TEXT,
  severity TEXT,
  count BIGINT,
  first_occurrence TIMESTAMP WITH TIME ZONE,
  last_occurrence TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  -- Multiple failed login attempts
  WITH suspicious_patterns AS (
    SELECT 
      'multiple_admin_changes'::TEXT as alert_type,
      'Multiple admin credential changes in short time'::TEXT as description,
      'critical'::TEXT as severity,
      COUNT(*) as count,
      MIN(timestamp) as first_occurrence,
      MAX(timestamp) as last_occurrence
    FROM public.security_audit_logs 
    WHERE table_name = 'tenant_admin_credentials'
      AND operation = 'UPDATE'
      AND timestamp > now() - INTERVAL '1 hour'
    HAVING COUNT(*) > 3
    
    UNION ALL
    
    SELECT 
      'bulk_client_access'::TEXT,
      'Unusual bulk client data access'::TEXT,
      'warning'::TEXT,
      COUNT(*),
      MIN(timestamp),
      MAX(timestamp)
    FROM public.security_audit_logs 
    WHERE table_name = 'client_assignments'
      AND timestamp > now() - INTERVAL '1 hour'
    HAVING COUNT(*) > 10
    
    UNION ALL
    
    SELECT 
      'financial_data_access'::TEXT,
      'High volume financial data operations'::TEXT,
      'warning'::TEXT,
      COUNT(*),
      MIN(timestamp),
      MAX(timestamp)
    FROM public.security_audit_logs 
    WHERE table_name IN ('bank_accounts', 'transfers')
      AND timestamp > now() - INTERVAL '2 hours'
    HAVING COUNT(*) > 20
  )
  SELECT * FROM suspicious_patterns;
END;
$$;

-- Grant execute permissions for security functions
GRANT EXECUTE ON FUNCTION public.get_security_metrics() TO authenticated;
GRANT EXECUTE ON FUNCTION public.detect_suspicious_activities() TO authenticated;

-- Create index for better audit log performance
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_timestamp ON public.security_audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_table_operation ON public.security_audit_logs(table_name, operation);
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_user_tenant ON public.security_audit_logs(user_id, tenant_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_severity ON public.security_audit_logs(severity) WHERE severity IN ('warning', 'critical');
