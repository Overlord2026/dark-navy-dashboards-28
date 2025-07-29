-- Fix the most critical functions first - those that are SECURITY DEFINER and handle sensitive operations

-- Core user/profile functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
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
$$;

-- Audit and security functions
CREATE OR REPLACE FUNCTION public.audit_profile_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  changed_fields TEXT[] := ARRAY[]::TEXT[];
  old_vals JSONB := '{}'::JSONB;
  new_vals JSONB := '{}'::JSONB;
BEGIN
  -- Track changes in critical fields
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    changed_fields := array_append(changed_fields, 'role');
    old_vals := old_vals || jsonb_build_object('role', OLD.role);
    new_vals := new_vals || jsonb_build_object('role', NEW.role);
  END IF;
  
  IF OLD.two_factor_enabled IS DISTINCT FROM NEW.two_factor_enabled THEN
    changed_fields := array_append(changed_fields, 'two_factor_enabled');
    old_vals := old_vals || jsonb_build_object('two_factor_enabled', OLD.two_factor_enabled);
    new_vals := new_vals || jsonb_build_object('two_factor_enabled', NEW.two_factor_enabled);
  END IF;
  
  IF array_length(changed_fields, 1) > 0 THEN
    INSERT INTO public.security_audit_logs (
      user_id, event_type, severity, table_name, operation,
      changed_fields, old_values, new_values, tenant_id
    ) VALUES (
      NEW.id, 'profile_modification', 'medium', 'profiles', 'UPDATE',
      changed_fields, old_vals, new_vals, NEW.tenant_id
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Authentication security functions
CREATE OR REPLACE FUNCTION public.validate_otp_code(p_user_id uuid, p_otp_code text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
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
$$;