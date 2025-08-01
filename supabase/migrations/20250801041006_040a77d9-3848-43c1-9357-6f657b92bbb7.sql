-- Create client invitation and onboarding tables
CREATE TABLE public.cpa_client_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cpa_partner_id UUID NOT NULL REFERENCES public.cpa_partners(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  phone TEXT,
  first_name TEXT,
  last_name TEXT,
  company_name TEXT,
  client_type TEXT NOT NULL DEFAULT 'individual', -- individual, business, trust, nonprofit
  business_structure TEXT, -- llc, corporation, partnership, sole_prop
  invitation_token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  status TEXT NOT NULL DEFAULT 'pending', -- pending, sent, opened, accepted, expired
  invited_by UUID REFERENCES public.cpa_staff(id),
  custom_message TEXT,
  welcome_video_url TEXT,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '30 days'),
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create client onboarding progress table
CREATE TABLE public.cpa_client_onboarding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_user_id UUID NOT NULL,
  cpa_partner_id UUID NOT NULL REFERENCES public.cpa_partners(id) ON DELETE CASCADE,
  invitation_id UUID REFERENCES public.cpa_client_invitations(id),
  onboarding_stage TEXT NOT NULL DEFAULT 'invited', -- invited, welcome_sent, organizer_pending, documents_pending, review_ready, completed
  client_type TEXT NOT NULL,
  business_structure TEXT,
  organizer_completed BOOLEAN NOT NULL DEFAULT false,
  documents_uploaded INTEGER NOT NULL DEFAULT 0,
  documents_required INTEGER NOT NULL DEFAULT 0,
  engagement_letter_signed BOOLEAN NOT NULL DEFAULT false,
  welcome_email_sent BOOLEAN NOT NULL DEFAULT false,
  video_watched BOOLEAN NOT NULL DEFAULT false,
  progress_percentage INTEGER NOT NULL DEFAULT 0,
  assigned_staff_id UUID REFERENCES public.cpa_staff(id),
  notes TEXT,
  estimated_completion_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create document requests table
CREATE TABLE public.cpa_document_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_user_id UUID NOT NULL,
  cpa_partner_id UUID NOT NULL REFERENCES public.cpa_partners(id) ON DELETE CASCADE,
  onboarding_id UUID REFERENCES public.cpa_client_onboarding(id),
  document_type TEXT NOT NULL, -- w2, 1099, k1, prior_return, bank_statements, etc.
  document_name TEXT NOT NULL,
  description TEXT,
  is_required BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, uploaded, reviewed, approved
  request_sent_at TIMESTAMPTZ,
  uploaded_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  due_date DATE,
  reminder_count INTEGER NOT NULL DEFAULT 0,
  last_reminder_sent TIMESTAMPTZ,
  uploaded_file_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create onboarding status log for tracking
CREATE TABLE public.cpa_onboarding_status_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  onboarding_id UUID NOT NULL REFERENCES public.cpa_client_onboarding(id) ON DELETE CASCADE,
  previous_stage TEXT,
  new_stage TEXT NOT NULL,
  status_message TEXT,
  triggered_by UUID REFERENCES public.cpa_staff(id),
  automated BOOLEAN NOT NULL DEFAULT false,
  client_visible BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create welcome email templates table
