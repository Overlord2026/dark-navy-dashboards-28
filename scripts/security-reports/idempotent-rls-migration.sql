-- Idempotent RLS Policy Migration
-- Safe for production deployment
-- Handles non-existent tables and duplicate policies gracefully

BEGIN;

-- Helper function to check if table exists
CREATE OR REPLACE FUNCTION table_exists(schema_name text, table_name text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = schema_name AND table_name = table_name
  );
END;
$$ LANGUAGE plpgsql;

-- Create policies for tables missing them (only if tables exist)
DO $$
DECLARE
  table_list text[] := ARRAY[
    'accountant_ce_alerts',
    'analytics_scorecard_events', 
    'api_integration_configs',
    'attorney_cle_alerts',
    'call_routing',
    'ce_completions',
    'compliance_checks',
    'draft_proposals',
    'email_sequences',
    'estate_filings',
    'estate_notaries',
    'estate_requests',
    'estate_sessions',
    'estate_witnesses',
    'firm_billing',
    'firm_handoffs',
    'firm_invitations',
    'fund_holdings_lookup',
    'ip_rules',
    'kyc_verifications',
    'liquidity_events',
    'phishing_simulations',
    'product_documents',
    'professional_seat_audit',
    'proposal_overrides',
    'ref_currencies',
    'retirement_confidence_submissions',
    'ria_state_comms',
    'roadmap_intake_sessions',
    'rollup_analytics',
    'security_review_completions',
    'security_training_completions',
    'tenant_hierarchies',
    'twilio_phone_numbers',
    'ui_layout_components',
    'vip_admin_activity_log',
    'vip_batch_imports',
    'vip_invitation_tracking',
    'vip_outreach_log',
    'vip_referral_networks',
    'voicemails',
    'xr_attestations'
  ];
  table_name text;
BEGIN
  FOREACH table_name IN ARRAY table_list LOOP
    IF table_exists('public', table_name) THEN
      -- Standard user isolation policy for tables with user_id
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = table_name 
          AND column_name = 'user_id'
        ) THEN
          EXECUTE format(
            'CREATE POLICY "Users can manage own %s" ON public.%I FOR ALL USING (auth.uid() = user_id)',
            table_name, table_name
          );
          RAISE NOTICE 'Created user isolation policy for %', table_name;
        
        -- Tenant isolation for tables with tenant_id
        ELSIF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = table_name 
          AND column_name = 'tenant_id'
        ) THEN
          EXECUTE format(
            'CREATE POLICY "Tenant users can access %s" ON public.%I FOR ALL USING (tenant_id = get_current_user_tenant_id())',
            table_name, table_name
          );
          RAISE NOTICE 'Created tenant isolation policy for %', table_name;
        
        -- Admin-only access for sensitive tables
        ELSIF table_name IN ('security_review_completions', 'security_training_completions', 'vip_admin_activity_log') THEN
          EXECUTE format(
            'CREATE POLICY "Admin access only for %s" ON public.%I FOR ALL USING (has_role(''admin''::text))',
            table_name, table_name
          );
          RAISE NOTICE 'Created admin-only policy for %', table_name;
        
        -- Default authenticated access for configuration tables
        ELSE
          EXECUTE format(
            'CREATE POLICY "Authenticated users can access %s" ON public.%I FOR SELECT USING (auth.role() = ''authenticated'')',
            table_name, table_name
          );
          RAISE NOTICE 'Created authenticated access policy for %', table_name;
        END IF;
        
      EXCEPTION 
        WHEN duplicate_object THEN 
          RAISE NOTICE 'Policy already exists for table %', table_name;
        WHEN OTHERS THEN
          RAISE NOTICE 'Could not create policy for table %: %', table_name, SQLERRM;
      END;
    ELSE
      RAISE NOTICE 'Table % does not exist, skipping', table_name;
    END IF;
  END LOOP;
END $$;

-- Create storage policy for proposals bucket if missing
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'proposals') THEN
    BEGIN
      CREATE POLICY "Users can view proposals in their tenant" ON storage.objects
        FOR SELECT USING (
          bucket_id = 'proposals' AND 
          auth.uid()::text = (storage.foldername(name))[1]
        );
      RAISE NOTICE 'Created proposals bucket SELECT policy';
    EXCEPTION 
      WHEN duplicate_object THEN 
        RAISE NOTICE 'Proposals SELECT policy already exists';
    END;
    
    BEGIN
      CREATE POLICY "Users can upload proposals" ON storage.objects
        FOR INSERT WITH CHECK (
          bucket_id = 'proposals' AND 
          auth.uid()::text = (storage.foldername(name))[1]
        );
      RAISE NOTICE 'Created proposals bucket INSERT policy';
    EXCEPTION 
      WHEN duplicate_object THEN 
        RAISE NOTICE 'Proposals INSERT policy already exists';
    END;
  ELSE
    RAISE NOTICE 'Proposals bucket does not exist, skipping storage policies';
  END IF;
END $$;

-- Clean up helper function
DROP FUNCTION IF EXISTS table_exists(text, text);

COMMIT;

-- Verification query (run separately to check results)
/*
SELECT 
  t.table_name,
  CASE 
    WHEN pt.rowsecurity = true THEN 'ENABLED'
    ELSE 'DISABLED'
  END AS rls_enabled,
  COALESCE(policy_count.count, 0) AS policy_count
FROM information_schema.tables t
LEFT JOIN pg_tables pt ON pt.tablename = t.table_name AND pt.schemaname = t.table_schema
LEFT JOIN (
  SELECT tablename, COUNT(*) as count
  FROM pg_policies 
  WHERE schemaname = 'public'
  GROUP BY tablename
) policy_count ON policy_count.tablename = t.table_name
WHERE 
  t.table_schema = 'public'
  AND t.table_type = 'BASE TABLE'
  AND t.table_name IN (
    'accountant_ce_alerts', 'analytics_scorecard_events', 'api_integration_configs',
    'attorney_cle_alerts', 'call_routing', 'ce_completions', 'compliance_checks',
    'draft_proposals', 'email_sequences', 'estate_filings', 'estate_notaries',
    'estate_requests', 'estate_sessions', 'estate_witnesses', 'firm_billing',
    'firm_handoffs', 'firm_invitations', 'fund_holdings_lookup', 'ip_rules',
    'kyc_verifications', 'liquidity_events', 'phishing_simulations',
    'product_documents', 'professional_seat_audit', 'proposal_overrides',
    'ref_currencies', 'retirement_confidence_submissions', 'ria_state_comms',
    'roadmap_intake_sessions', 'rollup_analytics', 'security_review_completions',
    'security_training_completions', 'tenant_hierarchies', 'twilio_phone_numbers',
    'ui_layout_components', 'vip_admin_activity_log', 'vip_batch_imports',
    'vip_invitation_tracking', 'vip_outreach_log', 'vip_referral_networks',
    'voicemails', 'xr_attestations'
  )
ORDER BY t.table_name;
*/