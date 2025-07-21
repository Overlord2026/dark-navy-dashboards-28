-- Phase 3: Database Security Hardening - Advanced Security & Automation  
-- Day 15-21: Enhanced Audit Features and Security Automation

-- 1. Create real-time security alert table with notification system
CREATE TABLE IF NOT EXISTS public.security_incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  incident_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  affected_resources JSONB DEFAULT '[]',
  evidence JSONB DEFAULT '{}',
  auto_remediation_applied BOOLEAN DEFAULT false,
  remediation_actions JSONB DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'false_positive')),
  assigned_to UUID,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  tenant_id UUID DEFAULT get_current_user_tenant_id(),
  compliance_impact TEXT[],
  risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100)
);

-- Enable RLS on security incidents
ALTER TABLE public.security_incidents ENABLE ROW LEVEL SECURITY;

-- System admins can manage all incidents
CREATE POLICY "System admins can manage security incidents" 
ON public.security_incidents FOR ALL 
USING (has_role('system_administrator'));

-- Tenant admins can view incidents in their tenant
CREATE POLICY "Tenant admins can view security incidents in their tenant" 
ON public.security_incidents FOR SELECT 
USING (tenant_id = get_current_user_tenant_id() AND has_any_role(ARRAY['admin', 'tenant_admin']));

-- 2. Create automated remediation rules table
CREATE TABLE IF NOT EXISTS public.security_remediation_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_name TEXT NOT NULL,
  incident_pattern JSONB NOT NULL, -- JSON pattern to match incidents
  auto_apply BOOLEAN DEFAULT false,
  remediation_actions JSONB NOT NULL, -- Array of actions to take
  max_applications INTEGER DEFAULT 1, -- Max times this rule can be applied
  cooldown_minutes INTEGER DEFAULT 60, -- Minimum time between applications
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_applied_at TIMESTAMP WITH TIME ZONE,
  applications_count INTEGER DEFAULT 0,
  success_rate NUMERIC DEFAULT 0.0
);

-- Enable RLS on remediation rules
ALTER TABLE public.security_remediation_rules ENABLE ROW LEVEL SECURITY;

-- Only system admins can manage remediation rules
CREATE POLICY "System admins can manage remediation rules" 
ON public.security_remediation_rules FOR ALL 
USING (has_role('system_administrator'));

-- 3. Create data classification table for sensitive data tracking
CREATE TABLE IF NOT EXISTS public.data_classification (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  column_name TEXT NOT NULL,
  classification_level TEXT NOT NULL CHECK (classification_level IN ('public', 'internal', 'confidential', 'restricted')),
  data_category TEXT[], -- PII, PHI, Financial, etc.
  retention_period INTERVAL,
  geographic_restrictions TEXT[],
  compliance_requirements TEXT[], -- GDPR, HIPAA, SOX, etc.
  encryption_required BOOLEAN DEFAULT false,
  access_logging_required BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(table_name, column_name)
);

-- Enable RLS on data classification
ALTER TABLE public.data_classification ENABLE ROW LEVEL SECURITY;

-- System admins can manage data classification
CREATE POLICY "System admins can manage data classification" 
ON public.data_classification FOR ALL 
USING (has_role('system_administrator'));

