-- Create payout tracking tables
CREATE TABLE public.referral_payouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  referral_id UUID REFERENCES public.referrals(id) ON DELETE CASCADE,
  advisor_override_id UUID REFERENCES public.advisor_overrides(id) ON DELETE CASCADE,
  payout_type TEXT NOT NULL CHECK (payout_type IN ('referral_reward', 'advisor_override')),
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'rejected')),
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  payment_method TEXT,
  payment_reference TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT check_referral_or_override CHECK (
    (referral_id IS NOT NULL AND advisor_override_id IS NULL) OR
    (referral_id IS NULL AND advisor_override_id IS NOT NULL)
  )
);

-- Enable RLS
ALTER TABLE public.referral_payouts ENABLE ROW LEVEL SECURITY;

-- RLS policies for referral_payouts
CREATE POLICY "Tenant admins can manage payouts" 
ON public.referral_payouts 
FOR ALL 
USING (
  tenant_id = get_current_user_tenant_id() AND 
  has_any_role(ARRAY['admin', 'tenant_admin', 'system_administrator'])
);

CREATE POLICY "Users can view their own payouts" 
ON public.referral_payouts 
FOR SELECT 
USING (
  tenant_id = get_current_user_tenant_id() AND (
    referral_id IN (SELECT id FROM public.referrals WHERE referrer_id = auth.uid()) OR
    advisor_override_id IN (SELECT id FROM public.advisor_overrides WHERE referring_advisor_id = auth.uid())
  )
);

-- Create notification preferences table
CREATE TABLE public.payout_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  payout_id UUID NOT NULL REFERENCES public.referral_payouts(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('payout_ready', 'payout_approved', 'payout_paid')),
  sent_at TIMESTAMP WITH TIME ZONE,
  email_sent BOOLEAN DEFAULT false,
  push_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for notifications
ALTER TABLE public.payout_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" 
ON public.payout_notifications 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "System can manage notifications" 
ON public.payout_notifications 
FOR ALL 
USING (auth.role() = 'service_role');

-- Create indexes for better performance
CREATE INDEX idx_referral_payouts_tenant_id ON public.referral_payouts(tenant_id);
CREATE INDEX idx_referral_payouts_status ON public.referral_payouts(status);
CREATE INDEX idx_referral_payouts_referral_id ON public.referral_payouts(referral_id);
CREATE INDEX idx_referral_payouts_advisor_override_id ON public.referral_payouts(advisor_override_id);
CREATE INDEX idx_payout_notifications_user_id ON public.payout_notifications(user_id);
CREATE INDEX idx_payout_notifications_payout_id ON public.payout_notifications(payout_id);

-- Create trigger for updated_at
CREATE TRIGGER update_referral_payouts_updated_at
  BEFORE UPDATE ON public.referral_payouts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create payout for referral reward
CREATE OR REPLACE FUNCTION public.create_referral_payout(p_referral_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  referral_record RECORD;
  payout_id UUID;
BEGIN
  -- Get referral details
  SELECT * INTO referral_record 
  FROM public.referrals 
  WHERE id = p_referral_id AND status = 'active';
  
  IF referral_record IS NULL THEN
    RAISE EXCEPTION 'Referral not found or not active';
  END IF;
  
  -- Check if payout already exists
  IF EXISTS (SELECT 1 FROM public.referral_payouts WHERE referral_id = p_referral_id) THEN
    RAISE EXCEPTION 'Payout already exists for this referral';
  END IF;
  
  -- Create payout record
  INSERT INTO public.referral_payouts (
    tenant_id, referral_id, payout_type, amount
  ) VALUES (
    referral_record.tenant_id,
    p_referral_id,
    'referral_reward',
    referral_record.reward_amount
  ) RETURNING id INTO payout_id;
  
  -- Create notification
  INSERT INTO public.payout_notifications (
    user_id, payout_id, notification_type
  ) VALUES (
    referral_record.referrer_id,
    payout_id,
    'payout_ready'
  );
  
  RETURN payout_id;
END;
$$;

-- Function to create payout for advisor override
CREATE OR REPLACE FUNCTION public.create_override_payout(p_override_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  override_record RECORD;
  payout_id UUID;
BEGIN
  -- Get override details
  SELECT * INTO override_record 
  FROM public.advisor_overrides 
  WHERE id = p_override_id AND status = 'active' AND override_amount > 0;
  
  IF override_record IS NULL THEN
    RAISE EXCEPTION 'Override not found, not active, or no amount to pay';
  END IF;
  
  -- Check if payout already exists for this period
  IF EXISTS (
    SELECT 1 FROM public.referral_payouts 
    WHERE advisor_override_id = p_override_id 
    AND status NOT IN ('rejected')
  ) THEN
    RAISE EXCEPTION 'Payout already exists for this override period';
  END IF;
  
  -- Create payout record
  INSERT INTO public.referral_payouts (
    tenant_id, advisor_override_id, payout_type, amount
  ) VALUES (
    override_record.tenant_id,
    p_override_id,
    'advisor_override',
    override_record.override_amount
  ) RETURNING id INTO payout_id;
  
  -- Create notification
  INSERT INTO public.payout_notifications (
    user_id, payout_id, notification_type
  ) VALUES (
    override_record.referring_advisor_id,
    payout_id,
    'payout_ready'
  );
  
  RETURN payout_id;
END;
$$;