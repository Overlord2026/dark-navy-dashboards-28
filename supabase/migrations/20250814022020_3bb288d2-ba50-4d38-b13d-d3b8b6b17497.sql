-- Security fixes: Enable RLS and create sanitized views

-- Enable RLS on key tables that may be missing it
ALTER TABLE public.advisor_profiles ENABLE ROW LEVEL SECURITY;

-- Create sanitized public view for advisor profiles (no emails exposed)
CREATE OR REPLACE VIEW public.advisor_profiles_public AS
SELECT 
  id, 
  display_name, 
  firm_name, 
  city, 
  state, 
  is_public,
  specialty_areas,
  certifications,
  years_experience
FROM public.advisor_profiles
WHERE is_public = true;

-- Grant select to anonymous users on sanitized view only
GRANT SELECT ON public.advisor_profiles_public TO anon;

-- Ensure the main table is protected
REVOKE ALL ON public.advisor_profiles FROM anon;

-- Create RLS policy for advisor profiles (owner access only)
DROP POLICY IF EXISTS advisor_profiles_owner_access ON public.advisor_profiles;
CREATE POLICY advisor_profiles_owner_access ON public.advisor_profiles
FOR ALL USING (auth.uid() = user_id);

-- Add invitation tokens table for proper invite routing
CREATE TABLE IF NOT EXISTS public.prospect_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_token TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  persona_group TEXT NOT NULL DEFAULT 'family',
  target_path TEXT,
  advisor_id UUID REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'pending',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
  activated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on prospect invitations
ALTER TABLE public.prospect_invitations ENABLE ROW LEVEL SECURITY;

-- RLS policy: advisors can manage their own invitations
CREATE POLICY prospect_invitations_advisor_access ON public.prospect_invitations
FOR ALL USING (auth.uid() = advisor_id);

-- RLS policy: public can read non-expired invitations by token
CREATE POLICY prospect_invitations_public_token_access ON public.prospect_invitations
FOR SELECT USING (expires_at > now() AND status = 'pending');

-- Update trigger for prospect invitations
CREATE OR REPLACE FUNCTION update_prospect_invitations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prospect_invitations_updated_at
  BEFORE UPDATE ON public.prospect_invitations
  FOR EACH ROW EXECUTE FUNCTION update_prospect_invitations_updated_at();