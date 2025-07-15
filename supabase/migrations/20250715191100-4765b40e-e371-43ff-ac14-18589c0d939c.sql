-- Fix critical security issues from linter

-- 1. Enable RLS on audit_logs table (critical security issue)
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Add RLS policy for audit_logs - only allow service role to access
CREATE POLICY "Service role can manage audit logs" ON public.audit_logs
FOR ALL USING (auth.role() = 'service_role');

-- 2. Fix search_path security issues on all functions
-- Update handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, display_name, email, two_factor_enabled)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    COALESCE(
      NEW.raw_user_meta_data->>'display_name',
      (NEW.raw_user_meta_data->>'first_name') || ' ' || (NEW.raw_user_meta_data->>'last_name')
    ),
    NEW.email,
    false
  );
  RETURN NEW;
END;
$function$;

-- Update validate_otp_code function
CREATE OR REPLACE FUNCTION public.validate_otp_code(p_user_id uuid, p_otp_code text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_record record;
BEGIN
  -- Get the latest unused OTP for this user
  SELECT * INTO v_record
  FROM public.user_otp_codes
  WHERE user_id = p_user_id
    AND is_used = false
    AND expires_at > now()
    AND attempts < 3
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- If no valid OTP found, return false
  IF v_record IS NULL THEN
    RETURN false;
  END IF;
  
  -- Increment attempt counter
  UPDATE public.user_otp_codes
  SET attempts = attempts + 1
  WHERE id = v_record.id;
  
  -- Check if OTP matches
  IF v_record.otp_code = p_otp_code THEN
    -- Mark as used
    UPDATE public.user_otp_codes
    SET is_used = true
    WHERE id = v_record.id;
    
    -- Clean up old codes for this user
    DELETE FROM public.user_otp_codes
    WHERE user_id = p_user_id AND id != v_record.id;
    
    RETURN true;
  END IF;
  
  RETURN false;
END;
$function$;

-- Update cleanup_expired_otp_codes function
CREATE OR REPLACE FUNCTION public.cleanup_expired_otp_codes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  DELETE FROM public.user_otp_codes 
  WHERE expires_at < now() OR is_used = true;
END;
$function$;

-- Update upsert_daily_financial_snapshot function
CREATE OR REPLACE FUNCTION public.upsert_daily_financial_snapshot(p_user_id uuid, p_total_assets numeric, p_total_liabilities numeric, p_net_worth numeric)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.user_financial_snapshots (
    user_id, 
    snapshot_date, 
    total_assets, 
    total_liabilities, 
    net_worth
  )
  VALUES (
    p_user_id, 
    CURRENT_DATE, 
    p_total_assets, 
    p_total_liabilities, 
    p_net_worth
  )
  ON CONFLICT (user_id, snapshot_date) 
  DO UPDATE SET
    total_assets = EXCLUDED.total_assets,
    total_liabilities = EXCLUDED.total_liabilities,
    net_worth = EXCLUDED.net_worth,
    updated_at = now();
END;
$function$;

-- Update calculate_provider_rating function
CREATE OR REPLACE FUNCTION public.calculate_provider_rating(provider_id uuid)
RETURNS numeric
LANGUAGE plpgsql
STABLE
SET search_path = ''
AS $function$
DECLARE
  avg_rating NUMERIC;
BEGIN
  SELECT AVG(rating) INTO avg_rating
  FROM public.provider_reviews
  WHERE provider_reviews.provider_id = calculate_provider_rating.provider_id;
  
  RETURN COALESCE(avg_rating, 0);
END;
$function$;

-- Update log_document_access function
CREATE OR REPLACE FUNCTION public.log_document_access(p_doc_id uuid, p_access_type text, p_access_method text DEFAULT 'direct'::text, p_emergency_token text DEFAULT NULL::text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.health_doc_access_log (
    doc_id, 
    accessed_by_user_id, 
    access_type, 
    access_method,
    emergency_token,
    accessed_at
  ) VALUES (
    p_doc_id,
    auth.uid(),
    p_access_type,
    p_access_method,
    p_emergency_token,
    now()
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$function$;

-- Update get_document_status function
CREATE OR REPLACE FUNCTION public.get_document_status(doc_id uuid)
RETURNS text
LANGUAGE plpgsql
STABLE 
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  doc_record public.health_docs%ROWTYPE;
  status TEXT;
BEGIN
  SELECT * INTO doc_record FROM public.health_docs WHERE id = doc_id;
  
  IF NOT FOUND THEN
    RETURN 'not_found';
  END IF;
  
  -- Check if document has expired
  IF doc_record.expires_on IS NOT NULL AND doc_record.expires_on < CURRENT_DATE THEN
    RETURN 'expired';
  END IF;
  
  -- Check if expiring soon (within 30 days)
  IF doc_record.expires_on IS NOT NULL AND doc_record.expires_on <= CURRENT_DATE + INTERVAL '30 days' THEN
    RETURN 'expiring_soon';
  END IF;
  
  -- Check if needs annual review (signed more than 1 year ago)
  IF doc_record.doc_type IN ('advance_directive', 'healthcare_poa', 'living_will') 
     AND doc_record.signed_date IS NOT NULL 
     AND doc_record.signed_date <= CURRENT_DATE - INTERVAL '1 year' THEN
    RETURN 'needs_review';
  END IF;
  
  RETURN 'current';
END;
$function$;

-- Update remaining functions with search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = now();
  NEW.modified = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.notify_medication_change()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.check_metric_thresholds()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $function$
DECLARE
  metric_info RECORD;
  user_thresholds RECORD;
  alert_message TEXT;
BEGIN
  -- Get metric catalog info
  SELECT * INTO metric_info 
  FROM public.metrics_catalog 
  WHERE id = NEW.metric_id;
  
  -- Get user-specific thresholds
  SELECT * INTO user_thresholds 
  FROM public.user_enabled_metrics 
  WHERE user_id = NEW.user_id AND metric_id = NEW.metric_id;
  
  -- Use user thresholds if available, otherwise use catalog defaults
  DECLARE
    low_threshold NUMERIC := COALESCE(user_thresholds.threshold_low, metric_info.ideal_low);
    high_threshold NUMERIC := COALESCE(user_thresholds.threshold_high, metric_info.ideal_high);
  BEGIN
    -- Check if value is outside thresholds
    IF (low_threshold IS NOT NULL AND NEW.value < low_threshold) THEN
      alert_message := format('%s reading of %s %s is below ideal range (<%s)', 
                            metric_info.label, NEW.value, metric_info.unit, low_threshold);
      
      INSERT INTO public.health_alerts (user_id, metric_id, title, message, severity)
      VALUES (NEW.user_id, NEW.metric_id, 'Low Reading Alert', alert_message, 'warning');
      
    ELSIF (high_threshold IS NOT NULL AND NEW.value > high_threshold) THEN
      alert_message := format('%s reading of %s %s is above ideal range (>%s)', 
                            metric_info.label, NEW.value, metric_info.unit, high_threshold);
      
      INSERT INTO public.health_alerts (user_id, metric_id, title, message, severity)
      VALUES (NEW.user_id, NEW.metric_id, 'High Reading Alert', alert_message, 'warning');
    END IF;
  END;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_document_expiry_reminders()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $function$
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
$function$;