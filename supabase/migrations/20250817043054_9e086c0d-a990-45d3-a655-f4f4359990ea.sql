-- RLS Policy Classification and Application
-- Class A: Lookup/Reference tables (public read access)
-- Class B: Ownership-based tables (user/tenant access)

DO $$
DECLARE
    _table_name TEXT;
    _policy_exists BOOLEAN;
BEGIN
    -- ===============================================
    -- CLASS A: LOOKUP TABLES (Public Read Access)
    -- ===============================================
    
    -- ref_currencies: Currency reference table
    SELECT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'ref_currencies'
        AND policyname = 'Anyone can view currency references'
    ) INTO _policy_exists;
    
    IF NOT _policy_exists AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ref_currencies' AND table_schema = 'public') THEN
        CREATE POLICY "Anyone can view currency references"
        ON public.ref_currencies
        FOR SELECT
        USING (true);
        RAISE NOTICE 'Created public read policy for ref_currencies';
    END IF;
    
    -- fund_holdings_lookup: Fund holdings reference
    SELECT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'fund_holdings_lookup'
        AND policyname = 'Anyone can view fund holdings lookup'
    ) INTO _policy_exists;
    
    IF NOT _policy_exists AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'fund_holdings_lookup' AND table_schema = 'public') THEN
        CREATE POLICY "Anyone can view fund holdings lookup"
        ON public.fund_holdings_lookup
        FOR SELECT
        USING (true);
        RAISE NOTICE 'Created public read policy for fund_holdings_lookup';
    END IF;
    
    -- ===============================================
    -- CLASS B: OWNERSHIP-BASED TABLES
    -- ===============================================
    
    -- Tenant-based access tables
    FOR _table_name IN 
        SELECT unnest(ARRAY[
            'api_integration_configs',
            'call_routing', 
            'compliance_checks',
            'draft_proposals',
            'phishing_simulations',
            'security_review_completions',
            'twilio_phone_numbers',
            'vip_batch_imports',
            'voicemails'
        ])
    LOOP
        -- Check if table exists
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = _table_name AND table_schema = 'public') THEN
            
            -- SELECT policy
            SELECT EXISTS (
                SELECT 1 FROM pg_policies 
                WHERE schemaname = 'public' 
                AND tablename = _table_name
                AND policyname = format('Tenant users can view %s', _table_name)
            ) INTO _policy_exists;
            
            IF NOT _policy_exists THEN
                BEGIN
                    EXECUTE format('CREATE POLICY "Tenant users can view %s" ON public.%I FOR SELECT USING (tenant_id = get_current_user_tenant_id())', _table_name, _table_name);
                    RAISE NOTICE 'Created SELECT policy for %', _table_name;
                EXCEPTION WHEN duplicate_object THEN
                    RAISE NOTICE 'SELECT policy already exists for %', _table_name;
                END;
            END IF;
            
            -- INSERT policy
            SELECT EXISTS (
                SELECT 1 FROM pg_policies 
                WHERE schemaname = 'public' 
                AND tablename = _table_name
                AND policyname = format('Tenant users can insert %s', _table_name)
            ) INTO _policy_exists;
            
            IF NOT _policy_exists THEN
                BEGIN
                    EXECUTE format('CREATE POLICY "Tenant users can insert %s" ON public.%I FOR INSERT WITH CHECK (tenant_id = get_current_user_tenant_id())', _table_name, _table_name);
                    RAISE NOTICE 'Created INSERT policy for %', _table_name;
                EXCEPTION WHEN duplicate_object THEN
                    RAISE NOTICE 'INSERT policy already exists for %', _table_name;
                END;
            END IF;
            
            -- UPDATE policy
            SELECT EXISTS (
                SELECT 1 FROM pg_policies 
                WHERE schemaname = 'public' 
                AND tablename = _table_name
                AND policyname = format('Tenant users can update %s', _table_name)
            ) INTO _policy_exists;
            
            IF NOT _policy_exists THEN
                BEGIN
                    EXECUTE format('CREATE POLICY "Tenant users can update %s" ON public.%I FOR UPDATE USING (tenant_id = get_current_user_tenant_id()) WITH CHECK (tenant_id = get_current_user_tenant_id())', _table_name, _table_name);
                    RAISE NOTICE 'Created UPDATE policy for %', _table_name;
                EXCEPTION WHEN duplicate_object THEN
                    RAISE NOTICE 'UPDATE policy already exists for %', _table_name;
                END;
            END IF;
            
            -- DELETE policy
            SELECT EXISTS (
                SELECT 1 FROM pg_policies 
                WHERE schemaname = 'public' 
                AND tablename = _table_name
                AND policyname = format('Tenant users can delete %s', _table_name)
            ) INTO _policy_exists;
            
            IF NOT _policy_exists THEN
                BEGIN
                    EXECUTE format('CREATE POLICY "Tenant users can delete %s" ON public.%I FOR DELETE USING (tenant_id = get_current_user_tenant_id())', _table_name, _table_name);
                    RAISE NOTICE 'Created DELETE policy for %', _table_name;
                EXCEPTION WHEN duplicate_object THEN
                    RAISE NOTICE 'DELETE policy already exists for %', _table_name;
                END;
            END IF;
            
        ELSE
            RAISE NOTICE 'Table % does not exist, skipping', _table_name;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'RLS policy application complete for classes A and B';
    
END $$;