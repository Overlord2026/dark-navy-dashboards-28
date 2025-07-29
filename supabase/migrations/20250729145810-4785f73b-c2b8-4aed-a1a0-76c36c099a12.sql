-- Security Fix: Critical Database Security Issues
-- Fix 1: Convert remaining SECURITY DEFINER functions to use proper search_path
-- Fix 2: Add missing RLS policies for comprehensive coverage
-- Fix 3: Enhance existing functions with proper security

-- Fix search_path for functions that don't have it set
CREATE OR REPLACE FUNCTION public.notify_medication_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  -- Only trigger for medications with RxNorm IDs
  IF NEW.rxnorm_id IS NOT NULL THEN
    -- Call the check-interaction edge function
    PERFORM
      net.http_post(
        url := 'https://xcmqjkvyvuhoslbzmlgi.supabase.co/functions/v1/check-interaction',
        headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || 
                   current_setting('app.settings.service_role_key', true) || '"}'::jsonb,
        body := json_build_object(
          'record', row_to_json(NEW)
        )::jsonb
      );
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Fix search_path for trigger_project_analytics_update
CREATE OR REPLACE FUNCTION public.trigger_project_analytics_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  -- Update project analytics when relevant tables change
  IF TG_TABLE_NAME IN ('user_donations', 'charities', 'impact_reports') THEN
    -- Trigger analytics recalculation for affected tenants
    INSERT INTO public.analytics_events (
      event_type,
      event_category,
      event_data,
      user_id,
      tenant_id
    ) VALUES (
      'analytics_update_required',
      'system',
      jsonb_build_object(
        'table_name', TG_TABLE_NAME,
        'operation', TG_OP,
        'record_id', COALESCE(NEW.id, OLD.id)
      ),
      auth.uid(),
      COALESCE(NEW.tenant_id, OLD.tenant_id, get_current_user_tenant_id())
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Add comprehensive RLS policies for critical tables with missing coverage

-- Analytics Events - Add missing policies
CREATE POLICY "Users can insert their own analytics events" ON public.analytics_events
FOR INSERT WITH CHECK (
  (user_id = auth.uid()) OR 
  (auth.role() = 'service_role'::text)
);

-- API Integration Configs - Add missing DELETE policy
CREATE POLICY "Tenant admins can delete API integrations" ON public.api_integration_configs
FOR DELETE USING (
  (tenant_id = get_current_user_tenant_id()) AND 
  has_any_role(ARRAY['admin'::text, 'tenant_admin'::text])
);

-- Business Entities - Add missing tenant isolation
CREATE POLICY "Users can only access entities in their tenant" ON public.business_entities
FOR ALL USING (
  (user_id = auth.uid()) AND 
  (tenant_id = get_current_user_tenant_id() OR tenant_id IS NULL)
);

-- Client Assignments - Add missing INSERT policy
CREATE POLICY "Firm admins can create client assignments" ON public.client_assignments
FOR INSERT WITH CHECK (
  (firm_id = get_current_user_firm_id()) AND 
  is_firm_admin()
);

-- Compliance Checks - Add missing UPDATE/DELETE policies
CREATE POLICY "Admins can update compliance checks" ON public.compliance_checks
FOR UPDATE USING (
  has_any_role(ARRAY['admin'::text, 'tenant_admin'::text, 'system_administrator'::text])
);

CREATE POLICY "Admins can delete compliance checks" ON public.compliance_checks
FOR DELETE USING (
  has_any_role(ARRAY['admin'::text, 'tenant_admin'::text, 'system_administrator'::text])
);

-- Create security monitoring function for policy violations
CREATE OR REPLACE FUNCTION public.log_rls_violation(
  p_table_name text,
  p_operation text,
  p_user_id uuid DEFAULT auth.uid(),
  p_additional_context jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  INSERT INTO public.security_audit_logs (
    user_id,
    event_type,
    severity,
    resource_type,
    action_performed,
    outcome,
    metadata,
    tenant_id
  ) VALUES (
    p_user_id,
    'rls_policy_violation',
    'high',
    'database_table',
    p_operation,
    'blocked',
    jsonb_build_object(
      'table_name', p_table_name,
      'operation', p_operation,
      'context', p_additional_context
    ),
    get_current_user_tenant_id()
  );
END;
$function$;

-- Create enhanced security function for role validation
CREATE OR REPLACE FUNCTION public.validate_user_role_access(
  p_required_roles text[],
  p_resource_type text DEFAULT 'general',
  p_resource_id uuid DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  user_role text;
  user_tenant_id uuid;
  access_granted boolean := false;
BEGIN
  -- Get current user's role and tenant
  SELECT role, tenant_id INTO user_role, user_tenant_id
  FROM public.profiles 
  WHERE id = auth.uid();
  
  -- If no user found, deny access
  IF user_role IS NULL THEN
    PERFORM log_rls_violation('role_validation', 'access_denied', auth.uid(), 
      jsonb_build_object('reason', 'user_not_found'));
    RETURN false;
  END IF;
  
  -- Check if user has required role
  access_granted := user_role = ANY(p_required_roles);
  
  -- Log access attempt
  INSERT INTO public.security_audit_logs (
    user_id, event_type, severity, resource_type, 
    action_performed, outcome, metadata, tenant_id
  ) VALUES (
    auth.uid(), 'role_access_check', 'low', p_resource_type,
    'role_validation', 
    CASE WHEN access_granted THEN 'success' ELSE 'denied' END,
    jsonb_build_object(
      'required_roles', p_required_roles,
      'user_role', user_role,
      'resource_id', p_resource_id
    ),
    user_tenant_id
  );
  
  RETURN access_granted;
END;
$function$;

-- Add rate limiting table for authentication attempts
CREATE TABLE IF NOT EXISTS public.auth_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text NOT NULL, -- IP address or user identifier
  limit_type text NOT NULL, -- 'login_attempt', 'otp_request', etc.
  attempt_count integer DEFAULT 1,
  window_start timestamp with time zone DEFAULT now(),
  blocked_until timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add index for efficient rate limit queries
CREATE INDEX IF NOT EXISTS idx_auth_rate_limits_identifier_type 
ON public.auth_rate_limits(identifier, limit_type);

-- RLS for rate limits table
ALTER TABLE public.auth_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage rate limits" ON public.auth_rate_limits
FOR ALL USING (auth.role() = 'service_role'::text);

-- Create rate limiting function
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_identifier text,
  p_limit_type text,
  p_max_attempts integer DEFAULT 5,
  p_window_minutes integer DEFAULT 15,
  p_block_minutes integer DEFAULT 30
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  rate_limit_record record;
  current_time timestamp with time zone := now();
  window_start timestamp with time zone := current_time - (p_window_minutes || ' minutes')::interval;
  result jsonb;
BEGIN
  -- Get or create rate limit record
  SELECT * INTO rate_limit_record
  FROM public.auth_rate_limits
  WHERE identifier = p_identifier 
    AND limit_type = p_limit_type
    AND window_start > window_start
  ORDER BY window_start DESC
  LIMIT 1;
  
  -- Check if currently blocked
  IF rate_limit_record.blocked_until IS NOT NULL 
     AND rate_limit_record.blocked_until > current_time THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', 'rate_limited',
      'blocked_until', rate_limit_record.blocked_until,
      'remaining_attempts', 0
    );
  END IF;
  
  -- If no recent record or window expired, create new one
  IF rate_limit_record IS NULL OR rate_limit_record.window_start <= window_start THEN
    INSERT INTO public.auth_rate_limits (identifier, limit_type, attempt_count, window_start)
    VALUES (p_identifier, p_limit_type, 1, current_time)
    RETURNING * INTO rate_limit_record;
    
    RETURN jsonb_build_object(
      'allowed', true,
      'remaining_attempts', p_max_attempts - 1
    );
  END IF;
  
  -- Check if limit exceeded
  IF rate_limit_record.attempt_count >= p_max_attempts THEN
    -- Block the identifier
    UPDATE public.auth_rate_limits
    SET blocked_until = current_time + (p_block_minutes || ' minutes')::interval,
        updated_at = current_time
    WHERE id = rate_limit_record.id;
    
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', 'rate_limit_exceeded',
      'blocked_until', current_time + (p_block_minutes || ' minutes')::interval,
      'remaining_attempts', 0
    );
  END IF;
  
  -- Increment attempt count
  UPDATE public.auth_rate_limits
  SET attempt_count = attempt_count + 1,
      updated_at = current_time
  WHERE id = rate_limit_record.id;
  
  RETURN jsonb_build_object(
    'allowed', true,
    'remaining_attempts', p_max_attempts - (rate_limit_record.attempt_count + 1)
  );
END;
$function$;