CREATE TABLE public.cpa_welcome_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cpa_partner_id UUID NOT NULL REFERENCES public.cpa_partners(id) ON DELETE CASCADE,
  template_name TEXT NOT NULL,
  subject_line TEXT NOT NULL,
  email_content TEXT NOT NULL,
  includes_video BOOLEAN NOT NULL DEFAULT false,
  video_url TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  client_type TEXT, -- individual, business, trust, nonprofit
  created_by UUID REFERENCES public.cpa_staff(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.cpa_client_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cpa_client_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cpa_document_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cpa_onboarding_status_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cpa_welcome_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cpa_client_invitations
CREATE POLICY "CPA partners can manage their client invitations" ON public.cpa_client_invitations
  FOR ALL USING (
    cpa_partner_id IN (
      SELECT id FROM public.cpa_partners WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for cpa_client_onboarding
CREATE POLICY "CPA partners can manage client onboarding" ON public.cpa_client_onboarding
  FOR ALL USING (
    cpa_partner_id IN (
      SELECT id FROM public.cpa_partners WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Clients can view their own onboarding" ON public.cpa_client_onboarding
  FOR SELECT USING (client_user_id = auth.uid());

-- RLS Policies for cpa_document_requests
CREATE POLICY "CPA partners can manage document requests" ON public.cpa_document_requests
  FOR ALL USING (
    cpa_partner_id IN (
      SELECT id FROM public.cpa_partners WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Clients can view and update their document requests" ON public.cpa_document_requests
  FOR SELECT USING (client_user_id = auth.uid());

CREATE POLICY "Clients can update their document status" ON public.cpa_document_requests
  FOR UPDATE USING (client_user_id = auth.uid());

-- RLS Policies for cpa_onboarding_status_log
CREATE POLICY "CPA partners can view onboarding logs" ON public.cpa_onboarding_status_log
  FOR SELECT USING (
    onboarding_id IN (
      SELECT id FROM public.cpa_client_onboarding 
      WHERE cpa_partner_id IN (
        SELECT id FROM public.cpa_partners WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Clients can view their status logs" ON public.cpa_onboarding_status_log
  FOR SELECT USING (
    onboarding_id IN (
      SELECT id FROM public.cpa_client_onboarding 
      WHERE client_user_id = auth.uid()
    ) AND client_visible = true
  );

-- RLS Policies for cpa_welcome_templates
CREATE POLICY "CPA partners can manage their welcome templates" ON public.cpa_welcome_templates
  FOR ALL USING (
    cpa_partner_id IN (
      SELECT id FROM public.cpa_partners WHERE user_id = auth.uid()
    )
  );

-- Add updated_at triggers
CREATE TRIGGER update_cpa_client_invitations_updated_at 
  BEFORE UPDATE ON public.cpa_client_invitations 
  FOR EACH ROW EXECUTE FUNCTION update_cpa_updated_at_column();

CREATE TRIGGER update_cpa_client_onboarding_updated_at 
  BEFORE UPDATE ON public.cpa_client_onboarding 
  FOR EACH ROW EXECUTE FUNCTION update_cpa_updated_at_column();

CREATE TRIGGER update_cpa_document_requests_updated_at 
  BEFORE UPDATE ON public.cpa_document_requests 
  FOR EACH ROW EXECUTE FUNCTION update_cpa_updated_at_column();

CREATE TRIGGER update_cpa_welcome_templates_updated_at 
  BEFORE UPDATE ON public.cpa_welcome_templates 
  FOR EACH ROW EXECUTE FUNCTION update_cpa_updated_at_column();

-- Function to calculate onboarding progress
CREATE OR REPLACE FUNCTION public.calculate_onboarding_progress(onboarding_id UUID)
RETURNS INTEGER
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  WITH progress_data AS (
    SELECT 
      o.organizer_completed,
      o.documents_uploaded,
      o.documents_required,
      o.engagement_letter_signed,
      o.welcome_email_sent
    FROM public.cpa_client_onboarding o
    WHERE o.id = onboarding_id
  )
  SELECT CASE 
    WHEN NOT welcome_email_sent THEN 0
    WHEN organizer_completed AND documents_uploaded >= documents_required AND engagement_letter_signed THEN 100
    WHEN organizer_completed AND documents_uploaded >= documents_required THEN 85
    WHEN organizer_completed AND documents_uploaded > 0 THEN 60
    WHEN organizer_completed THEN 40
    WHEN welcome_email_sent THEN 20
    ELSE 0
  END
  FROM progress_data;
$$;

-- Function to update onboarding stage
CREATE OR REPLACE FUNCTION public.update_onboarding_stage()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  new_stage TEXT;
  progress_pct INTEGER;
BEGIN
  -- Calculate new stage based on progress
  IF NEW.organizer_completed AND NEW.documents_uploaded >= NEW.documents_required AND NEW.engagement_letter_signed THEN
    new_stage := 'completed';
  ELSIF NEW.documents_uploaded >= NEW.documents_required AND NEW.engagement_letter_signed THEN
    new_stage := 'review_ready';
  ELSIF NEW.documents_uploaded > 0 THEN
    new_stage := 'documents_pending';
  ELSIF NEW.organizer_completed THEN
    new_stage := 'documents_pending';
  ELSIF NEW.welcome_email_sent THEN
    new_stage := 'organizer_pending';
  ELSE
    new_stage := 'invited';
  END IF;

  -- Calculate progress percentage
  progress_pct := public.calculate_onboarding_progress(NEW.id);
  
  -- Update the stage and progress if changed
  IF NEW.onboarding_stage != new_stage THEN
    NEW.onboarding_stage := new_stage;
    NEW.progress_percentage := progress_pct;
    
    -- Log the status change
    INSERT INTO public.cpa_onboarding_status_log (
      onboarding_id, previous_stage, new_stage, status_message, automated, client_visible
    ) VALUES (
      NEW.id, OLD.onboarding_stage, new_stage, 
      'Status automatically updated based on progress', true, true
    );
  ELSE
    NEW.progress_percentage := progress_pct;
  END IF;

  RETURN NEW;
END;
$$;

-- Add trigger for automatic stage updates
CREATE TRIGGER update_onboarding_stage_trigger
  BEFORE UPDATE ON public.cpa_client_onboarding
  FOR EACH ROW
  EXECUTE FUNCTION public.update_onboarding_stage();