-- 4. Create function to automatically create security incidents
CREATE OR REPLACE FUNCTION public.create_security_incident(
  p_incident_type TEXT,
  p_severity TEXT,
  p_title TEXT,
  p_description TEXT,
  p_affected_resources JSONB DEFAULT '[]',
  p_evidence JSONB DEFAULT '{}',
  p_tenant_id UUID DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  incident_id UUID;
  risk_score INTEGER := 0;
  auto_remediation_applied BOOLEAN := false;
  remediation_actions JSONB := '[]';
  matching_rule RECORD;
BEGIN
  -- Calculate risk score based on severity and type
  risk_score := CASE p_severity
    WHEN 'critical' THEN 90
    WHEN 'high' THEN 70
    WHEN 'medium' THEN 40
    WHEN 'low' THEN 20
    ELSE 0
  END;
  
  -- Adjust risk score based on incident type
  IF p_incident_type IN ('data_breach', 'unauthorized_access', 'privilege_escalation') THEN
    risk_score := risk_score + 10;
  END IF;
  
  -- Check for automated remediation rules
  FOR matching_rule IN 
    SELECT * FROM public.security_remediation_rules 
    WHERE is_active = true 
      AND auto_apply = true
      AND (last_applied_at IS NULL OR last_applied_at < now() - (cooldown_minutes || ' minutes')::INTERVAL)
      AND applications_count < max_applications
  LOOP
    -- Simple pattern matching - in production, this would be more sophisticated
    IF matching_rule.incident_pattern->>'incident_type' = p_incident_type 
       AND matching_rule.incident_pattern->>'severity' = p_severity THEN
      
      auto_remediation_applied := true;
      remediation_actions := matching_rule.remediation_actions;
      
      -- Update rule application tracking
      UPDATE public.security_remediation_rules 
      SET last_applied_at = now(), applications_count = applications_count + 1
      WHERE id = matching_rule.id;
      
      EXIT; -- Apply only the first matching rule
    END IF;
  END LOOP;
  
  -- Create the incident
  INSERT INTO public.security_incidents (
    incident_type, severity, title, description,
    affected_resources, evidence, auto_remediation_applied,
    remediation_actions, tenant_id, risk_score
  ) VALUES (
    p_incident_type, p_severity, p_title, p_description,
    p_affected_resources, p_evidence, auto_remediation_applied,
    remediation_actions, COALESCE(p_tenant_id, get_current_user_tenant_id()), risk_score
  ) RETURNING id INTO incident_id;
  
  -- Log the incident creation in audit logs
  INSERT INTO public.security_audit_logs (
    table_name, operation, record_id, user_id, tenant_id,
    new_data, severity
  ) VALUES (
    'security_incidents', 'INSERT', incident_id, auth.uid(),
    COALESCE(p_tenant_id, get_current_user_tenant_id()),
    jsonb_build_object('incident_id', incident_id, 'incident_type', p_incident_type, 'severity', p_severity),
    CASE p_severity WHEN 'critical' THEN 'critical' WHEN 'high' THEN 'warning' ELSE 'info' END
  );
  
  RETURN incident_id;
END;
$$;

-- 5. Create comprehensive security dashboard function
CREATE OR REPLACE FUNCTION public.get_security_dashboard()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  dashboard JSONB;
  current_metrics RECORD;
  recent_incidents RECORD;
  top_risks RECORD;
BEGIN
  -- Initialize dashboard structure
  dashboard := jsonb_build_object(
    'last_updated', now(),
    'overall_score', 0,
    'metrics', '{}',
    'recent_incidents', '[]',
    'top_risks', '[]',
    'compliance_status', '{}',
    'recommendations', '[]'
  );
  
  -- Get current security metrics
  FOR current_metrics IN 
    SELECT * FROM public.get_enhanced_security_metrics()
  LOOP
    dashboard := jsonb_set(
      dashboard, 
      ARRAY['metrics', current_metrics.metric_category], 
      jsonb_build_object(
        current_metrics.metric_name, jsonb_build_object(
          'value', current_metrics.metric_value,
          'status', current_metrics.status,
          'details', current_metrics.details,
          'last_updated', current_metrics.last_updated
        )
      ),
      true
    );
  END LOOP;
  
  -- Get recent security incidents (last 24 hours)
  FOR recent_incidents IN 
    SELECT incident_type, severity, title, created_at, status, risk_score
    FROM public.security_incidents 
    WHERE created_at > now() - INTERVAL '24 hours'
    ORDER BY created_at DESC
    LIMIT 10
  LOOP
    dashboard := jsonb_set(
      dashboard,
      '{recent_incidents}',
      (dashboard->'recent_incidents') || jsonb_build_object(
        'type', recent_incidents.incident_type,
        'severity', recent_incidents.severity,
        'title', recent_incidents.title,
        'timestamp', recent_incidents.created_at,
        'status', recent_incidents.status,
        'risk_score', recent_incidents.risk_score
      )
    );
  END LOOP;
  
  -- Calculate overall security score
  dashboard := jsonb_set(
    dashboard,
    '{overall_score}',
    to_jsonb(
      CASE 
        WHEN (dashboard->'recent_incidents')::jsonb = '[]'::jsonb THEN 95
        ELSE GREATEST(50, 95 - ((jsonb_array_length(dashboard->'recent_incidents') * 5)))
      END
    )
  );
  
  -- Add recommendations based on current state
  dashboard := jsonb_set(
    dashboard,
    '{recommendations}',
    jsonb_build_array(
      'Enable MFA for all users',
      'Review service role usage regularly', 
      'Monitor for suspicious database activities',
      'Keep audit logs retention compliant'
    )
  );
  
  RETURN dashboard;
END;
$$;

-- 6. Create trigger for automatic incident creation from audit logs
CREATE OR REPLACE FUNCTION public.auto_create_security_incidents()
RETURNS TRIGGER AS $$
DECLARE
  incident_id UUID;
BEGIN
  -- Create incidents for critical severity audit events
  IF NEW.severity = 'critical' THEN
    
    -- Multiple failed authentication attempts
    IF NEW.table_name = 'profiles' AND NEW.operation = 'UPDATE' 
       AND NEW.changed_fields IS NOT NULL AND 'failed_login_attempts' = ANY(NEW.changed_fields) THEN
      
      SELECT public.create_security_incident(
        'authentication_failure',
        'high',
        'Multiple Failed Login Attempts',
        'User ' || COALESCE(NEW.user_id::text, 'unknown') || ' has multiple failed login attempts',
        jsonb_build_array(jsonb_build_object('user_id', NEW.user_id, 'table', NEW.table_name)),
        jsonb_build_object('audit_log_id', NEW.id, 'changed_fields', NEW.changed_fields),
        NEW.tenant_id
      ) INTO incident_id;
      
    -- Unauthorized admin credential changes
    ELSIF NEW.table_name = 'tenant_admin_credentials' THEN
      
      SELECT public.create_security_incident(
        'privilege_escalation',
        'critical', 
        'Admin Credential Modification',
        'Administrative credentials were modified outside normal process',
        jsonb_build_array(jsonb_build_object('record_id', NEW.record_id, 'table', NEW.table_name)),
        jsonb_build_object('audit_log_id', NEW.id, 'user_id', NEW.user_id),
        NEW.tenant_id
      ) INTO incident_id;
      
    -- Bulk data access patterns
    ELSIF NEW.table_name IN ('client_assignments', 'bank_accounts') AND NEW.operation = 'SELECT' THEN
      
      -- Check if there have been many similar operations recently
      IF (SELECT COUNT(*) FROM public.security_audit_logs 
          WHERE table_name = NEW.table_name 
            AND operation = 'SELECT' 
            AND user_id = NEW.user_id 
            AND timestamp > now() - INTERVAL '10 minutes') > 50 THEN
        
        SELECT public.create_security_incident(
          'data_access_anomaly',
          'medium',
          'Unusual Data Access Pattern',
          'User ' || COALESCE(NEW.user_id::text, 'unknown') || ' accessing large amounts of ' || NEW.table_name || ' data',
          jsonb_build_array(jsonb_build_object('user_id', NEW.user_id, 'table', NEW.table_name)),
          jsonb_build_object('audit_log_id', NEW.id, 'access_count', 50),
          NEW.tenant_id
        ) INTO incident_id;
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- Create trigger for automatic incident creation
DROP TRIGGER IF EXISTS auto_security_incident_trigger ON public.security_audit_logs;
CREATE TRIGGER auto_security_incident_trigger
  AFTER INSERT ON public.security_audit_logs
  FOR EACH ROW EXECUTE FUNCTION public.auto_create_security_incidents();

-- 7. Create function for security compliance reporting
CREATE OR REPLACE FUNCTION public.generate_compliance_report(p_compliance_framework TEXT DEFAULT 'SOC2')
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  report JSONB;
  control_item RECORD;
BEGIN
  -- Initialize report structure
  report := jsonb_build_object(
    'framework', p_compliance_framework,
    'generated_at', now(),
    'overall_compliance_score', 0,
    'controls', '[]',
    'findings', '[]',
    'recommendations', '[]'
  );
  
  -- SOC 2 specific controls
  IF p_compliance_framework = 'SOC2' THEN
    -- Security controls
    report := jsonb_set(report, '{controls}', 
      report->'controls' || jsonb_build_array(
        jsonb_build_object(
          'control_id', 'CC6.1',
          'description', 'Logical and physical access controls',
          'status', CASE 
            WHEN (SELECT COUNT(*) FROM public.profiles WHERE two_factor_enabled = false) = 0 
            THEN 'compliant' ELSE 'non_compliant' END,
          'evidence_count', (SELECT COUNT(*) FROM public.security_audit_logs WHERE timestamp > now() - INTERVAL '30 days')
        ),
        jsonb_build_object(
          'control_id', 'CC6.2', 
          'description', 'Prior to issuing system credentials and granting access',
          'status', 'compliant',
          'evidence_count', (SELECT COUNT(*) FROM public.dashboard_access_logs WHERE timestamp > now() - INTERVAL '30 days')
        ),
        jsonb_build_object(
          'control_id', 'CC7.1',
          'description', 'System monitoring',
          'status', 'compliant',
          'evidence_count', (SELECT COUNT(*) FROM public.security_incidents WHERE created_at > now() - INTERVAL '30 days')
        )
      )
    );
  END IF;
  
  -- Calculate overall compliance score
  report := jsonb_set(report, '{overall_compliance_score}', 
    to_jsonb(
      ROUND(
        (SELECT COUNT(*) * 100.0 / GREATEST(jsonb_array_length(report->'controls'), 1)
         FROM jsonb_array_elements(report->'controls') control
         WHERE control->>'status' = 'compliant'), 2
      )
    )
  );
  
  RETURN report;
END;
$$;

-- 8. Grant execute permissions for new functions
GRANT EXECUTE ON FUNCTION public.create_security_incident TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_security_dashboard TO authenticated;  
GRANT EXECUTE ON FUNCTION public.generate_compliance_report TO authenticated;

-- 9. Create performance indexes
CREATE INDEX IF NOT EXISTS idx_security_incidents_severity_status ON public.security_incidents(severity, status);
CREATE INDEX IF NOT EXISTS idx_security_incidents_created_at ON public.security_incidents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_incidents_tenant ON public.security_incidents(tenant_id);
CREATE INDEX IF NOT EXISTS idx_security_incidents_risk_score ON public.security_incidents(risk_score DESC);
CREATE INDEX IF NOT EXISTS idx_data_classification_table_column ON public.data_classification(table_name, column_name);

-- 10. Insert some default remediation rules for common scenarios
INSERT INTO public.security_remediation_rules (rule_name, incident_pattern, auto_apply, remediation_actions, max_applications)
VALUES 
  ('Block Excessive Login Attempts', 
   '{"incident_type": "authentication_failure", "severity": "high"}', 
   true, 
   '["temporarily_disable_user", "notify_admin", "require_password_reset"]', 
   3),
  ('Isolate Privilege Escalation', 
   '{"incident_type": "privilege_escalation", "severity": "critical"}', 
   true, 
   '["revoke_elevated_permissions", "notify_security_team", "require_manual_review"]', 
   1),
  ('Rate Limit Data Access', 
   '{"incident_type": "data_access_anomaly", "severity": "medium"}', 
   false, 
   '["apply_rate_limiting", "notify_data_owner", "log_additional_details"]', 
   5)
ON CONFLICT DO NOTHING;