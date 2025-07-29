-- =============================================================================
-- COMPREHENSIVE DATABASE SCHEMA ANALYSIS FOR SANDBOX IMPORT
-- Project ID: xcmqjkvyvuhoslbzmlgi
-- Generated: 2025-07-29
-- =============================================================================

-- PURPOSE: This script analyzes the current database schema for potential
-- import issues when creating a sandbox environment. Run these queries 
-- BEFORE attempting to export/import to identify and resolve issues.

-- =============================================================================
-- SECTION 1: SCHEMA HEALTH CHECK
-- =============================================================================

-- 1.1: List all tables with estimated row counts
SELECT 
    'TABLE_COUNT' as check_type,
    t.table_name,
    t.table_type,
    CASE 
        WHEN t.table_name IN ('spatial_ref_sys') THEN 'SYSTEM_EXCLUDE'
        WHEN t.table_type = 'VIEW' THEN 'VIEW_EXCLUDE' 
        ELSE 'USER_INCLUDE' 
    END as import_category,
    COALESCE(pg_class.reltuples::bigint, 0) as estimated_rows
FROM information_schema.tables t
LEFT JOIN pg_class ON pg_class.relname = t.table_name
WHERE t.table_schema = 'public' 
ORDER BY t.table_name;

-- 1.2: Check for auth.users dependencies (CRITICAL FOR IMPORT)
SELECT 
    'AUTH_DEPENDENCY' as check_type,
    t.table_name,
    c.column_name,
    c.data_type,
    c.is_nullable,
    CASE 
        WHEN c.is_nullable = 'NO' THEN 'REQUIRES_USER_DATA'
        ELSE 'NULLABLE_OK'
    END as import_impact,
    c.column_default
FROM information_schema.tables t
JOIN information_schema.columns c ON t.table_name = c.table_name
WHERE t.table_schema = 'public' 
    AND (c.column_name LIKE '%user_id%' OR c.column_name = 'id')
    AND t.table_type = 'BASE TABLE'
ORDER BY t.table_name, c.column_name;

-- 1.3: Check for foreign key constraints that might fail
SELECT 
    'FOREIGN_KEY' as check_type,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    tc.constraint_name,
    CASE 
        WHEN ccu.table_name LIKE '%auth%' THEN 'AUTH_REFERENCE_ISSUE'
        ELSE 'STANDARD_FK'
    END as import_risk
FROM information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_name;

-- =============================================================================
-- SECTION 2: RLS POLICY ANALYSIS
-- =============================================================================

-- 2.1: Check RLS status for all tables
SELECT 
    'RLS_STATUS' as check_type,
    schemaname,
    tablename,
    rowsecurity as rls_enabled,
    CASE 
        WHEN rowsecurity = true THEN 'RLS_ENABLED'
        ELSE 'RLS_DISABLED_RISK'
    END as security_status
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- 2.2: Count policies per table
SELECT 
    'POLICY_COUNT' as check_type,
    schemaname,
    tablename,
    COUNT(*) as policy_count,
    CASE 
        WHEN COUNT(*) = 0 THEN 'NO_POLICIES_RISK'
        WHEN COUNT(*) < 3 THEN 'FEW_POLICIES_REVIEW'
        ELSE 'ADEQUATE_POLICIES'
    END as policy_status
FROM pg_policies 
WHERE schemaname = 'public'
GROUP BY schemaname, tablename
ORDER BY policy_count ASC, tablename;

-- =============================================================================
-- SECTION 3: FUNCTION AND TRIGGER ANALYSIS
-- =============================================================================

-- 3.1: List all custom functions
SELECT 
    'FUNCTION' as check_type,
    p.proname as function_name,
    pg_get_function_arguments(p.oid) as arguments,
    CASE p.provolatile
        WHEN 'i' THEN 'IMMUTABLE'
        WHEN 's' THEN 'STABLE'
        WHEN 'v' THEN 'VOLATILE'
    END as volatility,
    CASE p.prosecdef
        WHEN true THEN 'SECURITY_DEFINER'
        ELSE 'SECURITY_INVOKER'
    END as security_type
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
ORDER BY p.proname;

-- 3.2: List all triggers
SELECT 
    'TRIGGER' as check_type,
    trigger_name,
    event_object_table as table_name,
    action_timing,
    string_agg(event_manipulation, ', ') as events,
    action_statement as function_name
FROM information_schema.triggers
WHERE trigger_schema = 'public'
GROUP BY trigger_name, event_object_table, action_timing, action_statement
ORDER BY event_object_table, trigger_name;

-- =============================================================================
-- SECTION 4: DATA INTEGRITY CHECKS
-- =============================================================================

-- 4.1: Check for tables with CHECK constraints that might fail
SELECT 
    'CHECK_CONSTRAINT' as check_type,
    tc.table_name,
    tc.constraint_name,
    cc.check_clause,
    CASE 
        WHEN cc.check_clause LIKE '%now()%' THEN 'TIME_DEPENDENT_RISK'
        WHEN cc.check_clause LIKE '%auth.uid()%' THEN 'AUTH_DEPENDENT_RISK'
        ELSE 'STANDARD_CHECK'
    END as import_risk
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc ON tc.constraint_name = cc.constraint_name
WHERE tc.table_schema = 'public' AND tc.constraint_type = 'CHECK'
ORDER BY tc.table_name;

-- 4.2: Identify potential orphaned records
SELECT 
    'ORPHAN_CHECK' as check_type,
    'Run manual checks for orphaned user_id references after auth import' as recommendation;

-- =============================================================================
-- SECTION 5: STORAGE AND FILE REFERENCES
-- =============================================================================

-- 5.1: Check for storage bucket references
SELECT 
    'STORAGE_REFERENCE' as check_type,
    table_name,
    column_name,
    'Check for file_path or bucket references' as note
FROM information_schema.columns
WHERE table_schema = 'public'
    AND (column_name LIKE '%file%' OR column_name LIKE '%bucket%' OR column_name LIKE '%storage%')
ORDER BY table_name;

-- =============================================================================
-- RECOMMENDED IMPORT ORDER (Based on Dependencies)
-- =============================================================================

SELECT 
    'IMPORT_ORDER' as check_type,
    ROW_NUMBER() OVER (ORDER BY 
        CASE 
            WHEN table_name IN ('profiles') THEN 1
            WHEN table_name LIKE '%category%' OR table_name LIKE '%type%' THEN 2
            WHEN table_name IN ('charities', 'families', 'business_entities') THEN 3
            ELSE 4
        END
    ) as import_sequence,
    table_name,
    CASE 
        WHEN table_name IN ('profiles') THEN 'Import first - core user data'
        WHEN table_name LIKE '%category%' OR table_name LIKE '%type%' THEN 'Import early - lookup tables'
        WHEN table_name IN ('charities', 'families', 'business_entities') THEN 'Import before dependent tables'
        ELSE 'Standard import order'
    END as reason
FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    AND table_name NOT IN ('spatial_ref_sys')
ORDER BY import_sequence, table_name;

-- =============================================================================
-- CRITICAL WARNINGS FOR SANDBOX IMPORT
-- =============================================================================

SELECT 
    'CRITICAL_WARNING' as check_type,
    'Before importing to sandbox:' as warning_category,
    E'1. Export auth.users SEPARATELY\n2. Create test users in sandbox FIRST\n3. Map production user IDs to sandbox user IDs\n4. Update all user_id references during import\n5. Verify RLS policies work with test users\n6. Test file storage bucket access\n7. Update any hardcoded tenant IDs' as action_items;