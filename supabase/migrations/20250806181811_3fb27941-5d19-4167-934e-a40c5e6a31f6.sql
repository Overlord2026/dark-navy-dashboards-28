-- Create referral system tables

-- Table for storing unique referral codes for each user
CREATE TABLE public.referral_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  clicks_count INTEGER NOT NULL DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE
);

-- Table for tracking referrals
CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code_id UUID NOT NULL REFERENCES public.referral_codes(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'rewarded', 'cancelled')),
  referral_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  activation_date TIMESTAMP WITH TIME ZONE,
  reward_date TIMESTAMP WITH TIME ZONE,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for referral rewards
CREATE TABLE public.referral_rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referral_id UUID NOT NULL REFERENCES public.referrals(id) ON DELETE CASCADE,
  referrer_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_type TEXT NOT NULL CHECK (reward_type IN ('credits', 'cash', 'gift_card')),
  reward_amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
  payout_method TEXT CHECK (payout_method IN ('platform_credits', 'bank_transfer', 'paypal', 'gift_card')),
  payout_date TIMESTAMP WITH TIME ZONE,
  tax_reporting_required BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for batch payouts
CREATE TABLE public.referral_payouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  payout_batch_id TEXT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  payout_method TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  processed_by UUID REFERENCES auth.users(id),
  processed_at TIMESTAMP WITH TIME ZONE,
  export_file_url TEXT,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for referral program settings
CREATE TABLE public.referral_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for referral audit logs
CREATE TABLE public.referral_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('referral', 'reward', 'payout', 'settings')),
  entity_id UUID NOT NULL,
  action TEXT NOT NULL,
  old_values JSONB,
  new_values JSONB,
  performed_by UUID REFERENCES auth.users(id),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for referral_codes
CREATE POLICY "Users can view their own referral codes" ON public.referral_codes
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own referral codes" ON public.referral_codes
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own referral codes" ON public.referral_codes
  FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for referrals
CREATE POLICY "Users can view referrals they made or received" ON public.referrals
  FOR SELECT USING (referrer_user_id = auth.uid() OR referred_user_id = auth.uid());

CREATE POLICY "System can create referrals" ON public.referrals
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update referrals" ON public.referrals
  FOR UPDATE USING (has_any_role(ARRAY['admin', 'system_administrator']));

-- RLS Policies for referral_rewards
CREATE POLICY "Users can view their own rewards" ON public.referral_rewards
  FOR SELECT USING (referrer_user_id = auth.uid());

CREATE POLICY "Admins can manage all rewards" ON public.referral_rewards
  FOR ALL USING (has_any_role(ARRAY['admin', 'system_administrator']));

-- RLS Policies for referral_payouts
CREATE POLICY "Admins can manage payouts" ON public.referral_payouts
  FOR ALL USING (has_any_role(ARRAY['admin', 'system_administrator']));

-- RLS Policies for referral_settings
CREATE POLICY "Admins can manage settings" ON public.referral_settings
  FOR ALL USING (has_any_role(ARRAY['admin', 'system_administrator']));

CREATE POLICY "Anyone can view settings" ON public.referral_settings
  FOR SELECT USING (true);

-- RLS Policies for referral_audit_logs
CREATE POLICY "Admins can view audit logs" ON public.referral_audit_logs
  FOR SELECT USING (has_any_role(ARRAY['admin', 'system_administrator', 'compliance_officer']));

-- Create indexes for performance
CREATE INDEX idx_referral_codes_user_id ON public.referral_codes(user_id);
CREATE INDEX idx_referral_codes_code ON public.referral_codes(referral_code);
CREATE INDEX idx_referrals_referrer ON public.referrals(referrer_user_id);
CREATE INDEX idx_referrals_referred ON public.referrals(referred_user_id);
CREATE INDEX idx_referrals_status ON public.referrals(status);
CREATE INDEX idx_referral_rewards_user ON public.referral_rewards(referrer_user_id);
CREATE INDEX idx_referral_rewards_status ON public.referral_rewards(status);

-- Function to generate unique referral codes
CREATE OR REPLACE FUNCTION generate_referral_code()
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
    code := replace(code, '/', '');
    code := replace(code, '+', '');
    code := 'REF' || code;
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.referral_codes WHERE referral_code = code) INTO exists_check;
    
    IF NOT exists_check THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN code;
END;
$$;

-- Function to create referral code for new users
CREATE OR REPLACE FUNCTION create_user_referral_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.referral_codes (user_id, referral_code)
  VALUES (NEW.id, generate_referral_code());
  
  RETURN NEW;
