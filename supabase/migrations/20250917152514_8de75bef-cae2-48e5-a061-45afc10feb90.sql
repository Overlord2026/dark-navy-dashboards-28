-- Add payment responsibility column to prospect_invitations table
ALTER TABLE public.prospect_invitations 
ADD COLUMN IF NOT EXISTS payment_responsibility TEXT DEFAULT 'client_paid' 
CHECK (payment_responsibility IN ('advisor_paid', 'client_paid'));

-- Add advisor subscription tracking
CREATE TABLE IF NOT EXISTS public.advisor_client_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advisor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invitation_id UUID REFERENCES public.prospect_invitations(id) ON DELETE SET NULL,
  subscription_status TEXT NOT NULL DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'suspended')),
  monthly_fee DECIMAL(10,2) NOT NULL DEFAULT 19.00,
  stripe_subscription_id TEXT,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(advisor_id, client_id)
);

-- Enable RLS on the new table
ALTER TABLE public.advisor_client_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for advisor_client_subscriptions
CREATE POLICY "Advisors can manage their client subscriptions"
ON public.advisor_client_subscriptions
FOR ALL
USING (advisor_id = auth.uid());

CREATE POLICY "Clients can view their advisor subscriptions"
ON public.advisor_client_subscriptions
FOR SELECT
USING (client_id = auth.uid());

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_advisor_client_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_advisor_client_subscriptions_updated_at
BEFORE UPDATE ON public.advisor_client_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_advisor_client_subscriptions_updated_at();