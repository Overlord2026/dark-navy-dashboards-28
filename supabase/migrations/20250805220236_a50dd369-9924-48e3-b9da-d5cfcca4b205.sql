-- Add agreement and contract management tables for organizations

-- Create agreement types enum
CREATE TYPE agreement_type AS ENUM (
  'nda',
  'client_agreement', 
  'privacy_policy',
  'terms_of_service',
  'advisor_agreement',
  'compliance_disclosure'
);

-- Create agreement status enum  
CREATE TYPE agreement_status AS ENUM (
  'draft',
  'pending_signature',
  'signed',
  'expired',
  'revoked'
);

-- Organization agreement templates
CREATE TABLE public.organization_agreement_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  agreement_type agreement_type NOT NULL,
  template_name text NOT NULL,
  template_content text NOT NULL,
  version text NOT NULL DEFAULT '1.0',
  is_active boolean DEFAULT true,
  requires_signature boolean DEFAULT true,
  auto_renewal boolean DEFAULT false,
  validity_days integer DEFAULT 365,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- User agreement instances
CREATE TABLE public.user_agreements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  template_id uuid REFERENCES public.organization_agreement_templates(id),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  agreement_type agreement_type NOT NULL,
  status agreement_status DEFAULT 'pending_signature',
  signed_at timestamp with time zone,
  signature_data jsonb, -- e-signature details
  expires_at timestamp with time zone,
  signed_ip_address inet,
  signed_user_agent text,
  document_url text, -- stored signed document
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Organization compliance exports
CREATE TABLE public.organization_compliance_exports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  export_type text NOT NULL, -- 'finra', 'sec', 'state', 'internal'
  date_range_start date NOT NULL,
  date_range_end date NOT NULL,
  exported_by uuid REFERENCES auth.users(id),
  export_status text DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  export_url text, -- secure download link
  export_size_bytes bigint,
  includes_audit_logs boolean DEFAULT true,
  includes_agreements boolean DEFAULT true,
  includes_document_vault boolean DEFAULT true,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone
);

-- Enhanced organization audit logs with better categorization
CREATE TABLE public.organization_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  branch_id uuid REFERENCES public.organization_branches(id),
  user_id uuid REFERENCES auth.users(id),
  activity_type text NOT NULL, -- 'document_access', 'agreement_signed', 'seat_assigned', etc.
  activity_category text NOT NULL, -- 'compliance', 'admin', 'client', 'advisor'
  severity text DEFAULT 'info', -- 'info', 'warning', 'error', 'critical'
  resource_type text, -- 'document', 'agreement', 'user', 'seat'
  resource_id text,
  description text NOT NULL,
  metadata jsonb DEFAULT '{}',
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_org_agreement_templates_org_type ON public.organization_agreement_templates(organization_id, agreement_type);
CREATE INDEX idx_user_agreements_user_status ON public.user_agreements(user_id, status);
CREATE INDEX idx_user_agreements_org_type ON public.user_agreements(organization_id, agreement_type);
CREATE INDEX idx_compliance_exports_org_status ON public.organization_compliance_exports(organization_id, export_status);
CREATE INDEX idx_activity_logs_org_created ON public.organization_activity_logs(organization_id, created_at DESC);
CREATE INDEX idx_activity_logs_user_created ON public.organization_activity_logs(user_id, created_at DESC);
CREATE INDEX idx_activity_logs_category_type ON public.organization_activity_logs(activity_category, activity_type);

-- Enable RLS
ALTER TABLE public.organization_agreement_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_compliance_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for agreement templates
CREATE POLICY "Organization admins can manage agreement templates"
  ON public.organization_agreement_templates
  USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_admins 
      WHERE user_id = auth.uid() AND role IN ('admin', 'compliance_officer')
    )
  );

-- RLS Policies for user agreements
CREATE POLICY "Users can view their own agreements"
  ON public.user_agreements FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Organization admins can manage user agreements"
  ON public.user_agreements
  USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_admins 
      WHERE user_id = auth.uid() AND role IN ('admin', 'compliance_officer')
    )
  );

-- RLS Policies for compliance exports
CREATE POLICY "Organization admins can manage compliance exports"
  ON public.organization_compliance_exports
  USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_admins 
      WHERE user_id = auth.uid() AND role IN ('admin', 'compliance_officer')
    )
  );

-- RLS Policies for activity logs
CREATE POLICY "Organization admins can view activity logs"
  ON public.organization_activity_logs FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_admins 
      WHERE user_id = auth.uid() AND role IN ('admin', 'compliance_officer', 'sub_admin')
    )
  );

-- Function to log organization activities
CREATE OR REPLACE FUNCTION public.log_organization_activity(
  p_organization_id uuid,
  p_branch_id uuid DEFAULT NULL,
  p_activity_type text,
  p_activity_category text,
  p_description text,
  p_severity text DEFAULT 'info',
  p_resource_type text DEFAULT NULL,
  p_resource_id text DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  log_id uuid;
BEGIN
  INSERT INTO public.organization_activity_logs (
    organization_id,
    branch_id,
    user_id,
    activity_type,
    activity_category,
    severity,
    resource_type,
    resource_id,
    description,
    metadata,
    ip_address,
    user_agent
  ) VALUES (
    p_organization_id,
    p_branch_id,
    auth.uid(),
    p_activity_type,
    p_activity_category,
    p_severity,
    p_resource_type,
    p_resource_id,
    p_description,
    p_metadata,
    inet_client_addr(),
    current_setting('request.headers', true)::jsonb->>'user-agent'
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

-- Function to check agreement expiration and send reminders
CREATE OR REPLACE FUNCTION public.check_agreement_expiration()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Mark agreements as expired
  UPDATE public.user_agreements 
  SET status = 'expired'
  WHERE status = 'signed' 
    AND expires_at < now()
    AND expires_at IS NOT NULL;
    
  -- Log expiration events
  INSERT INTO public.organization_activity_logs (
    organization_id,
    user_id,
    activity_type,
    activity_category,
    severity,
    resource_type,
    resource_id,
    description
  )
  SELECT 
    ua.organization_id,
    ua.user_id,
    'agreement_expired',
    'compliance',
    'warning',
    'agreement',
    ua.id::text,
    'Agreement ' || ua.agreement_type || ' has expired'
  FROM public.user_agreements ua
  WHERE ua.status = 'expired' 
    AND ua.updated_at > now() - interval '1 hour'; -- Recently expired
END;
$$;

-- Trigger to update timestamps
CREATE OR REPLACE FUNCTION public.update_agreement_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_organization_agreement_templates_updated_at
  BEFORE UPDATE ON public.organization_agreement_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_agreement_updated_at();

CREATE TRIGGER update_user_agreements_updated_at
  BEFORE UPDATE ON public.user_agreements
  FOR EACH ROW EXECUTE FUNCTION public.update_agreement_updated_at();