-- Phase 2: Database Security Hardening - Access Controls & Monitoring
-- Day 8-10: Service Role Management and Dashboard Access Controls

-- 1. Create service role audit table to track service role usage
CREATE TABLE IF NOT EXISTS public.service_role_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  function_name TEXT NOT NULL,
  operation_type TEXT NOT NULL,
  execution_context TEXT,
  user_context UUID,
  tenant_context UUID,
  execution_time_ms NUMERIC,
  success BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT,
  request_metadata JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  severity TEXT DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),
  compliance_flags TEXT[] DEFAULT '{}'
);

-- Enable RLS on service role audit logs
ALTER TABLE public.service_role_audit_logs ENABLE ROW LEVEL SECURITY;

-- Only system administrators can access service role audit logs
CREATE POLICY "Only system admins can access service role audit logs" 
ON public.service_role_audit_logs FOR ALL 
USING (has_role('system_administrator'));

-- 2. Create dashboard access audit table
CREATE TABLE IF NOT EXISTS public.dashboard_access_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  access_type TEXT NOT NULL, -- 'login', 'logout', 'permission_change'
  ip_address INET,
  user_agent TEXT,
  session_duration_minutes INTEGER,
  actions_performed TEXT[],
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  severity TEXT DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),
  mfa_verified BOOLEAN DEFAULT false,
  geolocation JSONB,
  compliance_flags TEXT[] DEFAULT '{}'
);

-- Enable RLS on dashboard access logs
ALTER TABLE public.dashboard_access_logs ENABLE ROW LEVEL SECURITY;

-- Only system administrators can access dashboard logs
CREATE POLICY "Only system admins can access dashboard logs" 
ON public.dashboard_access_logs FOR ALL 
USING (has_role('system_administrator'));

