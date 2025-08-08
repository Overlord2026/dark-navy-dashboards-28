-- Create public wrapper functions for vault and graphql operations
-- These replace direct calls to extension schemas for security

-- Wrapper for vault.create_secret
CREATE OR REPLACE FUNCTION public.secure_create_secret(
  new_secret text,
  new_name text DEFAULT NULL,
  new_description text DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  result_id uuid;
BEGIN
  -- Check if user has permission to create secrets
  IF NOT public.has_any_role(ARRAY['admin', 'system_administrator']) THEN
    RAISE EXCEPTION 'Insufficient permissions to create secrets';
  END IF;
  
  -- Call vault function safely
  SELECT vault.create_secret(new_secret, new_name, new_description) INTO result_id;
  
  RETURN result_id;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error for debugging
    RAISE EXCEPTION 'Failed to create secret: %', SQLERRM;
END;
$$;

-- Wrapper for vault.update_secret
CREATE OR REPLACE FUNCTION public.secure_update_secret(
  secret_id uuid,
  new_secret text DEFAULT NULL,
  new_name text DEFAULT NULL,
  new_description text DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  -- Check if user has permission to update secrets
  IF NOT public.has_any_role(ARRAY['admin', 'system_administrator']) THEN
    RAISE EXCEPTION 'Insufficient permissions to update secrets';
  END IF;
  
  -- Call vault function safely
  PERFORM vault.update_secret(secret_id, new_secret, new_name, new_description);
  
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error for debugging
    RAISE EXCEPTION 'Failed to update secret: %', SQLERRM;
END;
$$;

-- Wrapper for graphql.get_schema_version
CREATE OR REPLACE FUNCTION public.safe_graphql_schema_version()
RETURNS text
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  version_result text;
BEGIN
  -- Attempt to get GraphQL schema version safely
  SELECT graphql.get_schema_version() INTO version_result;
  
  RETURN COALESCE(version_result, 'unknown');
  
EXCEPTION
  WHEN OTHERS THEN
    -- Return a safe default if GraphQL extension is not accessible
    RETURN 'access_denied';
END;
$$;

-- Health check function for app startup
CREATE OR REPLACE FUNCTION public.check_extension_health()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  health_result jsonb := '{}';
  graphql_version text;
  vault_accessible boolean := false;
BEGIN
  -- Check GraphQL access
  BEGIN
    graphql_version := public.safe_graphql_schema_version();
    health_result := health_result || jsonb_build_object('graphql_version', graphql_version);
    health_result := health_result || jsonb_build_object('graphql_accessible', graphql_version != 'access_denied');
  EXCEPTION
    WHEN OTHERS THEN
      health_result := health_result || jsonb_build_object('graphql_accessible', false);
      health_result := health_result || jsonb_build_object('graphql_error', SQLERRM);
  END;
  
  -- Check Vault access (basic check)
  BEGIN
    -- Just check if we can reference vault schema
    PERFORM 1 WHERE EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'vault');
    vault_accessible := true;
    health_result := health_result || jsonb_build_object('vault_accessible', vault_accessible);
  EXCEPTION
    WHEN OTHERS THEN
      health_result := health_result || jsonb_build_object('vault_accessible', false);
      health_result := health_result || jsonb_build_object('vault_error', SQLERRM);
  END;
  
  health_result := health_result || jsonb_build_object('checked_at', now());
  
  RETURN health_result;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.secure_create_secret(text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.secure_update_secret(uuid, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.safe_graphql_schema_version() TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_extension_health() TO authenticated;