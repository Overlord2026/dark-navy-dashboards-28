-- Create client onboarding tables
CREATE TABLE public.client_onboarding (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  attorney_id UUID NOT NULL,
  client_email TEXT NOT NULL,
  client_name TEXT,
  client_phone TEXT,
  case_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'::text CHECK (status IN ('pending', 'intake_sent', 'intake_completed', 'nda_signed', 'documents_requested', 'active', 'completed')),
  intake_token TEXT UNIQUE,
  nda_signed_at TIMESTAMP WITH TIME ZONE,
  engagement_letter_signed_at TIMESTAMP WITH TIME ZONE,
  communication_preferences JSONB DEFAULT '{}'::jsonb,
  deadlines JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create document request templates
CREATE TABLE public.document_request_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  attorney_id UUID NOT NULL,
  template_name TEXT NOT NULL,
  case_type TEXT NOT NULL,
  required_documents JSONB NOT NULL DEFAULT '[]'::jsonb,
  deadline_days INTEGER DEFAULT 14,
  instructions TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create client document requests
CREATE TABLE public.client_document_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  onboarding_id UUID NOT NULL REFERENCES public.client_onboarding(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  document_name TEXT NOT NULL,
  description TEXT,
  is_required BOOLEAN DEFAULT true,
  deadline DATE,
  status TEXT NOT NULL DEFAULT 'pending'::text CHECK (status IN ('pending', 'uploaded', 'reviewed', 'approved', 'rejected')),
  uploaded_document_url TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create legal document templates
CREATE TABLE public.legal_document_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  attorney_id UUID,
  template_type TEXT NOT NULL CHECK (template_type IN ('nda', 'engagement_letter', 'retainer_agreement', 'intake_form')),
  template_name TEXT NOT NULL,
  template_content TEXT NOT NULL,
  variables JSONB DEFAULT '[]'::jsonb,
  is_default BOOLEAN DEFAULT false,
  practice_area TEXT,
  state_jurisdiction TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create document collaboration table
CREATE TABLE public.document_collaborations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL,
  shared_by UUID NOT NULL,
  shared_with_email TEXT NOT NULL,
  shared_with_role TEXT NOT NULL CHECK (shared_with_role IN ('cpa', 'advisor', 'attorney', 'client')),
  permission_level TEXT NOT NULL DEFAULT 'view'::text CHECK (permission_level IN ('view', 'download', 'edit')),
  message TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  access_token TEXT UNIQUE,
  accessed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.client_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_request_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_document_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_collaborations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for client_onboarding
CREATE POLICY "Attorneys can manage their client onboarding" 
ON public.client_onboarding 
FOR ALL 
USING (attorney_id = auth.uid());

CREATE POLICY "Clients can view their onboarding via token" 
ON public.client_onboarding 
FOR SELECT 
USING (intake_token IS NOT NULL);

-- RLS Policies for document_request_templates
CREATE POLICY "Attorneys can manage their document templates" 
ON public.document_request_templates 
FOR ALL 
USING (attorney_id = auth.uid());

-- RLS Policies for client_document_requests
CREATE POLICY "Attorneys can manage document requests for their clients" 
ON public.client_document_requests 
FOR ALL 
USING (onboarding_id IN (SELECT id FROM public.client_onboarding WHERE attorney_id = auth.uid()));

CREATE POLICY "Clients can view and update their document requests via token" 
ON public.client_document_requests 
FOR SELECT 
USING (onboarding_id IN (SELECT id FROM public.client_onboarding WHERE intake_token IS NOT NULL));

-- RLS Policies for legal_document_templates
CREATE POLICY "Attorneys can manage their legal templates" 
ON public.legal_document_templates 
FOR ALL 
USING (attorney_id = auth.uid() OR attorney_id IS NULL);

CREATE POLICY "Anyone can view default templates" 
ON public.legal_document_templates 
FOR SELECT 
USING (is_default = true);

-- RLS Policies for document_collaborations
CREATE POLICY "Users can manage collaborations they created" 
ON public.document_collaborations 
FOR ALL 
USING (shared_by = auth.uid());

CREATE POLICY "Collaborators can view shared documents via token" 
ON public.document_collaborations 
FOR SELECT 
USING (access_token IS NOT NULL);

-- Create storage bucket for client documents
INSERT INTO storage.buckets (id, name, public) VALUES ('client-documents', 'client-documents', false);

-- Storage policies for client documents
CREATE POLICY "Attorneys can manage client documents" 
ON storage.objects 
FOR ALL 
USING (bucket_id = 'client-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Clients can upload documents to their folder" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'client-documents');

-- Create function to generate secure intake tokens
CREATE OR REPLACE FUNCTION public.generate_intake_token()
RETURNS TEXT AS $$
DECLARE
  token TEXT;
BEGIN
  token := encode(gen_random_bytes(32), 'hex');
  RETURN token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update onboarding status
CREATE OR REPLACE FUNCTION public.update_onboarding_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-update status based on progress
  IF NEW.nda_signed_at IS NOT NULL AND OLD.nda_signed_at IS NULL THEN
    NEW.status := 'nda_signed';
  ELSIF NEW.engagement_letter_signed_at IS NOT NULL AND OLD.engagement_letter_signed_at IS NULL THEN
    NEW.status := 'active';
  END IF;
  
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for onboarding status updates
CREATE TRIGGER update_onboarding_status_trigger
  BEFORE UPDATE ON public.client_onboarding
  FOR EACH ROW
  EXECUTE FUNCTION public.update_onboarding_status();

-- Insert default NDA template
INSERT INTO public.legal_document_templates (
  template_type, 
  template_name, 
  template_content, 
  variables, 
  is_default
) VALUES (
  'nda',
  'Standard Attorney-Client NDA',
  'NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into on {{date}} between {{attorney_name}}, Attorney at Law ("Attorney") and {{client_name}} ("Client").

1. CONFIDENTIAL INFORMATION
Client may disclose certain confidential and proprietary information to Attorney for the purpose of legal consultation and representation.

2. OBLIGATIONS
Attorney agrees to:
- Maintain strict confidentiality of all Client information
- Use information solely for legal representation purposes
- Return or destroy all confidential materials upon request

3. ATTORNEY-CLIENT PRIVILEGE
This Agreement supplements but does not replace the attorney-client privilege and professional rules of conduct.

4. TERM
This Agreement remains in effect indefinitely unless terminated in writing.

IN WITNESS WHEREOF, the parties have executed this Agreement.

Attorney: _________________________ Date: _________
{{attorney_name}}

Client: _________________________ Date: _________
{{client_name}}',
  '["attorney_name", "client_name", "date", "practice_area"]',
  true
);

-- Insert default engagement letter template
INSERT INTO public.legal_document_templates (
  template_type, 
  template_name, 
  template_content, 
  variables, 
  is_default
) VALUES (
  'engagement_letter',
  'Standard Engagement Letter',
  'ENGAGEMENT LETTER

Date: {{date}}

Dear {{client_name}},

This letter confirms our agreement for legal representation in the matter of {{case_description}}.

SCOPE OF REPRESENTATION:
{{scope_description}}

FEES AND COSTS:
- Hourly Rate: {{hourly_rate}}
- Retainer: {{retainer_amount}}
- Additional costs as incurred

TERMS:
- Client will provide all necessary documents and information
- Attorney will provide regular updates on case progress
- Either party may terminate representation with written notice

Please sign and return one copy to confirm your agreement.

Sincerely,
{{attorney_name}}
{{law_firm_name}}

ACCEPTED AND AGREED:

Client Signature: _________________________ Date: _________
{{client_name}}',
  '["attorney_name", "law_firm_name", "client_name", "date", "case_description", "scope_description", "hourly_rate", "retainer_amount"]',
  true
);