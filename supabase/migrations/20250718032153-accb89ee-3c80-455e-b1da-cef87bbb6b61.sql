-- Create referral and override tracking tables

-- Referral Tracking Table
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) NOT NULL,
  referrer_id UUID REFERENCES auth.users(id) NOT NULL,
  referee_id UUID REFERENCES auth.users(id),
  referral_code TEXT UNIQUE NOT NULL,
  referral_type TEXT NOT NULL CHECK (referral_type IN ('client', 'advisor', 'franchise')),
  reward_amount NUMERIC DEFAULT 0,
  reward_type TEXT CHECK (reward_type IN ('credit', 'override', 'bonus', 'gift_card', 'discount')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'paid', 'expired', 'cancelled')),
  expires_at TIMESTAMPTZ,
  activated_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Advisor Override Table
CREATE TABLE public.advisor_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) NOT NULL,
  referring_advisor_id UUID REFERENCES auth.users(id) NOT NULL,
  recruited_advisor_id UUID REFERENCES auth.users(id) NOT NULL,
  override_percent NUMERIC NOT NULL CHECK (override_percent > 0 AND override_percent <= 1),
  production_period_start DATE NOT NULL,
  production_period_end DATE,
  production_amount NUMERIC DEFAULT 0,
  override_amount NUMERIC DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'paid', 'expired')),
  payment_frequency TEXT DEFAULT 'monthly' CHECK (payment_frequency IN ('monthly', 'quarterly', 'annually')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Referral Rewards Table for tracking individual reward payouts
CREATE TABLE public.referral_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_id UUID REFERENCES public.referrals(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  reward_type TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  paid_at TIMESTAMPTZ,
  payment_method TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisor_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_rewards ENABLE ROW LEVEL SECURITY;

-- RLS Policies for referrals
CREATE POLICY "Users can view referrals in their tenant" ON public.referrals
  FOR SELECT USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can create referrals in their tenant" ON public.referrals
  FOR INSERT WITH CHECK (tenant_id = get_current_user_tenant_id() AND referrer_id = auth.uid());

CREATE POLICY "Users can update their own referrals" ON public.referrals
  FOR UPDATE USING (tenant_id = get_current_user_tenant_id() AND referrer_id = auth.uid());

-- RLS Policies for advisor overrides
CREATE POLICY "Advisors can view their overrides" ON public.advisor_overrides
  FOR SELECT USING (tenant_id = get_current_user_tenant_id() AND 
    (referring_advisor_id = auth.uid() OR recruited_advisor_id = auth.uid()));

CREATE POLICY "Admins can manage overrides" ON public.advisor_overrides
  FOR ALL USING (tenant_id = get_current_user_tenant_id() AND has_any_role(ARRAY['admin', 'tenant_admin']));

-- RLS Policies for referral rewards
CREATE POLICY "Users can view their rewards" ON public.referral_rewards
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage rewards" ON public.referral_rewards
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.referrals 
    WHERE id = referral_rewards.referral_id 
    AND tenant_id = get_current_user_tenant_id() 
    AND has_any_role(ARRAY['admin', 'tenant_admin'])
  ));

-- Indexes for performance
CREATE INDEX idx_referrals_tenant_id ON public.referrals(tenant_id);
CREATE INDEX idx_referrals_referrer_id ON public.referrals(referrer_id);
CREATE INDEX idx_referrals_referee_id ON public.referrals(referee_id);
CREATE INDEX idx_referrals_code ON public.referrals(referral_code);
CREATE INDEX idx_referrals_status ON public.referrals(status);

CREATE INDEX idx_advisor_overrides_tenant_id ON public.advisor_overrides(tenant_id);
CREATE INDEX idx_advisor_overrides_referring_advisor ON public.advisor_overrides(referring_advisor_id);
CREATE INDEX idx_advisor_overrides_recruited_advisor ON public.advisor_overrides(recruited_advisor_id);

-- Triggers for updated_at
CREATE TRIGGER update_referrals_updated_at
  BEFORE UPDATE ON public.referrals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_advisor_overrides_updated_at
  BEFORE UPDATE ON public.advisor_overrides
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate unique referral codes
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  code TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- Generate 8-character alphanumeric code
    code := upper(substring(encode(gen_random_bytes(6), 'base64') from 1 for 8));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.referrals WHERE referral_code = code) INTO exists_check;
    
    IF NOT exists_check THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN code;
END;
$$;

-- Function to activate referral when referee becomes active
CREATE OR REPLACE FUNCTION public.activate_referral(p_referee_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  referral_record RECORD;
BEGIN
  -- Find pending referral for this referee
  SELECT * INTO referral_record 
  FROM public.referrals 
  WHERE referee_id = p_referee_id 
  AND status = 'pending';
  
  IF referral_record IS NOT NULL THEN
    -- Update referral status to active
    UPDATE public.referrals 
    SET status = 'active', activated_at = now()
    WHERE id = referral_record.id;
    
    -- Create referral reward record
    INSERT INTO public.referral_rewards (
      referral_id, user_id, reward_type, amount
    ) VALUES (
      referral_record.id,
      referral_record.referrer_id,
      referral_record.reward_type,
      referral_record.reward_amount
    );
    
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$;