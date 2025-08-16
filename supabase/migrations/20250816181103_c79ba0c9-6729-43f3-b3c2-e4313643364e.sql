-- Create helper functions for db-health edge function (fixed)
-- These functions provide read-only access to RLS and policy information

-- Function to get table RLS status
CREATE OR REPLACE FUNCTION public.get_table_rls_status()
RETURNS TABLE (
  table_name TEXT,
  rls_enabled BOOLEAN,
  rls_forced BOOLEAN,
  policy_count BIGINT
) 
LANGUAGE SQL
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT 
    t.table_name::TEXT,
    COALESCE(pt.rowsecurity, false) AS rls_enabled,
    COALESCE(pc.relforcerowsecurity, false) AS rls_forced,
    COALESCE(policy_counts.count, 0) AS policy_count
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
  ) policy_counts ON policy_counts.tablename = t.table_name
  WHERE 
    t.table_schema = 'public'
    AND t.table_type = 'BASE TABLE'
    AND pc.relkind = 'r'
  ORDER BY t.table_name;
$$;

-- Function to get policy information
CREATE OR REPLACE FUNCTION public.get_table_policies()
RETURNS TABLE (
  table_name TEXT,
  policy_name TEXT,
  command TEXT,
  policy_type TEXT
) 
LANGUAGE SQL
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT 
    p.tablename::TEXT as table_name,
    p.policyname::TEXT as policy_name,
    p.cmd::TEXT as command,
    CASE 
      WHEN p.permissive = true THEN 'PERMISSIVE'
      ELSE 'RESTRICTIVE'
    END::TEXT as policy_type
  FROM pg_policies p 
  WHERE p.schemaname = 'public'
  ORDER BY p.tablename, p.policyname;
$$;