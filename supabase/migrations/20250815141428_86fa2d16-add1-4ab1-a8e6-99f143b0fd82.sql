-- 1) GraphQL: let anon/authenticated USE the schema and EXECUTE wrappers
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_namespace WHERE nspname='graphql') THEN
    GRANT USAGE ON SCHEMA graphql TO anon, authenticated;
    GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA graphql TO anon, authenticated;
  END IF;
END$$;

-- 2) Vault optional: create a safe public wrapper your UI can call
--    (does NOT touch the vault schema; just reports presence)
CREATE OR REPLACE FUNCTION public.vault_is_configured()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
  SELECT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'supabase_vault');
$$;

REVOKE ALL ON FUNCTION public.vault_is_configured() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.vault_is_configured() TO anon, authenticated;

-- 3) (Optional safety) keep any vault public wrappers locked down
--    If these exist in your DB, ensure anon cannot run them.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE pronamespace = 'public'::regnamespace AND proname='secure_create_secret') THEN
    REVOKE EXECUTE ON FUNCTION public.secure_create_secret(text,text,text) FROM PUBLIC, anon, authenticated;
    GRANT  EXECUTE ON FUNCTION public.secure_create_secret(text,text,text) TO service_role;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_proc WHERE pronamespace = 'public'::regnamespace AND proname='secure_update_secret') THEN
    REVOKE EXECUTE ON FUNCTION public.secure_update_secret(uuid,text,text,text) FROM PUBLIC, anon;
    GRANT  EXECUTE ON FUNCTION public.secure_update_secret(uuid,text,text,text) TO service_role;
  END IF;
END$$;