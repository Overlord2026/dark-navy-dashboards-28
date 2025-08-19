-- Fix critical security issues: Enable RLS on vulnerable tables and create PII masking functions

-- 1. Enable RLS on tables that currently have it disabled
ALTER TABLE public.aies_connector_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aies_consent_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aies_policies ENABLE ROW LEVEL SECURITY;

-- 2. Create policies for the newly secured tables
CREATE POLICY "System administrators can manage connector health"
ON public.aies_connector_health
FOR ALL
USING (public.has_any_role(ARRAY['admin', 'system_administrator']));

CREATE POLICY "Users can access their own consent grants"
ON public.aies_consent_grants
FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "System administrators can manage AIES policies"
ON public.aies_policies
FOR ALL
USING (public.has_any_role(ARRAY['admin', 'system_administrator']));

-- 3. Create PII masking functions for enhanced privacy
CREATE OR REPLACE FUNCTION public.mask_phone(phone_text text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SET search_path TO 'public', 'pg_temp'
AS $$
BEGIN
  IF phone_text IS NULL OR phone_text = '' THEN 
    RETURN phone_text; 
  END IF;
  
  -- Remove all non-digits
  phone_text := regexp_replace(phone_text, '[^0-9]', '', 'g');
  
  -- Mask based on length (assuming US format)
  IF length(phone_text) >= 10 THEN
    RETURN '(' || substring(phone_text from 1 for 3) || ') ***-' || right(phone_text, 4);
  ELSE
    RETURN '***-' || right(phone_text, 4);
  END IF;
END;
$$;

-- 4. Create secure data export function with audit logging
CREATE OR REPLACE FUNCTION public.secure_data_export(
  p_export_type text,
  p_filters jsonb DEFAULT '{}',
  p_include_pii boolean DEFAULT false
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
DECLARE
  result jsonb;
  current_user_role text;
BEGIN
  -- Check permissions
  SELECT role INTO current_user_role FROM profiles WHERE id = auth.uid();
  
  IF current_user_role NOT IN ('admin', 'system_administrator') THEN
    RAISE EXCEPTION 'Insufficient permissions for data export';
  END IF;
  
  -- Log the export request
  INSERT INTO security_audit_logs (
    event_type, severity, details, user_id
  ) VALUES (
    'data_export_request',
    'high',
    jsonb_build_object(
      'export_type', p_export_type,
      'include_pii', p_include_pii,
      'filters', p_filters,
      'exported_by', auth.uid()
    ),
    auth.uid()
  );
  
  -- Return confirmation (actual export logic would be implemented in application layer)
  RETURN jsonb_build_object(
    'export_id', gen_random_uuid(),
    'status', 'requested',
    'export_type', p_export_type,
    'include_pii', p_include_pii,
    'requested_at', now()
  );
END;
$$;

-- 5. Create function to log security events with enhanced metadata
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_event_type text,
  p_severity text,
  p_resource_type text DEFAULT NULL,
  p_resource_id text DEFAULT NULL,
  p_action_performed text DEFAULT NULL,
  p_outcome text DEFAULT 'success',
  p_metadata jsonb DEFAULT '{}'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
DECLARE
  event_id uuid;
BEGIN
  INSERT INTO security_audit_logs (
    event_type,
    severity,
    resource_type,
    resource_id,
    action_performed,
    outcome,
    metadata,
    user_id,
    created_at
  ) VALUES (
    p_event_type,
    p_severity,
    p_resource_type,
    p_resource_id,
    p_action_performed,
    p_outcome,
    p_metadata,
    auth.uid(),
    now()
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$;