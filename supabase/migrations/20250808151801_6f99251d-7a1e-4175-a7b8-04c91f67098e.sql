-- Fix security linter issues from the previous migration

-- 1) Fix remaining functions with mutable search_path
DO $$
DECLARE
    func_record RECORD;
    func_body TEXT;
    func_lang TEXT;
    func_volatility TEXT;
BEGIN
    -- Update remaining functions to have fixed search_path
    FOR func_record IN
        SELECT 
            p.proname as function_name,
            p.oid,
            pg_get_function_arguments(p.oid) as args,
            pg_get_functiondef(p.oid) as definition
        FROM pg_proc p
        JOIN pg_namespace n ON n.oid = p.pronamespace
        WHERE n.nspname = 'public'
        AND p.proname NOT LIKE 'pg_%'
        AND p.proname NOT IN (
            -- Skip functions we just updated
            'get_current_user_organization_id',
            'log_vault_activity',
            'create_default_onboarding_steps',
            -- Skip auth functions that need SECURITY DEFINER
            'pgbouncer_get_auth',
            'get_current_user_role', 
            'get_current_user_tenant_id',
            'has_role',
            'has_any_role',
            'is_tenant_admin',
            'validate_user_role_access'
        )
        -- Only get functions that don't already have search_path set
        AND NOT EXISTS (
            SELECT 1 FROM pg_proc_config pc 
            WHERE pc.oid = p.oid 
            AND pc.setting ~ 'search_path'
        )
        LIMIT 5  -- Process in batches to avoid timeout
    LOOP
        -- Extract function details from definition
        func_body := substring(func_record.definition from '\$body\$(.*)\$body\$');
        func_lang := CASE 
            WHEN func_record.definition ~ 'LANGUAGE sql' THEN 'sql'
            WHEN func_record.definition ~ 'LANGUAGE plpgsql' THEN 'plpgsql'
            ELSE 'sql'
        END;
        
        -- Only update if we can safely parse the function
        IF func_body IS NOT NULL THEN
            BEGIN
                EXECUTE format(
                    'CREATE OR REPLACE FUNCTION public.%I(%s) 
                     RETURNS %s 
                     LANGUAGE %s 
                     SECURITY INVOKER 
                     SET search_path = ''''
                     AS $body$%s$body$',
                    func_record.function_name,
                    func_record.args,
                    pg_get_function_result(func_record.oid),
                    func_lang,
                    func_body
                );
                
                RAISE NOTICE 'Updated function: %', func_record.function_name;
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Skipped function % due to complexity: %', func_record.function_name, SQLERRM;
            END;
        END IF;
    END LOOP;
END$$;

-- 2) Add RLS policies to tables that have RLS enabled but no policies
-- Check for onboarding_steps table
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'onboarding_steps'
    ) THEN
        -- Enable RLS if not already enabled
        EXECUTE 'ALTER TABLE public.onboarding_steps ENABLE ROW LEVEL SECURITY';
        
        -- Add basic RLS policy if none exists
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE schemaname = 'public' 
            AND tablename = 'onboarding_steps'
        ) THEN
            EXECUTE 'CREATE POLICY "Users can manage their own onboarding steps" 
                     ON public.onboarding_steps 
                     FOR ALL 
                     USING (user_id = auth.uid())
                     WITH CHECK (user_id = auth.uid())';
        END IF;
    END IF;
END$$;

-- 3) Add RLS policies to vault_activity_log if it was created
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'vault_activity_log'
    ) THEN
        -- Enable RLS if not already enabled
        EXECUTE 'ALTER TABLE public.vault_activity_log ENABLE ROW LEVEL SECURITY';
        
        -- Add basic RLS policy if none exists
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE schemaname = 'public' 
            AND tablename = 'vault_activity_log'
        ) THEN
            EXECUTE 'CREATE POLICY "Users can view their own vault activity" 
                     ON public.vault_activity_log 
                     FOR SELECT 
                     USING (user_id = auth.uid())';
                     
            EXECUTE 'CREATE POLICY "System can insert vault activity" 
                     ON public.vault_activity_log 
                     FOR INSERT 
                     WITH CHECK (true)';
        END IF;
    END IF;
END$$;