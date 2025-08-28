-- Security enhancement: Add secure role checking functions and audit logging

-- Create security definer function for secure role checking
CREATE OR REPLACE FUNCTION public.has_any_role(allowed_roles text[])
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
DECLARE
  user_role text;
BEGIN
  -- Get current user's role from profiles table
  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = auth.uid();
  
  -- Return false if no role found or user not authenticated
  IF user_role IS NULL OR auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check if user's role is in allowed roles array
  RETURN user_role = ANY(allowed_roles);
END;
$$;

-- Create security definer function for checking specific role
CREATE OR REPLACE FUNCTION public.has_role(required_role text)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
DECLARE
  user_role text;
BEGIN
  -- Get current user's role from profiles table
  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = auth.uid();
  
  -- Return false if no role found or user not authenticated
  IF user_role IS NULL OR auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check if user's role matches required role
  RETURN user_role = required_role;
END;
$$;

-- Create function to log admin access attempts
CREATE OR REPLACE FUNCTION public.log_admin_access_attempt(
  p_resource text,
  p_action text,
  p_granted boolean,
  p_required_role text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
DECLARE
  log_id uuid;
  user_role text;
BEGIN
  -- Get current user's role
  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = auth.uid();
  
  -- Insert audit log entry
  INSERT INTO public.security_audit_logs (
    user_id,
    event_type,
    severity,
    resource_type,
    action_performed,
    metadata,
    ip_address,
    user_agent,
    tenant_id
  ) VALUES (
    auth.uid(),
    'admin_access_attempt',
    CASE WHEN p_granted THEN 'info' ELSE 'warning' END,
    'admin_panel',
    p_action,
    jsonb_build_object(
      'resource', p_resource,
      'granted', p_granted,
      'user_role', user_role,
      'required_role', p_required_role,
      'timestamp', now()
    ),
    NULL, -- IP address would be populated by application
    NULL, -- User agent would be populated by application
    get_current_user_tenant_id()
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

-- Create function to check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
DECLARE
  user_role text;
BEGIN
  -- Get current user's role from profiles table
  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = auth.uid();
  
  -- Return false if no role found or user not authenticated
  IF user_role IS NULL OR auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check if user is system administrator
  RETURN user_role = 'system_administrator';
END;
$$;

-- Create function to validate role assignments
CREATE OR REPLACE FUNCTION public.validate_role_assignment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
DECLARE
  valid_roles text[] := ARRAY[
    'client', 'advisor', 'accountant', 'consultant', 
    'attorney', 'coach', 'tenant_admin', 'admin', 'system_administrator'
  ];
BEGIN
  -- Validate role is in allowed list
  IF NEW.role IS NOT NULL AND NOT (NEW.role = ANY(valid_roles)) THEN
    RAISE EXCEPTION 'Invalid role: %. Allowed roles are: %', NEW.role, valid_roles;
  END IF;
  
  -- Log role changes for audit
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    INSERT INTO public.security_audit_logs (
      user_id, event_type, severity, resource_type, action_performed,
      metadata, tenant_id
    ) VALUES (
      COALESCE(auth.uid(), NEW.id),
      'role_change',
      'critical',
      'user_profile',
      'role_updated',
      jsonb_build_object(
        'target_user_id', NEW.id,
        'old_role', OLD.role,
        'new_role', NEW.role,
        'changed_by', auth.uid()
      ),
      NEW.tenant_id
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Add trigger to profiles table for role validation
DROP TRIGGER IF EXISTS validate_role_assignment_trigger ON public.profiles;
CREATE TRIGGER validate_role_assignment_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_role_assignment();

-- Add trigger for new profile creation
DROP TRIGGER IF EXISTS validate_new_profile_role_trigger ON public.profiles;
CREATE TRIGGER validate_new_profile_role_trigger
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_role_assignment();

-- Create view for safe role checking (removes email-based admin detection)
CREATE OR REPLACE VIEW public.user_role_access AS
SELECT 
  p.id,
  p.role,
  p.tenant_id,
  CASE 
    WHEN p.role = 'system_administrator' THEN true
    ELSE false
  END as is_super_admin,
  CASE 
    WHEN p.role IN ('tenant_admin', 'admin', 'system_administrator') THEN true
    ELSE false
  END as is_admin,
  CASE 
    WHEN p.role IN ('advisor', 'accountant', 'consultant', 'attorney', 'coach', 'tenant_admin', 'admin', 'system_administrator') THEN true
    ELSE false
  END as is_professional
FROM public.profiles p
WHERE p.id = auth.uid();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.has_any_role(text[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_admin_access_attempt(text, text, boolean, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO authenticated;
GRANT SELECT ON public.user_role_access TO authenticated;