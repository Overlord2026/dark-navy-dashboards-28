-- CPA Onboarding and Practice Management System

-- CPA Firm onboarding checklist table
CREATE TABLE public.cpa_onboarding_checklists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cpa_partner_id UUID NOT NULL REFERENCES public.cpa_partners(id) ON DELETE CASCADE,
  step_name TEXT NOT NULL,
  step_category TEXT NOT NULL DEFAULT 'setup',
  step_order INTEGER NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  step_description TEXT,
  step_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Client organizer questionnaires
CREATE TABLE public.client_organizers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cpa_partner_id UUID NOT NULL REFERENCES public.cpa_partners(id) ON DELETE CASCADE,
  client_user_id UUID NOT NULL,
  organizer_type TEXT NOT NULL DEFAULT 'tax_prep',
  title TEXT NOT NULL,
  description TEXT,
  questions JSONB NOT NULL DEFAULT '[]',
  responses JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending',
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Communication campaigns for batch messaging
CREATE TABLE public.communication_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cpa_partner_id UUID NOT NULL REFERENCES public.cpa_partners(id) ON DELETE CASCADE,
  campaign_name TEXT NOT NULL,
  campaign_type TEXT NOT NULL, -- 'email', 'sms', 'portal_alert'
  subject TEXT,
  message_content TEXT NOT NULL,
  recipient_criteria JSONB DEFAULT '{}',
  scheduled_for TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'draft',
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Campaign delivery tracking
CREATE TABLE public.campaign_deliveries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES public.communication_campaigns(id) ON DELETE CASCADE,
  client_user_id UUID NOT NULL,
  delivery_type TEXT NOT NULL,
  delivered_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,
  tracking_data JSONB DEFAULT '{}'
);

-- Document request engine
CREATE TABLE public.document_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cpa_partner_id UUID NOT NULL REFERENCES public.cpa_partners(id) ON DELETE CASCADE,
  client_user_id UUID NOT NULL,
  request_name TEXT NOT NULL,
  document_types JSONB NOT NULL DEFAULT '[]',
  instructions TEXT,
  due_date DATE,
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Document request items (individual documents within a request)
CREATE TABLE public.document_request_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES public.document_requests(id) ON DELETE CASCADE,
  document_name TEXT NOT NULL,
  document_description TEXT,
  is_required BOOLEAN NOT NULL DEFAULT true,
  uploaded_file_url TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending'
);

-- White-label document templates
CREATE TABLE public.document_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cpa_partner_id UUID NOT NULL REFERENCES public.cpa_partners(id) ON DELETE CASCADE,
  template_name TEXT NOT NULL,
  template_type TEXT NOT NULL, -- 'engagement_letter', 'tax_organizer', 'invoice', etc.
  template_content TEXT NOT NULL,
  variables JSONB DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- E-signature requests
CREATE TABLE public.signature_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_template_id UUID REFERENCES public.document_templates(id),
  client_user_id UUID NOT NULL,
  cpa_partner_id UUID NOT NULL REFERENCES public.cpa_partners(id) ON DELETE CASCADE,
  document_title TEXT NOT NULL,
  document_content TEXT NOT NULL,
  signature_status TEXT NOT NULL DEFAULT 'pending',
  sent_at TIMESTAMP WITH TIME ZONE,
  signed_at TIMESTAMP WITH TIME ZONE,
  signature_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Practice analytics metrics
CREATE TABLE public.practice_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cpa_partner_id UUID NOT NULL REFERENCES public.cpa_partners(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL, -- 'onboarding_progress', 'ar_ap', 'client_nps', 'revenue'
  metric_date DATE NOT NULL,
  metric_value NUMERIC,
  metric_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Document request nudges and reminders
CREATE TABLE public.document_nudges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES public.document_requests(id) ON DELETE CASCADE,
  nudge_type TEXT NOT NULL DEFAULT 'reminder', -- 'reminder', 'overdue', 'final_notice'
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  response_received BOOLEAN DEFAULT false,
  nudge_content TEXT
);

-- Add RLS policies

-- CPA Onboarding Checklists
ALTER TABLE public.cpa_onboarding_checklists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "CPA partners can manage their onboarding checklists"
ON public.cpa_onboarding_checklists
FOR ALL
USING (cpa_partner_id IN (
  SELECT id FROM public.cpa_partners WHERE user_id = auth.uid()
));

-- Client Organizers
ALTER TABLE public.client_organizers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "CPA partners can manage their client organizers"
ON public.client_organizers
FOR ALL
USING (cpa_partner_id IN (
  SELECT id FROM public.cpa_partners WHERE user_id = auth.uid()
));

CREATE POLICY "Clients can view their organizers"
ON public.client_organizers
FOR SELECT
USING (client_user_id = auth.uid());

