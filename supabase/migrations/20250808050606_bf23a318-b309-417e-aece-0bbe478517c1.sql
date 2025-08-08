-- ============================================
-- BFO Supabase Master Migration (Functions & Grants)
-- Safe to re-run. Idempotent-ish and drift-tolerant.
-- ============================================

-- 0) Safety: ensure plpgsql available
CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;

-- 1) SCHEMA USAGE (avoid permission denied on read/execute)
-- Public schema (you should own this)
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- 2) FUNCTIONS

-- 2a) Drop duplicate or outdated versions
DROP FUNCTION IF EXISTS public.create_default_onboarding_steps(text);
DROP FUNCTION IF EXISTS public.create_default_onboarding_steps(uuid);
DROP FUNCTION IF EXISTS public.get_current_user_organization_id();
DROP FUNCTION IF EXISTS public.log_vault_activity(uuid, text, text, uuid, jsonb);

-- 2b) Recreate unified create_default_onboarding_steps
CREATE OR REPLACE FUNCTION public.create_default_onboarding_steps(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Ensure table exists (lightweight guard; no-op if already present)
  CREATE TABLE IF NOT EXISTS public.onboarding_steps (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    step text NOT NULL,
    status text NOT NULL DEFAULT 'pending',
    created_at timestamptz NOT NULL DEFAULT now()
  );

  INSERT INTO public.onboarding_steps (user_id, step, status, created_at)
  VALUES
    (p_user_id, 'Welcome', 'pending', now()),
    (p_user_id, 'Profile Setup', 'pending', now()),
    (p_user_id, 'Connect Accounts', 'pending', now()),
    (p_user_id, 'Explore Features', 'pending', now());
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_default_onboarding_steps(uuid) TO anon, authenticated;

-- 2c) Recreate get_current_user_organization_id
CREATE OR REPLACE FUNCTION public.get_current_user_organization_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organization_id
  FROM public.organization_admins
  WHERE user_id = auth.uid()
    AND is_active = true
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_current_user_organization_id() TO anon, authenticated;

-- 2d) Ensure audit table exists
CREATE TABLE IF NOT EXISTS public.vault_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id uuid NOT NULL,
  user_id uuid,
  action_type text NOT NULL,
  resource_type text NOT NULL,
  resource_id uuid,
  details jsonb NOT NULL DEFAULT '{}',
  ip_address inet,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2e) Recreate log_vault_activity
CREATE OR REPLACE FUNCTION public.log_vault_activity(
  p_vault_id uuid,
  p_action_type text,
  p_resource_type text,
  p_resource_id uuid DEFAULT NULL,
  p_details jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  log_id uuid;
BEGIN
  INSERT INTO public.vault_activity_log (
    vault_id, user_id, action_type, resource_type,
    resource_id, details, ip_address, created_at
  ) VALUES (
    p_vault_id, auth.uid(), p_action_type, p_resource_type,
    p_resource_id, p_details, inet_client_addr(), now()
  )
  RETURNING id INTO log_id;

  RETURN log_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.log_vault_activity(uuid, text, text, uuid, jsonb) TO anon, authenticated;