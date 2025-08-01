-- Create attorney onboarding tables
CREATE TABLE public.attorney_onboarding (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tenant_id UUID,
  
  -- Step 1: Profile Information
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  office_address JSONB,
  firm_name TEXT,
  firm_website TEXT,
  attorney_bio TEXT,
  
  -- Step 2: Credentials & Bar Licenses
  bar_number TEXT,
  primary_jurisdiction TEXT,
  jurisdictions_licensed TEXT[],
  admission_dates JSONB, -- {"state": "date"} format
  bar_status TEXT DEFAULT 'active', -- active, inactive, suspended
  
  -- Step 3: CLE History
  cle_hours_completed INTEGER DEFAULT 0,
  cle_hours_required INTEGER DEFAULT 20,
  cle_expiration_date DATE,
  cle_compliance_status TEXT DEFAULT 'pending', -- pending, compliant, overdue
  
  -- Step 4: Practice Areas
  primary_practice_area TEXT,
  practice_areas TEXT[],
  years_experience INTEGER,
  specializations TEXT[],
  
  -- Step 5: Fee Structure
  hourly_rate NUMERIC,
  consultation_fee NUMERIC,
  billing_method TEXT, -- hourly, flat_fee, contingency, hybrid
  retainer_required BOOLEAN DEFAULT false,
  typical_retainer_amount NUMERIC,
  
  -- Onboarding Progress
  current_step INTEGER DEFAULT 1,
  steps_completed INTEGER[] DEFAULT '{}',
  onboarding_status TEXT DEFAULT 'in_progress', -- in_progress, completed, approved, rejected
  progress_percentage INTEGER DEFAULT 0,
  
  -- Document Uploads
  bar_license_urls TEXT[],
  insurance_certificate_url TEXT,
  cv_resume_url TEXT,
  law_school_diploma_url TEXT,
  additional_certifications_urls TEXT[],
  
  -- Agreements & Signatures
  nda_signed BOOLEAN DEFAULT false,
  nda_signed_at TIMESTAMP WITH TIME ZONE,
  participation_agreement_signed BOOLEAN DEFAULT false,
  participation_agreement_signed_at TIMESTAMP WITH TIME ZONE,
  terms_accepted BOOLEAN DEFAULT false,
  terms_accepted_at TIMESTAMP WITH TIME ZONE,
  
  -- Verification
  bar_verification_status TEXT DEFAULT 'pending', -- pending, verified, failed
  bar_verification_data JSONB,
  background_check_status TEXT DEFAULT 'pending',
  reference_check_status TEXT DEFAULT 'pending',
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  submitted_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID,
  
  CONSTRAINT fk_attorney_onboarding_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.attorney_onboarding ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own onboarding" 
ON public.attorney_onboarding 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all onboarding applications" 
ON public.attorney_onboarding 
FOR SELECT 
USING (has_any_role(ARRAY['admin', 'system_administrator', 'tenant_admin']));

CREATE POLICY "Admins can update onboarding status" 
ON public.attorney_onboarding 
FOR UPDATE 
USING (has_any_role(ARRAY['admin', 'system_administrator', 'tenant_admin']));

-- Create attorney practice area reference table
CREATE TABLE public.attorney_practice_areas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert standard practice areas
INSERT INTO public.attorney_practice_areas (name, category, description) VALUES
('Estate Planning', 'Personal', 'Wills, trusts, and estate administration'),
('Trust & Asset Protection', 'Personal', 'Asset protection strategies and trust planning'),
('Business Law', 'Business', 'Business formation, contracts, and corporate law'),
('Real Estate Law', 'Property', 'Real estate transactions and property law'),
('Elder Law', 'Personal', 'Legal issues affecting older adults'),
('Family Law', 'Personal', 'Divorce, custody, and family legal matters'),
('Tax Law', 'Tax', 'Tax planning and compliance'),
('Probate Law', 'Personal', 'Probate administration and litigation'),
('Corporate Law', 'Business', 'Corporate governance and compliance'),
('Employment Law', 'Business', 'Employment contracts and workplace issues');

-- Create attorney document uploads table
CREATE TABLE public.attorney_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  onboarding_id UUID NOT NULL,
  document_type TEXT NOT NULL, -- 'bar_license', 'insurance', 'resume', 'diploma', 'certification'
  document_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  upload_status TEXT DEFAULT 'uploaded', -- uploaded, verified, rejected
  verification_notes TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID,
  
  CONSTRAINT fk_attorney_documents_onboarding FOREIGN KEY (onboarding_id) REFERENCES public.attorney_onboarding(id) ON DELETE CASCADE
);

