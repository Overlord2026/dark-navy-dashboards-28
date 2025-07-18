-- Fix critical tenant isolation security gaps (final corrected version)

-- 1. Make tenant_id NOT NULL for critical tables
-- First update any NULL values to a default tenant
UPDATE public.professionals SET tenant_id = (SELECT id FROM public.tenants ORDER BY created_at LIMIT 1) WHERE tenant_id IS NULL;
UPDATE public.documents SET tenant_id = (SELECT id FROM public.tenants ORDER BY created_at LIMIT 1) WHERE tenant_id IS NULL;
UPDATE public.investment_strategies SET tenant_id = (SELECT id FROM public.tenants ORDER BY created_at LIMIT 1) WHERE tenant_id IS NULL;
UPDATE public.educational_content SET tenant_id = (SELECT id FROM public.tenants ORDER BY created_at LIMIT 1) WHERE tenant_id IS NULL;

-- Now make them NOT NULL
ALTER TABLE public.professionals ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.documents ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.investment_strategies ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE public.educational_content ALTER COLUMN tenant_id SET NOT NULL;

-- 2. Fix document policies to enforce tenant isolation on updates/deletes
DROP POLICY IF EXISTS "Users can delete their own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can update their own documents" ON public.documents;

CREATE POLICY "Users can delete their own documents in their tenant" 
ON public.documents FOR DELETE 
USING (user_id = auth.uid() AND tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can update their own documents in their tenant" 
ON public.documents FOR UPDATE 
USING (user_id = auth.uid() AND tenant_id = get_current_user_tenant_id());

-- 3. Fix profiles policy to prevent cross-tenant viewing
DROP POLICY IF EXISTS "Users can view profiles in their tenant" ON public.profiles;

CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Tenant admins can view profiles in their tenant" 
ON public.profiles FOR SELECT 
USING (
  tenant_id = get_current_user_tenant_id() 
  AND has_any_role(ARRAY['admin', 'tenant_admin', 'system_administrator'])
);

-- 4. Tighten educational content policy
DROP POLICY IF EXISTS "Users can view available educational content" ON public.educational_content;

CREATE POLICY "Users can view educational content for their tenant" 
ON public.educational_content FOR SELECT 
USING (
  is_visible = true 
  AND tenant_id = get_current_user_tenant_id()
);

-- 5. Fix training modules policy
DROP POLICY IF EXISTS "Users can view published training modules in their tenant" ON public.training_modules;

CREATE POLICY "Users can view training modules for their tenant" 
ON public.training_modules FOR SELECT 
USING (
  is_published = true 
  AND (tenant_id = get_current_user_tenant_id() OR tenant_id IS NULL)
);