-- Create referral leaderboard view if it doesn't exist
CREATE OR REPLACE VIEW public.referral_leaderboard AS
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