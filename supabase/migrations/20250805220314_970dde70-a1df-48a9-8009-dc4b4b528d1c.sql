-- Create enums for new functionality
CREATE TYPE billing_model AS ENUM ('monthly', 'annual', 'usage_based', 'volume_discount', 'enterprise_custom');
CREATE TYPE invite_source AS ENUM ('advisor', 'broker_dealer', 'ria', 'insurance_agency', 'law_firm', 'accounting_firm', 'direct', 'referral');
CREATE TYPE module_type AS ENUM ('estate_planning', 'tax_optimization', 'private_markets', 'insurance_analysis', 'retirement_planning', 'investment_management', 'lending', 'vault_premium');

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

-- Referral usage tracking
CREATE TABLE public.referral_usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_code_id UUID REFERENCES public.organization_referral_codes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  organization_id UUID REFERENCES public.organizations(id),
  revenue_generated NUMERIC(10,2) DEFAULT 0,
  commission_amount NUMERIC(10,2) DEFAULT 0,
  conversion_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
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
  workflow_type TEXT NOT NULL, -- 'advisor_nda', 'client_consent', 'seat_assignment', 'renewal_notice'
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

-- Enable RLS on all tables
ALTER TABLE public.organization_billing_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_seat_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_onboarding_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_module_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_support_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_bulk_imports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agreement_workflow_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organization billing configs
CREATE POLICY "Org admins can manage billing configs" ON public.organization_billing_configs
  FOR ALL USING (
    organization_id IN (
      SELECT oa.organization_id FROM public.organization_admins oa 
      WHERE oa.user_id = auth.uid() AND oa.is_active = true
    )
  );

-- RLS Policies for seat usage
CREATE POLICY "Org members can view seat usage" ON public.organization_seat_usage
  FOR SELECT USING (
    organization_id IN (
      SELECT oa.organization_id FROM public.organization_admins oa 
      WHERE oa.user_id = auth.uid() AND oa.is_active = true
    )
  );

CREATE POLICY "Org admins can manage seat usage" ON public.organization_seat_usage
  FOR ALL USING (
    organization_id IN (
      SELECT oa.organization_id FROM public.organization_admins oa 
      WHERE oa.user_id = auth.uid() AND oa.is_active = true AND oa.role IN ('admin', 'billing_admin')
    )
  );

-- RLS Policies for onboarding flows
CREATE POLICY "Org admins can manage onboarding flows" ON public.organization_onboarding_flows
  FOR ALL USING (
    organization_id IN (
      SELECT oa.organization_id FROM public.organization_admins oa 
      WHERE oa.user_id = auth.uid() AND oa.is_active = true
    )
  );

-- RLS Policies for module access
CREATE POLICY "Org admins can manage module access" ON public.organization_module_access
  FOR ALL USING (
    organization_id IN (
      SELECT oa.organization_id FROM public.organization_admins oa 
      WHERE oa.user_id = auth.uid() AND oa.is_active = true
    )
  );

-- RLS Policies for referral codes
CREATE POLICY "Org admins can manage referral codes" ON public.organization_referral_codes
  FOR ALL USING (
    organization_id IN (
      SELECT oa.organization_id FROM public.organization_admins oa 
      WHERE oa.user_id = auth.uid() AND oa.is_active = true
    )
  );

-- RLS Policies for referral tracking
CREATE POLICY "Org admins can view referral tracking" ON public.referral_usage_tracking
  FOR SELECT USING (
    organization_id IN (
      SELECT oa.organization_id FROM public.organization_admins oa 
      WHERE oa.user_id = auth.uid() AND oa.is_active = true
    )
  );

-- RLS Policies for support configs
CREATE POLICY "Org admins can manage support configs" ON public.organization_support_configs
  FOR ALL USING (
    organization_id IN (
      SELECT oa.organization_id FROM public.organization_admins oa 
      WHERE oa.user_id = auth.uid() AND oa.is_active = true
    )
  );

-- RLS Policies for bulk imports
CREATE POLICY "Org admins can manage bulk imports" ON public.organization_bulk_imports
  FOR ALL USING (
    organization_id IN (
      SELECT oa.organization_id FROM public.organization_admins oa 
      WHERE oa.user_id = auth.uid() AND oa.is_active = true
    )
  );

-- RLS Policies for agreement templates
CREATE POLICY "Org admins can manage agreement templates" ON public.agreement_workflow_templates
  FOR ALL USING (
    organization_id IN (
      SELECT oa.organization_id FROM public.organization_admins oa 
      WHERE oa.user_id = auth.uid() AND oa.is_active = true
    )
  );

-- Create indexes for performance
CREATE INDEX idx_org_billing_configs_org_id ON public.organization_billing_configs(organization_id);
CREATE INDEX idx_org_seat_usage_org_id ON public.organization_seat_usage(organization_id);
CREATE INDEX idx_org_seat_usage_period ON public.organization_seat_usage(period_start, period_end);
CREATE INDEX idx_org_onboarding_flows_org_id ON public.organization_onboarding_flows(organization_id);
CREATE INDEX idx_org_onboarding_flows_source ON public.organization_onboarding_flows(invite_source);
CREATE INDEX idx_org_module_access_org_id ON public.organization_module_access(organization_id);
CREATE INDEX idx_org_referral_codes_org_id ON public.organization_referral_codes(organization_id);
CREATE INDEX idx_org_referral_codes_code ON public.organization_referral_codes(referral_code);
CREATE INDEX idx_referral_usage_tracking_code_id ON public.referral_usage_tracking(referral_code_id);
CREATE INDEX idx_org_support_configs_org_id ON public.organization_support_configs(organization_id);
CREATE INDEX idx_org_bulk_imports_org_id ON public.organization_bulk_imports(organization_id);
CREATE INDEX idx_agreement_workflow_templates_org_id ON public.agreement_workflow_templates(organization_id);

-- Add updated_at triggers
CREATE TRIGGER update_organization_billing_configs_updated_at
  BEFORE UPDATE ON public.organization_billing_configs
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_organization_onboarding_flows_updated_at
  BEFORE UPDATE ON public.organization_onboarding_flows
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_organization_module_access_updated_at
  BEFORE UPDATE ON public.organization_module_access
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_organization_referral_codes_updated_at
  BEFORE UPDATE ON public.organization_referral_codes
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_organization_support_configs_updated_at
  BEFORE UPDATE ON public.organization_support_configs
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_agreement_workflow_templates_updated_at
  BEFORE UPDATE ON public.agreement_workflow_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

-- Function to generate referral codes
CREATE OR REPLACE FUNCTION public.generate_organization_referral_code(p_organization_id UUID, p_prefix TEXT DEFAULT 'ORG')
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- Generate 8-character alphanumeric code with organization prefix
    code := p_prefix || '-' || upper(substring(encode(gen_random_bytes(6), 'base64') from 1 for 6));
    code := replace(code, '/', '');
    code := replace(code, '+', '');
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.organization_referral_codes WHERE referral_code = code) INTO exists_check;
    
    IF NOT exists_check THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;