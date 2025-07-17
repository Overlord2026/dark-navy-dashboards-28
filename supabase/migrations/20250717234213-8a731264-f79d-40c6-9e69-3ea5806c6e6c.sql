-- Create tenant feature flags table
CREATE TABLE public.tenant_feature_flags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  feature_name TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, feature_name)
);

-- Enable RLS
ALTER TABLE public.tenant_feature_flags ENABLE ROW LEVEL SECURITY;

-- Create policies for feature flags
CREATE POLICY "Tenant admins can manage their feature flags"
ON public.tenant_feature_flags
FOR ALL
USING (tenant_id = (SELECT tenant_id FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'tenant_admin')));

CREATE POLICY "Users can view their tenant feature flags"
ON public.tenant_feature_flags
FOR SELECT
USING (tenant_id = (SELECT tenant_id FROM profiles WHERE id = auth.uid()));

-- Create tenant resources table
CREATE TABLE public.tenant_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL CHECK (content_type IN ('article', 'video', 'pdf', 'webinar', 'tool')),
  resource_url TEXT,
  file_path TEXT,
  thumbnail_url TEXT,
  is_premium BOOLEAN DEFAULT false,
  is_global BOOLEAN DEFAULT false,
  is_visible BOOLEAN DEFAULT true,
  created_by UUID,
  sort_order INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  segments TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tenant_resources ENABLE ROW LEVEL SECURITY;

-- Create policies for tenant resources
CREATE POLICY "Super admins can manage all resources"
ON public.tenant_resources
FOR ALL
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'system_administrator');

CREATE POLICY "Tenant admins can manage their tenant resources"
ON public.tenant_resources
FOR ALL
USING (
  tenant_id = (SELECT tenant_id FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'tenant_admin'))
  OR (is_global = true AND (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'tenant_admin'))
);

CREATE POLICY "Users can view available resources"
ON public.tenant_resources
FOR SELECT
USING (
  is_visible = true AND (
    tenant_id = (SELECT tenant_id FROM profiles WHERE id = auth.uid())
    OR is_global = true
  )
);

-- Update investment strategies to be tenant-aware
ALTER TABLE public.investment_strategies ADD COLUMN IF NOT EXISTS is_global BOOLEAN DEFAULT false;
ALTER TABLE public.investment_strategies ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true;
ALTER TABLE public.investment_strategies ADD COLUMN IF NOT EXISTS created_by UUID;
ALTER TABLE public.investment_strategies ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Update investment strategies policies
DROP POLICY IF EXISTS "Users can view strategies in their tenant" ON public.investment_strategies;
DROP POLICY IF EXISTS "Only admins and advisors can edit investment strategies" ON public.investment_strategies;

CREATE POLICY "Super admins can manage all strategies"
ON public.investment_strategies
FOR ALL
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'system_administrator');

CREATE POLICY "Tenant admins can manage their strategies"
ON public.investment_strategies
FOR ALL
USING (
  tenant_id = (SELECT tenant_id FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'tenant_admin'))
  OR (is_global = true AND (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'tenant_admin'))
);

CREATE POLICY "Users can view available strategies"
ON public.investment_strategies
FOR SELECT
USING (
  is_visible = true AND (
    tenant_id = (SELECT tenant_id FROM profiles WHERE id = auth.uid())
    OR is_global = true
  )
);

-- Update educational content to be tenant-aware
ALTER TABLE public.educational_content ADD COLUMN IF NOT EXISTS is_global BOOLEAN DEFAULT false;
ALTER TABLE public.educational_content ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true;
ALTER TABLE public.educational_content ADD COLUMN IF NOT EXISTS created_by UUID;
ALTER TABLE public.educational_content ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
ALTER TABLE public.educational_content ADD COLUMN IF NOT EXISTS segments TEXT[] DEFAULT '{}';

-- Update educational content policies
DROP POLICY IF EXISTS "Everyone can view educational content" ON public.educational_content;

CREATE POLICY "Super admins can manage all educational content"
ON public.educational_content
FOR ALL
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'system_administrator');

CREATE POLICY "Tenant admins can manage their educational content"
ON public.educational_content
FOR ALL
USING (
  tenant_id = (SELECT tenant_id FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'tenant_admin'))
  OR (is_global = true AND (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'tenant_admin'))
);

CREATE POLICY "Users can view available educational content"
ON public.educational_content
FOR SELECT
USING (
  is_visible = true AND (
    tenant_id = (SELECT tenant_id FROM profiles WHERE id = auth.uid())
    OR is_global = true
  )
);

-- Create function to check if user has access to premium feature
CREATE OR REPLACE FUNCTION public.has_premium_access(feature_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_tenant_id UUID;
  feature_enabled BOOLEAN;
BEGIN
  -- Get user's tenant ID
  SELECT tenant_id INTO user_tenant_id
  FROM profiles
  WHERE id = auth.uid();
  
  -- Check if feature is enabled for the tenant
  SELECT enabled INTO feature_enabled
  FROM tenant_feature_flags
  WHERE tenant_id = user_tenant_id AND feature_name = $1;
  
  RETURN COALESCE(feature_enabled, false);
END;
$$;

-- Create trigger to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tenant_feature_flags_updated_at
  BEFORE UPDATE ON public.tenant_feature_flags
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tenant_resources_updated_at
  BEFORE UPDATE ON public.tenant_resources
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();