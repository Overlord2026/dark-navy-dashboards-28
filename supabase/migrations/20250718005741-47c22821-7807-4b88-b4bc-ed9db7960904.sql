-- Fix infinite recursion in RLS policies by creating security definer functions

-- 1. Create security definer functions to get user info without recursion
CREATE OR REPLACE FUNCTION public.get_current_user_tenant_id()
RETURNS UUID
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT tenant_id FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.has_role(required_role TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role = required_role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.has_any_role(roles TEXT[])
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role = ANY(roles) FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_tenant_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role = ANY(ARRAY['admin', 'tenant_admin', 'system_administrator']) 
  FROM public.profiles WHERE id = auth.uid();
$$;

-- 2. Fix the profiles table RLS policy that causes infinite recursion
DROP POLICY IF EXISTS "Users can view profiles in their tenant" ON public.profiles;

CREATE POLICY "Users can view profiles in their tenant" ON public.profiles
FOR SELECT 
USING (
  auth.uid() = id OR 
  tenant_id = public.get_current_user_tenant_id()
);

-- 3. Fix other tables with profile recursion issues

-- Analytics Events
DROP POLICY IF EXISTS "Tenant users can view their events" ON public.analytics_events;
CREATE POLICY "Tenant users can view their events" ON public.analytics_events
FOR SELECT 
USING (
  tenant_id = public.get_current_user_tenant_id() OR
  public.get_current_user_role() = 'system_administrator'
);

-- CRM Integrations
DROP POLICY IF EXISTS "Super admins can manage all CRM integrations" ON public.crm_integrations;
DROP POLICY IF EXISTS "Tenant admins can manage CRM integrations" ON public.crm_integrations;

CREATE POLICY "Super admins can manage all CRM integrations" ON public.crm_integrations
FOR ALL USING (public.get_current_user_role() = 'system_administrator');

CREATE POLICY "Tenant admins can manage CRM integrations" ON public.crm_integrations
FOR ALL USING (
  tenant_id = public.get_current_user_tenant_id() AND
  public.has_any_role(ARRAY['admin', 'tenant_admin'])
);

-- Daily Analytics
DROP POLICY IF EXISTS "Tenant admins can view their analytics" ON public.daily_analytics;
CREATE POLICY "Tenant admins can view their analytics" ON public.daily_analytics
FOR SELECT USING (
  tenant_id = public.get_current_user_tenant_id() OR
  public.get_current_user_role() = 'system_administrator'
);

-- Documents
DROP POLICY IF EXISTS "Users can create documents in their tenant" ON public.documents;
DROP POLICY IF EXISTS "Users can view documents in their tenant" ON public.documents;

CREATE POLICY "Users can create documents in their tenant" ON public.documents
FOR INSERT WITH CHECK (
  user_id = auth.uid() AND
  tenant_id = public.get_current_user_tenant_id()
);

CREATE POLICY "Users can view documents in their tenant" ON public.documents
FOR SELECT USING (
  user_id = auth.uid() OR
  tenant_id = public.get_current_user_tenant_id()
);

-- Educational Content
DROP POLICY IF EXISTS "Only admins can edit educational content" ON public.educational_content;
DROP POLICY IF EXISTS "Super admins can manage all educational content" ON public.educational_content;
DROP POLICY IF EXISTS "Tenant admins can manage their educational content" ON public.educational_content;
DROP POLICY IF EXISTS "Users can view available educational content" ON public.educational_content;
DROP POLICY IF EXISTS "Users can view content in their tenant" ON public.educational_content;

CREATE POLICY "Super admins can manage all educational content" ON public.educational_content
FOR ALL USING (public.get_current_user_role() = 'system_administrator');

CREATE POLICY "Tenant admins can manage their educational content" ON public.educational_content
FOR ALL USING (
  (tenant_id = public.get_current_user_tenant_id() AND public.has_any_role(ARRAY['admin', 'tenant_admin'])) OR
  (is_global = true AND public.has_any_role(ARRAY['admin', 'tenant_admin']))
);

CREATE POLICY "Users can view available educational content" ON public.educational_content
FOR SELECT USING (
  is_visible = true AND (
    tenant_id = public.get_current_user_tenant_id() OR 
    is_global = true OR
    tenant_id IS NULL
  )
);

-- Investment Strategies
DROP POLICY IF EXISTS "Super admins can manage all strategies" ON public.investment_strategies;
DROP POLICY IF EXISTS "Tenant admins can manage their strategies" ON public.investment_strategies;
DROP POLICY IF EXISTS "Users can view available strategies" ON public.investment_strategies;

CREATE POLICY "Super admins can manage all strategies" ON public.investment_strategies
FOR ALL USING (public.get_current_user_role() = 'system_administrator');

CREATE POLICY "Tenant admins can manage their strategies" ON public.investment_strategies
FOR ALL USING (
  (tenant_id = public.get_current_user_tenant_id() AND public.has_any_role(ARRAY['admin', 'tenant_admin'])) OR
  (is_global = true AND public.has_any_role(ARRAY['admin', 'tenant_admin']))
);

CREATE POLICY "Users can view available strategies" ON public.investment_strategies
FOR SELECT USING (
  is_visible = true AND (
    tenant_id = public.get_current_user_tenant_id() OR 
    is_global = true
  )
);

-- Professionals
DROP POLICY IF EXISTS "Users can create professionals in their tenant" ON public.professionals;
DROP POLICY IF EXISTS "Users can delete professionals in their tenant" ON public.professionals;
DROP POLICY IF EXISTS "Users can update professionals in their tenant" ON public.professionals;
DROP POLICY IF EXISTS "Users can view professionals in their tenant" ON public.professionals;

CREATE POLICY "Users can create professionals in their tenant" ON public.professionals
FOR INSERT WITH CHECK (
  auth.uid() = user_id AND
  tenant_id = public.get_current_user_tenant_id()
);

CREATE POLICY "Users can delete professionals in their tenant" ON public.professionals
FOR DELETE USING (
  auth.uid() = user_id AND
  tenant_id = public.get_current_user_tenant_id()
);

CREATE POLICY "Users can update professionals in their tenant" ON public.professionals
FOR UPDATE USING (
  auth.uid() = user_id AND
  tenant_id = public.get_current_user_tenant_id()
);

CREATE POLICY "Users can view professionals in their tenant" ON public.professionals
FOR SELECT USING (
  auth.uid() = user_id OR
  tenant_id = public.get_current_user_tenant_id()
);

-- Tenant Resources
DROP POLICY IF EXISTS "Super admins can manage all resources" ON public.tenant_resources;
DROP POLICY IF EXISTS "Tenant admins can manage their tenant resources" ON public.tenant_resources;
DROP POLICY IF EXISTS "Users can view available resources" ON public.tenant_resources;

CREATE POLICY "Super admins can manage all resources" ON public.tenant_resources
FOR ALL USING (public.get_current_user_role() = 'system_administrator');

CREATE POLICY "Tenant admins can manage their tenant resources" ON public.tenant_resources
FOR ALL USING (
  (tenant_id = public.get_current_user_tenant_id() AND public.has_any_role(ARRAY['admin', 'tenant_admin'])) OR
  (is_global = true AND public.has_any_role(ARRAY['admin', 'tenant_admin']))
);

CREATE POLICY "Users can view available resources" ON public.tenant_resources
FOR SELECT USING (
  is_visible = true AND (
    tenant_id = public.get_current_user_tenant_id() OR 
    is_global = true
  )
);

-- Webhook Configs
DROP POLICY IF EXISTS "Super admins can manage all webhook configs" ON public.webhook_configs;
DROP POLICY IF EXISTS "Tenant admins can manage webhook configs" ON public.webhook_configs;

CREATE POLICY "Super admins can manage all webhook configs" ON public.webhook_configs
FOR ALL USING (public.get_current_user_role() = 'system_administrator');

CREATE POLICY "Tenant admins can manage webhook configs" ON public.webhook_configs
FOR ALL USING (
  tenant_id = public.get_current_user_tenant_id() AND
  public.has_any_role(ARRAY['admin', 'tenant_admin'])
);

-- Webhook Deliveries
DROP POLICY IF EXISTS "Super admins can view all webhook deliveries" ON public.webhook_deliveries;
DROP POLICY IF EXISTS "Tenant admins can view webhook deliveries" ON public.webhook_deliveries;

CREATE POLICY "Super admins can view all webhook deliveries" ON public.webhook_deliveries
FOR SELECT USING (public.get_current_user_role() = 'system_administrator');

CREATE POLICY "Tenant admins can view webhook deliveries" ON public.webhook_deliveries
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM webhook_configs 
    WHERE webhook_configs.id = webhook_deliveries.webhook_config_id 
    AND webhook_configs.tenant_id = public.get_current_user_tenant_id()
  ) AND public.has_any_role(ARRAY['admin', 'tenant_admin'])
);

