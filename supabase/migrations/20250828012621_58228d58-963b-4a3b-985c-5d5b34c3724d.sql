-- Security Enhancement S2: Enable RLS on unprotected AIES tables
-- These tables contain sensitive AI policy and consent data that needs proper access control

-- 1. Enable RLS on aies_consent_grants table
ALTER TABLE public.aies_consent_grants ENABLE ROW LEVEL SECURITY;

-- Create policies for aies_consent_grants (users can only access their own consent grants)
CREATE POLICY "Users can view their own consent grants" 
ON public.aies_consent_grants 
FOR SELECT 
USING (auth.uid() = subject_user_id);

CREATE POLICY "Users can create their own consent grants" 
ON public.aies_consent_grants 
FOR INSERT 
WITH CHECK (auth.uid() = subject_user_id);

CREATE POLICY "Users can update their own consent grants" 
ON public.aies_consent_grants 
FOR UPDATE 
USING (auth.uid() = subject_user_id)
WITH CHECK (auth.uid() = subject_user_id);

-- Admins can manage all consent grants
CREATE POLICY "Admins can manage all consent grants" 
ON public.aies_consent_grants 
FOR ALL 
USING (public.has_any_role(ARRAY['admin', 'system_administrator']));

-- 2. Enable RLS on aies_policies table
ALTER TABLE public.aies_policies ENABLE ROW LEVEL SECURITY;

-- Policies are read-only for most users, writable by admins only
CREATE POLICY "Anyone can view active policies" 
ON public.aies_policies 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can create policies" 
ON public.aies_policies 
FOR INSERT 
WITH CHECK (public.has_any_role(ARRAY['admin', 'system_administrator']));

CREATE POLICY "Only admins can update policies" 
ON public.aies_policies 
FOR UPDATE 
USING (public.has_any_role(ARRAY['admin', 'system_administrator']))
WITH CHECK (public.has_any_role(ARRAY['admin', 'system_administrator']));

CREATE POLICY "Only admins can delete policies" 
ON public.aies_policies 
FOR DELETE 
USING (public.has_any_role(ARRAY['admin', 'system_administrator']));

-- 3. Enable RLS on aies_connector_health table
ALTER TABLE public.aies_connector_health ENABLE ROW LEVEL SECURITY;

-- Connector health is viewable by authenticated users, manageable by admins
CREATE POLICY "Authenticated users can view connector health" 
ON public.aies_connector_health 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can manage connector health" 
ON public.aies_connector_health 
FOR ALL 
USING (public.has_any_role(ARRAY['admin', 'system_administrator']))
WITH CHECK (public.has_any_role(ARRAY['admin', 'system_administrator']));

-- Create audit trail for these security changes
INSERT INTO public.security_audit_logs (
  user_id,
  event_type,
  severity,
  resource_type,
  action_performed,
  metadata
) VALUES (
  auth.uid(),
  'rls_policy_creation',
  'info',
  'aies_tables',
  'enabled_rls_on_aies_tables',
  jsonb_build_object(
    'tables', ARRAY['aies_consent_grants', 'aies_policies', 'aies_connector_health'],
    'security_enhancement', 'S2',
    'timestamp', now()
  )
);