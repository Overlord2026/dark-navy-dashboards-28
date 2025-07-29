-- =============================================================================
-- ENHANCED SUPABASE PROJECT SCHEMA EXPORT
-- Project ID: xcmqjkvyvuhoslbzmlgi
-- Generated: 2025-07-29
-- =============================================================================

-- This script provides a complete schema export with import validation
-- Run the analysis script (00-comprehensive-analysis.sql) FIRST to identify issues

-- =============================================================================
-- STEP 1: Export Complete Table Schema
-- =============================================================================

SELECT 
    'CREATE TABLE public.' || t.table_name || ' (' || chr(10) ||
    string_agg(
        '  ' || c.column_name || ' ' || 
        CASE 
            WHEN c.data_type = 'ARRAY' THEN c.udt_name
            WHEN c.data_type = 'USER-DEFINED' THEN c.udt_name
            ELSE c.data_type
        END ||
        CASE 
            WHEN c.character_maximum_length IS NOT NULL 
            THEN '(' || c.character_maximum_length || ')'
            WHEN c.numeric_precision IS NOT NULL AND c.numeric_scale IS NOT NULL
            THEN '(' || c.numeric_precision || ',' || c.numeric_scale || ')'
            WHEN c.numeric_precision IS NOT NULL 
            THEN '(' || c.numeric_precision || ')'
            ELSE ''
        END ||
        CASE WHEN c.is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END ||
        CASE WHEN c.column_default IS NOT NULL THEN ' DEFAULT ' || c.column_default ELSE '' END,
        ',' || chr(10)
    ) || chr(10) || ');' || chr(10) || chr(10) as create_statement
FROM information_schema.tables t
JOIN information_schema.columns c ON t.table_name = c.table_name AND t.table_schema = c.table_schema
WHERE t.table_schema = 'public' 
    AND t.table_type = 'BASE TABLE'
    AND t.table_name NOT IN ('spatial_ref_sys') -- Exclude system tables
GROUP BY t.table_name
ORDER BY 
    CASE 
        WHEN t.table_name IN ('profiles') THEN 1
        WHEN t.table_name LIKE '%category%' OR t.table_name LIKE '%type%' THEN 2
        WHEN t.table_name IN ('charities', 'families', 'business_entities') THEN 3
        ELSE 4
    END,
    t.table_name;

-- =============================================================================
-- STEP 2: Export Custom Types and Enums
-- =============================================================================

