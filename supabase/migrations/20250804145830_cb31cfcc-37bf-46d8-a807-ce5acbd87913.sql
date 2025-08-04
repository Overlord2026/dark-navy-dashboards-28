-- Create reserved profiles table for VIP onboarding campaign
CREATE TABLE public.reserved_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  organization TEXT,
  role_title TEXT,
  persona_type TEXT NOT NULL,
  linkedin_url TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  claimed_at TIMESTAMP WITH TIME ZONE,
  claimed_by UUID REFERENCES auth.users(id),
  invitation_token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'base64'),
  invitation_sent_at TIMESTAMP WITH TIME ZONE,
  invitation_method TEXT, -- 'email', 'sms', 'linkedin', 'heygen'
  referral_source TEXT,
  priority_level TEXT DEFAULT 'normal', -- 'high', 'normal', 'low'
  segment TEXT, -- 'advisor', 'custodian', 'coach', etc.
  custodian_partners TEXT[], -- Array of partner custodians
  urgency_deadline TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  tenant_id UUID REFERENCES public.tenants(id)
);

-- Enable RLS
ALTER TABLE public.reserved_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage reserved profiles" 
ON public.reserved_profiles 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'system_administrator', 'tenant_admin')
  )
);

CREATE POLICY "Anyone can view profile by token for claiming" 
ON public.reserved_profiles 
FOR SELECT 
USING (true);

-- Create reserved profile invitations table for tracking outreach
CREATE TABLE public.reserved_profile_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reserved_profile_id UUID NOT NULL REFERENCES public.reserved_profiles(id) ON DELETE CASCADE,
  invitation_method TEXT NOT NULL, -- 'email', 'sms', 'linkedin', 'heygen'
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  template_used TEXT,
  message_content TEXT,
  response_received BOOLEAN DEFAULT false,
  response_text TEXT,
  response_at TIMESTAMP WITH TIME ZONE,
  sent_by UUID REFERENCES auth.users(id),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.reserved_profile_invitations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage invitation tracking" 
ON public.reserved_profile_invitations 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'system_administrator', 'tenant_admin')
  )
);

-- Create reserved profile analytics table
CREATE TABLE public.reserved_profile_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  persona_type TEXT NOT NULL,
  segment TEXT,
  total_reserved INTEGER DEFAULT 0,
  total_claimed INTEGER DEFAULT 0,
  total_invited INTEGER DEFAULT 0,
  claim_rate NUMERIC,
  response_rate NUMERIC,
  avg_time_to_claim_hours NUMERIC,
  top_referral_sources JSONB DEFAULT '[]'::jsonb,
  custodian_preferences JSONB DEFAULT '{}'::jsonb,
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reserved_profile_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can view analytics" 
ON public.reserved_profile_analytics 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'system_administrator', 'tenant_admin')
  )
);

-- Create function to calculate claim rate analytics
CREATE OR REPLACE FUNCTION public.calculate_reserved_profile_analytics(p_date DATE DEFAULT CURRENT_DATE)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  persona_record RECORD;
BEGIN
  -- Calculate analytics for each persona type
  FOR persona_record IN 
    SELECT DISTINCT persona_type, segment 
    FROM public.reserved_profiles 
    WHERE is_active = true
  LOOP
    INSERT INTO public.reserved_profile_analytics (
      date, persona_type, segment, total_reserved, total_claimed, 
      total_invited, claim_rate, avg_time_to_claim_hours
    )
    SELECT 
      p_date,
      persona_record.persona_type,
      persona_record.segment,
      COUNT(*) as total_reserved,
      COUNT(claimed_at) as total_claimed,
      COUNT(invitation_sent_at) as total_invited,
      CASE 
        WHEN COUNT(*) > 0 THEN (COUNT(claimed_at)::numeric / COUNT(*)::numeric) * 100 
        ELSE 0 
      END as claim_rate,
      AVG(EXTRACT(EPOCH FROM (claimed_at - created_at)) / 3600) as avg_time_to_claim_hours
    FROM public.reserved_profiles
    WHERE persona_type = persona_record.persona_type 
      AND (segment = persona_record.segment OR (segment IS NULL AND persona_record.segment IS NULL))
      AND is_active = true
    GROUP BY persona_type, segment
    ON CONFLICT (date, persona_type, segment) 
    DO UPDATE SET
      total_reserved = EXCLUDED.total_reserved,
      total_claimed = EXCLUDED.total_claimed,
      total_invited = EXCLUDED.total_invited,
      claim_rate = EXCLUDED.claim_rate,
      avg_time_to_claim_hours = EXCLUDED.avg_time_to_claim_hours,
      calculated_at = now();
  END LOOP;
END;
$$;

-- Create function to generate claim token
CREATE OR REPLACE FUNCTION public.generate_claim_token()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  token TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    token := encode(gen_random_bytes(32), 'base64');
    token := replace(token, '/', '_');
    token := replace(token, '+', '-');
    
    SELECT EXISTS(SELECT 1 FROM public.reserved_profiles WHERE invitation_token = token) INTO exists_check;
    
    IF NOT exists_check THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN token;
END;
$$;

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_reserved_profiles_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_reserved_profiles_updated_at
  BEFORE UPDATE ON public.reserved_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_reserved_profiles_updated_at();

-- Insert sample VIP reserved profiles
INSERT INTO public.reserved_profiles (
  email, name, organization, role_title, persona_type, segment, 
  custodian_partners, priority_level, referral_source, notes
) VALUES 
  ('advisor1@example.com', 'Sarah Johnson', 'Johnson Wealth Advisors', 'Principal Advisor', 'advisor', 'advisor', 
   ARRAY['schwab', 'fidelity', 'altruist'], 'high', 'linkedin', 'Top 1% advisor in region'),
  ('coach1@example.com', 'Michael Chen', 'Elite Advisor Coaching', 'Founder & Coach', 'coach', 'coach', 
   ARRAY['schwab', 'fidelity'], 'high', 'referral', 'Industry thought leader'),
  ('attorney1@example.com', 'Jennifer Davis', 'Davis Estate Law', 'Managing Partner', 'attorney', 'attorney', 
   ARRAY['schwab', 'fidelity', 'pershing'], 'high', 'conference', 'Specializes in HNW estate planning');

-- Create indexes for performance
CREATE INDEX idx_reserved_profiles_persona_segment ON public.reserved_profiles(persona_type, segment);
CREATE INDEX idx_reserved_profiles_claimed ON public.reserved_profiles(claimed_at) WHERE claimed_at IS NOT NULL;
CREATE INDEX idx_reserved_profiles_token ON public.reserved_profiles(invitation_token);
CREATE INDEX idx_reserved_profile_invitations_profile_id ON public.reserved_profile_invitations(reserved_profile_id);