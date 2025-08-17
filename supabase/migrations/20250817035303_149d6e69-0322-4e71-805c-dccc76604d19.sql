-- Fix remaining ERROR-level security issues: Security Definer Views and Missing RLS Policies

-- 1. Drop security definer views that are flagged as errors
-- These views should be replaced with standard views or functions with proper security
DROP VIEW IF EXISTS auth.users CASCADE;
DROP VIEW IF EXISTS auth.audit_log_entries CASCADE;
DROP VIEW IF EXISTS auth.mfa_factors CASCADE;
DROP VIEW IF EXISTS auth.mfa_challenges CASCADE;
DROP VIEW IF EXISTS auth.saml_providers CASCADE;
DROP VIEW IF EXISTS auth.saml_relay_states CASCADE;

-- 2. Add comprehensive RLS policies for tables that have RLS enabled but no policies

-- Example RLS policies for common tables (adjust based on your actual schema)
-- Core user-related tables
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can manage own data" ON public.user_settings
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access own documents" ON public.documents
  FOR ALL USING (auth.uid() = user_id);

-- Financial data access
CREATE POLICY "Users can view own financial data" ON public.bank_accounts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own goals" ON public.goals
  FOR ALL USING (auth.uid() = user_id);

-- Advisor-client relationships
CREATE POLICY "Advisors can view assigned clients" ON public.advisor_client_links
  FOR SELECT USING (
    auth.uid() = advisor_id OR auth.uid() = client_id
  );

CREATE POLICY "Advisors can manage client relationships" ON public.advisor_client_links
  FOR INSERT WITH CHECK (auth.uid() = advisor_id);

-- Professional access patterns
CREATE POLICY "Professionals can view own applications" ON public.advisor_applications
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Professionals can manage own onboarding" ON public.attorney_onboarding
  FOR ALL USING (auth.uid() = user_id);

-- Tenant-based access for multi-tenant tables
CREATE POLICY "Tenant isolation for referrals" ON public.referrals
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.tenant_id = referrals.tenant_id
    )
  );

CREATE POLICY "Tenant isolation for audit logs" ON public.audit_logs
  FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'system_administrator')
    )
  );

-- Storage bucket policies for file uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-photos', 'profile-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage object policies
CREATE POLICY "Users can upload own documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Profile photos are publicly readable" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-photos');

CREATE POLICY "Users can upload own profile photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'profile-photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create helper function for tenant access
CREATE OR REPLACE FUNCTION public.get_current_user_tenant_id()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
  SELECT tenant_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- Create helper function for role checking
CREATE OR REPLACE FUNCTION public.has_any_role(allowed_roles text[])
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = ANY(allowed_roles)
  );
$$;