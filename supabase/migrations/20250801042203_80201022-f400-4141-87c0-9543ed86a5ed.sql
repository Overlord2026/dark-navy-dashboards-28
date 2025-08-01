-- Communication system tables
CREATE TABLE public.communication_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cpa_partner_id UUID NOT NULL,
  template_name TEXT NOT NULL,
  template_type TEXT NOT NULL CHECK (template_type IN ('email', 'sms', 'in_app', 'nudge')),
  subject TEXT,
  content TEXT NOT NULL,
  variables JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.batch_communications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cpa_partner_id UUID NOT NULL,
  campaign_name TEXT NOT NULL,
  template_id UUID REFERENCES public.communication_templates(id),
  communication_type TEXT NOT NULL CHECK (communication_type IN ('email', 'sms', 'in_app')),
  recipient_criteria JSONB DEFAULT '{}'::jsonb,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'completed', 'failed')),
  total_recipients INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.communication_deliveries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_id UUID REFERENCES public.batch_communications(id),
  client_user_id UUID NOT NULL,
  communication_type TEXT NOT NULL,
  recipient_email TEXT,
  recipient_phone TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'opened', 'clicked')),
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  tracking_data JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE public.ai_nudge_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cpa_partner_id UUID NOT NULL,
  rule_name TEXT NOT NULL,
  trigger_condition TEXT NOT NULL CHECK (trigger_condition IN ('missing_docs', 'overdue_response', 'incomplete_organizer', 'pending_signature')),
  days_threshold INTEGER NOT NULL DEFAULT 3,
  template_id UUID REFERENCES public.communication_templates(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.nudge_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_id UUID REFERENCES public.ai_nudge_rules(id),
  client_user_id UUID NOT NULL,
  onboarding_id UUID,
  trigger_reason TEXT NOT NULL,
  nudge_sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  response_received_at TIMESTAMP WITH TIME ZONE,
  effectiveness_score INTEGER CHECK (effectiveness_score BETWEEN 1 AND 5)
);

