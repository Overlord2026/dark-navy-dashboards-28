-- Create partner_applications table
CREATE TABLE public.partner_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_name TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE NULL,
  compliance_status TEXT NOT NULL DEFAULT 'pending',
  onboarding_docs TEXT[] DEFAULT '{}',
  business_type TEXT,
  license_number TEXT,
  website_url TEXT,
  contact_person TEXT,
  phone TEXT,
  address JSONB,
  loan_products TEXT[],
  minimum_loan_amount NUMERIC,
  maximum_loan_amount NUMERIC,
  tenant_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create loan_documents table
CREATE TABLE public.loan_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  loan_id UUID,
  user_id UUID NOT NULL,
  doc_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT,
  file_size BIGINT,
  status TEXT NOT NULL DEFAULT 'pending',
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  verified_at TIMESTAMP WITH TIME ZONE NULL,
  verified_by UUID NULL,
  expiry_date DATE NULL,
  notes TEXT,
  tenant_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create compliance_checks table
CREATE TABLE public.compliance_checks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  check_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  performed_by UUID,
  performed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  compliance_data JSONB DEFAULT '{}',
  risk_score INTEGER,
  expiry_date DATE,
  tenant_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage bucket for lending documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('lending-documents', 'lending-documents', false);

-- Enable RLS on all tables
ALTER TABLE public.partner_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_checks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for partner_applications
CREATE POLICY "Partners can view their own applications" 
ON public.partner_applications 
FOR SELECT 
USING (email = (SELECT users.email FROM auth.users WHERE users.id = auth.uid()));

CREATE POLICY "Anyone can create partner applications" 
ON public.partner_applications 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can manage all partner applications" 
ON public.partner_applications 
FOR ALL 
USING (has_any_role(ARRAY['admin', 'tenant_admin', 'system_administrator']));

-- RLS Policies for loan_documents
CREATE POLICY "Users can manage their own loan documents" 
ON public.loan_documents 
FOR ALL 
USING (user_id = auth.uid());

CREATE POLICY "Advisors can view client loan documents" 
ON public.loan_documents 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM advisor_assignments aa 
    WHERE aa.client_id = loan_documents.user_id 
    AND aa.advisor_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all loan documents" 
ON public.loan_documents 
FOR ALL 
USING (has_any_role(ARRAY['admin', 'tenant_admin', 'system_administrator']));

-- RLS Policies for compliance_checks
CREATE POLICY "Users can view compliance checks for their entities" 
ON public.compliance_checks 
FOR SELECT 
USING (
  (entity_type = 'user' AND entity_id = auth.uid()) OR
  (entity_type = 'partner_application' AND EXISTS (
    SELECT 1 FROM partner_applications pa 
    WHERE pa.id = compliance_checks.entity_id 
    AND pa.email = (SELECT users.email FROM auth.users WHERE users.id = auth.uid())
  )) OR
  has_any_role(ARRAY['admin', 'tenant_admin', 'system_administrator'])
);

CREATE POLICY "Admins can manage compliance checks" 
ON public.compliance_checks 
FOR ALL 
USING (has_any_role(ARRAY['admin', 'tenant_admin', 'system_administrator']));

-- Storage policies for lending documents
CREATE POLICY "Users can upload their own lending documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'lending-documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own lending documents" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'lending-documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Advisors can view client lending documents" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'lending-documents' AND 
  EXISTS (
    SELECT 1 FROM advisor_assignments aa 
    WHERE aa.client_id::text = (storage.foldername(name))[1] 
    AND aa.advisor_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all lending documents" 
ON storage.objects 
FOR ALL 
USING (
  bucket_id = 'lending-documents' AND 
  has_any_role(ARRAY['admin', 'tenant_admin', 'system_administrator'])
);

-- Add update triggers for timestamps
CREATE TRIGGER update_partner_applications_updated_at
  BEFORE UPDATE ON public.partner_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_loan_documents_updated_at
  BEFORE UPDATE ON public.loan_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_compliance_checks_updated_at
  BEFORE UPDATE ON public.compliance_checks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add audit logging triggers
CREATE TRIGGER audit_partner_applications
  AFTER INSERT OR UPDATE OR DELETE ON public.partner_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.log_product_changes();

CREATE TRIGGER audit_loan_documents
  AFTER INSERT OR UPDATE OR DELETE ON public.loan_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.log_product_changes();

CREATE TRIGGER audit_compliance_checks
  AFTER INSERT OR UPDATE OR DELETE ON public.compliance_checks
  FOR EACH ROW
  EXECUTE FUNCTION public.log_product_changes();

-- Create indexes for performance
CREATE INDEX idx_partner_applications_email ON public.partner_applications(email);
CREATE INDEX idx_partner_applications_status ON public.partner_applications(status);
CREATE INDEX idx_loan_documents_user_id ON public.loan_documents(user_id);
CREATE INDEX idx_loan_documents_loan_id ON public.loan_documents(loan_id);
CREATE INDEX idx_compliance_checks_entity ON public.compliance_checks(entity_type, entity_id);
CREATE INDEX idx_compliance_checks_status ON public.compliance_checks(status);

-- Create function for partner onboarding workflow
CREATE OR REPLACE FUNCTION public.process_partner_application(
  p_application_id UUID,
  p_action TEXT,
  p_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  app_record RECORD;
BEGIN
  -- Get application details
  SELECT * INTO app_record 
  FROM public.partner_applications 
  WHERE id = p_application_id;
  
  IF app_record IS NULL THEN
    RAISE EXCEPTION 'Partner application not found';
  END IF;
  
  -- Process based on action
  CASE p_action
    WHEN 'approve' THEN
      UPDATE public.partner_applications 
      SET 
        status = 'approved',
        approved_at = now(),
        compliance_status = 'approved',
        updated_at = now()
      WHERE id = p_application_id;
      
      -- Create compliance check record
      INSERT INTO public.compliance_checks (
        entity_type, entity_id, check_type, status, 
        performed_by, notes
      ) VALUES (
        'partner_application', p_application_id, 'initial_approval',
        'passed', auth.uid(), COALESCE(p_notes, 'Application approved')
      );
      
    WHEN 'reject' THEN
      UPDATE public.partner_applications 
      SET 
        status = 'rejected',
        compliance_status = 'failed',
        updated_at = now()
      WHERE id = p_application_id;
      
      -- Create compliance check record
      INSERT INTO public.compliance_checks (
        entity_type, entity_id, check_type, status, 
        performed_by, notes
      ) VALUES (
        'partner_application', p_application_id, 'initial_review',
        'failed', auth.uid(), COALESCE(p_notes, 'Application rejected')
      );
      
    WHEN 'request_documents' THEN
      UPDATE public.partner_applications 
      SET 
        status = 'pending_documents',
        updated_at = now()
      WHERE id = p_application_id;
      
    ELSE
      RAISE EXCEPTION 'Invalid action: %', p_action;
  END CASE;
  
  RETURN TRUE;
END;
$$;