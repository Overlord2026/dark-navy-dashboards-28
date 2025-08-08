-- Fix security linter issues - simplified version

-- 1) Add RLS policies to tables that have RLS enabled but no policies
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

-- 2) Add RLS policies to vault_activity_log if it was created
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