-- Tracked Events
DROP POLICY IF EXISTS "Users can view their tenant events" ON public.tracked_events;
CREATE POLICY "Users can view their tenant events" ON public.tracked_events
FOR SELECT USING (
  tenant_id = public.get_current_user_tenant_id() OR
  public.get_current_user_role() = 'system_administrator'
);

-- Fix remaining policies that reference profiles table
DROP POLICY IF EXISTS "Admins can create applications in their tenant" ON public.advisor_applications;
CREATE POLICY "Admins can create applications in their tenant" ON public.advisor_applications
FOR INSERT WITH CHECK (
  public.has_any_role(ARRAY['admin', 'system_administrator', 'tenant_administrator']) AND
  (tenant_id = public.get_current_user_tenant_id() OR public.get_current_user_role() = 'system_administrator')
);

DROP POLICY IF EXISTS "Admins can view applications in their tenant" ON public.advisor_applications;
CREATE POLICY "Admins can view applications in their tenant" ON public.advisor_applications
FOR SELECT USING (
  public.has_any_role(ARRAY['admin', 'system_administrator', 'tenant_administrator']) AND
  (tenant_id = public.get_current_user_tenant_id() OR public.get_current_user_role() = 'system_administrator')
);

DROP POLICY IF EXISTS "Only advisors can create assignments" ON public.advisor_assignments;
CREATE POLICY "Only advisors can create assignments" ON public.advisor_assignments
FOR INSERT WITH CHECK (public.has_role('advisor'));

