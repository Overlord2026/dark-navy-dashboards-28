-- Create onboarding applications table
CREATE TABLE public.tenant_onboarding_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_name TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  company_name TEXT NOT NULL,
  phone TEXT,
  franchise_type TEXT NOT NULL CHECK (franchise_type IN ('franchise', 'license', 'owned')),
  application_data JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'onboarding', 'completed')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  esign_url TEXT,
  esign_status TEXT DEFAULT 'pending' CHECK (esign_status IN ('pending', 'sent', 'signed', 'expired')),
  stripe_customer_id TEXT,
  billing_setup_complete BOOLEAN DEFAULT FALSE,
  tenant_id UUID REFERENCES public.tenants(id),
  admin_credentials_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tenant_onboarding_applications ENABLE ROW LEVEL SECURITY;

-- Super admins can manage all applications
CREATE POLICY "Super admins can manage onboarding applications" ON public.tenant_onboarding_applications
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'system_administrator'
  )
);

-- Applicants can view their own applications
CREATE POLICY "Applicants can view their own applications" ON public.tenant_onboarding_applications
FOR SELECT USING (applicant_email = auth.email());

-- Create onboarding workflow steps table
CREATE TABLE public.onboarding_workflow_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.tenant_onboarding_applications(id) ON DELETE CASCADE,
  step_name TEXT NOT NULL,
  step_order INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.onboarding_workflow_steps ENABLE ROW LEVEL SECURITY;

-- Super admins can manage workflow steps
CREATE POLICY "Super admins can manage workflow steps" ON public.onboarding_workflow_steps
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'system_administrator'
  )
);

-- Create temporary admin credentials table
CREATE TABLE public.tenant_admin_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.tenant_onboarding_applications(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  temp_email TEXT NOT NULL,
  temp_password TEXT NOT NULL,
  setup_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '7 days'),
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tenant_admin_credentials ENABLE ROW LEVEL SECURITY;

-- Only super admins can access credentials
CREATE POLICY "Super admins can manage admin credentials" ON public.tenant_admin_credentials
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'system_administrator'
  )
);

-- Add triggers for updated_at
CREATE TRIGGER update_tenant_onboarding_applications_updated_at
BEFORE UPDATE ON public.tenant_onboarding_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default workflow steps function
CREATE OR REPLACE FUNCTION public.create_default_onboarding_steps(app_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.onboarding_workflow_steps (application_id, step_name, step_order) VALUES
    (app_id, 'Application Review', 1),
    (app_id, 'Send License Agreement', 2),
    (app_id, 'E-Signature Collection', 3),
    (app_id, 'Billing Setup', 4),
    (app_id, 'Tenant Creation', 5),
    (app_id, 'Admin Credentials', 6),
    (app_id, 'Welcome Email', 7);
END;
$$;