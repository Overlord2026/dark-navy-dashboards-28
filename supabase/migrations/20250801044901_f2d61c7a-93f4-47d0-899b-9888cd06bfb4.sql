-- Ongoing Client Engagement & Upsell Tables

-- Tax completion triggers and engagement campaigns
CREATE TABLE public.tax_completion_triggers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cpa_partner_id UUID NOT NULL,
  trigger_name TEXT NOT NULL,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('planning_guide', 'review_invitation', 'upsell_campaign')),
  content JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  delay_days INTEGER NOT NULL DEFAULT 0,
  target_audience JSONB NOT NULL DEFAULT '{}', -- client criteria
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Track when triggers fire for clients
CREATE TABLE public.client_engagement_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_user_id UUID NOT NULL,
  cpa_partner_id UUID NOT NULL,
  trigger_id UUID REFERENCES public.tax_completion_triggers(id),
  engagement_type TEXT NOT NULL,
  content_delivered JSONB NOT NULL DEFAULT '{}',
  delivery_method TEXT NOT NULL CHECK (delivery_method IN ('email', 'in_app', 'sms')),
  delivered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  converted_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'opened', 'clicked', 'converted', 'failed'))
);

-- Family Office cross-sell tracking
CREATE TABLE public.family_office_upsells (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_user_id UUID NOT NULL,
  cpa_partner_id UUID NOT NULL,
  upsell_type TEXT NOT NULL CHECK (upsell_type IN ('dashboard_access', 'premium_planning', 'wealth_management', 'estate_planning')),
  presentation_context TEXT NOT NULL, -- where/when shown
  presented_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  clicked_at TIMESTAMP WITH TIME ZONE,
  converted_at TIMESTAMP WITH TIME ZONE,
  conversion_value NUMERIC,
  status TEXT NOT NULL DEFAULT 'presented' CHECK (status IN ('presented', 'clicked', 'converted', 'declined')),
  metadata JSONB NOT NULL DEFAULT '{}'
);

-- CPA Marketplace partner directory
CREATE TABLE public.marketplace_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cpa_partner_id UUID NOT NULL, -- who added this partner
  partner_type TEXT NOT NULL CHECK (partner_type IN ('tax_pro', 'financial_planner', 'estate_attorney', 'insurance_agent', 'business_attorney', 'wealth_manager')),
  partner_name TEXT NOT NULL,
  partner_email TEXT NOT NULL,
  partner_phone TEXT,
  firm_name TEXT NOT NULL,
  specialties TEXT[] NOT NULL DEFAULT '{}',
  bio TEXT,
  website_url TEXT,
  logo_url TEXT,
  location JSONB, -- city, state, zip
  fee_structure TEXT,
  credentials TEXT[] NOT NULL DEFAULT '{}',
  years_experience INTEGER,
  rating NUMERIC(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  referral_fee_percent NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Client partner referrals
CREATE TABLE public.client_partner_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_user_id UUID NOT NULL,
  cpa_partner_id UUID NOT NULL,
  marketplace_partner_id UUID REFERENCES public.marketplace_partners(id),
  referral_type TEXT NOT NULL,
  client_need TEXT NOT NULL, -- what the client is looking for
  referral_notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'meeting_scheduled', 'engaged', 'completed', 'declined')),
  referred_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  contacted_at TIMESTAMP WITH TIME ZONE,
  meeting_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  referral_fee_earned NUMERIC,
  feedback_rating INTEGER CHECK (feedback_rating BETWEEN 1 AND 5),
  feedback_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Planning guides and resources
CREATE TABLE public.planning_guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cpa_partner_id UUID NOT NULL,
  guide_title TEXT NOT NULL,
  guide_type TEXT NOT NULL CHECK (guide_type IN ('tax_planning', 'retirement_planning', 'estate_planning', 'business_planning', 'investment_planning')),
  description TEXT,
  content_url TEXT, -- link to PDF or resource
  thumbnail_url TEXT,
  target_audience JSONB NOT NULL DEFAULT '{}', -- client criteria
  is_premium BOOLEAN NOT NULL DEFAULT false,
  download_count INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Track guide downloads/views
CREATE TABLE public.client_guide_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_user_id UUID NOT NULL,
  guide_id UUID REFERENCES public.planning_guides(id),
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('viewed', 'downloaded', 'shared')),
  interaction_source TEXT NOT NULL, -- how they found it
  interacted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.tax_completion_triggers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_engagement_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_office_upsells ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_partner_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planning_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_guide_interactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tax_completion_triggers
