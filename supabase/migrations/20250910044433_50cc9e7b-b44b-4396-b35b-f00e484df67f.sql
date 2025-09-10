-- Email Security Hardening Migration
-- Create masked public views and harden security definer functions

-- Step 1: Ensure email_mask function exists and is secure
CREATE OR REPLACE FUNCTION public.email_mask(p_user_id uuid, p_email text)
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE
    WHEN p_email IS NULL THEN NULL
    WHEN auth.uid() = p_user_id THEN p_email
    ELSE LEFT(p_email, 3) || '***' || SUBSTRING(p_email FROM '@.*$')
  END;
$$;

-- Step 2: Create/Update advisor_profiles_public view with masked emails
CREATE OR REPLACE VIEW public.advisor_profiles_public AS
SELECT 
  id,
  user_id,
  full_name,
  public.email_mask(user_id, email) AS email_public,
  company_name,
  specialties,
  years_experience,
  certifications,
  bio,
  profile_picture_url,
  website_url,
  linkedin_url,
  is_active,
  is_verified,
  location_city,
  location_state,
  tenant_id,
  created_at,
  updated_at
FROM public.advisor_profiles
WHERE is_active = true AND is_verified = true;

-- Step 3: Create/Update reserved_profiles_public view with masked emails  
CREATE OR REPLACE VIEW public.reserved_profiles_public AS
SELECT 
  id,
  full_name,
  public.email_mask(claimed_by, email) AS email_public,
  industry,
  company_name,
  profile_picture_url,
  bio,
  is_claimed,
  created_by,
  claimed_by,
  tenant_id,
  created_at,
  updated_at
FROM public.reserved_profiles;

-- Step 4: Grant appropriate permissions on public views
GRANT SELECT ON public.advisor_profiles_public TO anon;
GRANT SELECT ON public.advisor_profiles_public TO authenticated;
GRANT SELECT ON public.reserved_profiles_public TO anon;
GRANT SELECT ON public.reserved_profiles_public TO authenticated;

-- Step 5: Remove direct email column access for anon role from base tables
REVOKE SELECT (email) ON public.advisor_profiles FROM anon;
REVOKE SELECT (email) ON public.reserved_profiles FROM anon;

-- Step 6: Update existing security definer functions to lock search_path
-- Update ensure_user_tenant function
CREATE OR REPLACE FUNCTION public.ensure_user_tenant()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE 
  uid uuid := auth.uid();
  tid uuid := '00000000-0000-0000-0000-000000000001';
BEGIN
  IF uid IS NULL THEN 
    RAISE EXCEPTION 'No auth.uid()'; 
  END IF;
  
  INSERT INTO public.user_tenants(user_id, tenant_id) 
  VALUES (uid, tid) 
  ON CONFLICT DO NOTHING;
  
  RETURN tid;
END;
$$;

-- Update receipt_emit_secure function
CREATE OR REPLACE FUNCTION public.receipt_emit_secure(
  inputs_json jsonb, 
  policy_json jsonb, 
  outcome text, 
  reasons jsonb DEFAULT '[]'::jsonb, 
  entity_id uuid DEFAULT NULL::uuid, 
  model_hash text DEFAULT NULL::text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  receipt_id UUID;
  inputs_hash TEXT;
  policy_hash TEXT;
  leaf_hash TEXT;
  root_hash TEXT;
  leaves TEXT[];
BEGIN
  -- Only allow service role to call this function directly
  IF auth.role() != 'service_role' THEN
    RAISE EXCEPTION 'Access denied: Only service role can emit receipts directly';
  END IF;
  
  -- Generate new receipt ID
  receipt_id := gen_random_uuid();
  
  -- Compute input and policy hashes
  inputs_hash := public.sha256_hex(inputs_json::text);
  policy_hash := public.sha256_hex(policy_json::text);
  
  -- Create leaf hash from receipt components
  leaf_hash := public.sha256_hex(
    receipt_id::text || 
    COALESCE(entity_id::text, '') ||
    inputs_hash || 
    policy_hash || 
    outcome ||
    COALESCE(model_hash, '') ||
    reasons::text ||
    EXTRACT(epoch from now())::text
  );
  
  -- For demo: create a simple merkle root (in production, this would batch with other receipts)
  leaves := ARRAY[leaf_hash];
  root_hash := public.merkle_root(leaves);
  
  -- Insert the receipt
  INSERT INTO public.receipts (
    receipt_id,
    entity_id,
    inputs_hash,
    policy_hash,
    model_hash,
    reason_codes,
    outcome,
    leaf,
    root
  ) VALUES (
    receipt_id,
    entity_id,
    inputs_hash,
    policy_hash,
    model_hash,
    reasons,
    outcome,
    leaf_hash,
    root_hash
  );
  
  RETURN receipt_id;
END;
$$;

-- Step 7: Update complete_attorney_onboarding function
CREATE OR REPLACE FUNCTION public.complete_attorney_onboarding(p_onboarding_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.attorney_onboarding 
  SET status = 'completed', updated_at = now()
  WHERE id = p_onboarding_id AND user_id = auth.uid();
  
  RETURN FOUND;
END;
$$;

-- Step 8: Update user_has_feature function
CREATE OR REPLACE FUNCTION public.user_has_feature(_feature text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_entitlements ue
    WHERE ue.user_id = auth.uid()
      AND ue.feature_key = _feature
  );
$$;

-- Step 9: Create restricted RLS policies for public views
-- Ensure anon users can only access public views, not base tables directly
DROP POLICY IF EXISTS "advisor_profiles_anon_blocked" ON public.advisor_profiles;
CREATE POLICY "advisor_profiles_anon_blocked" 
ON public.advisor_profiles 
FOR SELECT 
TO anon
USING (false);

DROP POLICY IF EXISTS "reserved_profiles_anon_blocked" ON public.reserved_profiles;
CREATE POLICY "reserved_profiles_anon_blocked" 
ON public.reserved_profiles 
FOR SELECT 
TO anon
USING (false);

-- Comment: This migration hardens email security by:
-- 1. Creating masked public views that use email_mask() function
-- 2. Revoking direct email column access for anon role
-- 3. Blocking anon access to base tables containing emails
-- 4. Locking search_path on all security definer functions
-- 5. Ensuring only authenticated users can access raw email data through proper RLS