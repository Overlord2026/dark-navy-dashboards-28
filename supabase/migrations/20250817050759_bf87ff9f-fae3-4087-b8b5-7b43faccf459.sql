-- Apply targeted RLS policies based on actual table structures

-- Class A: Safe lookup tables
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ui_layout_components') THEN
    EXECUTE 'CREATE POLICY "Anyone can view UI layout components" ON public.ui_layout_components FOR SELECT USING (true)';
  END IF;
EXCEPTION 
  WHEN duplicate_object THEN NULL;
END $$;

-- Class B: User-scoped tables
DO $$ 
BEGIN
  -- CE completions (user-based)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ce_completions') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ce_completions' AND column_name = 'user_id') THEN
      EXECUTE 'CREATE POLICY "Users can access their CE completions" ON public.ce_completions FOR ALL USING (user_id = auth.uid())';
    END IF;
  END IF;

  -- KYC verifications (user-based)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'kyc_verifications') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'kyc_verifications' AND column_name = 'user_id') THEN
      EXECUTE 'CREATE POLICY "Users can access their KYC verifications" ON public.kyc_verifications FOR ALL USING (user_id = auth.uid())';
    END IF;
  END IF;

  -- Professional seat audit (user-based)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'professional_seat_audit') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'professional_seat_audit' AND column_name = 'user_id') THEN
      EXECUTE 'CREATE POLICY "Users can view their seat audit" ON public.professional_seat_audit FOR SELECT USING (user_id = auth.uid())';
    END IF;
  END IF;

  -- Firm billing (firm-based)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'firm_billing') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'firm_billing' AND column_name = 'firm_id') THEN
      EXECUTE 'CREATE POLICY "Firm members can access billing" ON public.firm_billing FOR ALL USING (firm_id = get_current_user_firm_id())';
    END IF;
  END IF;

  -- Firm handoffs (firm-based)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'firm_handoffs') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'firm_handoffs' AND column_name = 'firm_id') THEN
      EXECUTE 'CREATE POLICY "Firm members can access handoffs" ON public.firm_handoffs FOR ALL USING (firm_id = get_current_user_firm_id())';
    END IF;
  END IF;

EXCEPTION 
  WHEN duplicate_object THEN NULL;
END $$;

-- Admin-only tables
DO $$ 
BEGIN
  -- IP rules (admin access)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ip_rules') THEN
    EXECUTE 'CREATE POLICY "Admins can manage IP rules" ON public.ip_rules FOR ALL USING (
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND role IN (''admin'', ''system_administrator'')
      )
    )';
  END IF;

  -- VIP admin activity log (admin access)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'vip_admin_activity_log') THEN
    EXECUTE 'CREATE POLICY "Admins can view admin activity logs" ON public.vip_admin_activity_log FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND role IN (''admin'', ''system_administrator'')
      )
    )';
  END IF;

EXCEPTION 
  WHEN duplicate_object THEN NULL;
END $$;