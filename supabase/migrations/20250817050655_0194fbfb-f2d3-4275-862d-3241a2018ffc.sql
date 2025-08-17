-- Classify and apply RLS policies for appropriate tables

-- Class A: Lookup/reference tables (safe for read-all)
-- ui_layout_components - UI configuration data
CREATE POLICY "Anyone can view UI layout components" 
ON public.ui_layout_components FOR SELECT USING (true);

-- Class B: Ownership/tenant-based tables
-- firm_billing - Already has get_current_user_firm_id function
CREATE POLICY "Firm members can access billing" 
ON public.firm_billing FOR ALL USING (firm_id = get_current_user_firm_id());

CREATE POLICY "Firm members can access handoffs" 
ON public.firm_handoffs FOR ALL USING (firm_id = get_current_user_firm_id());

-- tenant_hierarchies - Multi-tenant structure
CREATE POLICY "Tenant users can view their hierarchy" 
ON public.tenant_hierarchies FOR SELECT USING (
  tenant_id = get_current_user_tenant_id() OR 
  parent_tenant_id = get_current_user_tenant_id()
);

-- rollup_analytics - Tenant-scoped analytics
CREATE POLICY "Tenant users can view their analytics" 
ON public.rollup_analytics FOR SELECT USING (tenant_id = get_current_user_tenant_id());

-- User-scoped tables
-- kyc_verifications - User-specific KYC data
CREATE POLICY "Users can access their KYC verifications" 
ON public.kyc_verifications FOR ALL USING (user_id = auth.uid());

-- ce_completions - User training completions
CREATE POLICY "Users can access their CE completions" 
ON public.ce_completions FOR ALL USING (user_id = auth.uid());

-- professional_seat_audit - User activity audit
CREATE POLICY "Users can view their seat audit" 
ON public.professional_seat_audit FOR SELECT USING (user_id = auth.uid());

-- Admin-only tables (service role or admin access)
-- ip_rules - Network security configuration
CREATE POLICY "Admins can manage IP rules" 
ON public.ip_rules FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'system_administrator')
  )
);

-- vip_admin_activity_log - Admin activity tracking
CREATE POLICY "Admins can view admin activity logs" 
ON public.vip_admin_activity_log FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'system_administrator')
  )
);

-- Class C: Sensitive tables requiring manual review (commented for reference)
-- These remain policy-free for manual implementation:
-- email_sequences, estate_filings, estate_notaries, estate_sessions, estate_witnesses
-- firm_invitations, liquidity_events, product_documents, proposal_overrides
-- ria_state_comms, vip_invitation_tracking, vip_outreach_log, vip_referral_networks
-- xr_attestations