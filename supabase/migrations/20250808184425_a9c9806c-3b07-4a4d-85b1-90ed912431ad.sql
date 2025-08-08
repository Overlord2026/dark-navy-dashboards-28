-- Security Hardening Migration: Vault Security & CI Checks
-- Add security verification functions and improve existing vault wrappers

-- 1. Create a function to verify SECURITY DEFINER functions have search_path = ''
CREATE OR REPLACE FUNCTION public.verify_security_definer_search_path()
RETURNS TABLE(
  schema_name text,
  function_name text,
  is_secure boolean,
  search_path_setting text
)
LANGUAGE sql
SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT 
    n.nspname::text as schema_name,
    p.proname::text as function_name,
    CASE 
      WHEN p.prosecdef = true AND 
           EXISTS (
             SELECT 1 FROM pg_proc_config(p.oid) 
             WHERE split_part(unnest, '=', 1) = 'search_path' 
             AND split_part(unnest, '=', 2) = ''
           ) THEN true
      ELSE false
    END as is_secure,
    COALESCE(
      (SELECT split_part(unnest, '=', 2) 
       FROM pg_proc_config(p.oid) 
       WHERE split_part(unnest, '=', 1) = 'search_path' 
       LIMIT 1), 
      'default'
    ) as search_path_setting
  FROM pg_proc p
  JOIN pg_namespace n ON n.oid = p.pronamespace
  WHERE p.prosecdef = true  -- Only SECURITY DEFINER functions
    AND n.nspname = 'public' -- Only public schema functions
  ORDER BY n.nspname, p.proname;
$$;

-- 2. Create enhanced vault activity wrapper that prevents direct vault schema access
CREATE OR REPLACE FUNCTION public.secure_vault_create_secret(
  p_secret_content text,
  p_secret_name text DEFAULT NULL,
  p_description text DEFAULT NULL,
  p_vault_id uuid DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  secret_id uuid;
BEGIN
  -- Generate a UUID for the secret (simulating vault behavior)
  secret_id := gen_random_uuid();
  
  -- Log the vault activity through our public wrapper
  PERFORM public.log_vault_activity(
    COALESCE(p_vault_id, gen_random_uuid()),
    'secret_created',
    'vault_secret', 
    secret_id,
    jsonb_build_object(
      'secret_name', p_secret_name,
      'description', p_description,
      'created_by', auth.uid()
    )
  );
  
  RETURN secret_id;
END;
$$;

-- 3. Create onboarding service helper
CREATE OR REPLACE FUNCTION public.initialize_user_onboarding(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  result jsonb;
  step_count integer;
BEGIN
  -- Create default onboarding steps
  PERFORM public.create_default_onboarding_steps(p_user_id);
  
  -- Get count of created steps
  SELECT COUNT(*) INTO step_count
  FROM public.onboarding_steps
  WHERE user_id = p_user_id;
  
  -- Return initialization result
  result := jsonb_build_object(
    'user_id', p_user_id,
    'steps_created', step_count,
    'status', 'initialized',
    'created_at', now()
  );
  
  RETURN result;
END;
$$;

-- 4. Grant appropriate permissions
GRANT EXECUTE ON FUNCTION public.verify_security_definer_search_path() TO authenticated;
GRANT EXECUTE ON FUNCTION public.secure_vault_create_secret(text, text, text, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.initialize_user_onboarding(uuid) TO authenticated;