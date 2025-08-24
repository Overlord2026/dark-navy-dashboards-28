-- Create user onboarding tracking table
CREATE TABLE public.user_onboarding (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_complete BOOLEAN NOT NULL DEFAULT false,
  consent_ok BOOLEAN NOT NULL DEFAULT false,
  disclosures_done BOOLEAN NOT NULL DEFAULT false,
  vault_onboarded BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_onboarding ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own onboarding status" 
ON public.user_onboarding 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own onboarding status" 
ON public.user_onboarding 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own onboarding status" 
ON public.user_onboarding 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_user_onboarding_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_onboarding_updated_at
BEFORE UPDATE ON public.user_onboarding
FOR EACH ROW
EXECUTE FUNCTION public.update_user_onboarding_updated_at();

-- Create function to initialize user onboarding on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_onboarding()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_onboarding (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

-- Create trigger to initialize onboarding on user creation
CREATE TRIGGER on_auth_user_created_onboarding
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_onboarding();

-- Create function to compute readiness score
CREATE OR REPLACE FUNCTION public.get_user_readiness(user_uuid UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  onboarding_record RECORD;
  readiness_score INTEGER := 0;
  total_steps INTEGER := 4;
  missing_steps TEXT[] := '{}';
BEGIN
  -- Get user onboarding record
  SELECT * INTO onboarding_record 
  FROM public.user_onboarding 
  WHERE user_id = user_uuid;
  
  -- If no record exists, create one
  IF NOT FOUND THEN
    INSERT INTO public.user_onboarding (user_id) 
    VALUES (user_uuid);
    
    SELECT * INTO onboarding_record 
    FROM public.user_onboarding 
    WHERE user_id = user_uuid;
  END IF;
  
  -- Calculate readiness
  IF onboarding_record.profile_complete THEN
    readiness_score := readiness_score + 1;
  ELSE
    missing_steps := array_append(missing_steps, 'profile');
  END IF;
  
  IF onboarding_record.consent_ok THEN
    readiness_score := readiness_score + 1;
  ELSE
    missing_steps := array_append(missing_steps, 'consent');
  END IF;
  
  IF onboarding_record.disclosures_done THEN
    readiness_score := readiness_score + 1;
  ELSE
    missing_steps := array_append(missing_steps, 'disclosures');
  END IF;
  
  IF onboarding_record.vault_onboarded THEN
    readiness_score := readiness_score + 1;
  ELSE
    missing_steps := array_append(missing_steps, 'vault');
  END IF;
  
  RETURN json_build_object(
    'ready', readiness_score = total_steps,
    'score', readiness_score,
    'total', total_steps,
    'missing_steps', missing_steps,
    'profile_complete', onboarding_record.profile_complete,
    'consent_ok', onboarding_record.consent_ok,
    'disclosures_done', onboarding_record.disclosures_done,
    'vault_onboarded', onboarding_record.vault_onboarded
  );
END;
$$;