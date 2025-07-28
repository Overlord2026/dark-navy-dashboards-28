-- Fix security issues identified by the linter

-- 1. Add missing RLS policies for tables that have RLS enabled but no policies
CREATE POLICY "Password history restricted to service role" ON public.password_history
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Failed login attempts restricted to service role" ON public.failed_login_attempts
  FOR ALL USING (auth.role() = 'service_role');

-- 2. Fix function search paths for security
CREATE OR REPLACE FUNCTION public.log_file_access(
  p_file_path TEXT,
  p_bucket_name TEXT,
  p_access_type TEXT,
  p_file_size BIGINT DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.file_access_log (
    user_id, file_path, bucket_name, access_type, 
    ip_address, file_size, tenant_id
  ) VALUES (
    auth.uid(), p_file_path, p_bucket_name, p_access_type,
    inet_client_addr(), p_file_size, get_current_user_tenant_id()
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.log_security_event(
  p_event_type TEXT,
  p_severity TEXT,
  p_resource_type TEXT DEFAULT NULL,
  p_resource_id TEXT DEFAULT NULL,
  p_action_performed TEXT DEFAULT NULL,
  p_outcome TEXT DEFAULT 'success',
  p_metadata JSONB DEFAULT '{}'
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.security_audit_logs (
    user_id, event_type, severity, ip_address, 
    resource_type, resource_id, action_performed, 
    outcome, metadata, tenant_id
  ) VALUES (
    auth.uid(), p_event_type, p_severity, inet_client_addr(),
    p_resource_type, p_resource_id, p_action_performed,
    p_outcome, p_metadata, get_current_user_tenant_id()
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.audit_profile_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  changed_fields TEXT[] := ARRAY[]::TEXT[];
  old_vals JSONB := '{}'::JSONB;
  new_vals JSONB := '{}'::JSONB;
BEGIN
  -- Track changes in critical fields
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    changed_fields := array_append(changed_fields, 'role');
    old_vals := old_vals || jsonb_build_object('role', OLD.role);
    new_vals := new_vals || jsonb_build_object('role', NEW.role);
  END IF;
  
  IF OLD.two_factor_enabled IS DISTINCT FROM NEW.two_factor_enabled THEN
    changed_fields := array_append(changed_fields, 'two_factor_enabled');
    old_vals := old_vals || jsonb_build_object('two_factor_enabled', OLD.two_factor_enabled);
    new_vals := new_vals || jsonb_build_object('two_factor_enabled', NEW.two_factor_enabled);
  END IF;
  
  IF array_length(changed_fields, 1) > 0 THEN
    INSERT INTO public.security_audit_logs (
      user_id, event_type, severity, table_name, operation,
      changed_fields, old_values, new_values, tenant_id
    ) VALUES (
      NEW.id, 'profile_modification', 'medium', 'profiles', 'UPDATE',
      changed_fields, old_vals, new_vals, NEW.tenant_id
    );
  END IF;
  
  RETURN NEW;
END;
$$;