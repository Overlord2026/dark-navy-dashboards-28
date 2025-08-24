-- Fix search path security issue for functions
DROP FUNCTION IF EXISTS public.handle_new_user_onboarding();
DROP FUNCTION IF EXISTS public.get_user_readiness(UUID);

-- Recreate functions with proper search_path settings
CREATE OR REPLACE FUNCTION public.handle_new_user_onboarding()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.user_onboarding (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created_onboarding ON auth.users;
CREATE TRIGGER on_auth_user_created_onboarding
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_onboarding();

-- Recreate readiness function with proper security
CREATE OR REPLACE FUNCTION public.get_user_readiness(user_uuid UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
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