DROP POLICY IF EXISTS "Only advisors can update assignments" ON public.advisor_assignments;
CREATE POLICY "Only advisors can update assignments" ON public.advisor_assignments
FOR UPDATE USING (public.has_role('advisor'));

-- Strategy Educational Content
DROP POLICY IF EXISTS "Only admins can manage strategy content links" ON public.strategy_educational_content;
CREATE POLICY "Only admins can manage strategy content links" ON public.strategy_educational_content
FOR ALL USING (public.has_any_role(ARRAY['admin', 'system_administrator']));

-- Strategy Engagement Tracking
DROP POLICY IF EXISTS "Admins and advisors can view all engagements" ON public.strategy_engagement_tracking;
CREATE POLICY "Admins and advisors can view all engagements" ON public.strategy_engagement_tracking
FOR SELECT USING (public.has_any_role(ARRAY['admin', 'advisor', 'system_administrator']));

-- Tenant Admin Credentials
DROP POLICY IF EXISTS "Super admins can manage admin credentials" ON public.tenant_admin_credentials;
CREATE POLICY "Super admins can manage admin credentials" ON public.tenant_admin_credentials
FOR ALL USING (public.has_role('system_administrator'));

-- Tenant Feature Flags
DROP POLICY IF EXISTS "Tenant admins can manage their feature flags" ON public.tenant_feature_flags;
CREATE POLICY "Tenant admins can manage their feature flags" ON public.tenant_feature_flags
FOR ALL USING (
  tenant_id = public.get_current_user_tenant_id() AND
  public.has_any_role(ARRAY['admin', 'tenant_admin'])
);

DROP POLICY IF EXISTS "Users can view their tenant feature flags" ON public.tenant_feature_flags;
CREATE POLICY "Users can view their tenant feature flags" ON public.tenant_feature_flags
FOR SELECT USING (tenant_id = public.get_current_user_tenant_id());

-- Grant execute permissions on the security definer functions
GRANT EXECUTE ON FUNCTION public.get_current_user_tenant_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_user_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_any_role(TEXT[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_tenant_admin() TO authenticated;