SELECT 
    'CREATE TYPE public.' || t.typname || ' AS ENUM (' || chr(10) ||
    '  ' || string_agg('''' || e.enumlabel || '''', ',' || chr(10) || '  ') || chr(10) ||
    ');' || chr(10) || chr(10) as enum_statement
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
JOIN pg_namespace n ON t.typnamespace = n.oid
WHERE n.nspname = 'public'
GROUP BY t.typname, t.oid
ORDER BY t.typname;

-- =============================================================================
-- STEP 3: Export Primary Key Constraints
-- =============================================================================

SELECT 
    'ALTER TABLE public.' || t.table_name || 
    ' ADD CONSTRAINT ' || tc.constraint_name || 
    ' PRIMARY KEY (' || string_agg(kcu.column_name, ', ') || ');' || chr(10) as pk_statement
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.tables t ON tc.table_name = t.table_name
WHERE tc.constraint_type = 'PRIMARY KEY'
    AND tc.table_schema = 'public'
    AND t.table_type = 'BASE TABLE'
GROUP BY t.table_name, tc.constraint_name
ORDER BY t.table_name;

-- =============================================================================
-- STEP 4: Export Unique Constraints
-- =============================================================================

SELECT 
    'ALTER TABLE public.' || tc.table_name || 
    ' ADD CONSTRAINT ' || tc.constraint_name || 
    ' UNIQUE (' || string_agg(kcu.column_name, ', ') || ');' || chr(10) as unique_statement
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'UNIQUE'
    AND tc.table_schema = 'public'
GROUP BY tc.table_name, tc.constraint_name
ORDER BY tc.table_name;

-- =============================================================================
-- STEP 5: Export Check Constraints (WARNING: Review time-dependent constraints)
-- =============================================================================

SELECT 
    'ALTER TABLE public.' || tc.table_name || 
    ' ADD CONSTRAINT ' || tc.constraint_name || 
    ' CHECK (' || cc.check_clause || ');' || chr(10) as check_statement
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc ON tc.constraint_name = cc.constraint_name
WHERE tc.constraint_type = 'CHECK'
    AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- =============================================================================
-- STEP 6: Export Indexes (Excluding Primary Keys)
-- =============================================================================

SELECT 
    indexdef || ';' || chr(10) as index_statement
FROM pg_indexes 
WHERE schemaname = 'public'
    AND indexname NOT LIKE '%_pkey'  -- Exclude primary key indexes
    AND indexname NOT LIKE '%_key'   -- Exclude unique constraint indexes
ORDER BY indexname;

-- =============================================================================
-- STEP 7: Export Foreign Key Constraints (WARNING: May fail with auth references)
-- =============================================================================

SELECT 
    'ALTER TABLE public.' || tc.table_name || 
    ' ADD CONSTRAINT ' || tc.constraint_name || 
    ' FOREIGN KEY (' || kcu.column_name || ') REFERENCES ' ||
    ccu.table_schema || '.' || ccu.table_name || '(' || ccu.column_name || ')' ||
    CASE 
        WHEN rc.delete_rule != 'NO ACTION' THEN ' ON DELETE ' || rc.delete_rule
        ELSE ''
    END ||
    CASE 
        WHEN rc.update_rule != 'NO ACTION' THEN ' ON UPDATE ' || rc.update_rule  
        ELSE ''
    END || ';' || chr(10) as fk_statement
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints rc ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- =============================================================================
-- STEP 8: Export All Functions (Security-Aware)
-- =============================================================================

SELECT 
    pg_get_functiondef(p.oid) || ';' || chr(10) || chr(10) as function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
ORDER BY p.proname;

-- =============================================================================
-- STEP 9: Export Triggers
-- =============================================================================

SELECT 
    'CREATE TRIGGER ' || t.trigger_name ||
    ' ' || t.action_timing || ' ' || string_agg(t.event_manipulation, ' OR ') ||
    ' ON public.' || t.event_object_table ||
    ' FOR EACH ' || t.action_orientation ||
    CASE WHEN t.action_condition IS NOT NULL THEN ' WHEN (' || t.action_condition || ')' ELSE '' END ||
    ' EXECUTE FUNCTION ' || t.action_statement || ';' || chr(10) as trigger_statement
FROM information_schema.triggers t
WHERE t.trigger_schema = 'public'
GROUP BY t.trigger_name, t.action_timing, t.event_object_table, 
         t.action_orientation, t.action_condition, t.action_statement
ORDER BY t.event_object_table, t.trigger_name;

-- =============================================================================
-- STEP 10: Export RLS Enable Status
-- =============================================================================

SELECT 
    'ALTER TABLE public.' || tablename || ' ENABLE ROW LEVEL SECURITY;' || chr(10) as rls_statement
FROM pg_tables 
WHERE schemaname = 'public' 
    AND rowsecurity = true
    AND tablename NOT IN ('spatial_ref_sys')
ORDER BY tablename;

-- =============================================================================
-- STEP 11: Export RLS Policies (CRITICAL: Review auth.uid() dependencies)
-- =============================================================================

SELECT 
    'CREATE POLICY ' || quote_ident(pol.polname) || 
    ' ON public.' || quote_ident(c.relname) ||
    CASE 
        WHEN pol.polcmd = '*' THEN ' FOR ALL'
        WHEN pol.polcmd = 'r' THEN ' FOR SELECT'
        WHEN pol.polcmd = 'a' THEN ' FOR INSERT'
        WHEN pol.polcmd = 'w' THEN ' FOR UPDATE'
        WHEN pol.polcmd = 'd' THEN ' FOR DELETE'
    END ||
    CASE WHEN pol.polroles != '{0}' THEN 
        ' TO ' || array_to_string(ARRAY(
            SELECT rolname FROM pg_roles WHERE oid = ANY(pol.polroles)
        ), ', ')
        ELSE ''
    END ||
    CASE WHEN pol.polqual IS NOT NULL THEN 
        ' USING (' || pg_get_expr(pol.polqual, pol.polrelid) || ')'
        ELSE ''
    END ||
    CASE WHEN pol.polwithcheck IS NOT NULL THEN 
        ' WITH CHECK (' || pg_get_expr(pol.polwithcheck, pol.polrelid) || ')'
        ELSE ''
    END || ';' || chr(10) as policy_statement
FROM pg_policy pol
JOIN pg_class c ON pol.polrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'public'
ORDER BY c.relname, pol.polname;

-- =============================================================================
-- STEP 12: Export Views
-- =============================================================================

SELECT 
    'CREATE VIEW public.' || table_name || ' AS ' || chr(10) ||
    view_definition || ';' || chr(10) || chr(10) as view_statement
FROM information_schema.views
WHERE table_schema = 'public'
ORDER BY table_name;

-- =============================================================================
-- IMPORT VALIDATION CHECKLIST
-- =============================================================================

SELECT 
    '-- SANDBOX IMPORT VALIDATION CHECKLIST:' || chr(10) ||
    '-- 1. ✓ Run 00-comprehensive-analysis.sql first' || chr(10) ||
    '-- 2. ✓ Create auth.users with test data BEFORE importing schema' || chr(10) ||
    '-- 3. ✓ Map production user IDs to sandbox user IDs' || chr(10) ||
    '-- 4. ✓ Review time-dependent CHECK constraints' || chr(10) ||
    '-- 5. ✓ Update hardcoded tenant IDs in data' || chr(10) ||
    '-- 6. ✓ Test RLS policies with sandbox users' || chr(10) ||
    '-- 7. ✓ Verify storage bucket policies' || chr(10) ||
    '-- 8. ✓ Check function security settings (DEFINER vs INVOKER)' || chr(10) ||
    chr(10) as import_checklist;