CREATE POLICY "CPA partners can manage their triggers" ON public.tax_completion_triggers
  FOR ALL USING (cpa_partner_id IN (SELECT id FROM public.cpa_partners WHERE user_id = auth.uid()));

-- RLS Policies for client_engagement_history
CREATE POLICY "CPA partners can view their client engagement" ON public.client_engagement_history
  FOR ALL USING (cpa_partner_id IN (SELECT id FROM public.cpa_partners WHERE user_id = auth.uid()));

CREATE POLICY "Clients can view their engagement history" ON public.client_engagement_history
  FOR SELECT USING (client_user_id = auth.uid());

-- RLS Policies for family_office_upsells
CREATE POLICY "CPA partners can manage their upsells" ON public.family_office_upsells
  FOR ALL USING (cpa_partner_id IN (SELECT id FROM public.cpa_partners WHERE user_id = auth.uid()));

CREATE POLICY "Clients can view their upsell history" ON public.family_office_upsells
  FOR SELECT USING (client_user_id = auth.uid());

-- RLS Policies for marketplace_partners
CREATE POLICY "CPA partners can manage their marketplace partners" ON public.marketplace_partners
  FOR ALL USING (cpa_partner_id IN (SELECT id FROM public.cpa_partners WHERE user_id = auth.uid()));

CREATE POLICY "Clients can view verified active partners" ON public.marketplace_partners
  FOR SELECT USING (is_verified = true AND is_active = true);

-- RLS Policies for client_partner_referrals
CREATE POLICY "CPA partners can manage their referrals" ON public.client_partner_referrals
  FOR ALL USING (cpa_partner_id IN (SELECT id FROM public.cpa_partners WHERE user_id = auth.uid()));

CREATE POLICY "Clients can view their referrals" ON public.client_partner_referrals
  FOR SELECT USING (client_user_id = auth.uid());

CREATE POLICY "Clients can update their referral feedback" ON public.client_partner_referrals
  FOR UPDATE USING (client_user_id = auth.uid());

-- RLS Policies for planning_guides
CREATE POLICY "CPA partners can manage their guides" ON public.planning_guides
  FOR ALL USING (cpa_partner_id IN (SELECT id FROM public.cpa_partners WHERE user_id = auth.uid()));

CREATE POLICY "Clients can view active guides" ON public.planning_guides
  FOR SELECT USING (is_active = true);

-- RLS Policies for client_guide_interactions
CREATE POLICY "System can insert guide interactions" ON public.client_guide_interactions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their guide interactions" ON public.client_guide_interactions
  FOR SELECT USING (client_user_id = auth.uid());

-- Updated at triggers
CREATE TRIGGER update_tax_completion_triggers_updated_at
  BEFORE UPDATE ON public.tax_completion_triggers
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_family_office_upsells_updated_at
  BEFORE UPDATE ON public.family_office_upsells
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_marketplace_partners_updated_at
  BEFORE UPDATE ON public.marketplace_partners
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_client_partner_referrals_updated_at
  BEFORE UPDATE ON public.client_partner_referrals
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_planning_guides_updated_at
  BEFORE UPDATE ON public.planning_guides
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

-- Function to check and fire tax completion triggers
CREATE OR REPLACE FUNCTION public.check_tax_completion_triggers()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  trigger_record RECORD;
  client_record RECORD;
BEGIN
  -- Only fire when onboarding stage changes to 'completed'
  IF NEW.onboarding_stage = 'completed' AND OLD.onboarding_stage != 'completed' THEN
    
    -- Get client info
    SELECT * INTO client_record FROM public.profiles WHERE id = NEW.client_user_id;
    
    -- Find active triggers for this CPA partner
    FOR trigger_record IN 
      SELECT * FROM public.tax_completion_triggers 
      WHERE cpa_partner_id = NEW.cpa_partner_id 
        AND is_active = true
    LOOP
      -- Schedule trigger execution (would typically be handled by edge function)
      INSERT INTO public.client_engagement_history (
        client_user_id,
        cpa_partner_id,
        trigger_id,
        engagement_type,
        content_delivered,
        delivery_method,
        status
      ) VALUES (
        NEW.client_user_id,
        NEW.cpa_partner_id,
        trigger_record.id,
        trigger_record.trigger_type,
        trigger_record.content,
        'email',
        'sent'
      );
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger to fire completion events
CREATE TRIGGER on_tax_completion
  AFTER UPDATE ON public.cpa_client_onboarding
  FOR EACH ROW EXECUTE FUNCTION public.check_tax_completion_triggers();