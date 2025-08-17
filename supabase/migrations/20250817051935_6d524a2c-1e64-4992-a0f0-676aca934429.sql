-- Step D: Fix Database Configuration Issues (Safe Defaults)

-- 1. Secure public schema permissions
DO $$
BEGIN
  -- Revoke CREATE on public schema from PUBLIC role
  EXECUTE 'REVOKE CREATE ON SCHEMA public FROM PUBLIC';
  -- Grant to postgres (superuser) only
  EXECUTE 'GRANT CREATE ON SCHEMA public TO postgres';
  RAISE NOTICE 'Secured public schema permissions';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Public schema permission error: %', SQLERRM;
END $$;

-- 2. Set secure database defaults
ALTER DATABASE postgres SET search_path = 'public, pg_temp';
ALTER DATABASE postgres SET row_security = on;

-- 3. Create extensions schema if not exists and move extensions
DO $$
BEGIN
  -- Create extensions schema
  CREATE SCHEMA IF NOT EXISTS extensions;
  GRANT USAGE ON SCHEMA extensions TO postgres, anon, authenticated, service_role;
  
  -- Move supported extensions to extensions schema (safe ones only)
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'uuid-ossp' AND extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) THEN
    ALTER EXTENSION "uuid-ossp" SET SCHEMA extensions;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto' AND extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) THEN
    ALTER EXTENSION "pgcrypto" SET SCHEMA extensions;
  END IF;
  
  RAISE NOTICE 'Extensions schema configured';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Extensions schema error: %', SQLERRM;
END $$;

-- 4. Set default privileges for new objects
DO $$
BEGIN
  -- Revoke PUBLIC access to new functions in public schema
  ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO authenticated, service_role;
  
  -- Revoke PUBLIC access to new sequences in public schema  
  ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM PUBLIC;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO authenticated, service_role;
  
  RAISE NOTICE 'Default privileges configured';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Default privileges error: %', SQLERRM;
END $$;

-- 5. Create simple base table policies for remaining tables (without redaction views)
DO $$
BEGIN
  -- Simple service_role policies for the remaining sensitive tables
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'estate_witnesses' AND policyname = 'Service role can access estate witnesses') THEN
    EXECUTE 'CREATE POLICY "Service role can access estate witnesses" ON public.estate_witnesses FOR ALL USING (auth.role() = ''service_role'')';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'estate_notaries' AND policyname = 'Service role can access estate notaries') THEN
    EXECUTE 'CREATE POLICY "Service role can access estate notaries" ON public.estate_notaries FOR ALL USING (auth.role() = ''service_role'')';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'estate_sessions' AND policyname = 'Service role can access estate sessions') THEN
    EXECUTE 'CREATE POLICY "Service role can access estate sessions" ON public.estate_sessions FOR ALL USING (auth.role() = ''service_role'')';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'estate_filings' AND policyname = 'Service role can access estate filings') THEN
    EXECUTE 'CREATE POLICY "Service role can access estate filings" ON public.estate_filings FOR ALL USING (auth.role() = ''service_role'')';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'firm_invitations' AND policyname = 'Service role can access firm invitations') THEN
    EXECUTE 'CREATE POLICY "Service role can access firm invitations" ON public.firm_invitations FOR ALL USING (auth.role() = ''service_role'')';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'product_documents' AND policyname = 'Service role can access product documents') THEN
    EXECUTE 'CREATE POLICY "Service role can access product documents" ON public.product_documents FOR ALL USING (auth.role() = ''service_role'')';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'liquidity_events' AND policyname = 'Service role can access liquidity events') THEN
    EXECUTE 'CREATE POLICY "Service role can access liquidity events" ON public.liquidity_events FOR ALL USING (auth.role() = ''service_role'')';
  END IF;

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
  RAISE NOTICE 'Base table policy error: %', SQLERRM;
END $$;