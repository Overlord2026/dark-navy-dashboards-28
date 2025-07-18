-- Create franchise_referrals table for tracking firm/advisor team referrals
CREATE TABLE public.franchise_referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  referring_tenant_id UUID NOT NULL,
  referral_code TEXT NOT NULL UNIQUE,
  
  -- Referred entity information
  referred_firm_name TEXT NOT NULL,
  referred_contact_name TEXT NOT NULL,
  referred_contact_email TEXT NOT NULL,
  referred_contact_phone TEXT,
  firm_size INTEGER,
  expected_aum NUMERIC,
  
  -- Tracking
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'demo_scheduled', 'negotiating', 'signed', 'cancelled', 'expired')),
  contacted_at TIMESTAMP WITH TIME ZONE,
  demo_scheduled_at TIMESTAMP WITH TIME ZONE,
  signed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '90 days'),
  
  -- Referral rewards/royalty
  referral_reward_type TEXT NOT NULL DEFAULT 'percentage' CHECK (referral_reward_type IN ('percentage', 'fixed', 'royalty')),
  referral_reward_amount NUMERIC NOT NULL DEFAULT 0,
  royalty_period_months INTEGER DEFAULT 12,
  reward_status TEXT NOT NULL DEFAULT 'pending' CHECK (reward_status IN ('pending', 'approved', 'paid', 'cancelled')),
  
  -- Metadata
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create franchise_referral_payouts table for tracking payments
CREATE TABLE public.franchise_referral_payouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  franchise_referral_id UUID NOT NULL REFERENCES public.franchise_referrals(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL,
  referring_tenant_id UUID NOT NULL,
  
  -- Payout details
  payout_type TEXT NOT NULL CHECK (payout_type IN ('referral_bonus', 'monthly_royalty', 'annual_royalty')),
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  period_start DATE,
  period_end DATE,
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'processing', 'paid', 'failed', 'cancelled')),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID,
  paid_at TIMESTAMP WITH TIME ZONE,
  payment_method TEXT,
  payment_reference TEXT,
  
  -- Metadata
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.franchise_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_referral_payouts ENABLE ROW LEVEL SECURITY;

-- RLS policies for franchise_referrals
CREATE POLICY "Tenant admins can view referrals for their tenant"
  ON public.franchise_referrals FOR SELECT
  USING (
    is_tenant_admin() AND 
    (tenant_id = get_current_user_tenant_id() OR referring_tenant_id = get_current_user_tenant_id())
  );

CREATE POLICY "Tenant admins can create referrals for their tenant"
  ON public.franchise_referrals FOR INSERT
  WITH CHECK (
    is_tenant_admin() AND 
    referring_tenant_id = get_current_user_tenant_id()
  );

CREATE POLICY "Tenant admins can update referrals for their tenant"
  ON public.franchise_referrals FOR UPDATE
  USING (
    is_tenant_admin() AND 
    (tenant_id = get_current_user_tenant_id() OR referring_tenant_id = get_current_user_tenant_id())
  );

-- RLS policies for franchise_referral_payouts
CREATE POLICY "Tenant admins can view franchise payouts"
  ON public.franchise_referral_payouts FOR SELECT
  USING (
    is_tenant_admin() AND 
    (tenant_id = get_current_user_tenant_id() OR referring_tenant_id = get_current_user_tenant_id())
  );

CREATE POLICY "Tenant admins can create franchise payouts"
  ON public.franchise_referral_payouts FOR INSERT
  WITH CHECK (
    is_tenant_admin() AND 
    tenant_id = get_current_user_tenant_id()
  );

CREATE POLICY "Tenant admins can update franchise payouts"
  ON public.franchise_referral_payouts FOR UPDATE
  USING (
    is_tenant_admin() AND 
    tenant_id = get_current_user_tenant_id()
  );

-- Create indexes for performance
CREATE INDEX idx_franchise_referrals_tenant_id ON public.franchise_referrals(tenant_id);
CREATE INDEX idx_franchise_referrals_referring_tenant_id ON public.franchise_referrals(referring_tenant_id);
CREATE INDEX idx_franchise_referrals_status ON public.franchise_referrals(status);
CREATE INDEX idx_franchise_referrals_referral_code ON public.franchise_referrals(referral_code);

CREATE INDEX idx_franchise_referral_payouts_franchise_referral_id ON public.franchise_referral_payouts(franchise_referral_id);
CREATE INDEX idx_franchise_referral_payouts_tenant_id ON public.franchise_referral_payouts(tenant_id);
CREATE INDEX idx_franchise_referral_payouts_status ON public.franchise_referral_payouts(status);

-- Create triggers for updated_at
CREATE TRIGGER update_franchise_referrals_updated_at
  BEFORE UPDATE ON public.franchise_referrals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_franchise_referral_payouts_updated_at
  BEFORE UPDATE ON public.franchise_referral_payouts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate franchise referral codes
CREATE OR REPLACE FUNCTION public.generate_franchise_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  code TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- Generate 10-character alphanumeric code with 'FIRM-' prefix
    code := 'FIRM-' || upper(substring(encode(gen_random_bytes(4), 'base64') from 1 for 6));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.franchise_referrals WHERE referral_code = code) INTO exists_check;
    
    IF NOT exists_check THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN code;
END;
$$;

-- Function to create franchise referral payout
CREATE OR REPLACE FUNCTION public.create_franchise_referral_payout(
  p_franchise_referral_id UUID,
  p_payout_type TEXT,
  p_amount NUMERIC,
  p_period_start DATE DEFAULT NULL,
  p_period_end DATE DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  referral_record RECORD;
  payout_id UUID;
BEGIN
  -- Get franchise referral details
  SELECT * INTO referral_record 
  FROM public.franchise_referrals 
  WHERE id = p_franchise_referral_id AND status = 'signed';
  
  IF referral_record IS NULL THEN
    RAISE EXCEPTION 'Franchise referral not found or not signed';
  END IF;
  
  -- Create payout record
  INSERT INTO public.franchise_referral_payouts (
    franchise_referral_id, tenant_id, referring_tenant_id, 
    payout_type, amount, period_start, period_end
  ) VALUES (
    p_franchise_referral_id,
    referral_record.tenant_id,
    referral_record.referring_tenant_id,
    p_payout_type,
    p_amount,
    p_period_start,
    p_period_end
  ) RETURNING id INTO payout_id;
  
  RETURN payout_id;
END;
$$;