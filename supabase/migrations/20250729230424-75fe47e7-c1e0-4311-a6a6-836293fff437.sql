-- Fix search path for security compliance
CREATE OR REPLACE FUNCTION public.update_message_thread_timestamp()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;