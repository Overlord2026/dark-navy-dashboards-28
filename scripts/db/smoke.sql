-- Smoke test: Compact summary of tables and RLS status
-- Run this to verify migration applied correctly

SELECT 
    t.table_name,
    CASE 
        WHEN pt.rowsecurity = true THEN 'ENABLED'
        ELSE 'DISABLED'
    END AS rls_enabled,
    CASE 
        WHEN pt.relforcerowsecurity = true THEN 'FORCED'
        ELSE 'NOT_FORCED'
    END AS rls_forced,
    COALESCE(policy_count.count, 0) AS policy_count
FROM information_schema.tables t
LEFT JOIN pg_class pc ON pc.relname = t.table_name
LEFT JOIN pg_tables pt ON pt.tablename = t.table_name AND pt.schemaname = t.table_schema
LEFT JOIN (
    SELECT 
        p.tablename,
        COUNT(*) as count
    FROM pg_policies p
    WHERE p.schemaname = 'public'
    GROUP BY p.tablename
) policy_count ON policy_count.tablename = t.table_name
WHERE 
    t.table_schema = 'public'
    AND t.table_type = 'BASE TABLE'
    AND pc.relkind = 'r'
ORDER BY t.table_name;

-- Extension status
SELECT 
    extname as extension_name,
    CASE WHEN extname IS NOT NULL THEN 'INSTALLED' ELSE 'MISSING' END as status
FROM (
    VALUES ('pgcrypto'), ('pg_trgm')
) AS required(ext)
LEFT JOIN pg_extension ON extname = ext;

-- Policy details for verification
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd as command,
    CASE 
        WHEN permissive = true THEN 'PERMISSIVE'
        ELSE 'RESTRICTIVE'
    END as policy_type,
    LEFT(qual, 50) || CASE WHEN LENGTH(qual) > 50 THEN '...' ELSE '' END as using_expression
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;