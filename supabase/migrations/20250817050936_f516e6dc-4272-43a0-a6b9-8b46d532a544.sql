-- Fix remaining SECURITY DEFINER views by converting them to SECURITY INVOKER

-- Get list of views and convert them
DO $$
DECLARE
    view_record RECORD;
    new_definition TEXT;
BEGIN
    FOR view_record IN 
        SELECT schemaname, viewname, definition 
        FROM pg_views 
        WHERE schemaname = 'public' 
        AND definition ILIKE '%SECURITY DEFINER%'
    LOOP
        -- Replace SECURITY DEFINER with SECURITY INVOKER
        new_definition := REPLACE(view_record.definition, 'SECURITY DEFINER', 'SECURITY INVOKER');
        
        -- Drop and recreate the view
        EXECUTE 'DROP VIEW IF EXISTS ' || quote_ident(view_record.schemaname) || '.' || quote_ident(view_record.viewname) || ' CASCADE';
        EXECUTE new_definition;
        
        RAISE NOTICE 'Converted view % from SECURITY DEFINER to SECURITY INVOKER', view_record.viewname;
    END LOOP;
END $$;

-- Fix functions with mutable search_path by setting secure search_path
DO $$
DECLARE
    func_record RECORD;
BEGIN
    FOR func_record IN 
        SELECT 
            n.nspname as schema_name,
            p.proname as function_name,
            pg_get_function_identity_arguments(p.oid) as args
        FROM pg_proc p 
        JOIN pg_namespace n ON p.pronamespace = n.oid 
        WHERE n.nspname = 'public'
        AND p.prosecdef = false  -- Not security definer
        AND NOT EXISTS (
            SELECT 1 FROM pg_proc_config pc 
            WHERE pc.prooid = p.oid 
            AND pc.proconfig[1] LIKE 'search_path=%'
        )
        AND p.proname NOT LIKE 'pg_%'
        LIMIT 5  -- Fix a few at a time to avoid timeout
    LOOP
        BEGIN
            EXECUTE format('ALTER FUNCTION %I.%I(%s) SET search_path = public, pg_temp', 
                          func_record.schema_name, 
                          func_record.function_name, 
                          func_record.args);
            RAISE NOTICE 'Fixed search_path for function %', func_record.function_name;
        EXCEPTION 
            WHEN OTHERS THEN
                RAISE NOTICE 'Could not fix search_path for function %: %', func_record.function_name, SQLERRM;
        END;
    END LOOP;
END $$;