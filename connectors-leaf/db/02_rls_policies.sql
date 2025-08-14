-- Connector & Evidence Service - Row Level Security Policies
-- Tenant isolation and role-based access control

-- =============================================================================
-- ENABLE RLS ON ALL TABLES
-- =============================================================================

ALTER TABLE connector_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE connector_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE connector_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE connector_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE connector_notarizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notary_state_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE connector_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE connector_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE connector_exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE connector_billing_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE connector_events ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- HELPER FUNCTIONS FOR RLS
-- =============================================================================

-- Check if user has specific role
CREATE OR REPLACE FUNCTION has_connector_role(required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = required_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Check if user has any of the specified roles
CREATE OR REPLACE FUNCTION has_any_connector_role(required_roles TEXT[])
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = ANY(required_roles)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Check if user is in same tenant
CREATE OR REPLACE FUNCTION is_same_tenant(target_tenant_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN target_tenant_id = get_current_user_tenant_id();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Check if user owns the connection
CREATE OR REPLACE FUNCTION owns_connection(connection_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN connection_user_id = auth.uid();
END;
$$ LANGUAGE plpgsql STABLE;

-- =============================================================================
-- CONNECTIONS POLICIES
-- =============================================================================

-- Users can view their own connections
CREATE POLICY "connections_select_own" ON connector_connections
  FOR SELECT USING (
    user_id = auth.uid() 
    AND is_same_tenant(tenant_id)
  );

-- Users can create connections for themselves
CREATE POLICY "connections_insert_own" ON connector_connections
  FOR INSERT WITH CHECK (
    user_id = auth.uid() 
    AND is_same_tenant(tenant_id)
  );

-- Users can update their own connections
CREATE POLICY "connections_update_own" ON connector_connections
  FOR UPDATE USING (
    user_id = auth.uid() 
    AND is_same_tenant(tenant_id)
  );

-- Only admins can delete connections
CREATE POLICY "connections_delete_admin" ON connector_connections
  FOR DELETE USING (
    has_any_connector_role(ARRAY['admin', 'tenant_admin'])
    AND is_same_tenant(tenant_id)
  );

-- Service role has full access
CREATE POLICY "connections_service_all" ON connector_connections
  FOR ALL USING (auth.role() = 'service_role');

-- Support staff can view all connections in tenant
CREATE POLICY "connections_support_view" ON connector_connections
  FOR SELECT USING (
    has_any_connector_role(ARRAY['support', 'admin', 'tenant_admin'])
    AND is_same_tenant(tenant_id)
  );

-- =============================================================================
-- ACCOUNTS POLICIES
-- =============================================================================

-- Users can view accounts for their connections
CREATE POLICY "accounts_select_own_connections" ON connector_accounts
  FOR SELECT USING (
    connection_id IN (
      SELECT id FROM connector_connections 
      WHERE user_id = auth.uid() 
      AND tenant_id = get_current_user_tenant_id()
    )
    AND is_same_tenant(tenant_id)
  );

-- System can insert accounts during sync
CREATE POLICY "accounts_insert_system" ON connector_accounts
  FOR INSERT WITH CHECK (
    auth.role() = 'service_role' OR
    (connection_id IN (
      SELECT id FROM connector_connections 
      WHERE user_id = auth.uid() 
      AND tenant_id = get_current_user_tenant_id()
    ) AND is_same_tenant(tenant_id))
  );

-- System can update accounts during sync
CREATE POLICY "accounts_update_system" ON connector_accounts
  FOR UPDATE USING (
    auth.role() = 'service_role' OR
    (connection_id IN (
      SELECT id FROM connector_connections 
      WHERE user_id = auth.uid() 
      AND tenant_id = get_current_user_tenant_id()
    ) AND is_same_tenant(tenant_id))
  );

-- Only service role can delete accounts
CREATE POLICY "accounts_delete_service" ON connector_accounts
  FOR DELETE USING (auth.role() = 'service_role');

-- Support staff can view all accounts in tenant
CREATE POLICY "accounts_support_view" ON connector_accounts
  FOR SELECT USING (
    has_any_connector_role(ARRAY['support', 'admin', 'tenant_admin'])
    AND is_same_tenant(tenant_id)
  );

-- =============================================================================
-- TRANSACTIONS POLICIES
-- =============================================================================

-- Users can view transactions for their accounts
CREATE POLICY "transactions_select_own_accounts" ON connector_transactions
  FOR SELECT USING (
    account_id IN (
      SELECT a.id FROM connector_accounts a
      JOIN connector_connections c ON a.connection_id = c.id
      WHERE c.user_id = auth.uid() 
      AND a.tenant_id = get_current_user_tenant_id()
    )
    AND is_same_tenant(tenant_id)
  );

-- System can insert transactions during sync
CREATE POLICY "transactions_insert_system" ON connector_transactions
  FOR INSERT WITH CHECK (
    auth.role() = 'service_role' OR
    (account_id IN (
      SELECT a.id FROM connector_accounts a
      JOIN connector_connections c ON a.connection_id = c.id
      WHERE c.user_id = auth.uid() 
      AND a.tenant_id = get_current_user_tenant_id()
    ) AND is_same_tenant(tenant_id))
  );

-- System can update transactions during sync
CREATE POLICY "transactions_update_system" ON connector_transactions
  FOR UPDATE USING (
    auth.role() = 'service_role' OR
    (account_id IN (
      SELECT a.id FROM connector_accounts a
      JOIN connector_connections c ON a.connection_id = c.id
      WHERE c.user_id = auth.uid() 
      AND a.tenant_id = get_current_user_tenant_id()
    ) AND is_same_tenant(tenant_id))
  );

-- Only service role can delete transactions
CREATE POLICY "transactions_delete_service" ON connector_transactions
  FOR DELETE USING (auth.role() = 'service_role');

-- Support staff can view all transactions in tenant
CREATE POLICY "transactions_support_view" ON connector_transactions
  FOR SELECT USING (
    has_any_connector_role(ARRAY['support', 'admin', 'tenant_admin'])
    AND is_same_tenant(tenant_id)
  );

-- =============================================================================
-- POSITIONS POLICIES
-- =============================================================================

-- Users can view positions for their accounts
CREATE POLICY "positions_select_own_accounts" ON connector_positions
  FOR SELECT USING (
    account_id IN (
      SELECT a.id FROM connector_accounts a
      JOIN connector_connections c ON a.connection_id = c.id
      WHERE c.user_id = auth.uid() 
      AND a.tenant_id = get_current_user_tenant_id()
    )
    AND is_same_tenant(tenant_id)
  );

-- System can insert positions during sync
CREATE POLICY "positions_insert_system" ON connector_positions
  FOR INSERT WITH CHECK (
    auth.role() = 'service_role' OR
    (account_id IN (
      SELECT a.id FROM connector_accounts a
      JOIN connector_connections c ON a.connection_id = c.id
      WHERE c.user_id = auth.uid() 
      AND a.tenant_id = get_current_user_tenant_id()
    ) AND is_same_tenant(tenant_id))
  );

-- System can update positions during sync
CREATE POLICY "positions_update_system" ON connector_positions
  FOR UPDATE USING (
    auth.role() = 'service_role' OR
    (account_id IN (
      SELECT a.id FROM connector_accounts a
      JOIN connector_connections c ON a.connection_id = c.id
      WHERE c.user_id = auth.uid() 
      AND a.tenant_id = get_current_user_tenant_id()
    ) AND is_same_tenant(tenant_id))
  );

-- Only service role can delete positions
CREATE POLICY "positions_delete_service" ON connector_positions
  FOR DELETE USING (auth.role() = 'service_role');

-- Support staff can view all positions in tenant
CREATE POLICY "positions_support_view" ON connector_positions
  FOR SELECT USING (
    has_any_connector_role(ARRAY['support', 'admin', 'tenant_admin'])
    AND is_same_tenant(tenant_id)
  );

-- =============================================================================
-- NOTARIZATIONS POLICIES
-- =============================================================================

-- Users can view their own notarizations
CREATE POLICY "notarizations_select_own" ON connector_notarizations
  FOR SELECT USING (
    user_id = auth.uid() 
    AND is_same_tenant(tenant_id)
  );

-- Users can create notarizations for themselves
CREATE POLICY "notarizations_insert_own" ON connector_notarizations
  FOR INSERT WITH CHECK (
    user_id = auth.uid() 
    AND is_same_tenant(tenant_id)
  );

-- Users can update their own notarizations (limited fields)
CREATE POLICY "notarizations_update_own" ON connector_notarizations
  FOR UPDATE USING (
    user_id = auth.uid() 
    AND is_same_tenant(tenant_id)
  );

-- Service role has full access
CREATE POLICY "notarizations_service_all" ON connector_notarizations
  FOR ALL USING (auth.role() = 'service_role');

-- Notary staff can view and update notarizations
CREATE POLICY "notarizations_notary_access" ON connector_notarizations
  FOR ALL USING (
    has_any_connector_role(ARRAY['notary', 'admin', 'tenant_admin'])
    AND is_same_tenant(tenant_id)
  );

-- =============================================================================
-- NOTARY STATE POLICIES
-- =============================================================================

-- Everyone can read state policies (public information)
CREATE POLICY "notary_policies_read_all" ON notary_state_policies
  FOR SELECT USING (true);

-- Only admins can modify state policies
CREATE POLICY "notary_policies_admin_write" ON notary_state_policies
  FOR ALL USING (
    has_any_connector_role(ARRAY['admin', 'tenant_admin'])
  );

-- =============================================================================
-- REPORTS POLICIES
-- =============================================================================

-- Users can view their own reports
CREATE POLICY "reports_select_own" ON connector_reports
  FOR SELECT USING (
    user_id = auth.uid() 
    AND is_same_tenant(tenant_id)
  );

-- Users can create reports for themselves
CREATE POLICY "reports_insert_own" ON connector_reports
  FOR INSERT WITH CHECK (
    user_id = auth.uid() 
    AND is_same_tenant(tenant_id)
  );

-- System can update reports during generation
CREATE POLICY "reports_update_system" ON connector_reports
  FOR UPDATE USING (
    auth.role() = 'service_role' OR
    (user_id = auth.uid() AND is_same_tenant(tenant_id))
  );

-- Support staff can view all reports in tenant
CREATE POLICY "reports_support_view" ON connector_reports
  FOR SELECT USING (
    has_any_connector_role(ARRAY['support', 'admin', 'tenant_admin'])
    AND is_same_tenant(tenant_id)
  );

-- =============================================================================
-- AUDIT LOGS POLICIES
-- =============================================================================

-- Users can view audit logs for their own actions
CREATE POLICY "audit_logs_select_own" ON connector_audit_logs
  FOR SELECT USING (
    user_id = auth.uid() 
    AND is_same_tenant(tenant_id)
  );

-- Service role can insert audit logs
CREATE POLICY "audit_logs_insert_system" ON connector_audit_logs
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Auditors and admins can view all audit logs in tenant
CREATE POLICY "audit_logs_auditor_view" ON connector_audit_logs
  FOR SELECT USING (
    has_any_connector_role(ARRAY['auditor', 'admin', 'tenant_admin'])
    AND is_same_tenant(tenant_id)
  );

-- =============================================================================
-- EXCEPTIONS POLICIES
-- =============================================================================

-- Users can view exceptions related to their data
CREATE POLICY "exceptions_select_own" ON connector_exceptions
  FOR SELECT USING (
    is_same_tenant(tenant_id) AND (
      -- User's own entities
      entity_id IN (
        SELECT id FROM connector_connections WHERE user_id = auth.uid()
        UNION
        SELECT a.id FROM connector_accounts a
        JOIN connector_connections c ON a.connection_id = c.id
        WHERE c.user_id = auth.uid()
      ) OR
      -- Support/admin can see all
      has_any_connector_role(ARRAY['support', 'admin', 'tenant_admin'])
    )
  );

-- System can create exceptions
CREATE POLICY "exceptions_insert_system" ON connector_exceptions
  FOR INSERT WITH CHECK (
    auth.role() = 'service_role' OR
    is_same_tenant(tenant_id)
  );

-- Support staff can update exceptions
CREATE POLICY "exceptions_update_support" ON connector_exceptions
  FOR UPDATE USING (
    has_any_connector_role(ARRAY['support', 'admin', 'tenant_admin'])
    AND is_same_tenant(tenant_id)
  );

-- =============================================================================
-- BILLING USAGE POLICIES
-- =============================================================================

-- Users can view their own billing usage
CREATE POLICY "billing_usage_select_own" ON connector_billing_usage
  FOR SELECT USING (
    user_id = auth.uid() 
    AND is_same_tenant(tenant_id)
  );

-- System can insert billing records
CREATE POLICY "billing_usage_insert_system" ON connector_billing_usage
  FOR INSERT WITH CHECK (
    auth.role() = 'service_role' OR
    is_same_tenant(tenant_id)
  );

-- Billing staff can view all usage in tenant
CREATE POLICY "billing_usage_billing_view" ON connector_billing_usage
  FOR SELECT USING (
    has_any_connector_role(ARRAY['billing', 'admin', 'tenant_admin'])
    AND is_same_tenant(tenant_id)
  );

-- =============================================================================
-- EVENTS POLICIES
-- =============================================================================

-- System can manage events
CREATE POLICY "events_system_all" ON connector_events
  FOR ALL USING (auth.role() = 'service_role');

-- Developers can view events in their tenant
CREATE POLICY "events_developer_view" ON connector_events
  FOR SELECT USING (
    has_any_connector_role(ARRAY['developer', 'admin', 'tenant_admin'])
    AND is_same_tenant(tenant_id)
  );

-- =============================================================================
-- PERFORMANCE OPTIMIZATIONS
-- =============================================================================

-- Create partial indexes for active policies
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_connections_user_tenant_active 
  ON connector_connections(user_id, tenant_id) 
  WHERE status = 'active';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_accounts_connection_tenant_active 
  ON connector_accounts(connection_id, tenant_id) 
  WHERE is_active = true;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_user_tenant_recent 
  ON connector_audit_logs(user_id, tenant_id, created_at) 
  WHERE created_at > (now() - INTERVAL '90 days');

-- =============================================================================
-- SECURITY DEFINER FUNCTIONS FOR COMPLEX POLICIES
-- =============================================================================

-- Function to check if user can access account data
CREATE OR REPLACE FUNCTION can_access_account_data(target_account_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM connector_accounts a
    JOIN connector_connections c ON a.connection_id = c.id
    WHERE a.id = target_account_id
    AND c.user_id = auth.uid()
    AND a.tenant_id = get_current_user_tenant_id()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function to check if user can access notarization
CREATE OR REPLACE FUNCTION can_access_notarization(target_notarization_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM connector_notarizations
    WHERE id = target_notarization_id
    AND (
      user_id = auth.uid() OR
      has_any_connector_role(ARRAY['notary', 'admin', 'tenant_admin'])
    )
    AND tenant_id = get_current_user_tenant_id()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function to validate data access permissions
CREATE OR REPLACE FUNCTION validate_data_access(
  entity_type TEXT,
  entity_id UUID,
  operation TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  has_access BOOLEAN := false;
BEGIN
  -- Check based on entity type
  CASE entity_type
    WHEN 'connection' THEN
      SELECT EXISTS (
        SELECT 1 FROM connector_connections
        WHERE id = entity_id
        AND user_id = auth.uid()
        AND tenant_id = get_current_user_tenant_id()
      ) INTO has_access;
    
    WHEN 'account' THEN
      SELECT can_access_account_data(entity_id) INTO has_access;
    
    WHEN 'notarization' THEN
      SELECT can_access_notarization(entity_id) INTO has_access;
    
    ELSE
      -- Default to admin-only for unknown types
      SELECT has_any_connector_role(ARRAY['admin', 'tenant_admin']) INTO has_access;
  END CASE;

  -- Log access attempt
  INSERT INTO connector_audit_logs (
    tenant_id, event_type, entity_type, entity_id, user_id,
    metadata
  ) VALUES (
    get_current_user_tenant_id(),
    'access_validation',
    entity_type,
    entity_id,
    auth.uid(),
    jsonb_build_object(
      'operation', operation,
      'access_granted', has_access,
      'timestamp', now()
    )
  );

  RETURN has_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;