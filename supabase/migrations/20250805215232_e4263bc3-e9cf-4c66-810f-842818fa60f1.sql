-- Enhanced enterprise/organization management system
-- This migration adds comprehensive group licensing, compliance settings, and billing management

-- Create organizations table for broker-dealers, RIAs, agencies, etc.
CREATE TABLE public.organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  org_type TEXT NOT NULL, -- 'broker_dealer', 'ria', 'insurance_agency', 'law_firm', 'accounting_firm', 'family_office'
  license_number TEXT,
  registration_state TEXT,
  compliance_level TEXT NOT NULL DEFAULT 'standard', -- 'basic', 'standard', 'enhanced', 'finra_compliant'
  
  -- Branding and white-label settings
  logo_url TEXT,
  primary_color TEXT DEFAULT '#1B1B32',
  secondary_color TEXT DEFAULT '#F9F7E8',
  custom_domain TEXT,
  white_label_enabled BOOLEAN DEFAULT false,
  
  -- Billing and seat management
  total_seats_purchased INTEGER NOT NULL DEFAULT 0,
  seats_allocated INTEGER NOT NULL DEFAULT 0,
  seats_remaining INTEGER GENERATED ALWAYS AS (total_seats_purchased - seats_allocated) STORED,
  billing_tier TEXT NOT NULL DEFAULT 'standard', -- 'startup', 'standard', 'enterprise', 'white_label'
  volume_discount_percent NUMERIC DEFAULT 0,
  billing_cycle TEXT NOT NULL DEFAULT 'monthly', -- 'monthly', 'quarterly', 'annual'
  next_billing_date DATE,
  
  -- Contract and legal settings
  custom_nda_template TEXT,
  custom_contract_template TEXT,
  terms_of_service_url TEXT,
  privacy_policy_url TEXT,
  
  -- Status and metadata
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'suspended', 'trial', 'cancelled'
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES public.profiles(id),
  
  -- Contact information
  primary_contact_email TEXT,
  primary_contact_phone TEXT,
  billing_email TEXT,
  support_email TEXT,
  
  -- Regulatory and compliance
  finra_member BOOLEAN DEFAULT false,
  sec_registered BOOLEAN DEFAULT false,
  state_licenses TEXT[],
  compliance_officer_contact TEXT,
  
  CONSTRAINT valid_org_type CHECK (org_type IN ('broker_dealer', 'ria', 'insurance_agency', 'law_firm', 'accounting_firm', 'family_office')),
  CONSTRAINT valid_billing_tier CHECK (billing_tier IN ('startup', 'standard', 'enterprise', 'white_label')),
  CONSTRAINT valid_compliance_level CHECK (compliance_level IN ('basic', 'standard', 'enhanced', 'finra_compliant'))
);

-- Create organization admins and roles
CREATE TABLE public.organization_admins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  admin_role TEXT NOT NULL DEFAULT 'admin', -- 'master_admin', 'admin', 'sub_admin', 'branch_manager', 'compliance_officer'
  permissions JSONB NOT NULL DEFAULT '{}',
  seat_pool_allocation INTEGER DEFAULT 0,
  branch_identifier TEXT, -- For branch managers or OSJ
  territories TEXT[], -- Geographic or client territories
  is_active BOOLEAN NOT NULL DEFAULT true,
  appointed_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(organization_id, user_id),
  CONSTRAINT valid_admin_role CHECK (admin_role IN ('master_admin', 'admin', 'sub_admin', 'branch_manager', 'compliance_officer'))
);

