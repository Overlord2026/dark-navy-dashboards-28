-- Create client invitations table for advisor invite workflow
CREATE TABLE IF NOT EXISTS public.client_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advisor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  custom_message TEXT,
  onboarding_template TEXT DEFAULT 'standard',
  fee_structure TEXT DEFAULT 'aum_based',
  premium_modules TEXT[] DEFAULT '{}',
  invite_token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'base64'),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '7 days'),
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.client_invitations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Advisors can create invitations" ON public.client_invitations
  FOR INSERT WITH CHECK (advisor_id = auth.uid());

CREATE POLICY "Advisors can view their invitations" ON public.client_invitations
  FOR SELECT USING (advisor_id = auth.uid());

CREATE POLICY "Advisors can update their invitations" ON public.client_invitations
  FOR UPDATE USING (advisor_id = auth.uid());

-- Add indexes for performance
CREATE INDEX idx_client_invitations_advisor_id ON public.client_invitations(advisor_id);
CREATE INDEX idx_client_invitations_token ON public.client_invitations(invite_token);
CREATE INDEX idx_client_invitations_email ON public.client_invitations(email);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_client_invitations_updated_at
  BEFORE UPDATE ON public.client_invitations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();