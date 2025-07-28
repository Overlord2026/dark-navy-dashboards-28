-- Fix security issues from previous migration

-- Update the support ticket timestamp function with proper search path
CREATE OR REPLACE FUNCTION update_support_ticket_timestamp()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  NEW.last_updated = now();
  RETURN NEW;
END;
$$;

-- Update the cleanup function with proper search path
CREATE OR REPLACE FUNCTION cleanup_expired_export_requests()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  DELETE FROM public.data_export_requests 
  WHERE status = 'expired' 
  AND expires_at < now() - INTERVAL '30 days';
END;
$$;

-- Create secure helper function for role checking to avoid recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = 'public'
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;