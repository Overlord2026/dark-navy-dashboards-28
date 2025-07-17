-- Add tenant_invitations table to match our components
CREATE TABLE IF NOT EXISTS public.tenant_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('advisor', 'client')),
  segments TEXT[] DEFAULT '{}',
  advisor_role TEXT,
  invited_by UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '7 days'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tenant_invitations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Tenant admins can manage their invitations"
ON public.tenant_invitations
FOR ALL
USING (
  tenant_id = (
    SELECT tenant_id FROM profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'tenant_admin')
  )
);

-- Add trigger for updated_at
CREATE TRIGGER update_tenant_invitations_updated_at
  BEFORE UPDATE ON public.tenant_invitations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add tenant settings table for branding
CREATE TABLE IF NOT EXISTS public.tenant_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL UNIQUE,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#0066cc',
  secondary_color TEXT DEFAULT '#f8f9fa',
  accent_color TEXT DEFAULT '#28a745',
  custom_domain TEXT,
  subdomain TEXT,
  email_templates JSONB DEFAULT '{}',
  smtp_settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for tenant_settings
ALTER TABLE public.tenant_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for tenant_settings
CREATE POLICY "Tenant admins can manage their settings"
ON public.tenant_settings
FOR ALL
USING (
  tenant_id = (
    SELECT tenant_id FROM profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'tenant_admin')
  )
);

CREATE POLICY "Users can view their tenant settings"
ON public.tenant_settings
FOR SELECT
USING (
  tenant_id = (
    SELECT tenant_id FROM profiles 
    WHERE id = auth.uid()
  )
);

-- Add trigger for tenant_settings updated_at
CREATE TRIGGER update_tenant_settings_updated_at
  BEFORE UPDATE ON public.tenant_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add compliance_documents table
CREATE TABLE IF NOT EXISTS public.compliance_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  document_name TEXT NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN (
    'SEC_filing', 'FINRA_filing', 'ADV_form', 'compliance_manual', 
    'privacy_policy', 'terms_of_service', 'other'
  )),
  file_path TEXT,
  file_size BIGINT,
  content_type TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  uploaded_by UUID NOT NULL,
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for compliance_documents
ALTER TABLE public.compliance_documents ENABLE ROW LEVEL SECURITY;

-- Create policies for compliance_documents
CREATE POLICY "Tenant admins can manage their compliance documents"
ON public.compliance_documents
FOR ALL
USING (
  tenant_id = (
    SELECT tenant_id FROM profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'tenant_admin')
  )
);

-- Add trigger for compliance_documents updated_at
CREATE TRIGGER update_compliance_documents_updated_at
  BEFORE UPDATE ON public.compliance_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enhanced audit_logs for admin actions
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS tenant_id UUID;
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS action_category TEXT;
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS resource_id UUID;
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS resource_type TEXT;

-- Update audit_logs RLS policy
DROP POLICY IF EXISTS "Service role can manage audit logs" ON public.audit_logs;

CREATE POLICY "Tenant admins can view their audit logs"
ON public.audit_logs
FOR SELECT
USING (
  tenant_id = (
    SELECT tenant_id FROM profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'tenant_admin', 'system_administrator')
  )
  OR 
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'system_administrator'
);

CREATE POLICY "Service role can insert audit logs"
ON public.audit_logs
FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- Create function to log admin actions
CREATE OR REPLACE FUNCTION public.log_admin_action(
  p_tenant_id UUID,
  p_event_type TEXT,
  p_action_category TEXT,
  p_resource_type TEXT DEFAULT NULL,
  p_resource_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT '{}'
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.audit_logs (
    user_id,
    tenant_id,
    event_type,
    action_category,
    resource_type,
    resource_id,
    status,
    details
  ) VALUES (
    auth.uid(),
    p_tenant_id,
    p_event_type,
    p_action_category,
    p_resource_type,
    p_resource_id,
    'success',
    p_details
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;