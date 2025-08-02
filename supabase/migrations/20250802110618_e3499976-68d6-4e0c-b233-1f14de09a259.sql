-- Create marketing agencies table
CREATE TABLE public.marketing_agencies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  description TEXT,
  website_url TEXT,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  specializations TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'suspended', 'rejected')),
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  tenant_id UUID
);

-- Create agency performance metrics table
CREATE TABLE public.agency_performance_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID NOT NULL REFERENCES public.marketing_agencies(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_campaigns INTEGER DEFAULT 0,
  total_leads INTEGER DEFAULT 0,
  total_appointments INTEGER DEFAULT 0,
  total_closed_clients INTEGER DEFAULT 0,
  total_ad_spend NUMERIC DEFAULT 0,
  average_cpl NUMERIC DEFAULT 0,
  conversion_rate NUMERIC DEFAULT 0,
  close_rate NUMERIC DEFAULT 0,
  average_ltv NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(agency_id, period_start, period_end)
);

-- Create agency reviews table
CREATE TABLE public.agency_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID NOT NULL REFERENCES public.marketing_agencies(id) ON DELETE CASCADE,
  advisor_id UUID NOT NULL REFERENCES auth.users(id),
  campaign_id UUID REFERENCES public.ad_spend_tracking(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  response_text TEXT,
  responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create agency campaigns table
CREATE TABLE public.agency_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID NOT NULL REFERENCES public.marketing_agencies(id) ON DELETE CASCADE,
  advisor_id UUID NOT NULL REFERENCES auth.users(id),
  campaign_name TEXT NOT NULL,
  campaign_type TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  budget NUMERIC DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled', 'paused')),
  goals JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add agency_id to existing ad_spend_tracking table
ALTER TABLE public.ad_spend_tracking 
ADD COLUMN agency_id UUID REFERENCES public.marketing_agencies(id);

-- Add agency_id to existing leads table if it exists
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'leads' AND table_schema = 'public') THEN
    ALTER TABLE public.leads ADD COLUMN agency_id UUID REFERENCES public.marketing_agencies(id);
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX idx_agency_performance_agency_id ON public.agency_performance_metrics(agency_id);
CREATE INDEX idx_agency_reviews_agency_id ON public.agency_reviews(agency_id);
CREATE INDEX idx_agency_campaigns_agency_id ON public.agency_campaigns(agency_id);
CREATE INDEX idx_ad_spend_agency_id ON public.ad_spend_tracking(agency_id);

-- Enable RLS
ALTER TABLE public.marketing_agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_campaigns ENABLE ROW LEVEL SECURITY;

-- RLS Policies for marketing_agencies
CREATE POLICY "Anyone can view approved agencies" ON public.marketing_agencies
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Agencies can update their own profile" ON public.marketing_agencies
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Admins can manage all agencies" ON public.marketing_agencies
  FOR ALL USING (has_any_role(ARRAY['admin', 'system_administrator', 'tenant_admin']));

-- RLS Policies for agency_performance_metrics
CREATE POLICY "Anyone can view agency metrics" ON public.agency_performance_metrics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.marketing_agencies 
      WHERE id = agency_performance_metrics.agency_id 
      AND status = 'approved'
    )
  );

CREATE POLICY "Agencies can manage their own metrics" ON public.agency_performance_metrics
  FOR ALL USING (
    agency_id IN (
      SELECT id FROM public.marketing_agencies 
      WHERE created_by = auth.uid()
    )
  );

-- RLS Policies for agency_reviews
CREATE POLICY "Anyone can view agency reviews" ON public.agency_reviews
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.marketing_agencies 
      WHERE id = agency_reviews.agency_id 
      AND status = 'approved'
    )
  );

CREATE POLICY "Advisors can create reviews for their campaigns" ON public.agency_reviews
  FOR INSERT WITH CHECK (advisor_id = auth.uid());

CREATE POLICY "Advisors can update their own reviews" ON public.agency_reviews
  FOR UPDATE USING (advisor_id = auth.uid());