-- Create organization compliance settings
CREATE TABLE public.organization_compliance_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  
  -- Investment restrictions and approvals
  approved_investment_types TEXT[] NOT NULL DEFAULT '{}',
  restricted_investment_types TEXT[] NOT NULL DEFAULT '{}',
  minimum_investment_amounts JSONB DEFAULT '{}',
  maximum_investment_amounts JSONB DEFAULT '{}',
  suitability_requirements JSONB DEFAULT '{}',
  
  -- Document and disclosure requirements
  required_disclosures TEXT[] NOT NULL DEFAULT '{}',
  mandatory_document_categories TEXT[] NOT NULL DEFAULT '{}',
  document_retention_years INTEGER DEFAULT 7,
  electronic_signature_required BOOLEAN DEFAULT true,
  
  -- Client onboarding requirements
  kyc_requirements JSONB NOT NULL DEFAULT '{}',
  aml_screening_required BOOLEAN DEFAULT true,
  accredited_investor_verification BOOLEAN DEFAULT false,
  risk_tolerance_assessment_required BOOLEAN DEFAULT true,
  
  -- Communication and marketing restrictions
  social_media_policy JSONB DEFAULT '{}',
  marketing_material_approval_required BOOLEAN DEFAULT true,
  client_communication_archival BOOLEAN DEFAULT true,
  
  -- Audit and reporting settings
  activity_monitoring_level TEXT NOT NULL DEFAULT 'standard', -- 'basic', 'standard', 'enhanced', 'real_time'
  automated_compliance_checks BOOLEAN DEFAULT true,
  regulatory_reporting_frequency TEXT DEFAULT 'monthly',
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES public.profiles(id),
  
  UNIQUE(organization_id),
  CONSTRAINT valid_activity_monitoring CHECK (activity_monitoring_level IN ('basic', 'standard', 'enhanced', 'real_time'))
);

-- Create document vault folder templates
CREATE TABLE public.organization_document_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  template_name TEXT NOT NULL,
  folder_structure JSONB NOT NULL DEFAULT '[]',
  required_documents JSONB NOT NULL DEFAULT '[]',
  document_categories JSONB NOT NULL DEFAULT '[]',
  retention_policies JSONB DEFAULT '{}',
  access_permissions JSONB DEFAULT '{}',
  is_mandatory BOOLEAN DEFAULT false,
  applies_to_client_types TEXT[] DEFAULT '{}', -- 'individual', 'joint', 'entity', 'trust'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES public.profiles(id)
);

-- Create organization onboarding configurations
CREATE TABLE public.organization_onboarding_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  config_name TEXT NOT NULL DEFAULT 'default',
  
  -- Onboarding flow configuration
  enabled_steps TEXT[] NOT NULL DEFAULT '{}',
  step_order JSONB NOT NULL DEFAULT '[]',
  conditional_steps JSONB DEFAULT '{}',
  required_steps TEXT[] NOT NULL DEFAULT '{}',
  
  -- Investment menu configuration
  available_investment_options JSONB NOT NULL DEFAULT '{}',
  feature_toggles JSONB NOT NULL DEFAULT '{}',
  custom_workflows JSONB DEFAULT '{}',
  
  -- Branding and messaging
  welcome_message TEXT,
  custom_disclosures TEXT[],
  branding_settings JSONB DEFAULT '{}',
  
  -- Client type specific settings
  individual_client_config JSONB DEFAULT '{}',
  entity_client_config JSONB DEFAULT '{}',
  trust_client_config JSONB DEFAULT '{}',
  
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES public.profiles(id),
  
  UNIQUE(organization_id, config_name)
);

-- Create organization activity audit logs
CREATE TABLE public.organization_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  admin_user_id UUID REFERENCES public.profiles(id),
  client_id UUID,
  advisor_id UUID,
  branch_identifier TEXT,
  
  -- Activity details
  activity_type TEXT NOT NULL, -- 'seat_allocation', 'client_onboarding', 'document_access', 'investment_transaction', 'compliance_review', 'settings_change'
  activity_category TEXT NOT NULL, -- 'administrative', 'client_facing', 'compliance', 'financial', 'system'
  activity_description TEXT NOT NULL,
  
  -- Metadata and context
  activity_metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  
  -- Compliance and regulatory
  regulatory_significance TEXT DEFAULT 'low', -- 'low', 'medium', 'high', 'critical'
  requires_retention BOOLEAN DEFAULT true,
  retention_until DATE,
  
  -- Geographic and time tracking
  timezone TEXT DEFAULT 'UTC',
  business_hours BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  CONSTRAINT valid_activity_category CHECK (activity_category IN ('administrative', 'client_facing', 'compliance', 'financial', 'system')),
  CONSTRAINT valid_regulatory_significance CHECK (regulatory_significance IN ('low', 'medium', 'high', 'critical'))
);

