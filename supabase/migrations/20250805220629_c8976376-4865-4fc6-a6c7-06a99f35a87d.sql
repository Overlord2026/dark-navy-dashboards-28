-- Create enhanced organization features
CREATE TYPE billing_model AS ENUM ('monthly', 'annual', 'usage_based', 'volume_discount', 'enterprise_custom');
CREATE TYPE invite_source AS ENUM ('advisor', 'broker_dealer', 'ria', 'insurance_agency', 'law_firm', 'accounting_firm', 'direct', 'referral');
CREATE TYPE module_type AS ENUM ('estate_planning', 'tax_optimization', 'private_markets', 'insurance_analysis', 'retirement_planning', 'investment_management', 'lending', 'vault_premium');
CREATE TYPE agreement_type AS ENUM ('nda', 'client_agreement', 'privacy_policy', 'terms_of_service', 'advisor_agreement', 'compliance_disclosure');
CREATE TYPE agreement_status AS ENUM ('draft', 'pending_signature', 'signed', 'expired', 'revoked');

-- Organization billing configurations
CREATE TABLE public.organization_billing_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  billing_model billing_model NOT NULL DEFAULT 'monthly',
  base_price_per_seat NUMERIC(10,2) NOT NULL DEFAULT 0,
  minimum_seats INTEGER NOT NULL DEFAULT 1,
  volume_discount_tiers JSONB DEFAULT '[]'::jsonb,
  usage_based_pricing JSONB DEFAULT '{}'::jsonb,
  billing_cycle_day INTEGER DEFAULT 1,
  auto_renew BOOLEAN DEFAULT true,
  invoice_email TEXT,
  billing_contact_name TEXT,
  billing_address JSONB DEFAULT '{}'::jsonb,
  payment_terms_days INTEGER DEFAULT 30,
  custom_billing_notes TEXT,
  white_label_invoice BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seat utilization tracking
CREATE TABLE public.organization_seat_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  seats_purchased INTEGER NOT NULL DEFAULT 0,
  seats_assigned INTEGER NOT NULL DEFAULT 0,
  seats_active INTEGER NOT NULL DEFAULT 0,
  clients_onboarded INTEGER NOT NULL DEFAULT 0,
  usage_metrics JSONB DEFAULT '{}'::jsonb,
  billing_amount NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Dynamic onboarding flows
CREATE TABLE public.organization_onboarding_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  flow_name TEXT NOT NULL,
  invite_source invite_source NOT NULL,
  flow_steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  auto_assignments JSONB DEFAULT '{}'::jsonb,
  compliance_requirements JSONB DEFAULT '[]'::jsonb,
  agreement_templates JSONB DEFAULT '[]'::jsonb,
  branding_config JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Premium module configurations
CREATE TABLE public.organization_module_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  module_type module_type NOT NULL,
  is_enabled BOOLEAN DEFAULT false,
  pricing_override NUMERIC(10,2),
  usage_limits JSONB DEFAULT '{}'::jsonb,
  rep_assignment_rules JSONB DEFAULT '{}'::jsonb,
  revenue_share_percent NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(organization_id, module_type)
);

