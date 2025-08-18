-- Create trial_grants table for managing user trials
CREATE TABLE public.trial_grants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('basic', 'premium', 'elite')),
  persona TEXT NOT NULL CHECK (persona IN ('families', 'professionals')),
  segment TEXT,
  trial_start TIMESTAMP WITH TIME ZONE NOT NULL,
  trial_end TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  converted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.trial_grants ENABLE ROW LEVEL SECURITY;

-- Create policies for trial_grants
CREATE POLICY "Users can view their own trials"
ON public.trial_grants
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own trials"
ON public.trial_grants
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trials"
ON public.trial_grants
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_trial_grants_updated_at
BEFORE UPDATE ON public.trial_grants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for efficient trial lookups
CREATE INDEX idx_trial_grants_user_active ON public.trial_grants(user_id, is_active, trial_end);
CREATE INDEX idx_trial_grants_expiry ON public.trial_grants(trial_end) WHERE is_active = true;