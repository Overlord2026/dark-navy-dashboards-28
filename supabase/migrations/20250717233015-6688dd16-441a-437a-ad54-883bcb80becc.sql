-- Create tenants table
CREATE TABLE public.tenants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand_logo_url TEXT,
  color_palette JSONB DEFAULT '{"primary": "#1F1F1F", "accent": "#FFD700", "secondary": "#F5F5F5"}'::jsonb,
  domain TEXT,
  billing_status TEXT DEFAULT 'active' CHECK (billing_status IN ('active', 'trial', 'delinquent', 'suspended')),
  franchisee_status TEXT DEFAULT 'owned' CHECK (franchisee_status IN ('owned', 'licensed', 'franchisee')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  owner_id UUID
);

-- Enable RLS on tenants
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

-- Create policies for tenants table
CREATE POLICY "Super admins can manage all tenants" ON public.tenants
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'system_administrator'
  )
);

CREATE POLICY "Tenant admins can view their own tenant" ON public.tenants
FOR SELECT USING (
  id = (
    SELECT profiles.tenant_id 
    FROM public.profiles 
    WHERE profiles.id = auth.uid()
  )
);

-- Add tenant_id to profiles table (this is our main user table)
ALTER TABLE public.profiles ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);

-- Add tenant_id to other key tables
ALTER TABLE public.professionals ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.investment_strategies ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.educational_content ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.advisor_applications ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);

-- Create a default tenant for existing data
INSERT INTO public.tenants (id, name, billing_status, franchisee_status)
VALUES ('00000000-0000-0000-0000-000000000001', 'Default Organization', 'active', 'owned');

-- Update existing profiles to belong to default tenant
UPDATE public.profiles SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;

-- Update existing professionals to belong to default tenant
UPDATE public.professionals SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;

-- Update existing investment strategies to belong to default tenant  
UPDATE public.investment_strategies SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;

-- Update existing educational content to belong to default tenant
UPDATE public.educational_content SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;

-- Update existing advisor applications to belong to default tenant
UPDATE public.advisor_applications SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;

-- Update RLS policies to be tenant-aware
DROP POLICY IF EXISTS "Users can view their own professionals" ON public.professionals;
CREATE POLICY "Users can view professionals in their tenant" ON public.professionals
FOR SELECT USING (
  auth.uid() = user_id OR 
  tenant_id = (SELECT profiles.tenant_id FROM public.profiles WHERE profiles.id = auth.uid())
);

DROP POLICY IF EXISTS "Users can create their own professionals" ON public.professionals;
CREATE POLICY "Users can create professionals in their tenant" ON public.professionals
FOR INSERT WITH CHECK (
  auth.uid() = user_id AND 
  tenant_id = (SELECT profiles.tenant_id FROM public.profiles WHERE profiles.id = auth.uid())
);

DROP POLICY IF EXISTS "Users can update their own professionals" ON public.professionals;
CREATE POLICY "Users can update professionals in their tenant" ON public.professionals
FOR UPDATE USING (
  auth.uid() = user_id AND 
  tenant_id = (SELECT profiles.tenant_id FROM public.profiles WHERE profiles.id = auth.uid())
);

DROP POLICY IF EXISTS "Users can delete their own professionals" ON public.professionals;
CREATE POLICY "Users can delete professionals in their tenant" ON public.professionals
FOR DELETE USING (
  auth.uid() = user_id AND 
  tenant_id = (SELECT profiles.tenant_id FROM public.profiles WHERE profiles.id = auth.uid())
);

-- Update investment strategies RLS to be tenant-aware
DROP POLICY IF EXISTS "Users can view strategies in their tenant" ON public.investment_strategies;
CREATE POLICY "Users can view strategies in their tenant" ON public.investment_strategies
FOR SELECT USING (
  tenant_id IS NULL OR 
  tenant_id = (SELECT profiles.tenant_id FROM public.profiles WHERE profiles.id = auth.uid())
);

-- Update educational content RLS to be tenant-aware
DROP POLICY IF EXISTS "Educational content is viewable by everyone" ON public.educational_content;
CREATE POLICY "Users can view content in their tenant" ON public.educational_content
FOR SELECT USING (
  tenant_id IS NULL OR 
  tenant_id = (SELECT profiles.tenant_id FROM public.profiles WHERE profiles.id = auth.uid())
);

-- Update advisor applications RLS to be tenant-aware
DROP POLICY IF EXISTS "Advisor applications are viewable by admins" ON public.advisor_applications;
CREATE POLICY "Admins can view applications in their tenant" ON public.advisor_applications
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'system_administrator', 'tenant_administrator')
    AND (profiles.tenant_id = advisor_applications.tenant_id OR profiles.role = 'system_administrator')
  )
);

CREATE POLICY "Admins can create applications in their tenant" ON public.advisor_applications
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'system_administrator', 'tenant_administrator')
    AND (profiles.tenant_id = advisor_applications.tenant_id OR profiles.role = 'system_administrator')
  )
);

-- Create trigger to update updated_at on tenants
CREATE TRIGGER update_tenants_updated_at
BEFORE UPDATE ON public.tenants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();