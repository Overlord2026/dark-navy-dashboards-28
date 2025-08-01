-- Fix all remaining functions missing SET search_path = ''
-- Update update_modified_column function
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = now();
  NEW.modified = now();
  RETURN NEW;
END;
$function$;

-- Update update_connector_timestamp function  
CREATE OR REPLACE FUNCTION public.update_connector_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Update cleanup_expired_export_requests function
CREATE OR REPLACE FUNCTION public.cleanup_expired_export_requests()
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $function$
BEGIN
  DELETE FROM public.data_export_requests 
  WHERE status = 'expired' 
  AND expires_at < now() - INTERVAL '30 days';
END;
$function$;

-- Update update_charity_annual_totals function
CREATE OR REPLACE FUNCTION public.update_charity_annual_totals()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $function$
BEGIN
  -- Update the charity's annual raised amount
  UPDATE public.charities 
  SET annual_raised = (
    SELECT COALESCE(SUM(amount), 0) 
    FROM public.user_donations 
    WHERE charity_id = COALESCE(NEW.charity_id, OLD.charity_id)
    AND EXTRACT(YEAR FROM donation_date) = EXTRACT(YEAR FROM CURRENT_DATE)
  )
  WHERE id = COALESCE(NEW.charity_id, OLD.charity_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Update trigger_meeting_summary_processing function
CREATE OR REPLACE FUNCTION public.trigger_meeting_summary_processing()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $function$
BEGIN
  -- Only trigger processing when status changes to 'completed'
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    -- Call edge function to process the recording
    PERFORM
      net.http_post(
        url := 'https://xcmqjkvyvuhoslbzmlgi.functions.supabase.co/process-meeting-summary',
        headers := '{"Content-Type": "application/json"}'::jsonb,
        body := json_build_object(
          'recording_id', NEW.id,
          'user_id', NEW.user_id,
          'client_id', NEW.client_id
        )::jsonb
      );
  END IF;
  
  RETURN NEW;
END;
$function$;