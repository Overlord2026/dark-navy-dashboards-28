-- Step A & B: Policy Worksheet Implementation + Redaction Kit

-- Helper functions for redaction (idempotent)
CREATE OR REPLACE FUNCTION public.mask_email(email_text TEXT)
RETURNS TEXT AS $$
BEGIN
  IF email_text IS NULL OR email_text = '' THEN RETURN email_text; END IF;
  RETURN LEFT(email_text, 2) || '***@' || SPLIT_PART(email_text, '@', 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE SECURITY INVOKER SET search_path = public, pg_temp;

CREATE OR REPLACE FUNCTION public.mask_phone(phone_text TEXT)
RETURNS TEXT AS $$
BEGIN
  IF phone_text IS NULL OR phone_text = '' THEN RETURN phone_text; END IF;
  RETURN '***-***-' || RIGHT(phone_text, 4);
END;
$$ LANGUAGE plpgsql IMMUTABLE SECURITY INVOKER SET search_path = public, pg_temp;

CREATE OR REPLACE FUNCTION public.last4(text_value TEXT)
RETURNS TEXT AS $$
BEGIN
  IF text_value IS NULL OR LENGTH(text_value) < 4 THEN RETURN '****'; END IF;
  RETURN '****' || RIGHT(text_value, 4);
END;
$$ LANGUAGE plpgsql IMMUTABLE SECURITY INVOKER SET search_path = public, pg_temp;

-- Step C: Apply policies for Class A (Lookups) and Class B (Ownership)

-- Class A: Pure Lookups (read_all policies)
DO $$ 
BEGIN
  -- email_sequences: Marketing automation lookup
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'email_sequences' AND policyname = 'Email sequences readable by authenticated users') THEN
    EXECUTE 'CREATE POLICY "Email sequences readable by authenticated users" ON public.email_sequences FOR SELECT TO authenticated USING (true)';
  END IF;

  -- ria_state_comms: Regulatory communications lookup  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ria_state_comms' AND policyname = 'RIA communications readable by authenticated users') THEN
    EXECUTE 'CREATE POLICY "RIA communications readable by authenticated users" ON public.ria_state_comms FOR SELECT TO authenticated USING (true)';
  END IF;

  -- xr_attestations: Cross-reference attestations
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'xr_attestations' AND policyname = 'XR attestations readable by authenticated users') THEN
    EXECUTE 'CREATE POLICY "XR attestations readable by authenticated users" ON public.xr_attestations FOR SELECT TO authenticated USING (true)';
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Class A policy error: %', SQLERRM;
END $$;

-- Class B: Ownership-based tables
DO $$ 
BEGIN
  -- ce_completions: User training completions (created_by ownership)
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ce_completions' AND policyname = 'Users can manage their CE completions') THEN
    EXECUTE 'CREATE POLICY "Users can manage their CE completions" ON public.ce_completions FOR ALL TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid())';
  END IF;

  -- kyc_verifications: User KYC data (created_by ownership)
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'kyc_verifications' AND policyname = 'Users can manage their KYC verifications') THEN
    EXECUTE 'CREATE POLICY "Users can manage their KYC verifications" ON public.kyc_verifications FOR ALL TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid())';
  END IF;

  -- proposal_overrides: User proposal overrides (created_by ownership)
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'proposal_overrides' AND policyname = 'Users can manage their proposal overrides') THEN
    EXECUTE 'CREATE POLICY "Users can manage their proposal overrides" ON public.proposal_overrides FOR ALL TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid())';
  END IF;

  -- tenant_hierarchies: Tenant structure (created_by ownership)
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'tenant_hierarchies' AND policyname = 'Users can manage their tenant hierarchies') THEN
    EXECUTE 'CREATE POLICY "Users can manage their tenant hierarchies" ON public.tenant_hierarchies FOR ALL TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid())';
  END IF;

  -- professional_seat_audit: Professional activity audit
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'professional_seat_audit' AND policyname = 'Admins can view professional seat audit') THEN
    EXECUTE 'CREATE POLICY "Admins can view professional seat audit" ON public.professional_seat_audit FOR SELECT TO authenticated USING (
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN (''admin'', ''system_administrator''))
    )';
  END IF;

  -- rollup_analytics: System analytics
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'rollup_analytics' AND policyname = 'Admins can view rollup analytics') THEN
    EXECUTE 'CREATE POLICY "Admins can view rollup analytics" ON public.rollup_analytics FOR SELECT TO authenticated USING (
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN (''admin'', ''system_administrator''))
    )';
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Class B policy error: %', SQLERRM;
END $$;