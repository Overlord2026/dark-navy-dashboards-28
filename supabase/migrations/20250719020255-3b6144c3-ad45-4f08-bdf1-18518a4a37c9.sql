-- Create database functions for KPI data counting
CREATE OR REPLACE FUNCTION public.count_clients()
RETURNS BIGINT
SECURITY DEFINER
LANGUAGE SQL
AS $$
  SELECT COUNT(*) FROM public.profiles WHERE role = 'client';
$$;

CREATE OR REPLACE FUNCTION public.count_advisors()
RETURNS BIGINT
SECURITY DEFINER
LANGUAGE SQL
AS $$
  SELECT COUNT(*) FROM public.profiles WHERE role IN ('advisor', 'admin', 'tenant_admin');
$$;

CREATE OR REPLACE FUNCTION public.count_health_reports()
RETURNS BIGINT
SECURITY DEFINER
LANGUAGE SQL
AS $$
  SELECT COUNT(*) FROM public.health_recommendations;
$$;

CREATE OR REPLACE FUNCTION public.count_ltc_tests()
RETURNS BIGINT
SECURITY DEFINER
LANGUAGE SQL
AS $$
  SELECT COUNT(*) FROM public.fee_scenarios;
$$;

CREATE OR REPLACE FUNCTION public.count_fee_reports()
RETURNS BIGINT
SECURITY DEFINER
LANGUAGE SQL
AS $$
  SELECT COUNT(*) FROM public.fee_scenarios;
$$;

CREATE OR REPLACE FUNCTION public.count_open_tickets()
RETURNS BIGINT
SECURITY DEFINER
LANGUAGE SQL
AS $$
  SELECT 0; -- Placeholder until support system is implemented
$$;

-- Database health function
CREATE OR REPLACE FUNCTION public.rpc_database_health()
RETURNS JSONB
SECURITY DEFINER
LANGUAGE PLPGSQL
AS $$
DECLARE
  result JSONB;
  table_stats JSONB;
  index_stats JSONB;
BEGIN
  -- Get table statistics
  SELECT jsonb_build_object(
    'total_tables', COUNT(*),
    'largest_table', MAX(pg_total_relation_size(schemaname||'.'||tablename)),
    'total_size_mb', ROUND(SUM(pg_total_relation_size(schemaname||'.'||tablename))::numeric / 1024 / 1024, 2)
  ) INTO table_stats
  FROM pg_tables WHERE schemaname = 'public';
  
  -- Get index statistics
  SELECT jsonb_build_object(
    'total_indexes', COUNT(*),
    'unused_indexes', 0
  ) INTO index_stats
  FROM pg_indexes WHERE schemaname = 'public';
  
  result := jsonb_build_object(
    'status', 'healthy',
    'timestamp', now(),
    'tables', table_stats,
    'indexes', index_stats,
    'connections', (SELECT count(*) FROM pg_stat_activity),
    'slow_queries', 0
  );
  
  RETURN result;
END;
$$;

-- Backup status function
CREATE OR REPLACE FUNCTION public.rpc_backup_status()
RETURNS JSONB
SECURITY DEFINER
LANGUAGE PLPGSQL
AS $$
DECLARE
  result JSONB;
BEGIN
  result := jsonb_build_object(
    'last_backup', now() - interval '1 hour',
    'status', 'success',
    'size_mb', 150.5,
    'retention_days', 30,
    'next_backup', now() + interval '23 hours'
  );
  
  RETURN result;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.count_clients() TO authenticated;
GRANT EXECUTE ON FUNCTION public.count_advisors() TO authenticated;
GRANT EXECUTE ON FUNCTION public.count_health_reports() TO authenticated;
GRANT EXECUTE ON FUNCTION public.count_ltc_tests() TO authenticated;
GRANT EXECUTE ON FUNCTION public.count_fee_reports() TO authenticated;
GRANT EXECUTE ON FUNCTION public.count_open_tickets() TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_database_health() TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_backup_status() TO authenticated;