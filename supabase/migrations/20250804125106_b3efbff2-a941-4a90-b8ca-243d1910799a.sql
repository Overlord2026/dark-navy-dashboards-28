-- Create referrals table for tracking colleague invitations
CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL UNIQUE,
  referred_email TEXT,
  referred_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  signup_completed BOOLEAN DEFAULT FALSE,
  referral_source TEXT, -- 'linkedin', 'twitter', 'facebook', 'email', 'direct'
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT unique_referrer_code UNIQUE(referrer_id, referral_code)
);

-- Enable RLS
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own referrals" 
ON public.referrals FOR SELECT 
USING (referrer_id = auth.uid());

CREATE POLICY "Users can create their own referrals" 
ON public.referrals FOR INSERT 
WITH CHECK (referrer_id = auth.uid());

CREATE POLICY "Users can update their own referrals" 
ON public.referrals FOR UPDATE 
USING (referrer_id = auth.uid());

-- Create referral leaderboard view
CREATE VIEW public.referral_leaderboard AS
SELECT 
  p.name,
  p.id as user_id,
  COUNT(r.id) FILTER (WHERE r.signup_completed = true) as successful_referrals,
  COUNT(r.id) as total_referrals,
  MAX(r.completed_at) as last_referral_date
FROM public.profiles p
LEFT JOIN public.referrals r ON p.id = r.referrer_id
GROUP BY p.id, p.name
ORDER BY successful_referrals DESC, total_referrals DESC;

-- Grant access to the view
GRANT SELECT ON public.referral_leaderboard TO authenticated;

-- Function to generate unique referral codes
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  code TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- Generate 8-character alphanumeric code
    code := upper(substring(encode(gen_random_bytes(6), 'base64') from 1 for 8));
    code := replace(code, '/', '0');
    code := replace(code, '+', '1');
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.referrals WHERE referral_code = code) INTO exists_check;
    
    IF NOT exists_check THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN code;
END;
$$;

-- Function to track referral signup completion
CREATE OR REPLACE FUNCTION public.complete_referral_signup(p_referral_code TEXT, p_referred_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.referrals 
  SET 
    referred_user_id = p_referred_user_id,
    signup_completed = TRUE,
    completed_at = NOW()
  WHERE referral_code = p_referral_code
    AND signup_completed = FALSE;
  
  RETURN FOUND;
END;
$$;