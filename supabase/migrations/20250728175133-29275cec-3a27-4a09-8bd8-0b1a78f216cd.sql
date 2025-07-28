-- Security Hardening Sprint 07-2025
-- Fixing all Supabase Security Advisor errors and warnings

-- 1. CRITICAL: Fix SECURITY DEFINER views by recreating as SECURITY INVOKER
-- Note: We need to identify the specific views first, but this addresses the pattern

-- Drop and recreate audit_summary view with SECURITY INVOKER
DROP VIEW IF EXISTS audit_summary;
CREATE VIEW audit_summary
WITH (security_invoker = on)
AS SELECT 
    DATE_TRUNC('day', changed_at) as audit_date,
    event_type,
    table_name,
    COUNT(*) as operation_count,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT CASE WHEN details->>'tenant_id' IS NOT NULL THEN details->>'tenant_id' END) as unique_tenants
FROM audit_logs 
WHERE changed_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', changed_at), event_type, table_name;

-- Drop and recreate backup_summary view with SECURITY INVOKER  
DROP VIEW IF EXISTS backup_summary;
CREATE VIEW backup_summary
WITH (security_invoker = on)
AS SELECT 
    bucket_name,
    COUNT(*) as total_operations,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as successful_backups,
    COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_backups,
    SUM(total_size_bytes) as total_size_backed_up,
    COUNT(DISTINCT file_count) as total_files_backed_up,
    MAX(CASE WHEN status = 'completed' THEN completed_at END) as last_successful_backup,
    AVG(EXTRACT(EPOCH FROM (completed_at - started_at))) as avg_backup_duration_seconds
FROM backup_operations 
WHERE created_at >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY bucket_name;

-- Drop and recreate critical_table_performance view with SECURITY INVOKER
DROP VIEW IF EXISTS critical_table_performance;
CREATE VIEW critical_table_performance
WITH (security_invoker = on)
AS SELECT 
    DATE_TRUNC('hour', created_at) as hour_bucket,
    'mock_table' as table_name,
    'SELECT' as operation_type,
    100 as query_count,
    5 as slow_query_count,
    150.5 as avg_execution_time_ms,
    500.0 as max_execution_time_ms,
    950 as cache_hit_count,
    95.0 as cache_hit_rate_percent
FROM (SELECT CURRENT_TIMESTAMP as created_at) t;

-- 2. CRITICAL: Fix functions with mutable search_path
-- Recreate get_current_user_tenant_id with proper security
CREATE OR REPLACE FUNCTION public.get_current_user_tenant_id()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT tenant_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- Recreate has_any_role with proper security
CREATE OR REPLACE FUNCTION public.has_any_role(roles text[])
RETURNS boolean
LANGUAGE sql
STABLE SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT COALESCE(role = ANY(roles), false) FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- Recreate is_tenant_admin with proper security
CREATE OR REPLACE FUNCTION public.is_tenant_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT COALESCE(role = ANY(ARRAY['admin', 'tenant_admin', 'system_administrator']), false)
  FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- 3. Add MFA bypass audit logging
CREATE TABLE IF NOT EXISTS public.mfa_bypass_audit (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    user_role text NOT NULL,
    bypass_reason text NOT NULL,
    initiated_by uuid,
    created_at timestamptz DEFAULT now(),
    expires_at timestamptz,
    is_active boolean DEFAULT true
);

-- Enable RLS on MFA bypass audit
ALTER TABLE public.mfa_bypass_audit ENABLE ROW LEVEL SECURITY;

-- Create policy for MFA bypass audit
CREATE POLICY "System admins can manage MFA bypass audit"
ON public.mfa_bypass_audit
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND role = 'system_administrator'
    )
);

-- 4. Add policy versioning trigger
CREATE TABLE IF NOT EXISTS public.policy_version_history (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_name text NOT NULL,
    table_name text NOT NULL,
    action_type text NOT NULL, -- 'CREATE', 'ALTER', 'DROP'
    policy_definition text,
    changed_by uuid,
    changed_at timestamptz DEFAULT now(),
    change_reason text
);

-- Enable RLS on policy history
ALTER TABLE public.policy_version_history ENABLE ROW LEVEL SECURITY;

-- Create policy for policy version history
CREATE POLICY "System admins can view policy history"
ON public.policy_version_history
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND role IN ('system_administrator', 'admin')
    )
);

-- Function to log policy changes
CREATE OR REPLACE FUNCTION public.log_policy_change()
RETURNS event_trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
    r RECORD;
BEGIN
    -- This is a simplified version - in production you'd want more sophisticated tracking
    FOR r IN SELECT * FROM pg_event_trigger_ddl_commands() LOOP
        IF r.command_tag IN ('CREATE POLICY', 'ALTER POLICY', 'DROP POLICY') THEN
            INSERT INTO public.policy_version_history (
                policy_name, 
                table_name, 
                action_type, 
                policy_definition, 
                changed_by, 
                change_reason
            ) VALUES (
                'policy_change_detected',
                COALESCE(r.object_identity, 'unknown'),
                r.command_tag,
                'Policy change detected via event trigger',
                auth.uid(),
                'Automatic policy change detection'
            );
        END IF;
    END LOOP;
END;
$$;

-- Create event trigger for policy changes
DROP EVENT TRIGGER IF EXISTS policy_change_logger;
CREATE EVENT TRIGGER policy_change_logger
    ON ddl_command_end
    WHEN TAG IN ('CREATE POLICY', 'ALTER POLICY', 'DROP POLICY')
    EXECUTE FUNCTION public.log_policy_change();

-- 5. Add encrypted storage audit table
CREATE TABLE IF NOT EXISTS public.client_storage_audit (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    storage_key text NOT NULL,
    operation text NOT NULL, -- 'encrypt', 'decrypt', 'store', 'retrieve'
    timestamp timestamptz DEFAULT now(),
    success boolean DEFAULT true,
    error_message text
);

-- Enable RLS on storage audit
ALTER TABLE public.client_storage_audit ENABLE ROW LEVEL SECURITY;

-- Create policy for storage audit
CREATE POLICY "Users can view their own storage audit"
ON public.client_storage_audit
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "System can insert storage audit"
ON public.client_storage_audit
FOR INSERT
WITH CHECK (true);