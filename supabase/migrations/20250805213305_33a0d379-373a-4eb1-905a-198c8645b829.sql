-- Create advisor seat management and invitation system

-- Advisor seat packages table
CREATE TABLE public.advisor_seat_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  advisor_id UUID NOT NULL,
  package_size INTEGER NOT NULL, -- Number of seats purchased
  seats_used INTEGER NOT NULL DEFAULT 0,
  seats_remaining INTEGER GENERATED ALWAYS AS (package_size - seats_used) STORED,
  package_type TEXT NOT NULL DEFAULT 'basic' CHECK (package_type IN ('basic', 'premium', 'enterprise')),
  purchase_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expiry_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'suspended')),
  billing_info JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Advisor invitation links/codes
CREATE TABLE public.advisor_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  advisor_id UUID NOT NULL,
  invitation_code TEXT NOT NULL UNIQUE,
  invitation_link TEXT NOT NULL,
  max_uses INTEGER DEFAULT NULL, -- NULL = unlimited
  current_uses INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Track invitation usage
CREATE TABLE public.advisor_invitation_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES public.advisor_invitations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  used_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  signup_completed BOOLEAN NOT NULL DEFAULT false,
  client_tier TEXT NOT NULL DEFAULT 'basic' CHECK (client_tier IN ('basic', 'premium')),
  UNIQUE(invitation_id, user_id)
);

-- Advisor-client relationships with tiered access
CREATE TABLE public.advisor_client_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  advisor_id UUID NOT NULL,
  client_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL DEFAULT 'primary' CHECK (relationship_type IN ('primary', 'secondary', 'consultant')),
  client_tier TEXT NOT NULL DEFAULT 'basic' CHECK (client_tier IN ('basic', 'premium')),
  tier_billing_type TEXT NOT NULL DEFAULT 'advisor_covered' CHECK (tier_billing_type IN ('advisor_covered', 'client_billed', 'gifted')),
  linked_via_invitation BOOLEAN NOT NULL DEFAULT false,
  invitation_id UUID REFERENCES public.advisor_invitations(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(advisor_id, client_user_id, relationship_type)
);

-- Enable RLS on all tables
ALTER TABLE public.advisor_seat_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisor_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisor_invitation_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisor_client_links ENABLE ROW LEVEL SECURITY;

-- RLS Policies for advisor_seat_packages
CREATE POLICY "Advisors can view their own seat packages" 
ON public.advisor_seat_packages 
FOR SELECT 
USING (advisor_id = auth.uid());

CREATE POLICY "Advisors can manage their own seat packages" 
ON public.advisor_seat_packages 
FOR ALL 
USING (advisor_id = auth.uid());

-- RLS Policies for advisor_invitations
CREATE POLICY "Advisors can manage their own invitations" 
ON public.advisor_invitations 
FOR ALL 
USING (advisor_id = auth.uid());

-- RLS Policies for advisor_invitation_usage
CREATE POLICY "Users can view their own invitation usage" 
ON public.advisor_invitation_usage 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Advisors can view their invitation usage" 
ON public.advisor_invitation_usage 
FOR SELECT 
USING (invitation_id IN (
  SELECT id FROM public.advisor_invitations WHERE advisor_id = auth.uid()
));

-- RLS Policies for advisor_client_links
CREATE POLICY "Advisors can manage their client links" 
ON public.advisor_client_links 
FOR ALL 
USING (advisor_id = auth.uid());

CREATE POLICY "Clients can view their advisor links" 
ON public.advisor_client_links 
FOR SELECT 
USING (client_user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX idx_advisor_seat_packages_advisor_id ON public.advisor_seat_packages(advisor_id);
CREATE INDEX idx_advisor_invitations_advisor_id ON public.advisor_invitations(advisor_id);
CREATE INDEX idx_advisor_invitations_code ON public.advisor_invitations(invitation_code);
CREATE INDEX idx_advisor_invitation_usage_invitation_id ON public.advisor_invitation_usage(invitation_id);
CREATE INDEX idx_advisor_client_links_advisor_id ON public.advisor_client_links(advisor_id);
CREATE INDEX idx_advisor_client_links_client_id ON public.advisor_client_links(client_user_id);

-- Function to generate unique invitation codes
CREATE OR REPLACE FUNCTION public.generate_advisor_invitation_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- Generate 8-character alphanumeric code with advisor prefix
    code := 'ADV-' || upper(substring(encode(gen_random_bytes(6), 'base64') from 1 for 6));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.advisor_invitations WHERE invitation_code = code) INTO exists_check;
    
    IF NOT exists_check THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN code;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = '';

-- Function to update seat usage when clients are linked
CREATE OR REPLACE FUNCTION public.update_advisor_seat_usage()
RETURNS TRIGGER AS $$
BEGIN
  -- Update seat usage when a new client is linked
  IF TG_OP = 'INSERT' THEN
    UPDATE public.advisor_seat_packages 
    SET seats_used = seats_used + 1
    WHERE advisor_id = NEW.advisor_id 
      AND status = 'active'
      AND (expiry_date IS NULL OR expiry_date > now());
    RETURN NEW;
  END IF;
  
  -- Update seat usage when a client link is removed
  IF TG_OP = 'DELETE' THEN
    UPDATE public.advisor_seat_packages 
    SET seats_used = GREATEST(0, seats_used - 1)
    WHERE advisor_id = OLD.advisor_id 
      AND status = 'active';
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = '';

-- Create trigger for seat usage updates
CREATE TRIGGER update_advisor_seat_usage_trigger
  AFTER INSERT OR DELETE ON public.advisor_client_links
  FOR EACH ROW
  EXECUTE FUNCTION public.update_advisor_seat_usage();