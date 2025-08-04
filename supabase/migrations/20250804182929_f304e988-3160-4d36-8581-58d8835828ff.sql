-- RIA Multi-State Licensing Database Schema

-- 1. RIA State License Requests
CREATE TABLE public.ria_state_license_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ria_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  state text NOT NULL,
  status text NOT NULL DEFAULT 'not_started'::text CHECK (status IN ('not_started', 'in_progress', 'submitted', 'approved', 'needs_revision', 'rejected')),
  submission_date timestamp with time zone,
  approval_date timestamp with time zone,
  reviewer uuid REFERENCES public.profiles(id),
  notes text,
  doc_links jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  priority text DEFAULT 'medium'::text CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  estimated_completion_date date,
  fees_paid numeric DEFAULT 0,
  state_reference_number text,
  compliance_score integer DEFAULT 0 CHECK (compliance_score >= 0 AND compliance_score <= 100)
);

-- 2. RIA State Checklists (Requirements by State)
CREATE TABLE public.ria_state_checklists (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  state text NOT NULL,
  requirement text NOT NULL,
  doc_type text NOT NULL,
  is_required boolean NOT NULL DEFAULT true,
  example_file text,
  description text,
  compliance_notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  order_sequence integer DEFAULT 1,
  category text DEFAULT 'general'::text CHECK (category IN ('general', 'financial', 'disclosure', 'operational', 'legal')),
  estimated_hours numeric DEFAULT 1.0,
  UNIQUE(state, requirement, doc_type)
);

-- 3. RIA State Documents
CREATE TABLE public.ria_state_docs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  license_request_id uuid NOT NULL REFERENCES public.ria_state_license_requests(id) ON DELETE CASCADE,
  doc_type text NOT NULL,
  file_url text,
  file_name text,
  file_size bigint,
  status text NOT NULL DEFAULT 'pending'::text CHECK (status IN ('pending', 'uploaded', 'reviewed', 'approved', 'rejected', 'needs_revision')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  reviewed_by uuid REFERENCES public.profiles(id),
  reviewed_at timestamp with time zone,
  ai_review_score integer CHECK (ai_review_score >= 0 AND ai_review_score <= 100),
  ai_feedback jsonb DEFAULT '{}'::jsonb,
  compliance_issues jsonb DEFAULT '[]'::jsonb,
  version_number integer DEFAULT 1
);

-- 4. RIA State Communications
CREATE TABLE public.ria_state_comms (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  license_request_id uuid NOT NULL REFERENCES public.ria_state_license_requests(id) ON DELETE CASCADE,
  message text NOT NULL,
  sender uuid NOT NULL REFERENCES public.profiles(id),
  timestamp timestamp with time zone NOT NULL DEFAULT now(),
  message_type text DEFAULT 'note'::text CHECK (message_type IN ('note', 'request', 'response', 'system', 'alert')),
  is_internal boolean DEFAULT false,
  attachments jsonb DEFAULT '[]'::jsonb,
  priority text DEFAULT 'normal'::text CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  read_by jsonb DEFAULT '[]'::jsonb
);

-- 5. RIA State Requirements Template (Master List)
CREATE TABLE public.ria_state_requirements (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  state text NOT NULL,
  requirement_name text NOT NULL,
  requirement_type text NOT NULL CHECK (requirement_type IN ('document', 'fee', 'exam', 'experience', 'filing')),
  description text,
  is_mandatory boolean DEFAULT true,
  typical_processing_days integer DEFAULT 30,
  fee_amount numeric DEFAULT 0,
  renewal_required boolean DEFAULT true,
  renewal_period_months integer DEFAULT 12,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(state, requirement_name)
);

-- Enable RLS on all tables
ALTER TABLE public.ria_state_license_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ria_state_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ria_state_docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ria_state_comms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ria_state_requirements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ria_state_license_requests
CREATE POLICY "RIAs can view their own license requests" 
ON public.ria_state_license_requests 
FOR SELECT 
USING (ria_id = auth.uid() OR has_any_role(ARRAY['admin', 'system_administrator', 'compliance_officer']));

