-- SOC 2 and HIPAA Compliance Security Tables

-- 1. File Access Audit Log
CREATE TABLE IF NOT EXISTS public.file_access_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  file_path TEXT NOT NULL,
  bucket_name TEXT NOT NULL,
  access_type TEXT NOT NULL CHECK (access_type IN ('upload', 'download', 'view', 'delete')),
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  file_size BIGINT,
  download_duration_ms INTEGER,
  success BOOLEAN DEFAULT true,
  tenant_id UUID
);

-- 2. Security Audit Logs
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ip_address INET,
  user_agent TEXT,
  resource_type TEXT,
  resource_id TEXT,
  action_performed TEXT,
  outcome TEXT CHECK (outcome IN ('success', 'failure', 'blocked')),
  metadata JSONB DEFAULT '{}',
  tenant_id UUID,
  table_name TEXT,
  operation TEXT,
  changed_fields TEXT[],
  old_values JSONB,
  new_values JSONB
);

-- 3. Session Management
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  session_token TEXT UNIQUE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  device_fingerprint TEXT,
  location_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  revoked_at TIMESTAMP WITH TIME ZONE,
  revoked_by UUID REFERENCES auth.users(id)
);

-- 4. Password History
CREATE TABLE IF NOT EXISTS public.password_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  tenant_id UUID
);

-- 5. Data Export Audit
CREATE TABLE IF NOT EXISTS public.data_export_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  export_type TEXT NOT NULL,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  file_path TEXT,
  expiry_date TIMESTAMP WITH TIME ZONE,
  download_count INTEGER DEFAULT 0,
  ip_address INET,
  gdpr_request BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'expired'))
);

-- 6. Consent Tracking
CREATE TABLE IF NOT EXISTS public.user_consent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  consent_type TEXT NOT NULL,
  version TEXT NOT NULL,
  given_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  withdrawn_at TIMESTAMP WITH TIME ZONE,
  ip_address INET,
  user_agent TEXT,
  is_active BOOLEAN DEFAULT true
);

-- 7. Failed Login Attempts
CREATE TABLE IF NOT EXISTS public.failed_login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  failure_reason TEXT,
  blocked_until TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on all tables
ALTER TABLE public.file_access_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_export_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_consent ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.failed_login_attempts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own file access logs" ON public.file_access_log
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all security logs" ON public.security_audit_logs
  FOR SELECT USING (has_any_role(ARRAY['admin', 'system_administrator', 'tenant_admin']));

CREATE POLICY "Users can view their own sessions" ON public.user_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own password history" ON public.password_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own export requests" ON public.data_export_audit
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own consent records" ON public.user_consent
  FOR SELECT USING (auth.uid() = user_id);

-- Service role can manage all audit tables
CREATE POLICY "Service role can manage file access logs" ON public.file_access_log
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage security logs" ON public.security_audit_logs
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage sessions" ON public.user_sessions
  FOR ALL USING (auth.role() = 'service_role');

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_file_access_log_user_timestamp ON public.file_access_log(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_file_access_log_bucket ON public.file_access_log(bucket_name, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_security_audit_user_timestamp ON public.security_audit_logs(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_security_audit_severity ON public.security_audit_logs(severity, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON public.user_sessions(user_id, is_active, last_activity);
CREATE INDEX IF NOT EXISTS idx_failed_login_ip_timestamp ON public.failed_login_attempts(ip_address, attempted_at DESC);

-- Functions for audit logging
CREATE OR REPLACE FUNCTION public.log_file_access(
  p_file_path TEXT,
  p_bucket_name TEXT,
  p_access_type TEXT,
  p_file_size BIGINT DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.file_access_log (
    user_id, file_path, bucket_name, access_type, 
    ip_address, file_size, tenant_id
  ) VALUES (
    auth.uid(), p_file_path, p_bucket_name, p_access_type,
    inet_client_addr(), p_file_size, get_current_user_tenant_id()
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.log_security_event(
  p_event_type TEXT,
  p_severity TEXT,
  p_resource_type TEXT DEFAULT NULL,
  p_resource_id TEXT DEFAULT NULL,
  p_action_performed TEXT DEFAULT NULL,
  p_outcome TEXT DEFAULT 'success',
  p_metadata JSONB DEFAULT '{}'
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.security_audit_logs (
    user_id, event_type, severity, ip_address, 
    resource_type, resource_id, action_performed, 
    outcome, metadata, tenant_id
  ) VALUES (
    auth.uid(), p_event_type, p_severity, inet_client_addr(),
    p_resource_type, p_resource_id, p_action_performed,
    p_outcome, p_metadata, get_current_user_tenant_id()
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

-- Trigger for profile changes audit
CREATE OR REPLACE FUNCTION public.audit_profile_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  changed_fields TEXT[] := ARRAY[]::TEXT[];
  old_vals JSONB := '{}'::JSONB;
  new_vals JSONB := '{}'::JSONB;
BEGIN
  -- Track changes in critical fields
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    changed_fields := array_append(changed_fields, 'role');
    old_vals := old_vals || jsonb_build_object('role', OLD.role);
    new_vals := new_vals || jsonb_build_object('role', NEW.role);
  END IF;
  
  IF OLD.two_factor_enabled IS DISTINCT FROM NEW.two_factor_enabled THEN
    changed_fields := array_append(changed_fields, 'two_factor_enabled');
    old_vals := old_vals || jsonb_build_object('two_factor_enabled', OLD.two_factor_enabled);
    new_vals := new_vals || jsonb_build_object('two_factor_enabled', NEW.two_factor_enabled);
  END IF;
  
  IF array_length(changed_fields, 1) > 0 THEN
    INSERT INTO public.security_audit_logs (
      user_id, event_type, severity, table_name, operation,
      changed_fields, old_values, new_values, tenant_id
    ) VALUES (
      NEW.id, 'profile_modification', 'medium', 'profiles', 'UPDATE',
      changed_fields, old_vals, new_vals, NEW.tenant_id
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for profile changes
DROP TRIGGER IF EXISTS trigger_audit_profile_changes ON public.profiles;
CREATE TRIGGER trigger_audit_profile_changes
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_profile_changes();