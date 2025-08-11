-- ===================================================
-- Patent #9: RLS Policies for Core Vetting Tables
-- ===================================================

-- Vetting Requests Policies
CREATE POLICY "Users can view vetting requests for their professionals" ON public.vetting_requests
  FOR SELECT USING (
    tenant_id = get_current_user_tenant_id() OR 
    get_current_user_role() IN ('admin', 'system_administrator')
  );

CREATE POLICY "Professionals can create vetting requests" ON public.vetting_requests
  FOR INSERT WITH CHECK (
    tenant_id = get_current_user_tenant_id() AND
    (requested_by = auth.uid() OR get_current_user_role() IN ('admin', 'system_administrator'))
  );

CREATE POLICY "Admins can update vetting requests" ON public.vetting_requests
  FOR UPDATE USING (
    tenant_id = get_current_user_tenant_id() AND
    get_current_user_role() IN ('admin', 'system_administrator', 'reviewer')
  );

-- Credential Sources Policies (Global configuration)
CREATE POLICY "Anyone can view active credential sources" ON public.credential_sources
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage credential sources" ON public.credential_sources
  FOR ALL USING (get_current_user_role() IN ('admin', 'system_administrator'));

-- Registry Records Policies
CREATE POLICY "Users can view registry records for their professionals" ON public.registry_records
  FOR SELECT USING (
    tenant_id = get_current_user_tenant_id() OR
    get_current_user_role() IN ('admin', 'system_administrator')
  );

CREATE POLICY "System can create registry records" ON public.registry_records
  FOR INSERT WITH CHECK (tenant_id = get_current_user_tenant_id());

-- Trust Scores Policies
CREATE POLICY "Users can view trust scores for their professionals" ON public.trust_scores
  FOR SELECT USING (
    tenant_id = get_current_user_tenant_id() OR
    get_current_user_role() IN ('admin', 'system_administrator')
  );

CREATE POLICY "System can manage trust scores" ON public.trust_scores
  FOR ALL USING (
    tenant_id = get_current_user_tenant_id() OR
    get_current_user_role() IN ('admin', 'system_administrator')
  );