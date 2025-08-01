-- Fix function search paths by updating existing functions
CREATE OR REPLACE FUNCTION update_cpa_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Update the get_cpa_staff_permissions function with proper search path
CREATE OR REPLACE FUNCTION public.get_cpa_staff_permissions(staff_user_id UUID)
RETURNS JSONB
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT permissions 
  FROM public.cpa_staff 
  WHERE user_id = staff_user_id AND is_active = true
  LIMIT 1;
$$;

-- Update the has_cpa_permission function with proper search path
CREATE OR REPLACE FUNCTION public.has_cpa_permission(staff_user_id UUID, permission_name TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER  
SET search_path = ''
AS $$
  SELECT COALESCE(
    (SELECT (permissions->permission_name)::boolean 
     FROM public.cpa_staff 
     WHERE user_id = staff_user_id AND is_active = true
     LIMIT 1), 
    false
  );
$$;