-- Create query performance monitoring infrastructure

-- Table to store query performance metrics
CREATE TABLE IF NOT EXISTS public.query_performance_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  operation_type TEXT NOT NULL, -- 'SELECT', 'INSERT', 'UPDATE', 'DELETE'
  query_hash TEXT NOT NULL, -- Hash of the query for grouping
  execution_time_ms NUMERIC NOT NULL,
  rows_affected INTEGER,
  function_name TEXT, -- Edge function that executed the query
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  query_plan JSONB, -- For storing EXPLAIN output when available
  index_usage JSONB, -- Track which indexes were used
  cache_hit BOOLEAN DEFAULT NULL, -- Whether query hit cache
  slow_query_threshold_exceeded BOOLEAN DEFAULT FALSE
);

-- Index for fast querying of performance data
CREATE INDEX IF NOT EXISTS idx_query_performance_table_operation 
ON public.query_performance_logs(table_name, operation_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_query_performance_execution_time 
ON public.query_performance_logs(execution_time_ms DESC, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_query_performance_slow_queries 
ON public.query_performance_logs(slow_query_threshold_exceeded, created_at DESC) 
WHERE slow_query_threshold_exceeded = TRUE;

-- Function to log query performance
CREATE OR REPLACE FUNCTION public.log_query_performance(
  p_table_name TEXT,
  p_operation_type TEXT,
  p_query_hash TEXT,
  p_execution_time_ms NUMERIC,
  p_rows_affected INTEGER DEFAULT NULL,
  p_function_name TEXT DEFAULT NULL,
  p_user_id UUID DEFAULT NULL,
  p_query_plan JSONB DEFAULT NULL,
  p_index_usage JSONB DEFAULT NULL,
  p_cache_hit BOOLEAN DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  log_id UUID;
  slow_threshold NUMERIC := 1000; -- 1 second threshold
BEGIN
  INSERT INTO public.query_performance_logs (
    table_name,
    operation_type,
    query_hash,
    execution_time_ms,
    rows_affected,
    function_name,
    user_id,
    query_plan,
    index_usage,
    cache_hit,
    slow_query_threshold_exceeded
  ) VALUES (
    p_table_name,
    p_operation_type,
    p_query_hash,
    p_execution_time_ms,
    p_rows_affected,
    p_function_name,
    p_user_id,
    p_query_plan,
    p_index_usage,
    p_cache_hit,
    p_execution_time_ms > slow_threshold
  ) RETURNING id INTO log_id;
  
  -- Log warning for slow queries
  IF p_execution_time_ms > slow_threshold THEN
    INSERT INTO public.audit_logs (event_type, status, details, user_id)
    VALUES (
      'slow_query_detected',
      'warning',
      jsonb_build_object(
        'table_name', p_table_name,
        'operation_type', p_operation_type,
        'execution_time_ms', p_execution_time_ms,
        'function_name', p_function_name,
        'threshold_ms', slow_threshold
      ),
      p_user_id
    );
  END IF;
  
  RETURN log_id;
END;
$$;

-- Create monitoring views for analytics
CREATE OR REPLACE VIEW public.query_performance_summary AS
SELECT 
  table_name,
  operation_type,
  COUNT(*) as query_count,
  AVG(execution_time_ms) as avg_execution_time_ms,
  MIN(execution_time_ms) as min_execution_time_ms,
  MAX(execution_time_ms) as max_execution_time_ms,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY execution_time_ms) as p95_execution_time_ms,
  COUNT(*) FILTER (WHERE slow_query_threshold_exceeded = TRUE) as slow_query_count,
  DATE_TRUNC('hour', created_at) as hour_bucket
FROM public.query_performance_logs
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY table_name, operation_type, DATE_TRUNC('hour', created_at)
ORDER BY hour_bucket DESC, avg_execution_time_ms DESC;

-- Create view for tracking specific tables mentioned in requirements
CREATE OR REPLACE VIEW public.critical_table_performance AS
SELECT 
  table_name,
  operation_type,
  COUNT(*) as query_count,
  AVG(execution_time_ms) as avg_execution_time_ms,
  MAX(execution_time_ms) as max_execution_time_ms,
  COUNT(*) FILTER (WHERE slow_query_threshold_exceeded = TRUE) as slow_query_count,
  COUNT(*) FILTER (WHERE cache_hit = TRUE) as cache_hit_count,
  ROUND(
    (COUNT(*) FILTER (WHERE cache_hit = TRUE)::NUMERIC / NULLIF(COUNT(*), 0)) * 100, 2
  ) as cache_hit_rate_percent,
  DATE_TRUNC('hour', created_at) as hour_bucket
FROM public.query_performance_logs
WHERE table_name IN ('analytics_events', 'tracked_events', 'webhook_deliveries')
  AND created_at >= NOW() - INTERVAL '24 hours'
GROUP BY table_name, operation_type, DATE_TRUNC('hour', created_at)
ORDER BY hour_bucket DESC, avg_execution_time_ms DESC;

-- Function to get top slow queries
CREATE OR REPLACE FUNCTION public.get_top_slow_queries(
  p_hours_back INTEGER DEFAULT 24,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  table_name TEXT,
  operation_type TEXT,
  query_hash TEXT,
  avg_execution_time_ms NUMERIC,
  max_execution_time_ms NUMERIC,
  query_count BIGINT,
  function_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    qpl.table_name,
    qpl.operation_type,
    qpl.query_hash,
    AVG(qpl.execution_time_ms) as avg_execution_time_ms,
    MAX(qpl.execution_time_ms) as max_execution_time_ms,
    COUNT(*) as query_count,
    qpl.function_name
  FROM public.query_performance_logs qpl
  WHERE qpl.created_at >= NOW() - (p_hours_back || ' hours')::INTERVAL
  GROUP BY qpl.table_name, qpl.operation_type, qpl.query_hash, qpl.function_name
  ORDER BY avg_execution_time_ms DESC
  LIMIT p_limit;
END;
$$;

-- Grant permissions for service role to log performance data
GRANT INSERT, SELECT ON public.query_performance_logs TO service_role;
GRANT SELECT ON public.query_performance_summary TO service_role;
GRANT SELECT ON public.critical_table_performance TO service_role;
GRANT EXECUTE ON FUNCTION public.log_query_performance TO service_role;
GRANT EXECUTE ON FUNCTION public.get_top_slow_queries TO service_role;

-- RLS policies for query performance logs (restrict to service role and admins)
ALTER TABLE public.query_performance_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage query performance logs"
ON public.query_performance_logs
FOR ALL
USING (auth.role() = 'service_role');

CREATE POLICY "System admins can view query performance logs"
ON public.query_performance_logs
FOR SELECT
USING (get_current_user_role() = 'system_administrator');