END;
$$;

-- Trigger to create referral code when user signs up
CREATE TRIGGER on_user_created_referral_code
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_referral_code();

-- Function to track referral usage
CREATE OR REPLACE FUNCTION track_referral_usage(p_referral_code TEXT, p_referred_user_id UUID, p_ip_address INET DEFAULT NULL, p_user_agent TEXT DEFAULT NULL)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_referral_code_record RECORD;
  v_referral_id UUID;
BEGIN
  -- Get referral code record
  SELECT * INTO v_referral_code_record
  FROM public.referral_codes
  WHERE referral_code = p_referral_code AND is_active = true;
  
  IF v_referral_code_record IS NULL THEN
    RAISE EXCEPTION 'Invalid or inactive referral code';
  END IF;
  
  -- Check if user is trying to refer themselves
  IF v_referral_code_record.user_id = p_referred_user_id THEN
    RAISE EXCEPTION 'Users cannot refer themselves';
  END IF;
  
  -- Check if this user was already referred
  IF EXISTS (SELECT 1 FROM public.referrals WHERE referred_user_id = p_referred_user_id) THEN
    RAISE EXCEPTION 'User has already been referred';
  END IF;
  
  -- Create referral record
  INSERT INTO public.referrals (
    referrer_user_id, 
    referred_user_id, 
    referral_code_id,
    ip_address,
    user_agent
  ) VALUES (
    v_referral_code_record.user_id,
    p_referred_user_id,
    v_referral_code_record.id,
    p_ip_address,
    p_user_agent
  ) RETURNING id INTO v_referral_id;
  
  -- Update referral code usage stats
  UPDATE public.referral_codes
  SET 
    clicks_count = clicks_count + 1,
    last_used_at = now()
  WHERE id = v_referral_code_record.id;
  
  RETURN v_referral_id;
END;
$$;

-- Insert default referral settings
INSERT INTO public.referral_settings (setting_key, setting_value, description) VALUES
('reward_amount_credits', '50', 'Amount of platform credits awarded per successful referral'),
('reward_amount_cash', '25', 'Cash amount awarded per successful referral (USD)'),
('minimum_payout_threshold', '100', 'Minimum amount required before payout processing'),
('payout_frequency', '"quarterly"', 'How often payouts are processed'),
('tax_reporting_threshold', '600', 'Annual threshold for 1099-NEC reporting (USD)'),
('program_terms', '{"disclaimer": "Referral rewards apply only to platform usage, not investment services. No investment advice or account opening incentives provided.", "updated": "2024-01-01"}', 'Legal terms and disclaimers'),
('leaderboard_enabled', 'true', 'Whether to show referral leaderboard'),
('max_rewards_per_user', '1000', 'Maximum number of referral rewards per user per year');

-- Function to process referral rewards when user activates paid plan
CREATE OR REPLACE FUNCTION process_referral_reward(p_referred_user_id UUID, p_plan_type TEXT, p_plan_amount NUMERIC)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_referral_record RECORD;
  v_reward_amount NUMERIC;
  v_reward_type TEXT := 'credits';
BEGIN
  -- Find the referral record
  SELECT * INTO v_referral_record
  FROM public.referrals
  WHERE referred_user_id = p_referred_user_id AND status = 'pending';
  
  IF v_referral_record IS NULL THEN
    RETURN; -- No referral to reward
  END IF;
  
  -- Get reward amount from settings
  SELECT (setting_value)::NUMERIC INTO v_reward_amount
  FROM public.referral_settings
  WHERE setting_key = 'reward_amount_credits';
  
  -- Update referral status
  UPDATE public.referrals
  SET 
    status = 'active',
    activation_date = now(),
    updated_at = now()
  WHERE id = v_referral_record.id;
  
  -- Create reward record
  INSERT INTO public.referral_rewards (
    referral_id,
    referrer_user_id,
    reward_type,
    reward_amount,
    status
  ) VALUES (
    v_referral_record.id,
    v_referral_record.referrer_user_id,
    v_reward_type,
    v_reward_amount,
    'approved'
  );
  
  -- Log the action
  INSERT INTO public.referral_audit_logs (
    entity_type,
    entity_id,
    action,
    new_values
  ) VALUES (
    'referral',
    v_referral_record.id,
    'reward_processed',
    jsonb_build_object(
      'plan_type', p_plan_type,
      'plan_amount', p_plan_amount,
      'reward_amount', v_reward_amount
    )
  );
END;
$$;