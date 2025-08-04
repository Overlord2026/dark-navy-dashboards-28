-- Fix security warnings for insurance agent CE tracking system

-- Fix function search_path warnings by setting proper search paths
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = '';

CREATE OR REPLACE FUNCTION public.update_agent_ce_credits()
RETURNS TRIGGER AS $$
BEGIN
  -- Update total CE credits for the agent
  UPDATE public.insurance_agents
  SET ce_credits_completed = (
    SELECT COALESCE(SUM(credits_earned), 0)
    FROM public.ce_courses
    WHERE agent_id = NEW.agent_id
      AND verified = true
      AND completion_date BETWEEN 
        (SELECT ce_reporting_period_start FROM public.insurance_agents WHERE id = NEW.agent_id) AND
        (SELECT ce_reporting_period_end FROM public.insurance_agents WHERE id = NEW.agent_id)
  )
  WHERE id = NEW.agent_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';