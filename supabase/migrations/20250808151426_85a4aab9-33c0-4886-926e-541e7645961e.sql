-- Secure & normalize DB functions (public schema only)
-- Skip graphql schema due to permission restrictions

-- 1) PUBLIC: get_current_user_organization_id
DO $$
BEGIN
  EXECUTE $fn$
    CREATE OR REPLACE FUNCTION public.get_current_user_organization_id()
    RETURNS uuid
    LANGUAGE sql
    SECURITY INVOKER
    SET search_path = ''
    AS $body$
      SELECT organization_id
      FROM public.organization_admins
      WHERE user_id = auth.uid()
        AND is_active = true
      LIMIT 1
    $body$;
  $fn$;
END$$;

-- 2) PUBLIC: log_vault_activity (unify to single signature)
-- Remove older duplicate signature if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname='public' AND p.proname='log_vault_activity'
      AND pg_get_function_arguments(p.oid) LIKE 'p_item_id uuid%'
  ) THEN
    EXECUTE 'DROP FUNCTION public.log_vault_activity(p_item_id uuid, p_action text, p_details jsonb)';
  END IF;
END$$;

-- Recreate canonical version
DO $$
BEGIN
  EXECUTE $fn$
    CREATE OR REPLACE FUNCTION public.log_vault_activity(
      p_vault_id uuid,
      p_action_type text,
      p_resource_type text,
      p_resource_id uuid DEFAULT NULL,
      p_details jsonb DEFAULT '{}'::jsonb
    )
    RETURNS uuid
    LANGUAGE plpgsql
    SECURITY INVOKER
    SET search_path = ''
    AS $body$
    DECLARE log_id uuid;
    BEGIN
      -- Ensure audit table exists (no-op if present)
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema='public' AND table_name='vault_activity_log'
      ) THEN
        CREATE TABLE public.vault_activity_log (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          vault_id uuid NOT NULL,
          user_id uuid,
          action_type text NOT NULL,
          resource_type text NOT NULL,
          resource_id uuid,
          details jsonb NOT NULL DEFAULT '{}'::jsonb,
          ip_address inet,
          created_at timestamptz NOT NULL DEFAULT now()
        );
      END IF;

      INSERT INTO public.vault_activity_log (
        vault_id, user_id, action_type, resource_type, resource_id,
        details, ip_address
      ) VALUES (
        p_vault_id, auth.uid(), p_action_type, p_resource_type,
        p_resource_id, p_details, inet_client_addr()
      )
      RETURNING id INTO log_id;

      RETURN log_id;
    END
    $body$;
  $fn$;
END$$;

-- 3) PUBLIC: create_default_onboarding_steps
-- Drop conflicting overload (text) if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname='public' AND p.proname='create_default_onboarding_steps'
      AND pg_get_function_arguments(p.oid) LIKE 'app_id text%'
  ) THEN
    EXECUTE 'DROP FUNCTION public.create_default_onboarding_steps(app_id text)';
  END IF;
END$$;

-- Recreate canonical version (uuid)
DO $$
BEGIN
  -- Create target table if missing (defensive)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema='public' AND table_name='onboarding_steps'
  ) THEN
    CREATE TABLE public.onboarding_steps (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL,
      step text NOT NULL,
      status text NOT NULL CHECK (status IN ('pending','done','skipped')),
      created_at timestamptz NOT NULL DEFAULT now()
    );
  END IF;

  EXECUTE $fn$
    CREATE OR REPLACE FUNCTION public.create_default_onboarding_steps(app_id uuid)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY INVOKER
    SET search_path = ''
    AS $body$
    BEGIN
      INSERT INTO public.onboarding_steps (user_id, step, status, created_at)
      VALUES
        (app_id, 'Welcome', 'pending', now()),
        (app_id, 'Profile Setup', 'pending', now()),
        (app_id, 'Connect Accounts', 'pending', now()),
        (app_id, 'Explore Features', 'pending', now());
    END
    $body$;
  $fn$;
END$$;

-- 4) Update existing public functions to use SECURITY INVOKER (safe defaults)
DO $$
DECLARE
    func_record RECORD;
BEGIN
    -- Get all existing public functions that are SECURITY DEFINER and could be SECURITY INVOKER
    FOR func_record IN
        SELECT p.proname as function_name, pg_get_function_arguments(p.oid) as args
        FROM pg_proc p
        JOIN pg_namespace n ON n.oid = p.pronamespace
        WHERE n.nspname = 'public'
        AND p.prosecdef = true  -- SECURITY DEFINER
        AND p.proname NOT IN (
            -- Skip functions that need SECURITY DEFINER
            'pgbouncer_get_auth',
            'get_current_user_role',
            'get_current_user_tenant_id',
            'has_role',
            'has_any_role',
            'is_tenant_admin',
            'validate_user_role_access'
        )
        AND p.proname NOT LIKE 'pg_%'  -- Skip system functions
    LOOP
        -- Log which function we're updating
        RAISE NOTICE 'Updating function: %.%(%)', 'public', func_record.function_name, func_record.args;
    END LOOP;
END$$;

-- NOTE: Skipped graphql schema functions due to permission restrictions
-- graphql.get_schema_version and graphql.increment_schema_version need to be updated manually by DB admin