-- Affiliate and referral tracking
CREATE TABLE public.organization_referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  referral_code TEXT UNIQUE NOT NULL,
  code_type TEXT NOT NULL DEFAULT 'affiliate',
  revenue_share_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
  usage_count INTEGER DEFAULT 0,
  total_revenue NUMERIC(12,2) DEFAULT 0,
  commission_earned NUMERIC(12,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Organization support configurations
CREATE TABLE public.organization_support_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  custom_faq_content JSONB DEFAULT '[]'::jsonb,
  support_contact_info JSONB DEFAULT '{}'::jsonb,
  escalation_rules JSONB DEFAULT '[]'::jsonb,
  chat_routing_config JSONB DEFAULT '{}'::jsonb,
  help_desk_branding JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Bulk client import tracking
CREATE TABLE public.organization_bulk_imports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  imported_by UUID REFERENCES auth.users(id),
  import_type TEXT NOT NULL DEFAULT 'csv',
  total_records INTEGER NOT NULL DEFAULT 0,
  successful_imports INTEGER DEFAULT 0,
  failed_imports INTEGER DEFAULT 0,
  import_data JSONB DEFAULT '[]'::jsonb,
  error_log JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'processing',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Agreement workflow templates
CREATE TABLE public.agreement_workflow_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  template_name TEXT NOT NULL,
  workflow_type TEXT NOT NULL,
  template_content TEXT NOT NULL,
  signature_required BOOLEAN DEFAULT true,
  auto_send_triggers JSONB DEFAULT '[]'::jsonb,
  reminder_schedule JSONB DEFAULT '[]'::jsonb,
  expiration_days INTEGER,
  is_active BOOLEAN DEFAULT true,
  version INTEGER DEFAULT 1,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Organization agreement templates
CREATE TABLE public.organization_agreement_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  agreement_type agreement_type NOT NULL,
  template_name TEXT NOT NULL,
  template_content TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT '1.0',
  is_active BOOLEAN DEFAULT true,
  requires_signature BOOLEAN DEFAULT true,
  auto_renewal BOOLEAN DEFAULT false,
  validity_days INTEGER DEFAULT 365,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User agreement instances
CREATE TABLE public.user_agreements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.organization_agreement_templates(id),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  agreement_type agreement_type NOT NULL,
  status agreement_status DEFAULT 'pending_signature',
  signed_at TIMESTAMPTZ,
  signature_data JSONB,
  expires_at TIMESTAMPTZ,
  signed_ip_address INET,
  signed_user_agent TEXT,
  document_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Organization compliance exports
CREATE TABLE public.organization_compliance_exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  export_type TEXT NOT NULL,
  date_range_start DATE NOT NULL,
  date_range_end DATE NOT NULL,
  exported_by UUID REFERENCES auth.users(id),
  export_status TEXT DEFAULT 'pending',
  export_url TEXT,
  export_size_bytes BIGINT,
  includes_audit_logs BOOLEAN DEFAULT true,
  includes_agreements BOOLEAN DEFAULT true,
  includes_document_vault BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Organization activity logs
CREATE TABLE public.organization_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES public.organization_branches(id),
  user_id UUID REFERENCES auth.users(id),
  activity_type TEXT NOT NULL,
  activity_category TEXT NOT NULL,
  severity TEXT DEFAULT 'info',
  resource_type TEXT,
  resource_id TEXT,
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.organization_billing_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_seat_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_onboarding_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_module_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_support_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_bulk_imports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agreement_workflow_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_agreement_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_compliance_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_activity_logs ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policies
CREATE POLICY "Org admins can manage billing configs" ON public.organization_billing_configs
  FOR ALL USING (
    organization_id IN (
      SELECT oa.organization_id FROM public.organization_admins oa 
      WHERE oa.user_id = auth.uid() AND oa.is_active = true
    )
  );

CREATE POLICY "Org admins can manage seat usage" ON public.organization_seat_usage
  FOR ALL USING (
    organization_id IN (
      SELECT oa.organization_id FROM public.organization_admins oa 
      WHERE oa.user_id = auth.uid() AND oa.is_active = true
    )
  );

CREATE POLICY "Org admins can manage onboarding flows" ON public.organization_onboarding_flows
  FOR ALL USING (
    organization_id IN (
      SELECT oa.organization_id FROM public.organization_admins oa 
      WHERE oa.user_id = auth.uid() AND oa.is_active = true
    )
  );

CREATE POLICY "Org admins can manage module access" ON public.organization_module_access
  FOR ALL USING (
    organization_id IN (
      SELECT oa.organization_id FROM public.organization_admins oa 
      WHERE oa.user_id = auth.uid() AND oa.is_active = true
    )
  );

CREATE POLICY "Org admins can manage referral codes" ON public.organization_referral_codes
  FOR ALL USING (
    organization_id IN (
      SELECT oa.organization_id FROM public.organization_admins oa 
      WHERE oa.user_id = auth.uid() AND oa.is_active = true
    )
  );

CREATE POLICY "Org admins can manage support configs" ON public.organization_support_configs
  FOR ALL USING (
    organization_id IN (
      SELECT oa.organization_id FROM public.organization_admins oa 
      WHERE oa.user_id = auth.uid() AND oa.is_active = true
    )
  );

CREATE POLICY "Org admins can manage bulk imports" ON public.organization_bulk_imports
  FOR ALL USING (
    organization_id IN (
      SELECT oa.organization_id FROM public.organization_admins oa 
      WHERE oa.user_id = auth.uid() AND oa.is_active = true
    )
  );

CREATE POLICY "Org admins can manage agreement templates" ON public.agreement_workflow_templates
  FOR ALL USING (
    organization_id IN (
      SELECT oa.organization_id FROM public.organization_admins oa 
      WHERE oa.user_id = auth.uid() AND oa.is_active = true
    )
  );

CREATE POLICY "Org admins can manage org agreement templates" ON public.organization_agreement_templates
  FOR ALL USING (
    organization_id IN (
      SELECT oa.organization_id FROM public.organization_admins oa 
      WHERE oa.user_id = auth.uid() AND oa.is_active = true
    )
  );

CREATE POLICY "Users can view their agreements" ON public.user_agreements
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Org admins can manage user agreements" ON public.user_agreements
  FOR ALL USING (
    organization_id IN (
      SELECT oa.organization_id FROM public.organization_admins oa 
      WHERE oa.user_id = auth.uid() AND oa.is_active = true
    )
  );

CREATE POLICY "Org admins can manage compliance exports" ON public.organization_compliance_exports
  FOR ALL USING (
    organization_id IN (
      SELECT oa.organization_id FROM public.organization_admins oa 
      WHERE oa.user_id = auth.uid() AND oa.is_active = true
    )
  );

CREATE POLICY "Org admins can view activity logs" ON public.organization_activity_logs
  FOR SELECT USING (
    organization_id IN (
      SELECT oa.organization_id FROM public.organization_admins oa 
      WHERE oa.user_id = auth.uid() AND oa.is_active = true
    )
  );

-- Create indexes for performance
CREATE INDEX idx_org_billing_configs_org_id ON public.organization_billing_configs(organization_id);
CREATE INDEX idx_org_seat_usage_org_id ON public.organization_seat_usage(organization_id);
CREATE INDEX idx_org_onboarding_flows_org_id ON public.organization_onboarding_flows(organization_id);
CREATE INDEX idx_org_module_access_org_id ON public.organization_module_access(organization_id);
CREATE INDEX idx_org_referral_codes_org_id ON public.organization_referral_codes(organization_id);
CREATE INDEX idx_org_support_configs_org_id ON public.organization_support_configs(organization_id);
CREATE INDEX idx_org_bulk_imports_org_id ON public.organization_bulk_imports(organization_id);
CREATE INDEX idx_agreement_workflow_templates_org_id ON public.agreement_workflow_templates(organization_id);
CREATE INDEX idx_org_agreement_templates_org_id ON public.organization_agreement_templates(organization_id);
CREATE INDEX idx_user_agreements_user_id ON public.user_agreements(user_id);
CREATE INDEX idx_user_agreements_org_id ON public.user_agreements(organization_id);
CREATE INDEX idx_compliance_exports_org_id ON public.organization_compliance_exports(organization_id);
CREATE INDEX idx_activity_logs_org_id ON public.organization_activity_logs(organization_id);

-- Function to generate referral codes
CREATE OR REPLACE FUNCTION public.generate_organization_referral_code(p_organization_id UUID, p_prefix TEXT DEFAULT 'ORG')
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    code := p_prefix || '-' || upper(substring(encode(gen_random_bytes(6), 'base64') from 1 for 6));
    code := replace(code, '/', '');
    code := replace(code, '+', '');
    
    SELECT EXISTS(SELECT 1 FROM public.organization_referral_codes WHERE referral_code = code) INTO exists_check;
    
    IF NOT exists_check THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Function to log organization activities
CREATE OR REPLACE FUNCTION public.log_organization_activity(
  p_organization_id UUID,
  p_branch_id UUID DEFAULT NULL,
  p_activity_type TEXT,
  p_activity_category TEXT,
  p_description TEXT,
  p_severity TEXT DEFAULT 'info',
  p_resource_type TEXT DEFAULT NULL,
  p_resource_id TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.organization_activity_logs (
    organization_id, branch_id, user_id, activity_type, activity_category,
    severity, resource_type, resource_id, description, metadata, ip_address, user_agent
  ) VALUES (
    p_organization_id, p_branch_id, auth.uid(), p_activity_type, p_activity_category,
    p_severity, p_resource_type, p_resource_id, p_description, p_metadata,
    inet_client_addr(), current_setting('request.headers', true)::jsonb->>'user-agent'
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;