CREATE POLICY "Clients can update their organizer responses"
ON public.client_organizers
FOR UPDATE
USING (client_user_id = auth.uid());

-- Communication Campaigns
ALTER TABLE public.communication_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "CPA partners can manage their communication campaigns"
ON public.communication_campaigns
FOR ALL
USING (cpa_partner_id IN (
  SELECT id FROM public.cpa_partners WHERE user_id = auth.uid()
));

-- Campaign Deliveries
ALTER TABLE public.campaign_deliveries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "CPA partners can view their campaign deliveries"
ON public.campaign_deliveries
FOR SELECT
USING (campaign_id IN (
  SELECT id FROM public.communication_campaigns 
  WHERE cpa_partner_id IN (
    SELECT id FROM public.cpa_partners WHERE user_id = auth.uid()
  )
));

-- Document Requests
ALTER TABLE public.document_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "CPA partners can manage their document requests"
ON public.document_requests
FOR ALL
USING (cpa_partner_id IN (
  SELECT id FROM public.cpa_partners WHERE user_id = auth.uid()
));

CREATE POLICY "Clients can view their document requests"
ON public.document_requests
FOR SELECT
USING (client_user_id = auth.uid());

-- Document Request Items
ALTER TABLE public.document_request_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "CPA partners can manage document request items"
ON public.document_request_items
FOR ALL
USING (request_id IN (
  SELECT id FROM public.document_requests 
  WHERE cpa_partner_id IN (
    SELECT id FROM public.cpa_partners WHERE user_id = auth.uid()
  )
));

CREATE POLICY "Clients can view and upload their document request items"
ON public.document_request_items
FOR ALL
USING (request_id IN (
  SELECT id FROM public.document_requests WHERE client_user_id = auth.uid()
));

-- Document Templates
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "CPA partners can manage their document templates"
ON public.document_templates
FOR ALL
USING (cpa_partner_id IN (
  SELECT id FROM public.cpa_partners WHERE user_id = auth.uid()
));

-- Signature Requests
ALTER TABLE public.signature_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "CPA partners can manage their signature requests"
ON public.signature_requests
FOR ALL
USING (cpa_partner_id IN (
  SELECT id FROM public.cpa_partners WHERE user_id = auth.uid()
));

CREATE POLICY "Clients can view and sign their signature requests"
ON public.signature_requests
FOR ALL
USING (client_user_id = auth.uid());

-- Practice Metrics
ALTER TABLE public.practice_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "CPA partners can view their practice metrics"
ON public.practice_metrics
FOR SELECT
USING (cpa_partner_id IN (
  SELECT id FROM public.cpa_partners WHERE user_id = auth.uid()
));

-- Document Nudges
ALTER TABLE public.document_nudges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "CPA partners can view their document nudges"
ON public.document_nudges
FOR SELECT
USING (request_id IN (
  SELECT id FROM public.document_requests 
  WHERE cpa_partner_id IN (
    SELECT id FROM public.cpa_partners WHERE user_id = auth.uid()
  )
));

-- Add update triggers
CREATE TRIGGER update_cpa_onboarding_checklists_updated_at
  BEFORE UPDATE ON public.cpa_onboarding_checklists
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_organizers_updated_at
  BEFORE UPDATE ON public.client_organizers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_communication_campaigns_updated_at
  BEFORE UPDATE ON public.communication_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_document_requests_updated_at
  BEFORE UPDATE ON public.document_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_document_templates_updated_at
  BEFORE UPDATE ON public.document_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_signature_requests_updated_at
  BEFORE UPDATE ON public.signature_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default onboarding checklist steps
INSERT INTO public.cpa_onboarding_checklists (cpa_partner_id, step_name, step_category, step_order, step_description) 
SELECT 
  cp.id,
  step_data.step_name,
  step_data.step_category,
  step_data.step_order,
  step_data.step_description
FROM public.cpa_partners cp
CROSS JOIN (
  VALUES 
    ('Firm Profile Setup', 'setup', 1, 'Complete your firm profile with contact information and specialties'),
    ('White-Label Branding', 'branding', 2, 'Upload your firm logo and customize portal colors'),
    ('Data Import Configuration', 'data', 3, 'Set up integrations with QuickBooks and Drake/Lacerte'),
    ('Document Templates', 'templates', 4, 'Customize engagement letters and tax organizers'),
    ('Client Invite Workflow', 'clients', 5, 'Set up your client onboarding process'),
    ('Communication Preferences', 'communication', 6, 'Configure email templates and notification settings'),
    ('Practice Analytics Setup', 'analytics', 7, 'Configure your KPI tracking and reporting preferences')
) AS step_data(step_name, step_category, step_order, step_description)
WHERE cp.onboarding_status != 'completed';