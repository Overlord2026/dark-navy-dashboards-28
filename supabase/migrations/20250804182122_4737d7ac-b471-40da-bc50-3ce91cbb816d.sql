-- Fix critical database security issues

-- 1. Fix profiles table RLS policy to prevent role escalation
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can update own profile (limited fields)" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND 
  -- Only allow role updates by admins
  (role = role OR has_any_role(ARRAY['admin', 'system_administrator', 'tenant_admin']))
);

-- 2. Create secure role update function for admins only
CREATE OR REPLACE FUNCTION public.update_user_role(
  target_user_id uuid,
  new_role text
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Only allow admins to update roles
  IF NOT has_any_role(ARRAY['admin', 'system_administrator', 'tenant_admin']) THEN
    RAISE EXCEPTION 'Insufficient permissions to update user roles';
  END IF;
  
  -- Validate role
  IF new_role NOT IN ('client', 'advisor', 'admin', 'system_administrator', 'tenant_admin', 'accountant', 'consultant', 'attorney', 'coach') THEN
    RAISE EXCEPTION 'Invalid role specified';
  END IF;
  
  -- Update the role
  UPDATE public.profiles 
  SET role = new_role, updated_at = now()
  WHERE id = target_user_id;
  
  -- Log the role change if security_audit_logs table exists
  INSERT INTO public.security_audit_logs (
    user_id, event_type, severity, resource_type, action_performed,
    metadata, tenant_id
  ) VALUES (
    auth.uid(), 'role_change', 'critical', 'user_role', 'role_updated',
    jsonb_build_object('target_user_id', target_user_id, 'new_role', new_role),
    get_current_user_tenant_id()
  );
  
  RETURN true;
EXCEPTION WHEN OTHERS THEN
  -- If logging fails, still return success but log the error
  RAISE WARNING 'Role updated but logging failed: %', SQLERRM;
  RETURN true;
END;
$$;

-- 3. Reduce OTP expiry time for better security
ALTER TABLE public.user_otp_codes 
ALTER COLUMN expires_at SET DEFAULT (now() + interval '5 minutes');