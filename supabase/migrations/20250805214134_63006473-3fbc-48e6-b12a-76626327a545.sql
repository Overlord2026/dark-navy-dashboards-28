-- Enhanced audit logging and compliance system for seat management
-- This migration adds comprehensive audit trails and compliance exports

-- Create comprehensive seat audit logs table
CREATE TABLE public.seat_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seat_id UUID REFERENCES public.professional_seat_management(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL,
  client_id UUID,
  action_type TEXT NOT NULL, -- 'invite_sent', 'client_accepted', 'seat_upgraded', 'access_granted', 'document_viewed', etc.
  persona_type professional_persona NOT NULL,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES public.profiles(id)
);

-- Create access logs for detailed tracking
CREATE TABLE public.client_access_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL,
  professional_id UUID NOT NULL,
  seat_id UUID REFERENCES public.professional_seat_management(id),
  access_type TEXT NOT NULL, -- 'login', 'document_view', 'vault_access', 'message_sent', etc.
  resource_accessed TEXT,
  session_duration_minutes INTEGER,
  ip_address INET,
  user_agent TEXT,
  device_info JSONB DEFAULT '{}',
  location_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create compliance export requests table
CREATE TABLE public.compliance_export_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requested_by UUID NOT NULL REFERENCES public.profiles(id),
  tenant_id UUID NOT NULL,
  export_type TEXT NOT NULL, -- 'full_audit', 'seat_activity', 'access_logs', 'billing_report'
  persona_filter professional_persona[],
  date_range_start DATE,
  date_range_end DATE,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  export_url TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  parameters JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create invitation message templates table
CREATE TABLE public.invitation_message_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  persona_type professional_persona NOT NULL,
  template_name TEXT NOT NULL,
  subject_template TEXT NOT NULL,
  body_template TEXT NOT NULL,
  variables JSONB DEFAULT '[]', -- Array of available variables like [client_name], [professional_name], etc.
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.profiles(id),
  tenant_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.seat_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_export_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitation_message_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for seat_audit_logs
CREATE POLICY "Professionals can view their seat audit logs"
ON public.seat_audit_logs FOR SELECT
USING (professional_id = auth.uid() OR auth.uid() IN (
  SELECT id FROM public.profiles 
  WHERE role = ANY(ARRAY['admin', 'system_administrator', 'compliance_officer'])
));

CREATE POLICY "System can create audit logs"
ON public.seat_audit_logs FOR INSERT
WITH CHECK (true);

-- RLS Policies for client_access_logs
CREATE POLICY "Professionals can view their client access logs"
ON public.client_access_logs FOR SELECT
USING (professional_id = auth.uid() OR client_id = auth.uid() OR auth.uid() IN (
  SELECT id FROM public.profiles 
  WHERE role = ANY(ARRAY['admin', 'system_administrator', 'compliance_officer'])
));

CREATE POLICY "System can create access logs"
ON public.client_access_logs FOR INSERT
WITH CHECK (true);

-- RLS Policies for compliance_export_requests
CREATE POLICY "Users can manage their export requests"
ON public.compliance_export_requests FOR ALL
USING (requested_by = auth.uid() AND tenant_id = get_current_user_tenant_id());

CREATE POLICY "Admins can view all export requests in tenant"
ON public.compliance_export_requests FOR SELECT
USING (tenant_id = get_current_user_tenant_id() AND 
       has_any_role(ARRAY['admin', 'system_administrator', 'compliance_officer', 'tenant_admin']));

-- RLS Policies for invitation_message_templates
CREATE POLICY "Users can manage templates in their tenant"
ON public.invitation_message_templates FOR ALL
USING (tenant_id = get_current_user_tenant_id() OR tenant_id IS NULL);

CREATE POLICY "Anyone can view active templates"
ON public.invitation_message_templates FOR SELECT
USING (is_active = true);

-- Create indexes for performance
CREATE INDEX idx_seat_audit_logs_professional_id ON public.seat_audit_logs(professional_id);
CREATE INDEX idx_seat_audit_logs_client_id ON public.seat_audit_logs(client_id);
CREATE INDEX idx_seat_audit_logs_action_type ON public.seat_audit_logs(action_type);
CREATE INDEX idx_seat_audit_logs_created_at ON public.seat_audit_logs(created_at);
CREATE INDEX idx_seat_audit_logs_persona_type ON public.seat_audit_logs(persona_type);

