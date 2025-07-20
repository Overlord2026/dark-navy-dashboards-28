
-- Create prospect_invitations table to track invitation lifecycle
CREATE TABLE public.prospect_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  advisor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  magic_token TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'expired', 'activated', 'cancelled')),
  client_segment TEXT NOT NULL DEFAULT 'general',
  personal_note TEXT,
  utm_source TEXT,
  utm_medium TEXT DEFAULT 'advisor_invite',
  utm_campaign TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '7 days'),
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  activated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.prospect_invitations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for prospect_invitations
CREATE POLICY "Advisors can view their own invitations" 
  ON public.prospect_invitations 
  FOR SELECT 
  USING (auth.uid() = advisor_id);

CREATE POLICY "Advisors can create invitations" 
  ON public.prospect_invitations 
  FOR INSERT 
  WITH CHECK (auth.uid() = advisor_id);

CREATE POLICY "Advisors can update their own invitations" 
  ON public.prospect_invitations 
  FOR UPDATE 
  USING (auth.uid() = advisor_id);

-- Index for performance
CREATE INDEX idx_prospect_invitations_advisor_id ON public.prospect_invitations(advisor_id);
CREATE INDEX idx_prospect_invitations_magic_token ON public.prospect_invitations(magic_token);
CREATE INDEX idx_prospect_invitations_email ON public.prospect_invitations(email);

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_prospect_invitations_updated_at
  BEFORE UPDATE ON public.prospect_invitations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
