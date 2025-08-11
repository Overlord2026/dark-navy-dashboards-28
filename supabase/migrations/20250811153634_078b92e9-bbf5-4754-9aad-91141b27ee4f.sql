-- ===================================================
-- Patent #9: RLS Policies for Vetting Engine
-- ===================================================

-- Helper Functions (Security Definer to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.get_current_user_tenant_id()
RETURNS UUID
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT tenant_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

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

-- Sanction Hits Policies
CREATE POLICY "Users can view sanction hits for their professionals" ON public.sanction_hits
  FOR SELECT USING (
    tenant_id = get_current_user_tenant_id() OR
    get_current_user_role() IN ('admin', 'system_administrator')
  );

CREATE POLICY "System can create sanction hits" ON public.sanction_hits
  FOR INSERT WITH CHECK (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Reviewers can update sanction hits" ON public.sanction_hits
  FOR UPDATE USING (
    tenant_id = get_current_user_tenant_id() AND
    get_current_user_role() IN ('admin', 'system_administrator', 'reviewer')
  );

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

-- Monitoring Jobs Policies
CREATE POLICY "Users can view monitoring jobs for their professionals" ON public.monitoring_jobs
  FOR SELECT USING (
    tenant_id = get_current_user_tenant_id() OR
    get_current_user_role() IN ('admin', 'system_administrator')
  );

CREATE POLICY "System can manage monitoring jobs" ON public.monitoring_jobs
  FOR ALL USING (
    tenant_id = get_current_user_tenant_id() OR
    get_current_user_role() IN ('admin', 'system_administrator')
  );

-- Reconciliation Logs Policies
CREATE POLICY "Users can view reconciliation logs for their professionals" ON public.reconciliation_logs
  FOR SELECT USING (
    tenant_id = get_current_user_tenant_id() OR
    get_current_user_role() IN ('admin', 'system_administrator')
  );

CREATE POLICY "System can create reconciliation logs" ON public.reconciliation_logs
  FOR INSERT WITH CHECK (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Reviewers can update reconciliation logs" ON public.reconciliation_logs
  FOR UPDATE USING (
    tenant_id = get_current_user_tenant_id() AND
    get_current_user_role() IN ('admin', 'system_administrator', 'reviewer')
  );

-- Digital Assets Policies
CREATE POLICY "Users can view their digital assets" ON public.digital_assets
  FOR SELECT USING (
    tenant_id = get_current_user_tenant_id() OR
    get_current_user_role() IN ('admin', 'system_administrator')
  );

CREATE POLICY "System can create digital assets" ON public.digital_assets
  FOR INSERT WITH CHECK (tenant_id = get_current_user_tenant_id());

-- Fingerprints Policies
CREATE POLICY "Users can view fingerprints of their assets" ON public.fingerprints
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.digital_assets da 
      WHERE da.id = digital_asset_id 
      AND (da.tenant_id = get_current_user_tenant_id() OR get_current_user_role() IN ('admin', 'system_administrator'))
    )
  );

CREATE POLICY "System can create fingerprints" ON public.fingerprints
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.digital_assets da 
      WHERE da.id = digital_asset_id 
      AND da.tenant_id = get_current_user_tenant_id()
    )
  );

-- Merkle Batches Policies
CREATE POLICY "Users can view their merkle batches" ON public.merkle_batches
  FOR SELECT USING (
    tenant_id = get_current_user_tenant_id() OR
    get_current_user_role() IN ('admin', 'system_administrator')
  );

CREATE POLICY "System can manage merkle batches" ON public.merkle_batches
  FOR ALL USING (
    tenant_id = get_current_user_tenant_id() OR
    get_current_user_role() IN ('admin', 'system_administrator')
  );

-- Chain Anchors Policies
CREATE POLICY "Users can view chain anchors for their batches" ON public.chain_anchors
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.merkle_batches mb 
      WHERE mb.id = merkle_batch_id 
      AND (mb.tenant_id = get_current_user_tenant_id() OR get_current_user_role() IN ('admin', 'system_administrator'))
    )
  );

CREATE POLICY "System can manage chain anchors" ON public.chain_anchors
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.merkle_batches mb 
      WHERE mb.id = merkle_batch_id 
      AND (mb.tenant_id = get_current_user_tenant_id() OR get_current_user_role() IN ('admin', 'system_administrator'))
    )
  );

-- Attestations Policies
CREATE POLICY "Users can view attestations for their assets" ON public.attestations
  FOR SELECT USING (
    tenant_id = get_current_user_tenant_id() OR
    attestor_id = auth.uid() OR
    get_current_user_role() IN ('admin', 'system_administrator')
  );

CREATE POLICY "Users can create attestations" ON public.attestations
  FOR INSERT WITH CHECK (
    attestor_id = auth.uid() AND
    tenant_id = get_current_user_tenant_id()
  );

CREATE POLICY "Attestors can update their attestations" ON public.attestations
  FOR UPDATE USING (
    attestor_id = auth.uid() OR
    get_current_user_role() IN ('admin', 'system_administrator')
  );

-- Licenses Policies
CREATE POLICY "Users can view licenses for their assets" ON public.licenses
  FOR SELECT USING (
    tenant_id = get_current_user_tenant_id() OR
    granted_to = auth.uid() OR
    get_current_user_role() IN ('admin', 'system_administrator')
  );

CREATE POLICY "Admins can manage licenses" ON public.licenses
  FOR ALL USING (
    get_current_user_role() IN ('admin', 'system_administrator')
  );