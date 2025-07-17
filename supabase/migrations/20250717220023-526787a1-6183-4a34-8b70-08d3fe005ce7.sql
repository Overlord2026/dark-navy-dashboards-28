-- Phase 1: Core Tenant Infrastructure

-- Create tenants table
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand_logo_url TEXT,
  color_palette JSONB DEFAULT '{"primary": "#1F1F1F", "accent": "#FFD700", "secondary": "#F5F5F5"}'::jsonb,
  domain TEXT,
  billing_status TEXT DEFAULT 'trial' CHECK (billing_status IN ('trial', 'active', 'delinquent', 'suspended')),
  franchisee_status TEXT DEFAULT 'owned' CHECK (franchisee_status IN ('owned', 'licensed', 'franchisee')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  owner_id UUID,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended'))
);

-- Create tenant_licenses table
CREATE TABLE public.tenant_licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  agreement_url TEXT,
  license_type TEXT CHECK (license_type IN ('franchise', 'license', 'owned')),
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'expired', 'terminated')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create tenant_settings table for white-label configuration
CREATE TABLE public.tenant_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE UNIQUE,
  branding_config JSONB DEFAULT '{}'::jsonb,
  feature_flags JSONB DEFAULT '{}'::jsonb,
  email_templates JSONB DEFAULT '{}'::jsonb,
  custom_css TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create advisor_applications table
CREATE TABLE public.advisor_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  specialty TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined', 'withdrawn')),
  application_form_url TEXT,
  notes TEXT,
  applied_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID
);

-- Add tenant_id to existing profiles table
ALTER TABLE public.profiles ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);

-- Add tenant_id to investment_strategies table
ALTER TABLE public.investment_strategies ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);

-- Add tenant_id to documents table  
ALTER TABLE public.documents ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);

-- Add tenant_id to educational_content table
ALTER TABLE public.educational_content ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);

-- Create default tenant for existing data
INSERT INTO public.tenants (id, name, billing_status, franchisee_status, status)
VALUES ('00000000-0000-0000-0000-000000000001', 'Boutique Family Office', 'active', 'owned', 'active');

-- Update existing profiles to use default tenant
UPDATE public.profiles SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;

-- Update existing investment_strategies to use default tenant
UPDATE public.investment_strategies SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;

-- Update existing documents to use default tenant
UPDATE public.documents SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;

-- Update existing educational_content to use default tenant
UPDATE public.educational_content SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;

-- Create triggers for updated_at
CREATE TRIGGER update_tenants_updated_at
  BEFORE UPDATE ON public.tenants
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tenant_licenses_updated_at
  BEFORE UPDATE ON public.tenant_licenses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tenant_settings_updated_at
  BEFORE UPDATE ON public.tenant_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS on new tables
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisor_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tenants (only superadmins and tenant owners can manage)
CREATE POLICY "Superadmins can view all tenants" ON public.tenants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'superadmin'
    )
  );

CREATE POLICY "Tenant owners can view their tenant" ON public.tenants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.tenant_id = tenants.id 
      AND profiles.role IN ('tenant_admin', 'superadmin')
    )
  );

CREATE POLICY "Superadmins can manage all tenants" ON public.tenants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'superadmin'
    )
  );

-- RLS Policies for tenant_licenses
CREATE POLICY "Tenant admins can view their licenses" ON public.tenant_licenses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.tenant_id = tenant_licenses.tenant_id
      AND profiles.role IN ('tenant_admin', 'superadmin')
    )
  );

CREATE POLICY "Superadmins can manage all licenses" ON public.tenant_licenses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'superadmin'
    )
  );

-- RLS Policies for tenant_settings
CREATE POLICY "Tenant admins can manage their settings" ON public.tenant_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.tenant_id = tenant_settings.tenant_id
      AND profiles.role IN ('tenant_admin', 'superadmin')
    )
  );

-- RLS Policies for advisor_applications
CREATE POLICY "Tenant admins can manage applications for their tenant" ON public.advisor_applications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.tenant_id = advisor_applications.tenant_id
      AND profiles.role IN ('tenant_admin', 'superadmin')
    )
  );

-- Update existing RLS policies to include tenant isolation
-- Update profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can view profiles in their tenant" ON public.profiles
  FOR SELECT USING (
    auth.uid() = id OR 
    (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()))
  );

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Update investment_strategies policies to include tenant isolation
DROP POLICY IF EXISTS "Everyone can view investment strategies" ON public.investment_strategies;

CREATE POLICY "Users can view strategies in their tenant" ON public.investment_strategies
  FOR SELECT USING (
    tenant_id IS NULL OR 
    tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
  );

-- Update documents policies to include tenant isolation  
DROP POLICY IF EXISTS "Users can view their own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can create their own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can update their own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can delete their own documents" ON public.documents;

CREATE POLICY "Users can view documents in their tenant" ON public.documents
  FOR SELECT USING (
    user_id = auth.uid() OR
    (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()))
  );

CREATE POLICY "Users can create documents in their tenant" ON public.documents
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can update their own documents" ON public.documents
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own documents" ON public.documents
  FOR DELETE USING (user_id = auth.uid());