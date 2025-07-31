-- Database Performance Optimization Migration
-- Creating critical indexes for frequently accessed columns

-- 1. Audit logs optimization (largest table)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_table_name ON public.audit_logs(table_name);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_status ON public.audit_logs(status);

-- 2. Security audit logs optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_security_audit_logs_user_id ON public.security_audit_logs(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_security_audit_logs_timestamp ON public.security_audit_logs(timestamp);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_security_audit_logs_event_type ON public.security_audit_logs(event_type);

-- 3. Analytics events optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_events_event_name ON public.analytics_events(event_name);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_events_session_id ON public.analytics_events(session_id);

-- 4. Profiles optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_tenant_id ON public.profiles(tenant_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- 5. Financial snapshots optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_financial_snapshots_user_id ON public.user_financial_snapshots(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_financial_snapshots_created_at ON public.user_financial_snapshots(created_at);

-- 6. Bank accounts optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bank_accounts_user_id ON public.bank_accounts(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bank_accounts_plaid_institution_id ON public.bank_accounts(plaid_institution_id);

-- 7. Webhook deliveries optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_webhook_deliveries_status ON public.webhook_deliveries(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_webhook_deliveries_created_at ON public.webhook_deliveries(created_at);

-- 8. Query performance monitoring function
CREATE OR REPLACE FUNCTION public.log_query_performance(
  p_query_type text,
  p_execution_time_ms numeric,
  p_table_name text DEFAULT NULL,
  p_user_id uuid DEFAULT auth.uid()
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.security_audit_logs (
    user_id, event_type, severity, metadata, tenant_id
  ) VALUES (
    p_user_id, 
    'query_performance', 
    CASE 
      WHEN p_execution_time_ms > 5000 THEN 'high'
      WHEN p_execution_time_ms > 1000 THEN 'medium'
      ELSE 'low'
    END,
    jsonb_build_object(
      'query_type', p_query_type,
      'execution_time_ms', p_execution_time_ms,
      'table_name', p_table_name
    ),
    (SELECT tenant_id FROM public.profiles WHERE id = p_user_id LIMIT 1)
  );
END;
$$;