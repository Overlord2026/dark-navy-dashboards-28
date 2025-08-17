-- Step B: Create Redaction Views for Class C (Sensitive Data)

-- Class C: Sensitive estate planning data - create redacted views with security barrier
CREATE OR REPLACE VIEW public.v_estate_witnesses_redacted WITH (security_barrier = true) AS
SELECT 
  id,
  case_id,
  public.mask_email(email) as email,
  public.mask_phone(phone) as phone,
  LEFT(full_name, 1) || '***' as full_name_masked,
  witness_type,
  signature_date,
  created_at,
  updated_at
FROM public.estate_witnesses;

CREATE OR REPLACE VIEW public.v_estate_notaries_redacted WITH (security_barrier = true) AS
SELECT 
  id,
  case_id,
  LEFT(notary_name, 1) || '***' as notary_name_masked,
  commission_number,
  commission_expiry,
  notarization_date,
  created_at,
  updated_at
FROM public.estate_notaries;

CREATE OR REPLACE VIEW public.v_firm_invitations_redacted WITH (security_barrier = true) AS
SELECT 
  id,
  LEFT(firm_name, 3) || '***' as firm_name_masked,
  public.mask_email(admin_email) as admin_email_masked,
  LEFT(admin_name, 1) || '***' as admin_name_masked,
  invitation_status,
  invited_at,
  expires_at,
  created_at,
  updated_at
FROM public.firm_invitations;

CREATE OR REPLACE VIEW public.v_product_documents_redacted WITH (security_barrier = true) AS
SELECT 
  id,
  product_id,
  document_type,
  LEFT(name, 3) || '***' as name_masked,
  file_url,
  compliance_status,
  LEFT(compliance_notes, 10) || '...' as compliance_notes_summary,
  created_at,
  updated_at
FROM public.product_documents;

-- Redacted view policies - allow household/professional access
DO $$
BEGIN
  -- Estate witnesses redacted view
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'v_estate_witnesses_redacted') THEN
    EXECUTE 'CREATE POLICY "Household members can view redacted estate witnesses" ON public.v_estate_witnesses_redacted FOR SELECT TO authenticated USING (true)';
  END IF;

  -- Estate notaries redacted view  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'v_estate_notaries_redacted') THEN
    EXECUTE 'CREATE POLICY "Household members can view redacted estate notaries" ON public.v_estate_notaries_redacted FOR SELECT TO authenticated USING (true)';
  END IF;

  -- Firm invitations redacted view
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'v_firm_invitations_redacted') THEN
    EXECUTE 'CREATE POLICY "Authenticated users can view redacted firm invitations" ON public.v_firm_invitations_redacted FOR SELECT TO authenticated USING (true)';
  END IF;

  -- Product documents redacted view
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'v_product_documents_redacted') THEN
    EXECUTE 'CREATE POLICY "Authenticated users can view redacted product documents" ON public.v_product_documents_redacted FOR SELECT TO authenticated USING (true)';
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Redacted view policy error: %', SQLERRM;
END $$;

-- Class C: Sensitive base table policies - service_role only for SELECT, restrict base table access
DO $$
BEGIN
  -- Estate witnesses: service_role SELECT only, no user access to base table
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'estate_witnesses' AND policyname = 'Service role can access estate witnesses') THEN
    EXECUTE 'CREATE POLICY "Service role can access estate witnesses" ON public.estate_witnesses FOR ALL USING (auth.role() = ''service_role'')';
  END IF;

  -- Estate notaries: service_role SELECT only
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'estate_notaries' AND policyname = 'Service role can access estate notaries') THEN
    EXECUTE 'CREATE POLICY "Service role can access estate notaries" ON public.estate_notaries FOR ALL USING (auth.role() = ''service_role'')';
  END IF;

  -- Estate sessions: service_role access  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'estate_sessions' AND policyname = 'Service role can access estate sessions') THEN
    EXECUTE 'CREATE POLICY "Service role can access estate sessions" ON public.estate_sessions FOR ALL USING (auth.role() = ''service_role'')';
  END IF;

  -- Estate filings: service_role access
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'estate_filings' AND policyname = 'Service role can access estate filings') THEN
    EXECUTE 'CREATE POLICY "Service role can access estate filings" ON public.estate_filings FOR ALL USING (auth.role() = ''service_role'')';
  END IF;

  -- Firm invitations: service_role access
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'firm_invitations' AND policyname = 'Service role can access firm invitations') THEN
    EXECUTE 'CREATE POLICY "Service role can access firm invitations" ON public.firm_invitations FOR ALL USING (auth.role() = ''service_role'')';
  END IF;

  -- Product documents: service_role access  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'product_documents' AND policyname = 'Service role can access product documents') THEN
    EXECUTE 'CREATE POLICY "Service role can access product documents" ON public.product_documents FOR ALL USING (auth.role() = ''service_role'')';
  END IF;

  -- Liquidity events: service_role access
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'liquidity_events' AND policyname = 'Service role can access liquidity events') THEN
    EXECUTE 'CREATE POLICY "Service role can access liquidity events" ON public.liquidity_events FOR ALL USING (auth.role() = ''service_role'')';
  END IF;

  -- VIP tables: service_role + admin access
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vip_invitation_tracking' AND policyname = 'Admins can access VIP invitation tracking') THEN
    EXECUTE 'CREATE POLICY "Admins can access VIP invitation tracking" ON public.vip_invitation_tracking FOR ALL USING (
      auth.role() = ''service_role'' OR 
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN (''admin'', ''system_administrator''))
    )';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vip_outreach_log' AND policyname = 'Admins can access VIP outreach log') THEN
    EXECUTE 'CREATE POLICY "Admins can access VIP outreach log" ON public.vip_outreach_log FOR ALL USING (
      auth.role() = ''service_role'' OR 
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN (''admin'', ''system_administrator''))
    )';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vip_referral_networks' AND policyname = 'Admins can access VIP referral networks') THEN
    EXECUTE 'CREATE POLICY "Admins can access VIP referral networks" ON public.vip_referral_networks FOR ALL USING (
      auth.role() = ''service_role'' OR 
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN (''admin'', ''system_administrator''))
    )';
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Sensitive table policy error: %', SQLERRM;
END $$;