CREATE INDEX idx_client_access_logs_client_id ON public.client_access_logs(client_id);
CREATE INDEX idx_client_access_logs_professional_id ON public.client_access_logs(professional_id);
CREATE INDEX idx_client_access_logs_access_type ON public.client_access_logs(access_type);
CREATE INDEX idx_client_access_logs_created_at ON public.client_access_logs(created_at);

CREATE INDEX idx_compliance_export_requests_tenant_id ON public.compliance_export_requests(tenant_id);
CREATE INDEX idx_compliance_export_requests_status ON public.compliance_export_requests(status);
CREATE INDEX idx_compliance_export_requests_requested_by ON public.compliance_export_requests(requested_by);

CREATE INDEX idx_invitation_templates_persona_type ON public.invitation_message_templates(persona_type);
CREATE INDEX idx_invitation_templates_active ON public.invitation_message_templates(is_active);

-- Function to log seat activities
CREATE OR REPLACE FUNCTION public.log_seat_activity(
  p_seat_id UUID,
  p_professional_id UUID,
  p_client_id UUID,
  p_action_type TEXT,
  p_persona_type professional_persona,
  p_details JSONB DEFAULT '{}',
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.seat_audit_logs (
    seat_id, professional_id, client_id, action_type, 
    persona_type, details, ip_address, user_agent, created_by
  ) VALUES (
    p_seat_id, p_professional_id, p_client_id, p_action_type,
    p_persona_type, p_details, p_ip_address, p_user_agent, auth.uid()
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

-- Function to log client access
CREATE OR REPLACE FUNCTION public.log_client_access(
  p_client_id UUID,
  p_professional_id UUID,
  p_seat_id UUID,
  p_access_type TEXT,
  p_resource_accessed TEXT DEFAULT NULL,
  p_session_duration_minutes INTEGER DEFAULT NULL,
  p_device_info JSONB DEFAULT '{}'
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.client_access_logs (
    client_id, professional_id, seat_id, access_type,
    resource_accessed, session_duration_minutes, 
    ip_address, user_agent, device_info
  ) VALUES (
    p_client_id, p_professional_id, p_seat_id, p_access_type,
    p_resource_accessed, p_session_duration_minutes,
    inet_client_addr(), 
    current_setting('request.headers', true)::json->>'user-agent',
    p_device_info
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

-- Function to get invitation template with personalization
CREATE OR REPLACE FUNCTION public.get_personalized_invitation_template(
  p_persona_type professional_persona,
  p_professional_name TEXT,
  p_client_name TEXT,
  p_firm_name TEXT DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  template_record RECORD;
  personalized_subject TEXT;
  personalized_body TEXT;
BEGIN
  -- Get the default template for the persona type
  SELECT * INTO template_record
  FROM public.invitation_message_templates
  WHERE persona_type = p_persona_type 
    AND is_default = true 
    AND is_active = true
  LIMIT 1;
  
  -- If no default template, get any active template for the persona
  IF template_record IS NULL THEN
    SELECT * INTO template_record
    FROM public.invitation_message_templates
    WHERE persona_type = p_persona_type 
      AND is_active = true
    ORDER BY created_at DESC
    LIMIT 1;
  END IF;
  
  -- If still no template, return a default message
  IF template_record IS NULL THEN
    RETURN jsonb_build_object(
      'subject', 'Welcome to Boutique Family Office™ — Secure Client Dashboard Invitation',
      'body', format('Dear %s,

As your %s, I''m inviting you to our secure Family Office platform. Click below to activate your account—your seat is reserved as part of our services.

You''ll get access to secure document vaults, shared tools, and communication channels. Premium upgrades are available if needed.

Sincerely,
%s', p_client_name, p_persona_type, p_professional_name)
    );
  END IF;
  
  -- Personalize the template
  personalized_subject := template_record.subject_template;
  personalized_subject := replace(personalized_subject, '[client_name]', p_client_name);
  personalized_subject := replace(personalized_subject, '[professional_name]', p_professional_name);
  personalized_subject := replace(personalized_subject, '[firm_name]', COALESCE(p_firm_name, ''));
  
  personalized_body := template_record.body_template;
  personalized_body := replace(personalized_body, '[client_name]', p_client_name);
  personalized_body := replace(personalized_body, '[professional_name]', p_professional_name);
  personalized_body := replace(personalized_body, '[firm_name]', COALESCE(p_firm_name, ''));
  personalized_body := replace(personalized_body, '[persona_type]', 
    CASE p_persona_type
      WHEN 'attorney' THEN 'Attorney'
      WHEN 'cpa' THEN 'CPA'
      WHEN 'insurance_agent' THEN 'Insurance Agent'
      WHEN 'consultant' THEN 'Consultant'
      WHEN 'advisor' THEN 'Financial Advisor'
      WHEN 'coach' THEN 'Coach'
      ELSE 'Professional'
    END
  );
  
  RETURN jsonb_build_object(
    'subject', personalized_subject,
    'body', personalized_body,
    'template_id', template_record.id
  );
END;
$$;

-- Function to generate compliance export
CREATE OR REPLACE FUNCTION public.request_compliance_export(
  p_export_type TEXT,
  p_persona_filter professional_persona[] DEFAULT NULL,
  p_date_range_start DATE DEFAULT NULL,
  p_date_range_end DATE DEFAULT NULL,
  p_parameters JSONB DEFAULT '{}'
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  export_id UUID;
  user_tenant_id UUID;
BEGIN
  -- Get user's tenant
  SELECT tenant_id INTO user_tenant_id 
  FROM public.profiles 
  WHERE id = auth.uid();
  
  -- Verify user has compliance export permissions
  IF NOT has_any_role(ARRAY['admin', 'system_administrator', 'compliance_officer', 'tenant_admin']) THEN
    RAISE EXCEPTION 'Insufficient permissions for compliance export';
  END IF;
  
  INSERT INTO public.compliance_export_requests (
    requested_by, tenant_id, export_type, persona_filter,
    date_range_start, date_range_end, parameters,
    expires_at
  ) VALUES (
    auth.uid(), user_tenant_id, p_export_type, p_persona_filter,
    p_date_range_start, p_date_range_end, p_parameters,
    now() + INTERVAL '7 days'
  ) RETURNING id INTO export_id;
  
  RETURN export_id;
END;
$$;

-- Insert default invitation templates for each persona type
INSERT INTO public.invitation_message_templates (persona_type, template_name, subject_template, body_template, is_default, variables) VALUES
('attorney', 'Default Attorney Invitation', 
 'Welcome to Boutique Family Office™ — Secure Client Dashboard Invitation',
 'Dear [client_name],

As your [persona_type], I''m inviting you to our secure Family Office platform. Click below to activate your account—your seat is reserved as part of our services.

[Personalized Sign-Up Link]

You''ll get access to secure document vaults, shared tools, and communication channels. Premium upgrades are available if needed.

Sincerely,
[professional_name]',
 true, '["client_name", "professional_name", "persona_type", "firm_name"]'),

('cpa', 'Default CPA Invitation',
 'Welcome to Boutique Family Office™ — Secure Client Dashboard Invitation', 
 'Dear [client_name],

As your [persona_type], I''m inviting you to our secure Family Office platform. Click below to activate your account—your seat is reserved as part of our services.

[Personalized Sign-Up Link]

You''ll get access to secure document vaults, shared tools, and communication channels. Premium upgrades are available if needed.

Sincerely,
[professional_name]',
 true, '["client_name", "professional_name", "persona_type", "firm_name"]'),

('insurance_agent', 'Default Insurance Agent Invitation',
 'Welcome to Boutique Family Office™ — Secure Client Dashboard Invitation',
 'Dear [client_name],

As your [persona_type], I''m inviting you to our secure Family Office platform. Click below to activate your account—your seat is reserved as part of our services.

[Personalized Sign-Up Link]

You''ll get access to secure document vaults, shared tools, and communication channels. Premium upgrades are available if needed.

Sincerely,
[professional_name]',
 true, '["client_name", "professional_name", "persona_type", "firm_name"]'),

('consultant', 'Default Consultant Invitation',
 'Welcome to Boutique Family Office™ — Secure Client Dashboard Invitation',
 'Dear [client_name],

As your [persona_type], I''m inviting you to our secure Family Office platform. Click below to activate your account—your seat is reserved as part of our services.

[Personalized Sign-Up Link]

You''ll get access to secure document vaults, shared tools, and communication channels. Premium upgrades are available if needed.

Sincerely,
[professional_name]',
 true, '["client_name", "professional_name", "persona_type", "firm_name"]'),

('advisor', 'Default Advisor Invitation',
 'Welcome to Boutique Family Office™ — Secure Client Dashboard Invitation',
 'Dear [client_name],

As your [persona_type], I''m inviting you to our secure Family Office platform. Click below to activate your account—your seat is reserved as part of our services.

[Personalized Sign-Up Link]

You''ll get access to secure document vaults, shared tools, and communication channels. Premium upgrades are available if needed.

Sincerely,
[professional_name]',
 true, '["client_name", "professional_name", "persona_type", "firm_name"]'),

('coach', 'Default Coach Invitation',
 'Welcome to Boutique Family Office™ — Secure Client Dashboard Invitation',
 'Dear [client_name],

As your [persona_type], I''m inviting you to our secure Family Office platform. Click below to activate your account—your seat is reserved as part of our services.

[Personalized Sign-Up Link]

You''ll get access to secure document vaults, shared tools, and communication channels. Premium upgrades are available if needed.

Sincerely,
[professional_name]',
 true, '["client_name", "professional_name", "persona_type", "firm_name"]'),

('enterprise_admin', 'Default Enterprise Admin Invitation',
 'Welcome to Boutique Family Office™ — Enterprise Dashboard Invitation',
 'Dear [client_name],

As your [persona_type], I''m inviting you to our secure Family Office platform. Click below to activate your account—your seat is reserved as part of our services.

[Personalized Sign-Up Link]

You''ll get access to secure document vaults, shared tools, and communication channels. Premium upgrades are available if needed.

Sincerely,
[professional_name]',
 true, '["client_name", "professional_name", "persona_type", "firm_name"]');

-- Create trigger to automatically log seat status changes
CREATE OR REPLACE FUNCTION public.trigger_seat_status_audit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Log seat status changes
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    PERFORM public.log_seat_activity(
      NEW.id,
      NEW.professional_id,
      NEW.client_id,
      'status_changed',
      NEW.persona_type,
      jsonb_build_object(
        'old_status', OLD.status,
        'new_status', NEW.status,
        'changed_by', auth.uid()
      )
    );
  END IF;
  
  -- Log tier upgrades
  IF TG_OP = 'UPDATE' AND OLD.seat_tier IS DISTINCT FROM NEW.seat_tier THEN
    PERFORM public.log_seat_activity(
      NEW.id,
      NEW.professional_id,
      NEW.client_id,
      'tier_upgraded',
      NEW.persona_type,
      jsonb_build_object(
        'old_tier', OLD.seat_tier,
        'new_tier', NEW.seat_tier,
        'billing_responsibility', NEW.billing_responsibility,
        'changed_by', auth.uid()
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER seat_audit_trigger
  AFTER UPDATE ON public.professional_seat_management
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_seat_status_audit();

-- Create trigger to log client relationship changes
CREATE OR REPLACE FUNCTION public.trigger_client_relationship_audit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.log_seat_activity(
      NEW.seat_id,
      NEW.professional_id,
      NEW.client_id,
      'client_linked',
      NEW.persona_type,
      jsonb_build_object(
        'relationship_type', NEW.relationship_type,
        'access_level', NEW.access_level,
        'linked_via_invitation', NEW.linked_via_invitation
      )
    );
  END IF;
  
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    PERFORM public.log_seat_activity(
      NEW.seat_id,
      NEW.professional_id,
      NEW.client_id,
      'relationship_status_changed',
      NEW.persona_type,
      jsonb_build_object(
        'old_status', OLD.status,
        'new_status', NEW.status,
        'changed_by', auth.uid()
      )
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER client_relationship_audit_trigger
  AFTER INSERT OR UPDATE ON public.professional_client_relationships
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_client_relationship_audit();