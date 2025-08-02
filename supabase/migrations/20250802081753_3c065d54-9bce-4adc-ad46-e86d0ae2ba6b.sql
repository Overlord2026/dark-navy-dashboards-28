-- Add lead scoring and automation fields to leads table
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS lead_score INTEGER DEFAULT 0;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS engagement_score INTEGER DEFAULT 0;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS budget_score INTEGER DEFAULT 0;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS timeline_score INTEGER DEFAULT 0;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS fit_score INTEGER DEFAULT 0;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS timeline_to_purchase TEXT DEFAULT 'unknown';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS fit_assessment TEXT DEFAULT 'unknown';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS last_contact_attempt TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS next_follow_up_due TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS follow_up_count INTEGER DEFAULT 0;

-- Create lead_engagement_tracking table
CREATE TABLE IF NOT EXISTS public.lead_engagement_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  engagement_type TEXT NOT NULL, -- 'email_opened', 'email_replied', 'meeting_booked', 'phone_answered', 'form_submitted'
  engagement_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  engagement_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pipeline_stage_config table for configurable automation
CREATE TABLE IF NOT EXISTS public.pipeline_stage_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advisor_id UUID NOT NULL,
  stage_name TEXT NOT NULL,
  follow_up_delay_hours INTEGER DEFAULT 24,
  email_template TEXT,
  sms_template TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create automated_follow_ups table
CREATE TABLE IF NOT EXISTS public.automated_follow_ups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  advisor_id UUID NOT NULL,
  follow_up_type TEXT NOT NULL, -- 'email', 'sms', 'call_reminder'
  stage TEXT NOT NULL,
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'cancelled'
  content TEXT,
  response_received BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE public.lead_engagement_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_stage_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automated_follow_ups ENABLE ROW LEVEL SECURITY;

-- RLS policies for lead_engagement_tracking
CREATE POLICY "Advisors can manage engagement tracking for their leads" ON public.lead_engagement_tracking
FOR ALL
USING (
  lead_id IN (
    SELECT id FROM public.leads WHERE advisor_id = auth.uid()
  )
);

-- RLS policies for pipeline_stage_config
CREATE POLICY "Advisors can manage their own pipeline config" ON public.pipeline_stage_config
FOR ALL
USING (advisor_id = auth.uid());

-- RLS policies for automated_follow_ups
CREATE POLICY "Advisors can manage their own follow-ups" ON public.automated_follow_ups
FOR ALL
USING (advisor_id = auth.uid());

