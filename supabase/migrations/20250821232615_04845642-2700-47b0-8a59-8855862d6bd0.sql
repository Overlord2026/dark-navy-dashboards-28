-- Fix security linter issues

-- Update the NIL trigger function to set search_path for security
CREATE OR REPLACE FUNCTION public.update_nil_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;