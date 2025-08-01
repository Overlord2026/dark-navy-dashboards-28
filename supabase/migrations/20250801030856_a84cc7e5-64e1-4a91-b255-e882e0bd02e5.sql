-- CPA Partner Profiles and Applications
CREATE TABLE public.cpa_partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  firm_name TEXT NOT NULL,
  firm_ein TEXT,
  license_number TEXT NOT NULL,
  license_state TEXT NOT NULL,
  specialties TEXT[] DEFAULT ARRAY[]::TEXT[],
  years_experience INTEGER DEFAULT 0,
  client_capacity INTEGER DEFAULT 50,
  hourly_rate NUMERIC(10,2),
  service_areas TEXT[] DEFAULT ARRAY[]::TEXT[],
  certifications TEXT[] DEFAULT ARRAY[]::TEXT[],
  software_used TEXT[] DEFAULT ARRAY[]::TEXT[],
  firm_size TEXT DEFAULT 'solo', -- solo, small (2-10), medium (11-50), large (50+)
  website_url TEXT,
  linkedin_url TEXT,
  bio TEXT,
  profile_image_url TEXT,
  office_address JSONB,
  phone TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  onboarding_status TEXT DEFAULT 'not_started' CHECK (onboarding_status IN ('not_started', 'in_progress', 'completed', 'needs_review')),
  white_label_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID,
  tenant_id UUID,
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- White-label Portal Configurations
CREATE TABLE public.white_label_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cpa_partner_id UUID NOT NULL REFERENCES public.cpa_partners(id) ON DELETE CASCADE,
  subdomain TEXT UNIQUE,
  custom_domain TEXT UNIQUE,
  brand_name TEXT NOT NULL,
  logo_url TEXT,
  favicon_url TEXT,
  primary_color TEXT DEFAULT '#3B82F6',
  secondary_color TEXT DEFAULT '#1E40AF',
  accent_color TEXT DEFAULT '#10B981',
  font_family TEXT DEFAULT 'Inter',
  custom_css TEXT,
  welcome_message TEXT,
  footer_text TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  terms_url TEXT,
  privacy_url TEXT,
  features_enabled JSONB DEFAULT '{"tax_planning": true, "document_vault": true, "client_portal": true, "analytics": false}'::JSONB,
  pricing_tiers JSONB DEFAULT '{"basic": 29, "premium": 99, "enterprise": 299}'::JSONB,
  is_active BOOLEAN DEFAULT false,
  ssl_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Onboarding Workflow Steps
CREATE TABLE public.onboarding_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  app_id TEXT NOT NULL, -- 'cpa_marketplace', 'client_portal', etc.
  step_number INTEGER NOT NULL,
  step_key TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  component_name TEXT, -- React component to render
  is_required BOOLEAN DEFAULT true,
  estimated_minutes INTEGER DEFAULT 5,
  help_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Individual Onboarding Progress
CREATE TABLE public.onboarding_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  app_id TEXT NOT NULL,
  step_key TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped', 'failed')),
  completed_at TIMESTAMP WITH TIME ZONE,
  data JSONB DEFAULT '{}'::JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, app_id, step_key)
);

-- Migration Jobs for QuickBooks/Drake/Lacerte
CREATE TABLE public.migration_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cpa_partner_id UUID NOT NULL REFERENCES public.cpa_partners(id) ON DELETE CASCADE,
  client_user_id UUID, -- If migrating for specific client
  migration_type TEXT NOT NULL CHECK (migration_type IN ('quickbooks', 'drake', 'lacerte', 'other')),
  source_system TEXT NOT NULL,
  source_version TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'cancelled')),
  progress_percentage INTEGER DEFAULT 0,
  total_records INTEGER DEFAULT 0,
  processed_records INTEGER DEFAULT 0,
  failed_records INTEGER DEFAULT 0,
  error_log JSONB DEFAULT '[]'::JSONB,
  migration_config JSONB DEFAULT '{}'::JSONB,
  file_mappings JSONB DEFAULT '{}'::JSONB, -- Map source fields to target fields
  backup_location TEXT, -- Where we store the original data
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  estimated_completion TIMESTAMP WITH TIME ZONE,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Demo Data Sets for CPA Partners
CREATE TABLE public.demo_data_sets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'individual', 'business', 'estate', 'nonprofit'
  data_type TEXT NOT NULL, -- 'tax_return', 'financial_statement', 'client_profile'
  demo_data JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Client-CPA Relationships
CREATE TABLE public.cpa_client_relationships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cpa_partner_id UUID NOT NULL REFERENCES public.cpa_partners(id) ON DELETE CASCADE,
  client_user_id UUID NOT NULL,
  relationship_type TEXT DEFAULT 'primary' CHECK (relationship_type IN ('primary', 'secondary', 'consultant')),
  engagement_type TEXT NOT NULL, -- 'tax_prep', 'bookkeeping', 'advisory', 'audit'
  fee_structure JSONB, -- Pricing agreement
  engagement_letter_signed BOOLEAN DEFAULT false,
  engagement_letter_url TEXT,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(cpa_partner_id, client_user_id, engagement_type)
);

-- Enable RLS on all tables
ALTER TABLE public.cpa_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.white_label_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.migration_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_data_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cpa_client_relationships ENABLE ROW LEVEL SECURITY;

-- RLS Policies for CPA Partners
CREATE POLICY "Users can manage their own CPA partner profile" 
ON public.cpa_partners 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all CPA partners" 
ON public.cpa_partners 
FOR ALL 
USING (has_any_role(ARRAY['admin'::text, 'system_administrator'::text]));

