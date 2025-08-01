-- Fix security warning: Update function search paths
CREATE OR REPLACE FUNCTION public.update_attorney_onboarding_progress()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Calculate progress based on completed steps
  NEW.progress_percentage := (array_length(NEW.steps_completed, 1) * 100) / 6; -- 6 total steps
  
  -- Auto-update status based on progress
  IF NEW.progress_percentage = 100 AND NEW.nda_signed AND NEW.participation_agreement_signed THEN
    NEW.onboarding_status := 'completed';
    NEW.submitted_at := COALESCE(NEW.submitted_at, now());
  END IF;
  
  -- Log status change
  IF OLD.onboarding_status IS DISTINCT FROM NEW.onboarding_status OR 
     OLD.current_step IS DISTINCT FROM NEW.current_step THEN
    INSERT INTO public.attorney_onboarding_log (
      onboarding_id, previous_status, new_status, step_completed, automated
    ) VALUES (
      NEW.id, OLD.onboarding_status, NEW.onboarding_status, NEW.current_step, true
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Fix security warning: Update function search paths  
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE
SET search_path = ''
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Fix security warning: Update function search paths
CREATE OR REPLACE FUNCTION public.get_current_user_tenant_id()
RETURNS UUID 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE
SET search_path = ''
AS $$
  SELECT tenant_id FROM public.profiles WHERE id = auth.uid();
$$;