-- =============================================================================
-- SUPABASE PROJECT SCHEMA EXPORT
-- Project ID: xcmqjkvyvuhoslbzmlgi
-- Generated: 2025-07-29
-- =============================================================================

-- This script exports the complete database schema including:
-- 1. Tables with columns, constraints, and indexes
-- 2. Functions and triggers
-- 3. Row Level Security (RLS) policies
-- 4. Custom types and enums

-- =============================================================================
-- STEP 1: Export Table Schema
-- =============================================================================

-- Use this query in Supabase SQL Editor to get the complete schema:
SELECT 
    'CREATE TABLE ' || schemaname || '.' || tablename || ' (' || chr(10) ||
    string_agg(
        '  ' || column_name || ' ' || data_type || 
        CASE 
            WHEN character_maximum_length IS NOT NULL 
            THEN '(' || character_maximum_length || ')'
            WHEN numeric_precision IS NOT NULL AND numeric_scale IS NOT NULL
            THEN '(' || numeric_precision || ',' || numeric_scale || ')'
            WHEN numeric_precision IS NOT NULL 
            THEN '(' || numeric_precision || ')'
            ELSE ''
        END ||
        CASE WHEN is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END ||
        CASE WHEN column_default IS NOT NULL THEN ' DEFAULT ' || column_default ELSE '' END,
        ',' || chr(10)
    ) || chr(10) || ');' || chr(10) || chr(10) as create_statement
FROM information_schema.tables t
JOIN information_schema.columns c ON t.table_name = c.table_name AND t.table_schema = c.table_schema
WHERE t.table_schema = 'public' AND t.table_type = 'BASE TABLE'
GROUP BY t.schemaname, t.tablename
ORDER BY t.tablename;

-- =============================================================================
-- STEP 2: Export Custom Types and Enums
-- =============================================================================

SELECT 
    'CREATE TYPE ' || n.nspname || '.' || t.typname || ' AS ENUM (' || chr(10) ||
    '  ' || string_agg('''' || e.enumlabel || '''', ',' || chr(10) || '  ') || chr(10) ||
    ');' || chr(10) as enum_statement
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
JOIN pg_namespace n ON t.typnamespace = n.oid
WHERE n.nspname = 'public'
GROUP BY n.nspname, t.typname, t.oid
ORDER BY t.typname;

-- =============================================================================
-- STEP 3: Export Indexes
-- =============================================================================

SELECT 
    indexdef || ';' || chr(10) as index_statement
FROM pg_indexes 
WHERE schemaname = 'public'
AND indexname NOT LIKE '%_pkey'  -- Exclude primary key indexes
ORDER BY indexname;

-- =============================================================================
-- STEP 4: Export Foreign Key Constraints
-- =============================================================================

SELECT 
    'ALTER TABLE ' || nspname || '.' || relname || 
    ' ADD CONSTRAINT ' || conname || 
    ' ' || pg_get_constraintdef(pg_constraint.oid) || ';' || chr(10) as fk_statement
FROM pg_constraint
JOIN pg_class ON conrelid = pg_class.oid
JOIN pg_namespace ON pg_class.relnamespace = pg_namespace.oid
WHERE contype = 'f'
AND nspname = 'public'
ORDER BY relname, conname;

-- =============================================================================
-- STEP 5: Export Functions
-- =============================================================================

SELECT 
    pg_get_functiondef(p.oid) || ';' || chr(10) || chr(10) as function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
ORDER BY p.proname;

-- =============================================================================
-- STEP 6: Export Triggers
-- =============================================================================

SELECT 
    'CREATE TRIGGER ' || trigger_name ||
    ' ' || action_timing || ' ' || string_agg(event_manipulation, ' OR ') ||
    ' ON ' || trigger_schema || '.' || event_object_table ||
    ' FOR EACH ' || action_orientation ||
    CASE WHEN action_condition IS NOT NULL THEN ' WHEN (' || action_condition || ')' ELSE '' END ||
    ' EXECUTE FUNCTION ' || action_statement || ';' || chr(10) as trigger_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
GROUP BY trigger_name, action_timing, trigger_schema, event_object_table, 
         action_orientation, action_condition, action_statement
ORDER BY event_object_table, trigger_name;

-- =============================================================================
-- STEP 7: Export RLS Policies
-- =============================================================================

SELECT 
    'CREATE POLICY ' || quote_ident(pol.polname) || 
    ' ON ' || quote_ident(n.nspname) || '.' || quote_ident(c.relname) ||
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
-- STEP 8: Export RLS Enable Status
-- =============================================================================

SELECT 
    'ALTER TABLE ' || schemaname || '.' || tablename || ' ENABLE ROW LEVEL SECURITY;' || chr(10) as rls_statement
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = true
ORDER BY tablename;