-- Create base organization structure first
CREATE TYPE organization_type AS ENUM ('broker_dealer', 'ria', 'insurance_agency', 'law_firm', 'accounting_firm', 'family_office', 'wealth_management', 'financial_planning');
CREATE TYPE admin_role AS ENUM ('admin', 'sub_admin', 'billing_admin', 'compliance_officer', 'branch_manager');

-- Base organizations table
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  organization_type organization_type NOT NULL,
  total_seats_purchased INTEGER NOT NULL DEFAULT 0,
  seats_in_use INTEGER NOT NULL DEFAULT 0,
  subscription_status TEXT NOT NULL DEFAULT 'trial',
  billing_email TEXT,
  marketplace_visibility BOOLEAN DEFAULT false,
  branding_enabled BOOLEAN DEFAULT false,
  custom_domain TEXT,
  primary_color TEXT,
  secondary_color TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Organization admins
CREATE TABLE public.organization_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role admin_role NOT NULL DEFAULT 'admin',
  permissions JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  invited_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(organization_id, user_id)
);

-- Organization branches
CREATE TABLE public.organization_branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  branch_name TEXT NOT NULL,
  branch_code TEXT,
  manager_id UUID REFERENCES auth.users(id),
  seat_allocation INTEGER DEFAULT 0,
  address JSONB DEFAULT '{}'::jsonb,
  contact_info JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_branches ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Organization admins can view their org" ON public.organizations
  FOR SELECT USING (
    id IN (
      SELECT organization_id FROM public.organization_admins 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Organization admins can manage their org" ON public.organizations
  FOR ALL USING (
    id IN (
      SELECT organization_id FROM public.organization_admins 
      WHERE user_id = auth.uid() AND is_active = true AND role = 'admin'
    )
  );

CREATE POLICY "Organization admins can view admin records" ON public.organization_admins
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_admins 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Organization admins can manage admin records" ON public.organization_admins
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_admins 
      WHERE user_id = auth.uid() AND is_active = true AND role = 'admin'
    )
  );

CREATE POLICY "Organization members can view branches" ON public.organization_branches
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_admins 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Organization admins can manage branches" ON public.organization_branches
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_admins 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- Create indexes
CREATE INDEX idx_organizations_type ON public.organizations(organization_type);
CREATE INDEX idx_organization_admins_org_id ON public.organization_admins(organization_id);
CREATE INDEX idx_organization_admins_user_id ON public.organization_admins(user_id);
CREATE INDEX idx_organization_branches_org_id ON public.organization_branches(organization_id);

-- Helper function for getting current user's tenant
CREATE OR REPLACE FUNCTION public.get_current_user_organization_id()
RETURNS UUID AS $$
  SELECT organization_id FROM public.organization_admins 
  WHERE user_id = auth.uid() AND is_active = true 
  LIMIT 1;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Update timestamp triggers
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_organization_admins_updated_at
  BEFORE UPDATE ON public.organization_admins
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_organization_branches_updated_at
  BEFORE UPDATE ON public.organization_branches
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();