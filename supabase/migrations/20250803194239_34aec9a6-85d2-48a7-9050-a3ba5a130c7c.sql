-- Create CRM and lead management tables
CREATE TABLE IF NOT EXISTS public.crm_clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  advisor_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'prospect',
  lead_value NUMERIC DEFAULT 0,
  ai_opportunities JSONB DEFAULT '[]'::jsonb,
  tax_savings_estimate NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.crm_clients ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Advisors can manage their clients" 
ON public.crm_clients 
FOR ALL 
USING (advisor_id = auth.uid());

-- Create leads table
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  advisor_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  lead_status TEXT NOT NULL DEFAULT 'new',
  lead_value NUMERIC DEFAULT 0,
  timeline_to_purchase TEXT,
  fit_assessment TEXT,
  engagement_score INTEGER DEFAULT 0,
  budget_score INTEGER DEFAULT 0,
  timeline_score INTEGER DEFAULT 0,
  fit_score INTEGER DEFAULT 0,
  lead_score INTEGER DEFAULT 0,
  next_follow_up_due TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Advisors can manage their leads" 
ON public.leads 
FOR ALL 
USING (advisor_id = auth.uid());

-- Create lead engagement tracking
CREATE TABLE IF NOT EXISTS public.lead_engagement_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads(id),
  engagement_type TEXT NOT NULL,
  engagement_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lead_engagement_tracking ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Advisors can view engagement for their leads" 
ON public.lead_engagement_tracking 
FOR ALL 
USING (lead_id IN (SELECT id FROM public.leads WHERE advisor_id = auth.uid()));

-- Create pipeline stage config
CREATE TABLE IF NOT EXISTS public.pipeline_stage_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  advisor_id UUID NOT NULL,
  stage_name TEXT NOT NULL,
  follow_up_delay_hours INTEGER DEFAULT 24,
  email_template TEXT,
  sms_template TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pipeline_stage_config ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Advisors can manage their pipeline config" 
ON public.pipeline_stage_config 
FOR ALL 
USING (advisor_id = auth.uid());

-- Create automated follow ups
CREATE TABLE IF NOT EXISTS public.automated_follow_ups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads(id),
  advisor_id UUID NOT NULL,
  follow_up_type TEXT NOT NULL,
  stage TEXT NOT NULL,
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.automated_follow_ups ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Advisors can manage their follow ups" 
ON public.automated_follow_ups 
FOR ALL 
USING (advisor_id = auth.uid());

-- Create ad accounts table
CREATE TABLE IF NOT EXISTS public.ad_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  advisor_id UUID NOT NULL,
  platform TEXT NOT NULL,
  account_id TEXT NOT NULL,
  account_name TEXT NOT NULL,
  access_token_encrypted TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ad_accounts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Advisors can manage their ad accounts" 
ON public.ad_accounts 
FOR ALL 
USING (advisor_id = auth.uid());

-- Create ad campaign data
CREATE TABLE IF NOT EXISTS public.ad_campaign_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  advisor_id UUID NOT NULL,
  campaign_id TEXT NOT NULL,
  campaign_name TEXT NOT NULL,
  platform TEXT NOT NULL,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  cost NUMERIC DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  date_range_start DATE NOT NULL,
  date_range_end DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ad_campaign_data ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Advisors can view their ad campaign data" 
ON public.ad_campaign_data 
FOR ALL 
USING (advisor_id = auth.uid());

-- Create lead attributions
CREATE TABLE IF NOT EXISTS public.lead_attributions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads(id),
  advisor_id UUID NOT NULL,
  source_platform TEXT NOT NULL,
  campaign_id TEXT,
  campaign_name TEXT,
  ad_set_id TEXT,
  ad_id TEXT,
  attribution_data JSONB DEFAULT '{}'::jsonb,
  cost_per_lead NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lead_attributions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Advisors can view their lead attributions" 
ON public.lead_attributions 
FOR ALL 
USING (advisor_id = auth.uid());

-- Create reminder rules
CREATE TABLE IF NOT EXISTS public.reminder_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  advisor_id UUID NOT NULL,
  rule_name TEXT NOT NULL,
  trigger_type TEXT NOT NULL,
  trigger_conditions JSONB DEFAULT '{}'::jsonb,
  action_type TEXT NOT NULL,
  action_config JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reminder_rules ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Advisors can manage their reminder rules" 
ON public.reminder_rules 
FOR ALL 
USING (advisor_id = auth.uid());

-- Create reminder executions
CREATE TABLE IF NOT EXISTS public.reminder_executions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_id UUID NOT NULL REFERENCES public.reminder_rules(id),
  target_id UUID NOT NULL,
  target_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  executed_at TIMESTAMP WITH TIME ZONE,
  result_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reminder_executions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Advisors can view their reminder executions" 
ON public.reminder_executions 
FOR ALL 
USING (rule_id IN (SELECT id FROM public.reminder_rules WHERE advisor_id = auth.uid()));

-- Create email campaigns
CREATE TABLE IF NOT EXISTS public.email_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  advisor_id UUID NOT NULL,
  campaign_name TEXT NOT NULL,
  subject_line TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  recipient_count INTEGER DEFAULT 0,
  open_rate NUMERIC DEFAULT 0,
  click_rate NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Advisors can manage their email campaigns" 
ON public.email_campaigns 
FOR ALL 
USING (advisor_id = auth.uid());

-- Create meeting summaries
CREATE TABLE IF NOT EXISTS public.meeting_summaries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  advisor_id UUID NOT NULL,
  client_email TEXT NOT NULL,
  meeting_platform TEXT NOT NULL,
  meeting_date TIMESTAMP WITH TIME ZONE NOT NULL,
  summary_content TEXT,
  action_items JSONB DEFAULT '[]'::jsonb,
  key_insights JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'pending',
  recording_url TEXT,
  transcript TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.meeting_summaries ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Advisors can manage their meeting summaries" 
ON public.meeting_summaries 
FOR ALL 
USING (advisor_id = auth.uid());