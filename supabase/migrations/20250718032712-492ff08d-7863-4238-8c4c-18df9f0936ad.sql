-- Add referring advisor tracking to profiles table
ALTER TABLE public.profiles 
ADD COLUMN referring_advisor_id UUID REFERENCES auth.users(id),
ADD COLUMN recruited_at TIMESTAMPTZ;

-- Create production tracking table for advisor revenue
CREATE TABLE public.advisor_production (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advisor_id UUID REFERENCES auth.users(id) NOT NULL,
  tenant_id UUID REFERENCES public.tenants(id) NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  gross_revenue NUMERIC DEFAULT 0,
  net_revenue NUMERIC DEFAULT 0,
  client_fees NUMERIC DEFAULT 0,
  aum_fees NUMERIC DEFAULT 0,
  commission NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(advisor_id, period_start, period_end)
);

-- Enable RLS on advisor production
ALTER TABLE public.advisor_production ENABLE ROW LEVEL SECURITY;

-- RLS policies for advisor production
CREATE POLICY "Advisors can view their own production" ON public.advisor_production
  FOR SELECT USING (advisor_id = auth.uid());

CREATE POLICY "Admins can manage all production" ON public.advisor_production
  FOR ALL USING (tenant_id = get_current_user_tenant_id() AND has_any_role(ARRAY['admin', 'tenant_admin']));

-- Function to create override when advisor is recruited
CREATE OR REPLACE FUNCTION public.create_advisor_override_on_recruit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  override_percent NUMERIC := 0.05; -- 5% default
  period_end_date DATE;
BEGIN
  -- Only process if referring_advisor_id is being set for the first time
  IF NEW.referring_advisor_id IS NOT NULL AND 
     (OLD.referring_advisor_id IS NULL OR OLD.referring_advisor_id != NEW.referring_advisor_id) THEN
    
    -- Set override period (2 years from recruitment)
    period_end_date := CURRENT_DATE + INTERVAL '2 years';
    
    -- Create advisor override record
    INSERT INTO public.advisor_overrides (
      tenant_id,
      referring_advisor_id,
      recruited_advisor_id,
      override_percent,
      production_period_start,
      production_period_end,
      status
    ) VALUES (
      NEW.tenant_id,
      NEW.referring_advisor_id,
      NEW.id,
      override_percent,
      CURRENT_DATE,
      period_end_date,
      'pending'
    );
    
    -- Set recruited_at timestamp if not already set
    IF NEW.recruited_at IS NULL THEN
      NEW.recruited_at := now();
    END IF;
    
    -- Log the override creation
    INSERT INTO public.audit_logs (event_type, status, details, user_id)
    VALUES (
      'advisor_override_created',
      'success',
      jsonb_build_object(
        'referring_advisor_id', NEW.referring_advisor_id,
        'recruited_advisor_id', NEW.id,
        'override_percent', override_percent,
        'period_end', period_end_date
      ),
      NEW.referring_advisor_id
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for automatic override creation
CREATE TRIGGER create_override_on_advisor_recruit
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_advisor_override_on_recruit();

-- Function to calculate and update override payouts
CREATE OR REPLACE FUNCTION public.calculate_advisor_overrides(p_period_start DATE, p_period_end DATE)
RETURNS TABLE(
  override_id UUID,
  referring_advisor_id UUID,
  recruited_advisor_id UUID,
  production_amount NUMERIC,
  override_amount NUMERIC,
  updated BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  override_record RECORD;
  production_total NUMERIC;
  calculated_override NUMERIC;
BEGIN
  -- Loop through all active overrides for the period
  FOR override_record IN 
    SELECT ao.* 
    FROM public.advisor_overrides ao
    WHERE ao.status = 'active'
    AND ao.production_period_start <= p_period_end
    AND (ao.production_period_end IS NULL OR ao.production_period_end >= p_period_start)
  LOOP
    -- Calculate production for the recruited advisor in the period
    SELECT COALESCE(SUM(ap.net_revenue), 0) INTO production_total
    FROM public.advisor_production ap
    WHERE ap.advisor_id = override_record.recruited_advisor_id
    AND ap.period_start >= GREATEST(override_record.production_period_start, p_period_start)
    AND ap.period_end <= LEAST(COALESCE(override_record.production_period_end, p_period_end), p_period_end);
    
    -- Calculate override amount
    calculated_override := production_total * override_record.override_percent;
    
    -- Update the override record
    UPDATE public.advisor_overrides
    SET 
      production_amount = production_total,
      override_amount = calculated_override,
      updated_at = now()
    WHERE id = override_record.id;
    
    -- Return the results
    RETURN QUERY SELECT 
      override_record.id,
      override_record.referring_advisor_id,
      override_record.recruited_advisor_id,
      production_total,
      calculated_override,
      TRUE;
  END LOOP;
END;
$$;

-- Function to process referral code and recruit advisor
CREATE OR REPLACE FUNCTION public.process_advisor_referral(p_referral_code TEXT, p_new_advisor_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  referral_record RECORD;
  advisor_profile RECORD;
BEGIN
  -- Find the referral record
  SELECT * INTO referral_record
  FROM public.referrals
  WHERE referral_code = p_referral_code
  AND referral_type = 'advisor'
  AND status = 'pending'
  AND (expires_at IS NULL OR expires_at > now());
  
  IF referral_record IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Get the new advisor's profile
  SELECT * INTO advisor_profile
  FROM public.profiles
  WHERE id = p_new_advisor_id;
  
  IF advisor_profile IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Update the advisor's profile with referring advisor
  UPDATE public.profiles
  SET 
    referring_advisor_id = referral_record.referrer_id,
    recruited_at = now()
  WHERE id = p_new_advisor_id;
  
  -- Update referral status
  UPDATE public.referrals
  SET 
    referee_id = p_new_advisor_id,
    status = 'active',
    activated_at = now()
  WHERE id = referral_record.id;
  
  -- Activate referral function will handle reward creation
  PERFORM public.activate_referral(p_new_advisor_id);
  
  RETURN TRUE;
END;
$$;

-- Indexes for performance
CREATE INDEX idx_advisor_production_advisor_period ON public.advisor_production(advisor_id, period_start, period_end);
CREATE INDEX idx_advisor_production_tenant ON public.advisor_production(tenant_id);
CREATE INDEX idx_profiles_referring_advisor ON public.profiles(referring_advisor_id);

-- Trigger for updated_at on advisor_production
CREATE TRIGGER update_advisor_production_updated_at
  BEFORE UPDATE ON public.advisor_production
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();