-- Create function to calculate lead score
CREATE OR REPLACE FUNCTION public.calculate_lead_score(p_lead_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_engagement_score INTEGER := 0;
  v_budget_score INTEGER := 0;
  v_timeline_score INTEGER := 0;
  v_fit_score INTEGER := 0;
  v_total_score INTEGER := 0;
  v_lead_record RECORD;
  v_engagement_count INTEGER := 0;
BEGIN
  -- Get lead data
  SELECT * INTO v_lead_record FROM public.leads WHERE id = p_lead_id;
  
  IF v_lead_record IS NULL THEN
    RETURN 0;
  END IF;
  
  -- Calculate engagement score (0-30 points)
  SELECT COUNT(*) INTO v_engagement_count
  FROM public.lead_engagement_tracking
  WHERE lead_id = p_lead_id;
  
  v_engagement_score := LEAST(30, v_engagement_count * 5); -- 5 points per engagement, max 30
  
  -- Bonus points for specific engagement types
  IF EXISTS (SELECT 1 FROM public.lead_engagement_tracking WHERE lead_id = p_lead_id AND engagement_type = 'meeting_booked') THEN
    v_engagement_score := v_engagement_score + 15;
  END IF;
  
  IF EXISTS (SELECT 1 FROM public.lead_engagement_tracking WHERE lead_id = p_lead_id AND engagement_type = 'email_replied') THEN
    v_engagement_score := v_engagement_score + 10;
  END IF;
  
  v_engagement_score := LEAST(30, v_engagement_score);
  
  -- Calculate budget score (0-25 points)
  CASE 
    WHEN v_lead_record.lead_value >= 2000000 THEN v_budget_score := 25;
    WHEN v_lead_record.lead_value >= 1000000 THEN v_budget_score := 20;
    WHEN v_lead_record.lead_value >= 500000 THEN v_budget_score := 15;
    WHEN v_lead_record.lead_value >= 250000 THEN v_budget_score := 10;
    WHEN v_lead_record.lead_value >= 100000 THEN v_budget_score := 5;
    ELSE v_budget_score := 0;
  END CASE;
  
  -- Calculate timeline score (0-25 points)
  CASE v_lead_record.timeline_to_purchase
    WHEN 'immediate' THEN v_timeline_score := 25;
    WHEN '1-3_months' THEN v_timeline_score := 20;
    WHEN '3-6_months' THEN v_timeline_score := 15;
    WHEN '6-12_months' THEN v_timeline_score := 10;
    WHEN '12+_months' THEN v_timeline_score := 5;
    ELSE v_timeline_score := 0;
  END CASE;
  
  -- Calculate fit score (0-20 points)
  CASE v_lead_record.fit_assessment
    WHEN 'excellent' THEN v_fit_score := 20;
    WHEN 'good' THEN v_fit_score := 15;
    WHEN 'fair' THEN v_fit_score := 10;
    WHEN 'poor' THEN v_fit_score := 5;
    ELSE v_fit_score := 0;
  END CASE;
  
  -- Calculate total score
  v_total_score := v_engagement_score + v_budget_score + v_timeline_score + v_fit_score;
  
  -- Update the lead record with individual scores
  UPDATE public.leads SET
    engagement_score = v_engagement_score,
    budget_score = v_budget_score,
    timeline_score = v_timeline_score,
    fit_score = v_fit_score,
    lead_score = v_total_score,
    updated_at = NOW()
  WHERE id = p_lead_id;
  
  RETURN v_total_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to schedule follow-ups
CREATE OR REPLACE FUNCTION public.schedule_follow_up(p_lead_id UUID, p_stage TEXT)
RETURNS VOID AS $$
DECLARE
  v_lead_record RECORD;
  v_config_record RECORD;
  v_follow_up_time TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get lead data
  SELECT * INTO v_lead_record FROM public.leads WHERE id = p_lead_id;
  
  IF v_lead_record IS NULL THEN
    RETURN;
  END IF;
  
  -- Get stage configuration
  SELECT * INTO v_config_record 
  FROM public.pipeline_stage_config 
  WHERE advisor_id = v_lead_record.advisor_id 
    AND stage_name = p_stage 
    AND is_active = true;
  
  IF v_config_record IS NULL THEN
    -- Create default config if none exists
    INSERT INTO public.pipeline_stage_config (advisor_id, stage_name, follow_up_delay_hours, email_template, sms_template)
    VALUES (
      v_lead_record.advisor_id,
      p_stage,
      24,
      'Hi {{name}}, following up on your inquiry. Let me know if you have any questions!',
      'Hi {{name}}, checking in about your financial planning needs. Reply YES to schedule a call.'
    );
    
    v_follow_up_time := NOW() + INTERVAL '24 hours';
  ELSE
    v_follow_up_time := NOW() + INTERVAL '1 hour' * v_config_record.follow_up_delay_hours;
  END IF;
  
  -- Schedule email follow-up
  INSERT INTO public.automated_follow_ups (lead_id, advisor_id, follow_up_type, stage, scheduled_for, content)
  VALUES (
    p_lead_id,
    v_lead_record.advisor_id,
    'email',
    p_stage,
    v_follow_up_time,
    COALESCE(v_config_record.email_template, 'Hi {{name}}, following up on your inquiry. Let me know if you have any questions!')
  );
  
  -- Schedule SMS follow-up (1 hour after email)
  INSERT INTO public.automated_follow_ups (lead_id, advisor_id, follow_up_type, stage, scheduled_for, content)
  VALUES (
    p_lead_id,
    v_lead_record.advisor_id,
    'sms',
    p_stage,
    v_follow_up_time + INTERVAL '1 hour',
    COALESCE(v_config_record.sms_template, 'Hi {{name}}, checking in about your financial planning needs. Reply YES to schedule a call.')
  );
  
  -- Update lead's next follow-up due date
  UPDATE public.leads SET 
    next_follow_up_due = v_follow_up_time,
    updated_at = NOW()
  WHERE id = p_lead_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-calculate lead score on engagement
CREATE OR REPLACE FUNCTION public.trigger_lead_score_calculation()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM public.calculate_lead_score(NEW.lead_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER engagement_score_update
AFTER INSERT ON public.lead_engagement_tracking
FOR EACH ROW
EXECUTE FUNCTION public.trigger_lead_score_calculation();

-- Create trigger to schedule follow-ups on status change
CREATE OR REPLACE FUNCTION public.trigger_follow_up_scheduling()
RETURNS TRIGGER AS $$
BEGIN
  -- Only schedule if status actually changed
  IF OLD.lead_status IS DISTINCT FROM NEW.lead_status THEN
    PERFORM public.schedule_follow_up(NEW.id, NEW.lead_status);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER lead_status_follow_up
AFTER UPDATE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.trigger_follow_up_scheduling();

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_lead_engagement_lead_id ON public.lead_engagement_tracking(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_engagement_type ON public.lead_engagement_tracking(engagement_type);
CREATE INDEX IF NOT EXISTS idx_leads_score ON public.leads(lead_score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_next_follow_up ON public.leads(next_follow_up_due);
CREATE INDEX IF NOT EXISTS idx_automated_follow_ups_scheduled ON public.automated_follow_ups(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_automated_follow_ups_status ON public.automated_follow_ups(status);