-- Create organization billing and seat management
CREATE TABLE public.organization_seat_allocations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  allocated_to_admin UUID REFERENCES public.organization_admins(id),
  allocated_by UUID NOT NULL REFERENCES public.profiles(id),
  
  -- Seat allocation details
  seats_allocated INTEGER NOT NULL,
  allocation_purpose TEXT, -- 'branch', 'team', 'advisor_pool', 'trial'
  allocation_notes TEXT,
  
  -- Usage tracking
  seats_used INTEGER NOT NULL DEFAULT 0,
  seats_remaining INTEGER GENERATED ALWAYS AS (seats_allocated - seats_used) STORED,
  
  -- Validity and constraints
  expires_at TIMESTAMP WITH TIME ZONE,
  can_reallocate BOOLEAN DEFAULT true,
  usage_restrictions JSONB DEFAULT '{}',
  
  -- Status and tracking
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'suspended', 'expired', 'revoked'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  CONSTRAINT valid_seat_allocation_status CHECK (status IN ('active', 'suspended', 'expired', 'revoked'))
);

-- Enable RLS on all new tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_compliance_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_onboarding_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_seat_allocations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organizations
CREATE POLICY "Organization admins can manage their organizations"
ON public.organizations FOR ALL
USING (id IN (
  SELECT organization_id FROM public.organization_admins 
  WHERE user_id = auth.uid() AND is_active = true
));

CREATE POLICY "System administrators can view all organizations"
ON public.organizations FOR SELECT
USING (has_any_role(ARRAY['system_administrator', 'superadmin']));

-- RLS Policies for organization_admins  
CREATE POLICY "Organization admins can view admins in their org"
ON public.organization_admins FOR SELECT
USING (organization_id IN (
  SELECT organization_id FROM public.organization_admins 
  WHERE user_id = auth.uid() AND is_active = true
));

CREATE POLICY "Master admins can manage admins in their org"
ON public.organization_admins FOR ALL
USING (organization_id IN (
  SELECT organization_id FROM public.organization_admins 
  WHERE user_id = auth.uid() AND admin_role = 'master_admin' AND is_active = true
));

-- RLS Policies for organization_compliance_settings
CREATE POLICY "Organization admins can manage compliance settings"
ON public.organization_compliance_settings FOR ALL
USING (organization_id IN (
  SELECT organization_id FROM public.organization_admins 
  WHERE user_id = auth.uid() AND admin_role IN ('master_admin', 'admin', 'compliance_officer') AND is_active = true
));

-- RLS Policies for organization_document_templates
CREATE POLICY "Organization admins can manage document templates"
ON public.organization_document_templates FOR ALL
USING (organization_id IN (
  SELECT organization_id FROM public.organization_admins 
  WHERE user_id = auth.uid() AND is_active = true
));

-- RLS Policies for organization_onboarding_configs
CREATE POLICY "Organization admins can manage onboarding configs"
ON public.organization_onboarding_configs FOR ALL
USING (organization_id IN (
  SELECT organization_id FROM public.organization_admins 
  WHERE user_id = auth.uid() AND is_active = true
));

-- RLS Policies for organization_audit_logs
CREATE POLICY "Organization admins can view audit logs for their org"
ON public.organization_audit_logs FOR SELECT
USING (organization_id IN (
  SELECT organization_id FROM public.organization_admins 
  WHERE user_id = auth.uid() AND is_active = true
));

CREATE POLICY "System can create audit logs"
ON public.organization_audit_logs FOR INSERT
WITH CHECK (true);

-- RLS Policies for organization_seat_allocations
CREATE POLICY "Organization admins can manage seat allocations"
ON public.organization_seat_allocations FOR ALL
USING (organization_id IN (
  SELECT organization_id FROM public.organization_admins 
  WHERE user_id = auth.uid() AND admin_role IN ('master_admin', 'admin') AND is_active = true
));

-- Create indexes for performance
CREATE INDEX idx_organizations_org_type ON public.organizations(org_type);
CREATE INDEX idx_organizations_status ON public.organizations(status);
CREATE INDEX idx_organizations_billing_tier ON public.organizations(billing_tier);

CREATE INDEX idx_organization_admins_org_id ON public.organization_admins(organization_id);
CREATE INDEX idx_organization_admins_user_id ON public.organization_admins(user_id);
CREATE INDEX idx_organization_admins_role ON public.organization_admins(admin_role);