-- 3. Create function to log service role usage
CREATE OR REPLACE FUNCTION public.log_service_role_usage(
  p_function_name TEXT,
  p_operation_type TEXT,
  p_execution_context TEXT DEFAULT NULL,
  p_user_context UUID DEFAULT NULL,
  p_tenant_context UUID DEFAULT NULL,
  p_execution_time_ms NUMERIC DEFAULT NULL,
  p_success BOOLEAN DEFAULT true,
  p_error_message TEXT DEFAULT NULL,
  p_request_metadata JSONB DEFAULT '{}'
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  log_id UUID;
  severity_level TEXT := 'info';
BEGIN
  -- Determine severity based on operation and success
  IF NOT p_success THEN
    severity_level := 'critical';
  ELSIF p_function_name IN ('reset-test-data', 'admin-override') THEN
    severity_level := 'warning';
  END IF;
  
  -- Insert service role usage log
  INSERT INTO public.service_role_audit_logs (
    function_name, operation_type, execution_context,
    user_context, tenant_context, execution_time_ms,
    success, error_message, request_metadata, severity
  ) VALUES (
    p_function_name, p_operation_type, p_execution_context,
    p_user_context, p_tenant_context, p_execution_time_ms,
    p_success, p_error_message, p_request_metadata, severity_level
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

-- 4. Create function to detect service role abuse
CREATE OR REPLACE FUNCTION public.detect_service_role_abuse()
RETURNS TABLE (
  alert_type TEXT,
  description TEXT,
  severity TEXT,
  count BIGINT,
  first_occurrence TIMESTAMP WITH TIME ZONE,
  last_occurrence TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  WITH abuse_patterns AS (
    SELECT 
      'excessive_service_role_usage'::TEXT as alert_type,
      'Excessive service role usage detected'::TEXT as description,
      'warning'::TEXT as severity,
      COUNT(*) as count,
      MIN(timestamp) as first_occurrence,
      MAX(timestamp) as last_occurrence
    FROM public.service_role_audit_logs 
    WHERE timestamp > now() - INTERVAL '1 hour'
    HAVING COUNT(*) > 100
    
    UNION ALL
    
    SELECT 
      'service_role_failures'::TEXT,
      'Multiple service role operation failures'::TEXT,
      'critical'::TEXT,
      COUNT(*),
      MIN(timestamp),
      MAX(timestamp)
    FROM public.service_role_audit_logs 
    WHERE success = false
      AND timestamp > now() - INTERVAL '1 hour'
    HAVING COUNT(*) > 5
    
    UNION ALL
    
    SELECT 
      'unauthorized_admin_operations'::TEXT,
      'Unauthorized admin-level operations via service role'::TEXT,
      'critical'::TEXT,
      COUNT(*),
      MIN(timestamp),
      MAX(timestamp)
    FROM public.service_role_audit_logs 
    WHERE function_name LIKE '%admin%'
      AND user_context IS NULL
      AND timestamp > now() - INTERVAL '2 hours'
    HAVING COUNT(*) > 10
  )
  SELECT * FROM abuse_patterns;
END;
$$;

-- 5. Create enhanced security metrics function
CREATE OR REPLACE FUNCTION public.get_enhanced_security_metrics()
RETURNS TABLE (
  metric_category TEXT,
  metric_name TEXT,
  metric_value NUMERIC,
  status TEXT,
  last_updated TIMESTAMP WITH TIME ZONE,
  details JSONB
) 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  -- User security metrics
  SELECT 
    'user_security'::TEXT,
    'mfa_enabled_users'::TEXT,
    (SELECT COUNT(*)::NUMERIC FROM public.profiles WHERE two_factor_enabled = true),
    CASE 
      WHEN (SELECT COUNT(*) FROM public.profiles WHERE two_factor_enabled = true) > 
           (SELECT COUNT(*) FROM public.profiles) * 0.8 
      THEN 'healthy' 
      ELSE 'warning' 
    END::TEXT,
    now(),
    jsonb_build_object(
      'total_users', (SELECT COUNT(*) FROM public.profiles),
      'mfa_percentage', ROUND((SELECT COUNT(*) FROM public.profiles WHERE two_factor_enabled = true)::NUMERIC / 
                             NULLIF((SELECT COUNT(*) FROM public.profiles), 0) * 100, 2)
    )
  
  UNION ALL
  
  -- Audit log health
  SELECT 
    'audit_security'::TEXT,
    'audit_logs_today'::TEXT,
    (SELECT COUNT(*)::NUMERIC FROM public.security_audit_logs WHERE timestamp > CURRENT_DATE),
    CASE 
      WHEN (SELECT COUNT(*) FROM public.security_audit_logs WHERE timestamp > CURRENT_DATE) > 0 
      THEN 'healthy' 
      ELSE 'critical' 
    END::TEXT,
    now(),
    jsonb_build_object(
      'critical_events', (SELECT COUNT(*) FROM public.security_audit_logs WHERE timestamp > CURRENT_DATE AND severity = 'critical'),
      'warning_events', (SELECT COUNT(*) FROM public.security_audit_logs WHERE timestamp > CURRENT_DATE AND severity = 'warning')
    )
  
  UNION ALL
  
  -- Service role usage metrics
  SELECT 
    'service_role_security'::TEXT,
    'service_role_operations_today'::TEXT,
    (SELECT COALESCE(COUNT(*), 0)::NUMERIC FROM public.service_role_audit_logs WHERE timestamp > CURRENT_DATE),
    CASE 
      WHEN (SELECT COALESCE(COUNT(*), 0) FROM public.service_role_audit_logs WHERE timestamp > CURRENT_DATE AND success = false) = 0 
      THEN 'healthy' 
      ELSE 'warning' 
    END::TEXT,
    now(),
    jsonb_build_object(
      'failed_operations', (SELECT COALESCE(COUNT(*), 0) FROM public.service_role_audit_logs WHERE timestamp > CURRENT_DATE AND success = false),
      'most_used_functions', (
        SELECT jsonb_agg(jsonb_build_object('function', function_name, 'count', cnt))
        FROM (
          SELECT function_name, COUNT(*) as cnt 
          FROM public.service_role_audit_logs 
          WHERE timestamp > CURRENT_DATE 
          GROUP BY function_name 
          ORDER BY cnt DESC 
          LIMIT 5
        ) top_functions
      )
    );
END;
$$;

-- 6. Create function to validate RLS policy coverage
CREATE OR REPLACE FUNCTION public.audit_rls_coverage()
RETURNS TABLE (
  table_name TEXT,
  rls_enabled BOOLEAN,
  policy_count INTEGER,
  missing_operations TEXT[],
  security_score NUMERIC,
  recommendations TEXT[]
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  WITH table_policies AS (
    SELECT 
      t.tablename,
      t.rowsecurity as rls_enabled,
      COALESCE(policy_counts.policy_count, 0) as policy_count,
      COALESCE(policy_operations.operations, ARRAY[]::TEXT[]) as operations
    FROM pg_tables t
    LEFT JOIN (
      SELECT schemaname, tablename, COUNT(*) as policy_count
      FROM pg_policies 
      WHERE schemaname = 'public'
      GROUP BY schemaname, tablename
    ) policy_counts ON t.tablename = policy_counts.tablename AND t.schemaname = policy_counts.schemaname
    LEFT JOIN (
      SELECT schemaname, tablename, array_agg(DISTINCT cmd) as operations
      FROM pg_policies 
      WHERE schemaname = 'public'
      GROUP BY schemaname, tablename
    ) policy_operations ON t.tablename = policy_operations.tablename AND t.schemaname = policy_operations.schemaname
    WHERE t.schemaname = 'public'
      AND t.tablename NOT IN ('spatial_ref_sys') -- Exclude system tables
  )
  SELECT 
    tp.tablename::TEXT,
    tp.rls_enabled,
    tp.policy_count,
    CASE 
      WHEN tp.rls_enabled THEN
        (ARRAY['SELECT', 'INSERT', 'UPDATE', 'DELETE'] - tp.operations)
      ELSE 
        ARRAY['ALL']::TEXT[]
    END as missing_operations,
    CASE 
      WHEN NOT tp.rls_enabled THEN 0
      WHEN tp.policy_count = 0 THEN 1
      WHEN tp.policy_count >= 3 THEN 10
      ELSE tp.policy_count * 3
    END::NUMERIC as security_score,
    CASE 
      WHEN NOT tp.rls_enabled THEN ARRAY['Enable RLS on this table']
      WHEN tp.policy_count = 0 THEN ARRAY['Add RLS policies to control access']
      WHEN 'SELECT' = ANY((ARRAY['SELECT', 'INSERT', 'UPDATE', 'DELETE'] - tp.operations)) THEN 
        ARRAY['Consider adding SELECT policy']
      ELSE ARRAY['Review policy specificity']::TEXT[]
    END as recommendations
  FROM table_policies tp
  ORDER BY tp.rls_enabled ASC, tp.policy_count ASC;
END;
$$;

-- 7. Grant execute permissions for new security functions
GRANT EXECUTE ON FUNCTION public.log_service_role_usage TO authenticated;
GRANT EXECUTE ON FUNCTION public.detect_service_role_abuse TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_enhanced_security_metrics TO authenticated;
GRANT EXECUTE ON FUNCTION public.audit_rls_coverage TO authenticated;

-- 8. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_service_role_audit_logs_timestamp ON public.service_role_audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_service_role_audit_logs_function ON public.service_role_audit_logs(function_name);
CREATE INDEX IF NOT EXISTS idx_service_role_audit_logs_severity ON public.service_role_audit_logs(severity) WHERE severity IN ('warning', 'critical');
CREATE INDEX IF NOT EXISTS idx_dashboard_access_logs_timestamp ON public.dashboard_access_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_dashboard_access_logs_user ON public.dashboard_access_logs(user_email);

-- 9. Create automated security alert function
CREATE OR REPLACE FUNCTION public.check_security_alerts()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  alerts JSONB := '[]'::JSONB;
  suspicious_activities RECORD;
  service_abuse RECORD;
  rls_issues RECORD;
BEGIN
  -- Check suspicious activities
  FOR suspicious_activities IN 
    SELECT * FROM public.detect_suspicious_activities()
  LOOP
    alerts := alerts || jsonb_build_object(
      'type', 'suspicious_activity',
      'alert_type', suspicious_activities.alert_type,
      'description', suspicious_activities.description,
      'severity', suspicious_activities.severity,
      'count', suspicious_activities.count,
      'timestamp', now()
    );
  END LOOP;
  
  -- Check service role abuse
  FOR service_abuse IN 
    SELECT * FROM public.detect_service_role_abuse()
  LOOP
    alerts := alerts || jsonb_build_object(
      'type', 'service_role_abuse',
      'alert_type', service_abuse.alert_type,
      'description', service_abuse.description,
      'severity', service_abuse.severity,
      'count', service_abuse.count,
      'timestamp', now()
    );
  END LOOP;
  
  -- Check for tables without proper RLS
  FOR rls_issues IN 
    SELECT * FROM public.audit_rls_coverage() WHERE security_score < 5
  LOOP
    alerts := alerts || jsonb_build_object(
      'type', 'rls_coverage',
      'table_name', rls_issues.table_name,
      'description', 'Table has insufficient RLS coverage',
      'severity', CASE WHEN rls_issues.security_score = 0 THEN 'critical' ELSE 'warning' END,
      'security_score', rls_issues.security_score,
      'recommendations', rls_issues.recommendations,
      'timestamp', now()
    );
  END LOOP;
  
  RETURN alerts;
END;
$$;