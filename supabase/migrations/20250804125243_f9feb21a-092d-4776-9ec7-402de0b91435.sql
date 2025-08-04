-- Add missing columns to existing referrals table for colleague invitations
ALTER TABLE public.referrals 
ADD COLUMN IF NOT EXISTS referred_email TEXT,
ADD COLUMN IF NOT EXISTS signup_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS referral_source TEXT,
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

-- Create referral leaderboard view using existing structure
CREATE OR REPLACE VIEW public.referral_leaderboard AS
SELECT 
  COALESCE(p.display_name, p.first_name || ' ' || p.last_name, 'Anonymous') as name,
  p.id as user_id,
  COUNT(r.id) FILTER (WHERE r.status = 'activated') as successful_referrals,
  COUNT(r.id) as total_referrals,
  MAX(r.activated_at) as last_referral_date
FROM public.profiles p
LEFT JOIN public.referrals r ON p.id = r.referrer_id
GROUP BY p.id, p.display_name, p.first_name, p.last_name
ORDER BY successful_referrals DESC, total_referrals DESC;

-- Grant access to the view
GRANT SELECT ON public.referral_leaderboard TO authenticated;