CREATE POLICY "RIAs can create their own license requests" 
ON public.ria_state_license_requests 
FOR INSERT 
WITH CHECK (ria_id = auth.uid());

CREATE POLICY "RIAs and admins can update license requests" 
ON public.ria_state_license_requests 
FOR UPDATE 
USING (ria_id = auth.uid() OR has_any_role(ARRAY['admin', 'system_administrator', 'compliance_officer']));

-- RLS Policies for ria_state_checklists (Public read, admin write)
CREATE POLICY "Anyone can view state checklists" 
ON public.ria_state_checklists 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage state checklists" 
ON public.ria_state_checklists 
FOR ALL 
USING (has_any_role(ARRAY['admin', 'system_administrator', 'compliance_officer']));

-- RLS Policies for ria_state_docs
CREATE POLICY "RIAs can view their license documents" 
ON public.ria_state_docs 
FOR SELECT 
USING (
  license_request_id IN (
    SELECT id FROM public.ria_state_license_requests 
    WHERE ria_id = auth.uid()
  ) OR has_any_role(ARRAY['admin', 'system_administrator', 'compliance_officer'])
);

CREATE POLICY "RIAs can upload their license documents" 
ON public.ria_state_docs 
FOR INSERT 
WITH CHECK (
  license_request_id IN (
    SELECT id FROM public.ria_state_license_requests 
    WHERE ria_id = auth.uid()
  )
);

CREATE POLICY "RIAs and admins can update license documents" 
ON public.ria_state_docs 
FOR UPDATE 
USING (
  license_request_id IN (
    SELECT id FROM public.ria_state_license_requests 
    WHERE ria_id = auth.uid()
  ) OR has_any_role(ARRAY['admin', 'system_administrator', 'compliance_officer'])
);

-- RLS Policies for ria_state_comms
CREATE POLICY "RIAs can view their license communications" 
ON public.ria_state_comms 
FOR SELECT 
USING (
  license_request_id IN (
    SELECT id FROM public.ria_state_license_requests 
    WHERE ria_id = auth.uid()
  ) OR has_any_role(ARRAY['admin', 'system_administrator', 'compliance_officer'])
);

CREATE POLICY "RIAs can create communications" 
ON public.ria_state_comms 
FOR INSERT 
WITH CHECK (
  sender = auth.uid() AND (
    license_request_id IN (
      SELECT id FROM public.ria_state_license_requests 
      WHERE ria_id = auth.uid()
    ) OR has_any_role(ARRAY['admin', 'system_administrator', 'compliance_officer'])
  )
);

-- RLS Policies for ria_state_requirements (Public read, admin write)
CREATE POLICY "Anyone can view state requirements" 
ON public.ria_state_requirements 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage state requirements" 
ON public.ria_state_requirements 
FOR ALL 
USING (has_any_role(ARRAY['admin', 'system_administrator', 'compliance_officer']));

-- Create indexes for performance
CREATE INDEX idx_ria_state_license_requests_ria_id ON public.ria_state_license_requests(ria_id);
CREATE INDEX idx_ria_state_license_requests_state ON public.ria_state_license_requests(state);
CREATE INDEX idx_ria_state_license_requests_status ON public.ria_state_license_requests(status);
CREATE INDEX idx_ria_state_checklists_state ON public.ria_state_checklists(state);
CREATE INDEX idx_ria_state_docs_license_request_id ON public.ria_state_docs(license_request_id);
CREATE INDEX idx_ria_state_comms_license_request_id ON public.ria_state_comms(license_request_id);
CREATE INDEX idx_ria_state_requirements_state ON public.ria_state_requirements(state);

-- Update timestamp triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ria_state_license_requests_updated_at 
BEFORE UPDATE ON public.ria_state_license_requests 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ria_state_checklists_updated_at 
BEFORE UPDATE ON public.ria_state_checklists 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ria_state_docs_updated_at 
BEFORE UPDATE ON public.ria_state_docs 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ria_state_requirements_updated_at 
BEFORE UPDATE ON public.ria_state_requirements 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();