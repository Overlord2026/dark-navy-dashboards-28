-- Create test execution tracking system
CREATE TABLE IF NOT EXISTS public.diagnostic_test_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  environment TEXT NOT NULL DEFAULT 'development',
  git_commit_hash TEXT,
  git_branch TEXT,
  total_tests INTEGER NOT NULL DEFAULT 0,
  passed_tests INTEGER NOT NULL DEFAULT 0,
  failed_tests INTEGER NOT NULL DEFAULT 0,
  warnings_count INTEGER NOT NULL DEFAULT 0,
  execution_time_ms INTEGER,
  overall_status TEXT NOT NULL CHECK (overall_status IN ('pass', 'fail', 'warning')),
  test_results JSONB NOT NULL DEFAULT '{}',
  error_details JSONB,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_diagnostic_test_runs_timestamp ON public.diagnostic_test_runs(run_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_diagnostic_test_runs_environment ON public.diagnostic_test_runs(environment);
CREATE INDEX IF NOT EXISTS idx_diagnostic_test_runs_status ON public.diagnostic_test_runs(overall_status);

-- Enable RLS
ALTER TABLE public.diagnostic_test_runs ENABLE ROW LEVEL SECURITY;

-- Create policies for test run management
CREATE POLICY "Service role can manage test runs"
  ON public.diagnostic_test_runs
  FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Authenticated users can view test runs"
  ON public.diagnostic_test_runs
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Create function to log test run results
CREATE OR REPLACE FUNCTION public.log_diagnostic_test_run(
  p_environment TEXT DEFAULT 'development',
  p_git_commit_hash TEXT DEFAULT NULL,
  p_git_branch TEXT DEFAULT NULL,
  p_total_tests INTEGER DEFAULT 0,
  p_passed_tests INTEGER DEFAULT 0,
  p_failed_tests INTEGER DEFAULT 0,
  p_warnings_count INTEGER DEFAULT 0,
  p_execution_time_ms INTEGER DEFAULT NULL,
  p_overall_status TEXT DEFAULT 'pass',
  p_test_results JSONB DEFAULT '{}',
  p_error_details JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_run_id UUID;
BEGIN
  INSERT INTO public.diagnostic_test_runs (
    environment,
    git_commit_hash,
    git_branch,
    total_tests,
    passed_tests,
    failed_tests,
    warnings_count,
    execution_time_ms,
    overall_status,
    test_results,
    error_details,
    created_by
  ) VALUES (
    p_environment,
    p_git_commit_hash,
    p_git_branch,
    p_total_tests,
    p_passed_tests,
    p_failed_tests,
    p_warnings_count,
    p_execution_time_ms,
    p_overall_status,
    p_test_results,
    p_error_details,
    auth.uid()
  ) RETURNING id INTO v_run_id;
  
  RETURN v_run_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to clean up old test runs (retention policy)
CREATE OR REPLACE FUNCTION public.cleanup_old_diagnostic_runs(
  p_retention_days INTEGER DEFAULT 90
)
RETURNS INTEGER AS $$
DECLARE
  v_deleted_count INTEGER;
BEGIN
  DELETE FROM public.diagnostic_test_runs
  WHERE created_at < (now() - (p_retention_days || ' days')::INTERVAL);
  
  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  
  -- Log the cleanup operation
  INSERT INTO public.audit_logs (event_type, status, details)
  VALUES (
    'diagnostic_cleanup',
    'success',
    jsonb_build_object(
      'deleted_runs', v_deleted_count,
      'retention_days', p_retention_days,
      'cleanup_timestamp', now()
    )
  );
  
  RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get test run statistics
CREATE OR REPLACE FUNCTION public.get_diagnostic_test_stats(
  p_environment TEXT DEFAULT NULL,
  p_days_back INTEGER DEFAULT 30
)
RETURNS JSONB AS $$
DECLARE
  v_stats JSONB;
  v_where_clause TEXT := '';
BEGIN
  -- Build dynamic where clause
  IF p_environment IS NOT NULL THEN
    v_where_clause := ' AND environment = ''' || p_environment || '''';
  END IF;
  
  EXECUTE format('
    SELECT jsonb_build_object(
      ''total_runs'', COUNT(*),
      ''passed_runs'', SUM(CASE WHEN overall_status = ''pass'' THEN 1 ELSE 0 END),
      ''failed_runs'', SUM(CASE WHEN overall_status = ''fail'' THEN 1 ELSE 0 END),
      ''warning_runs'', SUM(CASE WHEN overall_status = ''warning'' THEN 1 ELSE 0 END),
      ''success_rate'', ROUND(
        (SUM(CASE WHEN overall_status = ''pass'' THEN 1 ELSE 0 END)::DECIMAL / COUNT(*)) * 100, 2
      ),
      ''avg_execution_time_ms'', ROUND(AVG(execution_time_ms)),
      ''avg_tests_per_run'', ROUND(AVG(total_tests)),
      ''recent_trend'', (
        SELECT jsonb_agg(
          jsonb_build_object(
            ''date'', date_trunc(''day'', run_timestamp),
            ''total_runs'', COUNT(*),
            ''success_rate'', ROUND((SUM(CASE WHEN overall_status = ''pass'' THEN 1 ELSE 0 END)::DECIMAL / COUNT(*)) * 100, 2)
          )
        )
        FROM public.diagnostic_test_runs
        WHERE run_timestamp >= now() - interval ''%s days'' %s
        GROUP BY date_trunc(''day'', run_timestamp)
        ORDER BY date_trunc(''day'', run_timestamp) DESC
        LIMIT 7
      )
    )
    FROM public.diagnostic_test_runs
    WHERE run_timestamp >= now() - interval ''%s days'' %s
  ', p_days_back, v_where_clause, p_days_back, v_where_clause) INTO v_stats;
  
  RETURN v_stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.log_diagnostic_test_run TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.cleanup_old_diagnostic_runs TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_diagnostic_test_stats TO authenticated, service_role;