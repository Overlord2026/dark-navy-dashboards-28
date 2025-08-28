-- Security enhancement: Fix admin privilege escalation and add secure role checking

-- Drop existing function to change parameter name
DROP FUNCTION IF EXISTS public.has_any_role(text[]);

-- Create security definer function for secure role checking with new parameter name
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

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.has_any_role(text[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_admin_access_attempt(text, text, boolean, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO authenticated;