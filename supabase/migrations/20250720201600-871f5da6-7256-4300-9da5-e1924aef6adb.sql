-- Phase 2: RLS Recursion and Security Critical Fixes (Fixed)

-- 1. Fix RLS recursion issues by updating the get_current_user_tenant_id function
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

-- 6. Create missing tables that are referenced in the schema but don't exist
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

-- 7. Enable RLS for new tables (only if not already enabled)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_otp_codes') THEN
    ALTER TABLE public.user_otp_codes ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Users can manage their own OTP codes" ON public.user_otp_codes
    FOR ALL USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_financial_snapshots') THEN
    ALTER TABLE public.user_financial_snapshots ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Users can manage their own financial snapshots" ON public.user_financial_snapshots
    FOR ALL USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'provider_reviews') THEN
    ALTER TABLE public.provider_reviews ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Users can view all provider reviews" ON public.provider_reviews
    FOR SELECT USING (true);
    CREATE POLICY "Users can create their own reviews" ON public.provider_reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);
    CREATE POLICY "Users can update their own provider reviews" ON public.provider_reviews
    FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'webhook_deliveries') THEN
    ALTER TABLE public.webhook_deliveries ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Only service role can manage webhooks" ON public.webhook_deliveries
    FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;