CREATE TABLE public.meeting_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cpa_partner_id UUID NOT NULL,
  integration_type TEXT NOT NULL CHECK (integration_type IN ('calendly', 'zoom', 'teams', 'google_meet')),
  api_credentials JSONB,
  webhook_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.client_meetings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cpa_partner_id UUID NOT NULL,
  client_user_id UUID NOT NULL,
  onboarding_id UUID,
  meeting_title TEXT NOT NULL,
  meeting_type TEXT DEFAULT 'consultation' CHECK (meeting_type IN ('consultation', 'review', 'follow_up', 'signature')),
  scheduled_for TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER DEFAULT 30,
  meeting_url TEXT,
  meeting_platform TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
  agenda JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.document_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID,
  document_type TEXT NOT NULL CHECK (document_type IN ('organizer', 'upload', 'signature', 'tax_return')),
  onboarding_id UUID,
  commenter_id UUID NOT NULL,
  commenter_type TEXT NOT NULL CHECK (commenter_type IN ('cpa', 'client', 'staff')),
  comment_text TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT false,
  parent_comment_id UUID REFERENCES public.document_comments(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.communication_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batch_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_nudge_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nudge_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for communication_templates
CREATE POLICY "CPA partners can manage their communication templates"
ON public.communication_templates FOR ALL
USING (cpa_partner_id IN (
  SELECT id FROM public.cpa_partners WHERE user_id = auth.uid()
));

-- RLS Policies for batch_communications
CREATE POLICY "CPA partners can manage their batch communications"
ON public.batch_communications FOR ALL
USING (cpa_partner_id IN (
  SELECT id FROM public.cpa_partners WHERE user_id = auth.uid()
));

-- RLS Policies for communication_deliveries
CREATE POLICY "CPA partners can view their communication deliveries"
ON public.communication_deliveries FOR SELECT
USING (batch_id IN (
  SELECT id FROM public.batch_communications bc
  WHERE bc.cpa_partner_id IN (
    SELECT id FROM public.cpa_partners WHERE user_id = auth.uid()
  )
));

CREATE POLICY "Clients can view deliveries sent to them"
ON public.communication_deliveries FOR SELECT
USING (client_user_id = auth.uid());

-- RLS Policies for ai_nudge_rules
CREATE POLICY "CPA partners can manage their nudge rules"
ON public.ai_nudge_rules FOR ALL
USING (cpa_partner_id IN (
  SELECT id FROM public.cpa_partners WHERE user_id = auth.uid()
));

-- RLS Policies for nudge_history
CREATE POLICY "CPA partners can view their nudge history"
ON public.nudge_history FOR SELECT
USING (rule_id IN (
  SELECT id FROM public.ai_nudge_rules nr
  WHERE nr.cpa_partner_id IN (
    SELECT id FROM public.cpa_partners WHERE user_id = auth.uid()
  )
));

CREATE POLICY "Clients can view nudges sent to them"
ON public.nudge_history FOR SELECT
USING (client_user_id = auth.uid());

-- RLS Policies for meeting_integrations
CREATE POLICY "CPA partners can manage their meeting integrations"
ON public.meeting_integrations FOR ALL
USING (cpa_partner_id IN (
  SELECT id FROM public.cpa_partners WHERE user_id = auth.uid()
));

-- RLS Policies for client_meetings
CREATE POLICY "CPA partners can manage their client meetings"
ON public.client_meetings FOR ALL
USING (cpa_partner_id IN (
  SELECT id FROM public.cpa_partners WHERE user_id = auth.uid()
));

CREATE POLICY "Clients can view and update their meetings"
ON public.client_meetings FOR ALL
USING (client_user_id = auth.uid());

-- RLS Policies for document_comments
CREATE POLICY "CPA partners can manage comments on their documents"
ON public.document_comments FOR ALL
USING (
  onboarding_id IN (
    SELECT id FROM public.cpa_client_onboarding co
    WHERE co.cpa_partner_id IN (
      SELECT id FROM public.cpa_partners WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Clients can view and create comments on their documents"
ON public.document_comments FOR ALL
USING (
  onboarding_id IN (
    SELECT id FROM public.cpa_client_onboarding 
    WHERE client_user_id = auth.uid()
  )
);

-- Update triggers
CREATE TRIGGER update_communication_templates_updated_at
  BEFORE UPDATE ON public.communication_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_cpa_updated_at_column();

CREATE TRIGGER update_batch_communications_updated_at
  BEFORE UPDATE ON public.batch_communications
  FOR EACH ROW EXECUTE FUNCTION public.update_cpa_updated_at_column();

CREATE TRIGGER update_ai_nudge_rules_updated_at
  BEFORE UPDATE ON public.ai_nudge_rules
  FOR EACH ROW EXECUTE FUNCTION public.update_cpa_updated_at_column();

CREATE TRIGGER update_meeting_integrations_updated_at
  BEFORE UPDATE ON public.meeting_integrations
  FOR EACH ROW EXECUTE FUNCTION public.update_cpa_updated_at_column();

CREATE TRIGGER update_client_meetings_updated_at
  BEFORE UPDATE ON public.client_meetings
  FOR EACH ROW EXECUTE FUNCTION public.update_cpa_updated_at_column();

CREATE TRIGGER update_document_comments_updated_at
  BEFORE UPDATE ON public.document_comments
  FOR EACH ROW EXECUTE FUNCTION public.update_cpa_updated_at_column();

-- Function to check for nudge triggers
CREATE OR REPLACE FUNCTION public.check_nudge_triggers()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  rule RECORD;
  overdue_client RECORD;
BEGIN
  -- Check all active nudge rules
  FOR rule IN 
    SELECT * FROM public.ai_nudge_rules 
    WHERE is_active = true
  LOOP
    -- Check for missing docs
    IF rule.trigger_condition = 'missing_docs' THEN
      FOR overdue_client IN
        SELECT DISTINCT co.client_user_id, co.id as onboarding_id
        FROM public.cpa_client_onboarding co
        JOIN public.cpa_document_requests cdr ON co.id = cdr.onboarding_id
        WHERE co.cpa_partner_id = rule.cpa_partner_id
        AND cdr.status = 'pending'
        AND cdr.due_date < (now() - (rule.days_threshold || ' days')::interval)
        AND NOT EXISTS (
          SELECT 1 FROM public.nudge_history nh
          WHERE nh.rule_id = rule.id 
          AND nh.client_user_id = co.client_user_id
          AND nh.nudge_sent_at > (now() - '7 days'::interval)
        )
      LOOP
        INSERT INTO public.nudge_history (
          rule_id, client_user_id, onboarding_id, trigger_reason
        ) VALUES (
          rule.id, overdue_client.client_user_id, overdue_client.onboarding_id,
          'Missing documents past due date'
        );
      END LOOP;
    END IF;
    
    -- Check for overdue responses
    IF rule.trigger_condition = 'overdue_response' THEN
      FOR overdue_client IN
        SELECT DISTINCT co.client_user_id, co.id as onboarding_id
        FROM public.cpa_client_onboarding co
        WHERE co.cpa_partner_id = rule.cpa_partner_id
        AND co.status IN ('organizer_pending', 'documents_pending')
        AND co.created_at < (now() - (rule.days_threshold || ' days')::interval)
        AND NOT EXISTS (
          SELECT 1 FROM public.nudge_history nh
          WHERE nh.rule_id = rule.id 
          AND nh.client_user_id = co.client_user_id
          AND nh.nudge_sent_at > (now() - '3 days'::interval)
        )
      LOOP
        INSERT INTO public.nudge_history (
          rule_id, client_user_id, onboarding_id, trigger_reason
        ) VALUES (
          rule.id, overdue_client.client_user_id, overdue_client.onboarding_id,
          'No response to onboarding requests'
        );
      END LOOP;
    END IF;
  END LOOP;
END;
$$;