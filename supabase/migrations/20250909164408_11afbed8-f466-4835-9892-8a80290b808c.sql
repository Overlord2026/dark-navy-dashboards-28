-- Fix Security Definer Views by adding SECURITY INVOKER
-- This ensures views use the permissions of the querying user, not the view creator

-- Get all views that have security_barrier=true but lack security_invoker=true
DO $$
DECLARE
    view_record RECORD;
    view_count INTEGER := 0;
BEGIN
    -- Loop through all problematic views
    FOR view_record IN 
        SELECT c.relname as view_name
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relkind = 'v'
        AND n.nspname = 'public'
        AND c.reloptions IS NOT NULL
        AND ('security_barrier=true' = ANY(c.reloptions))
        AND NOT ('security_invoker=true' = ANY(c.reloptions))
    LOOP
        -- Add security_invoker=true option to each view
        EXECUTE format('ALTER VIEW public.%I SET (security_invoker=true);', view_record.view_name);
        view_count := view_count + 1;
        
        RAISE NOTICE 'Fixed security definer view: %', view_record.view_name;
    END LOOP;
    
    RAISE NOTICE 'Total views fixed: %', view_count;
END$$;

-- Verify the fix by checking that all views now have security_invoker=true
DO $$
DECLARE
    remaining_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO remaining_count
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relkind = 'v'
    AND n.nspname = 'public'
    AND c.reloptions IS NOT NULL
    AND ('security_barrier=true' = ANY(c.reloptions))
    AND NOT ('security_invoker=true' = ANY(c.reloptions));
    
    IF remaining_count = 0 THEN
        RAISE NOTICE 'SUCCESS: All security_barrier views now have security_invoker=true';
    ELSE
        RAISE WARNING 'WARNING: % views still need security_invoker=true', remaining_count;
    END IF;
END$$;