CREATE INDEX idx_organization_audit_logs_org_id ON public.organization_audit_logs(organization_id);
CREATE INDEX idx_organization_audit_logs_activity_type ON public.organization_audit_logs(activity_type);
CREATE INDEX idx_organization_audit_logs_created_at ON public.organization_audit_logs(created_at);
CREATE INDEX idx_organization_audit_logs_regulatory_sig ON public.organization_audit_logs(regulatory_significance);

-- Function to log organization activities
CREATE OR REPLACE FUNCTION public.log_organization_activity(
  p_organization_id UUID,
  p_user_id UUID,
  p_activity_type TEXT,
  p_activity_category TEXT,
  p_activity_description TEXT,
  p_activity_metadata JSONB DEFAULT '{}',
  p_regulatory_significance TEXT DEFAULT 'low',
  p_admin_user_id UUID DEFAULT NULL,
  p_client_id UUID DEFAULT NULL,
  p_advisor_id UUID DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.organization_audit_logs (
    organization_id, user_id, admin_user_id, client_id, advisor_id,
    activity_type, activity_category, activity_description, activity_metadata,
    regulatory_significance, ip_address, user_agent
  ) VALUES (
    p_organization_id, p_user_id, p_admin_user_id, p_client_id, p_advisor_id,
    p_activity_type, p_activity_category, p_activity_description, p_activity_metadata,
    p_regulatory_significance, inet_client_addr(),
    current_setting('request.headers', true)::json->>'user-agent'
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

-- Function to allocate seats to admins
CREATE OR REPLACE FUNCTION public.allocate_organization_seats(
  p_organization_id UUID,
  p_admin_id UUID,
  p_seats_to_allocate INTEGER,
  p_allocation_purpose TEXT DEFAULT NULL,
  p_expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  allocation_id UUID;
  org_seats_remaining INTEGER;
BEGIN
  -- Check if organization has enough seats
  SELECT seats_remaining INTO org_seats_remaining
  FROM public.organizations
  WHERE id = p_organization_id;
  
  IF org_seats_remaining < p_seats_to_allocate THEN
    RAISE EXCEPTION 'Insufficient seats available. Requested: %, Available: %', p_seats_to_allocate, org_seats_remaining;
  END IF;
  
  -- Create seat allocation
  INSERT INTO public.organization_seat_allocations (
    organization_id, allocated_to_admin, allocated_by,
    seats_allocated, allocation_purpose, expires_at
  ) VALUES (
    p_organization_id, p_admin_id, auth.uid(),
    p_seats_to_allocate, p_allocation_purpose, p_expires_at
  ) RETURNING id INTO allocation_id;
  
  -- Update organization allocated seats
  UPDATE public.organizations
  SET seats_allocated = seats_allocated + p_seats_to_allocate,
      updated_at = now()
  WHERE id = p_organization_id;
  
  -- Log the allocation activity
  PERFORM public.log_organization_activity(
    p_organization_id, auth.uid(), 'seat_allocation', 'administrative',
    format('Allocated %s seats to admin', p_seats_to_allocate),
    jsonb_build_object(
      'seats_allocated', p_seats_to_allocate,
      'allocation_id', allocation_id,
      'allocated_to_admin', p_admin_id
    ),
    'medium'
  );
  
  RETURN allocation_id;
END;
$$;

-- Function to generate compliance export for organization
CREATE OR REPLACE FUNCTION public.generate_organization_compliance_export(
  p_organization_id UUID,
  p_export_type TEXT,
  p_date_range_start DATE DEFAULT NULL,
  p_date_range_end DATE DEFAULT NULL,
  p_include_client_data BOOLEAN DEFAULT true,
  p_include_financial_data BOOLEAN DEFAULT false
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  export_id UUID;
  user_admin_role TEXT;
BEGIN
  -- Verify user has export permissions for this organization
  SELECT admin_role INTO user_admin_role
  FROM public.organization_admins
  WHERE organization_id = p_organization_id 
    AND user_id = auth.uid() 
    AND is_active = true;
  
  IF user_admin_role IS NULL OR user_admin_role NOT IN ('master_admin', 'admin', 'compliance_officer') THEN
    RAISE EXCEPTION 'Insufficient permissions for compliance export';
  END IF;
  
  -- Create export request
  INSERT INTO public.compliance_export_requests (
    requested_by, tenant_id, export_type, date_range_start, date_range_end,
    parameters, expires_at
  ) VALUES (
    auth.uid(), p_organization_id, p_export_type, p_date_range_start, p_date_range_end,
    jsonb_build_object(
      'organization_id', p_organization_id,
      'include_client_data', p_include_client_data,
      'include_financial_data', p_include_financial_data,
      'export_scope', 'organization'
    ),
    now() + INTERVAL '30 days'
  ) RETURNING id INTO export_id;
  
  -- Log export request
  PERFORM public.log_organization_activity(
    p_organization_id, auth.uid(), 'compliance_export', 'compliance',
    format('Requested %s compliance export', p_export_type),
    jsonb_build_object(
      'export_id', export_id,
      'export_type', p_export_type,
      'date_range_start', p_date_range_start,
      'date_range_end', p_date_range_end
    ),
    'high'
  );
  
  RETURN export_id;
END;
$$;

-- Function to update organization settings and log changes
CREATE OR REPLACE FUNCTION public.update_organization_settings()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  changes_made JSONB := '{}';
  change_fields TEXT[] := ARRAY[]::TEXT[];
BEGIN
  -- Track important field changes
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    changes_made := changes_made || jsonb_build_object('status', jsonb_build_object('old', OLD.status, 'new', NEW.status));
    change_fields := array_append(change_fields, 'status');
  END IF;
  
  IF OLD.compliance_level IS DISTINCT FROM NEW.compliance_level THEN
    changes_made := changes_made || jsonb_build_object('compliance_level', jsonb_build_object('old', OLD.compliance_level, 'new', NEW.compliance_level));
    change_fields := array_append(change_fields, 'compliance_level');
  END IF;
  
  IF OLD.total_seats_purchased IS DISTINCT FROM NEW.total_seats_purchased THEN
    changes_made := changes_made || jsonb_build_object('total_seats_purchased', jsonb_build_object('old', OLD.total_seats_purchased, 'new', NEW.total_seats_purchased));
    change_fields := array_append(change_fields, 'total_seats_purchased');
  END IF;
  
  -- Log changes if any significant fields changed
  IF array_length(change_fields, 1) > 0 THEN
    PERFORM public.log_organization_activity(
      NEW.id, auth.uid(), 'settings_change', 'administrative',
      format('Organization settings updated: %s', array_to_string(change_fields, ', ')),
      jsonb_build_object('changes', changes_made),
      CASE WHEN 'status' = ANY(change_fields) OR 'compliance_level' = ANY(change_fields) THEN 'high' ELSE 'medium' END
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for organization settings changes
CREATE TRIGGER organization_settings_audit_trigger
  AFTER UPDATE ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_organization_settings();

-- Insert sample organization types and default templates
INSERT INTO public.organization_document_templates (organization_id, template_name, folder_structure, required_documents, document_categories, is_mandatory)
SELECT 
  o.id,
  'Standard Client Documentation',
  '[
    {"name": "Client Information", "subfolders": ["KYC Documents", "Identity Verification", "Account Opening"]},
    {"name": "Investment Documentation", "subfolders": ["Proposals", "Statements", "Trade Confirmations"]},
    {"name": "Compliance", "subfolders": ["Disclosures", "Risk Assessments", "Regulatory Forms"]},
    {"name": "Communications", "subfolders": ["Meeting Notes", "Email Correspondence", "Advisory Agreements"]}
  ]'::jsonb,
  '[
    {"category": "KYC Documents", "documents": ["Driver License", "Passport", "Utility Bill"], "required": true},
    {"category": "Account Opening", "documents": ["Application", "W-9", "Investment Policy"], "required": true},
    {"category": "Risk Assessment", "documents": ["Risk Tolerance Questionnaire", "Suitability Assessment"], "required": true}
  ]'::jsonb,
  '["identity", "financial", "regulatory", "advisory", "compliance"]'::jsonb,
  true
FROM public.organizations o
ON CONFLICT (organization_id, template_name) DO NOTHING;