-- Enable RLS for documents
ALTER TABLE public.attorney_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their onboarding documents" 
ON public.attorney_documents 
FOR ALL 
USING (
  onboarding_id IN (
    SELECT id FROM public.attorney_onboarding WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all attorney documents" 
ON public.attorney_documents 
FOR SELECT 
USING (has_any_role(ARRAY['admin', 'system_administrator', 'tenant_admin']));

-- Create attorney onboarding status log
CREATE TABLE public.attorney_onboarding_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  onboarding_id UUID NOT NULL,
  previous_status TEXT,
  new_status TEXT,
  step_completed INTEGER,
  notes TEXT,
  created_by UUID,
  automated BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  CONSTRAINT fk_attorney_log_onboarding FOREIGN KEY (onboarding_id) REFERENCES public.attorney_onboarding(id) ON DELETE CASCADE
);

-- Enable RLS for status log
ALTER TABLE public.attorney_onboarding_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their onboarding log" 
ON public.attorney_onboarding_log 
FOR SELECT 
USING (
  onboarding_id IN (
    SELECT id FROM public.attorney_onboarding WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all onboarding logs" 
ON public.attorney_onboarding_log 
FOR SELECT 
USING (has_any_role(ARRAY['admin', 'system_administrator', 'tenant_admin']));

-- Create storage bucket for attorney documents
INSERT INTO storage.buckets (id, name, public) VALUES ('attorney-documents', 'attorney-documents', false);

-- Create storage policies for attorney documents
CREATE POLICY "Users can upload their onboarding documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'attorney-documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own documents" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'attorney-documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all attorney documents" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'attorney-documents' AND 
  has_any_role(ARRAY['admin', 'system_administrator', 'tenant_admin'])
);

-- Create function to update onboarding progress
CREATE OR REPLACE FUNCTION public.update_attorney_onboarding_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate progress based on completed steps
  NEW.progress_percentage := (array_length(NEW.steps_completed, 1) * 100) / 6; -- 6 total steps
  
  -- Auto-update status based on progress
  IF NEW.progress_percentage = 100 AND NEW.nda_signed AND NEW.participation_agreement_signed THEN
    NEW.onboarding_status := 'completed';
    NEW.submitted_at := COALESCE(NEW.submitted_at, now());
  END IF;
  
  -- Log status change
  IF OLD.onboarding_status IS DISTINCT FROM NEW.onboarding_status OR 
     OLD.current_step IS DISTINCT FROM NEW.current_step THEN
    INSERT INTO public.attorney_onboarding_log (
      onboarding_id, previous_status, new_status, step_completed, automated
    ) VALUES (
      NEW.id, OLD.onboarding_status, NEW.onboarding_status, NEW.current_step, true
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for progress updates
CREATE TRIGGER attorney_onboarding_progress_trigger
  BEFORE UPDATE ON public.attorney_onboarding
  FOR EACH ROW
  EXECUTE FUNCTION public.update_attorney_onboarding_progress();

-- Create function to get current user's onboarding status
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create function to get current user's tenant ID
CREATE OR REPLACE FUNCTION public.get_current_user_tenant_id()
RETURNS UUID AS $$
  SELECT tenant_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;