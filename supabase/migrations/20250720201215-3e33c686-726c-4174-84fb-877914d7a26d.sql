-- Phase 2: RLS Recursion and Security Critical Fixes

-- 1. Fix RLS recursion issues by updating the get_current_user_tenant_id function
-- The current function may be causing recursion when used in RLS policies
CREATE OR REPLACE FUNCTION public.get_current_user_tenant_id()
RETURNS UUID
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT tenant_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- 2. Update get_current_user_role function to prevent recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- 3. Update has_role function for consistency
CREATE OR REPLACE FUNCTION public.has_role(required_role TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT COALESCE(role = required_role, false) FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- 4. Update has_any_role function for consistency
CREATE OR REPLACE FUNCTION public.has_any_role(roles TEXT[])
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT COALESCE(role = ANY(roles), false) FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- 5. Update is_tenant_admin function for consistency
CREATE OR REPLACE FUNCTION public.is_tenant_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT COALESCE(role = ANY(ARRAY['admin', 'tenant_admin', 'system_administrator']), false)
  FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- 6. Add search_path to critical security functions to prevent SQL injection
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

-- 7. Fix validate_otp_code function with proper search_path
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

-- 8. Fix cleanup_expired_otp_codes function
CREATE OR REPLACE FUNCTION public.cleanup_expired_otp_codes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  DELETE FROM public.user_otp_codes 
  WHERE expires_at < now() OR is_used = true;
END;
$$;

-- 9. Fix upsert_daily_financial_snapshot function
CREATE OR REPLACE FUNCTION public.upsert_daily_financial_snapshot(p_user_id uuid, p_total_assets numeric, p_total_liabilities numeric, p_net_worth numeric)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
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
$$;

-- 10. Fix calculate_provider_rating function
CREATE OR REPLACE FUNCTION public.calculate_provider_rating(provider_id uuid)
RETURNS numeric
LANGUAGE plpgsql
STABLE
SET search_path = ''
AS $$
DECLARE
  avg_rating NUMERIC;
BEGIN
  SELECT AVG(rating) INTO avg_rating
  FROM public.provider_reviews
  WHERE provider_reviews.provider_id = calculate_provider_rating.provider_id;
  
  RETURN COALESCE(avg_rating, 0);
END;
$$;

-- 11. Create missing tables that are referenced in the schema but don't exist
CREATE TABLE IF NOT EXISTS public.user_otp_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  otp_code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_used BOOLEAN NOT NULL DEFAULT false,
  attempts INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_financial_snapshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  snapshot_date DATE NOT NULL,
  total_assets NUMERIC NOT NULL DEFAULT 0,
  total_liabilities NUMERIC NOT NULL DEFAULT 0,
  net_worth NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, snapshot_date)
);

CREATE TABLE IF NOT EXISTS public.provider_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL,
  user_id UUID NOT NULL,
  rating NUMERIC NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.webhook_deliveries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'success', 'failed', 'retrying')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  delivered_at TIMESTAMP WITH TIME ZONE
);

-- 12. Add RLS policies for the new tables
ALTER TABLE public.user_otp_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_financial_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_deliveries ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_otp_codes
CREATE POLICY "Users can manage their own OTP codes" ON public.user_otp_codes
FOR ALL USING (auth.uid() = user_id);

-- RLS policies for user_financial_snapshots
CREATE POLICY "Users can manage their own financial snapshots" ON public.user_financial_snapshots
FOR ALL USING (auth.uid() = user_id);

-- RLS policies for provider_reviews
CREATE POLICY "Users can view all provider reviews" ON public.provider_reviews
FOR SELECT USING (true);

CREATE POLICY "Users can create their own reviews" ON public.provider_reviews
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON public.provider_reviews
FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for webhook_deliveries (admin only)
CREATE POLICY "Only service role can manage webhooks" ON public.webhook_deliveries
FOR ALL USING (auth.role() = 'service_role');

-- 13. Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.get_current_user_tenant_id() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_current_user_role() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.has_role(TEXT) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.has_any_role(TEXT[]) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_tenant_admin() TO authenticated, service_role;