CREATE POLICY "Agencies can respond to reviews" ON public.agency_reviews
  FOR UPDATE USING (
    agency_id IN (
      SELECT id FROM public.marketing_agencies 
      WHERE created_by = auth.uid()
    )
  );

-- RLS Policies for agency_campaigns
CREATE POLICY "Advisors can view their campaigns" ON public.agency_campaigns
  FOR SELECT USING (advisor_id = auth.uid());

CREATE POLICY "Advisors can create campaigns" ON public.agency_campaigns
  FOR INSERT WITH CHECK (advisor_id = auth.uid());

CREATE POLICY "Advisors can update their campaigns" ON public.agency_campaigns
  FOR UPDATE USING (advisor_id = auth.uid());

CREATE POLICY "Agencies can view their campaigns" ON public.agency_campaigns
  FOR SELECT USING (
    agency_id IN (
      SELECT id FROM public.marketing_agencies 
      WHERE created_by = auth.uid()
    )
  );

-- Create function to calculate agency average ratings
CREATE OR REPLACE FUNCTION public.calculate_agency_average_rating(p_agency_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  avg_rating NUMERIC;
BEGIN
  SELECT AVG(rating) INTO avg_rating
  FROM public.agency_reviews
  WHERE agency_id = p_agency_id;
  
  RETURN COALESCE(avg_rating, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Create function to update agency performance metrics
CREATE OR REPLACE FUNCTION public.update_agency_performance_metrics(
  p_agency_id UUID,
  p_period_start DATE,
  p_period_end DATE
)
RETURNS VOID AS $$
DECLARE
  v_total_campaigns INTEGER := 0;
  v_total_leads INTEGER := 0;
  v_total_appointments INTEGER := 0;
  v_total_closed_clients INTEGER := 0;
  v_total_ad_spend NUMERIC := 0;
  v_average_cpl NUMERIC := 0;
  v_conversion_rate NUMERIC := 0;
  v_close_rate NUMERIC := 0;
BEGIN
  -- Calculate metrics from ad_spend_tracking and related tables
  SELECT 
    COUNT(DISTINCT campaign_id),
    COALESCE(SUM(impressions), 0),
    0, -- appointments - would need to join with appointments table
    0, -- closed clients - would need to join with closed deals
    COALESCE(SUM(amount), 0)
  INTO
    v_total_campaigns,
    v_total_leads,
    v_total_appointments,
    v_total_closed_clients,
    v_total_ad_spend
  FROM public.ad_spend_tracking
  WHERE agency_id = p_agency_id
    AND spend_date BETWEEN p_period_start AND p_period_end;
  
  -- Calculate derived metrics
  v_average_cpl := CASE WHEN v_total_leads > 0 THEN v_total_ad_spend / v_total_leads ELSE 0 END;
  v_conversion_rate := CASE WHEN v_total_leads > 0 THEN v_total_appointments::NUMERIC / v_total_leads ELSE 0 END;
  v_close_rate := CASE WHEN v_total_appointments > 0 THEN v_total_closed_clients::NUMERIC / v_total_appointments ELSE 0 END;
  
  -- Upsert performance metrics
  INSERT INTO public.agency_performance_metrics (
    agency_id, period_start, period_end, total_campaigns, total_leads,
    total_appointments, total_closed_clients, total_ad_spend,
    average_cpl, conversion_rate, close_rate
  ) VALUES (
    p_agency_id, p_period_start, p_period_end, v_total_campaigns, v_total_leads,
    v_total_appointments, v_total_closed_clients, v_total_ad_spend,
    v_average_cpl, v_conversion_rate, v_close_rate
  ) ON CONFLICT (agency_id, period_start, period_end)
  DO UPDATE SET
    total_campaigns = EXCLUDED.total_campaigns,
    total_leads = EXCLUDED.total_leads,
    total_appointments = EXCLUDED.total_appointments,
    total_closed_clients = EXCLUDED.total_closed_clients,
    total_ad_spend = EXCLUDED.total_ad_spend,
    average_cpl = EXCLUDED.average_cpl,
    conversion_rate = EXCLUDED.conversion_rate,
    close_rate = EXCLUDED.close_rate;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';