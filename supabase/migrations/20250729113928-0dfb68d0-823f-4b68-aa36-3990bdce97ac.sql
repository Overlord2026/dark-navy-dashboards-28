-- Fix remaining functions with mutable search_path vulnerabilities
-- These are the remaining functions that need the SET search_path = '' security fix

CREATE OR REPLACE FUNCTION public.notify_medication_change()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  -- Only trigger for medications with RxNorm IDs
  IF NEW.rxnorm_id IS NOT NULL THEN
    -- Call the check-interaction edge function
    PERFORM
      net.http_post(
        url := 'https://xcmqjkvyvuhoslbzmlgi.supabase.co/functions/v1/check-interaction',
        headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || 
                   current_setting('app.settings.service_role_key', true) || '"}'::jsonb,
        body := json_build_object(
          'record', row_to_json(NEW)
        )::jsonb
      );
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_document_expiry_reminders()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  -- Create reminder 30 days before expiry
  IF NEW.expires_on IS NOT NULL THEN
    INSERT INTO public.health_doc_reminders (doc_id, reminder_type, remind_at)
    VALUES (
      NEW.id, 
      'expiry_warning', 
      NEW.expires_on - INTERVAL '30 days'
    );
  END IF;
  
  -- Create annual review reminder for advance directives
  IF NEW.doc_type IN ('advance_directive', 'healthcare_poa', 'living_will') AND NEW.signed_date IS NOT NULL THEN
    INSERT INTO public.health_doc_reminders (doc_id, reminder_type, remind_at)
    VALUES (
      NEW.id, 
      'annual_review', 
      NEW.signed_date + INTERVAL '1 year'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.trigger_project_analytics_update()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  -- Update project analytics
  IF TG_TABLE_NAME IN ('projects', 'project_tasks', 'project_milestones') THEN
    PERFORM public.calculate_project_analytics(
      CASE 
        WHEN TG_TABLE_NAME = 'projects' THEN COALESCE(NEW.id, OLD.id)
        ELSE COALESCE(NEW.project_id, OLD.project_id)
      END
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;