-- RLS Policies for White-label Configs
CREATE POLICY "CPA partners can manage their white-label config" 
ON public.white_label_configs 
FOR ALL 
USING (cpa_partner_id IN (
  SELECT id FROM public.cpa_partners WHERE user_id = auth.uid()
));

-- RLS Policies for Onboarding Steps
CREATE POLICY "Anyone can view onboarding steps" 
ON public.onboarding_steps 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage onboarding steps" 
ON public.onboarding_steps 
FOR ALL 
USING (has_any_role(ARRAY['admin'::text, 'system_administrator'::text]));

-- RLS Policies for Onboarding Progress
CREATE POLICY "Users can manage their own onboarding progress" 
ON public.onboarding_progress 
FOR ALL 
USING (auth.uid() = user_id);

-- RLS Policies for Migration Jobs
CREATE POLICY "CPA partners can manage their migration jobs" 
ON public.migration_jobs 
FOR ALL 
USING (cpa_partner_id IN (
  SELECT id FROM public.cpa_partners WHERE user_id = auth.uid()
));

CREATE POLICY "Users can view migration jobs for their data" 
ON public.migration_jobs 
FOR SELECT 
USING (client_user_id = auth.uid());

-- RLS Policies for Demo Data Sets
CREATE POLICY "Anyone can view active demo data sets" 
ON public.demo_data_sets 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage demo data sets" 
ON public.demo_data_sets 
FOR ALL 
USING (has_any_role(ARRAY['admin'::text, 'system_administrator'::text]));

-- RLS Policies for CPA-Client Relationships
CREATE POLICY "CPA partners can manage their client relationships" 
ON public.cpa_client_relationships 
FOR ALL 
USING (cpa_partner_id IN (
  SELECT id FROM public.cpa_partners WHERE user_id = auth.uid()
));

CREATE POLICY "Clients can view their CPA relationships" 
ON public.cpa_client_relationships 
FOR SELECT 
USING (client_user_id = auth.uid());

-- Create update triggers for timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cpa_partners_updated_at
  BEFORE UPDATE ON public.cpa_partners
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_white_label_configs_updated_at
  BEFORE UPDATE ON public.white_label_configs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_onboarding_progress_updated_at
  BEFORE UPDATE ON public.onboarding_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_migration_jobs_updated_at
  BEFORE UPDATE ON public.migration_jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_demo_data_sets_updated_at
  BEFORE UPDATE ON public.demo_data_sets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cpa_client_relationships_updated_at
  BEFORE UPDATE ON public.cpa_client_relationships
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default onboarding steps for CPA marketplace
INSERT INTO public.onboarding_steps (app_id, step_number, step_key, title, description, component_name, estimated_minutes) VALUES
('cpa_marketplace', 1, 'profile_setup', 'Complete Your Profile', 'Set up your professional profile with firm details and credentials', 'CPAProfileSetup', 10),
('cpa_marketplace', 2, 'license_verification', 'License Verification', 'Upload and verify your CPA license and certifications', 'LicenseVerification', 5),
('cpa_marketplace', 3, 'services_pricing', 'Services & Pricing', 'Configure your service offerings and pricing structure', 'ServicesPricing', 8),
('cpa_marketplace', 4, 'integration_setup', 'Software Integrations', 'Connect your existing accounting software and tools', 'IntegrationSetup', 15),
('cpa_marketplace', 5, 'white_label_config', 'White-label Portal', 'Set up your branded client portal (optional)', 'WhiteLabelConfig', 12),
('cpa_marketplace', 6, 'demo_data', 'Load Demo Data', 'Import sample client data to test the platform', 'DemoDataSetup', 7),
('cpa_marketplace', 7, 'compliance_review', 'Compliance Review', 'Review platform compliance features and policies', 'ComplianceReview', 10),
('cpa_marketplace', 8, 'go_live', 'Go Live', 'Activate your profile and start accepting clients', 'GoLive', 3);

-- Insert demo data sets
INSERT INTO public.demo_data_sets (name, description, category, data_type, demo_data) VALUES
('High Net Worth Individual', 'Complex individual return with multiple income sources', 'individual', 'tax_return', '{"name": "John & Sarah Thompson", "filing_status": "married_filing_jointly", "agi": 850000, "income_sources": ["w2", "investment", "business", "rental"], "deductions": ["mortgage_interest", "charitable", "state_taxes"], "children": 2, "retirement_accounts": ["401k", "ira", "roth_ira"]}'),
('Small Business LLC', 'Multi-member LLC with complex deductions', 'business', 'tax_return', '{"business_name": "Thompson Consulting LLC", "entity_type": "LLC", "members": 2, "revenue": 450000, "expenses": {"office_rent": 24000, "equipment": 15000, "professional_services": 8000, "marketing": 12000}, "depreciation": 5000, "payroll": 180000}'),
('Family Trust', 'Revocable family trust with multiple beneficiaries', 'estate', 'tax_return', '{"trust_name": "Thompson Family Trust", "trust_type": "revocable", "beneficiaries": 4, "assets": {"real_estate": 2500000, "investments": 1800000, "cash": 150000}, "distributions": 75000, "income": 120000}'),
('Nonprofit Organization', '501(c)(3) charitable organization', 'nonprofit', 'tax_return', '{"org_name": "Community Education Foundation", "ein": "12-3456789", "gross_receipts": 285000, "donations": 180000, "grants": 75000, "expenses": {"program": 195000, "admin": 35000, "fundraising": 25000}, "volunteers": 45}');

-- Create function to generate demo client data for CPA partners
CREATE OR REPLACE FUNCTION public.create_default_onboarding_steps(app_id TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  -- This function can be called to create default onboarding steps for new apps
  -- Implementation would insert default steps based on app_id
  NULL;
END;
$$;