-- Persona-Scoped Row Level Security Policies
-- Implements comprehensive RLS for wealth platform canonical schema

-- =============================================================================
-- ENABLE RLS ON ALL WEALTH TABLES
-- =============================================================================

ALTER TABLE entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE instruments ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE alt_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE connectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE connector_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE ron_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_daily ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- ENTITIES POLICIES
-- =============================================================================

-- Clients can view only their family entities
CREATE POLICY "entities_client_select" ON entities
  FOR SELECT USING (
    get_user_role() = 'client' AND can_access_entity(entity_id)
  );

-- Professionals can view entities they're assigned to
CREATE POLICY "entities_professional_select" ON entities
  FOR SELECT USING (
    get_user_role() IN ('advisor', 'cpa', 'attorney') 
    AND can_access_entity(entity_id)
  );

-- Admins can view all entities
CREATE POLICY "entities_admin_select" ON entities
  FOR SELECT USING (get_user_role() = 'admin');

-- Service role has full access
CREATE POLICY "entities_service_all" ON entities
  FOR ALL USING (auth.role() = 'service_role');

-- Users can create entities they will have access to
CREATE POLICY "entities_insert" ON entities
  FOR INSERT WITH CHECK (
    get_user_role() IN ('admin', 'advisor') OR auth.role() = 'service_role'
  );

-- Only admins and advisors can update entities
CREATE POLICY "entities_update" ON entities
  FOR UPDATE USING (
    (get_user_role() IN ('admin', 'advisor') AND can_access_entity(entity_id))
    OR auth.role() = 'service_role'
  );

-- Only admins can delete entities
CREATE POLICY "entities_delete" ON entities
  FOR DELETE USING (
    get_user_role() = 'admin' OR auth.role() = 'service_role'
  );

-- =============================================================================
-- PORTFOLIOS POLICIES  
-- =============================================================================

-- Users can view portfolios for accessible entities
CREATE POLICY "portfolios_select" ON portfolios
  FOR SELECT USING (can_access_entity(entity_id));

-- Service role has full access
CREATE POLICY "portfolios_service_all" ON portfolios
  FOR ALL USING (auth.role() = 'service_role');

-- Advisors and admins can create portfolios
CREATE POLICY "portfolios_insert" ON portfolios
  FOR INSERT WITH CHECK (
    (get_user_role() IN ('admin', 'advisor') AND can_access_entity(entity_id))
    OR auth.role() = 'service_role'
  );

-- Advisors and admins can update portfolios they have access to
CREATE POLICY "portfolios_update" ON portfolios
  FOR UPDATE USING (
    (get_user_role() IN ('admin', 'advisor') AND can_access_entity(entity_id))
    OR auth.role() = 'service_role'
  );

-- Only admins can delete portfolios
CREATE POLICY "portfolios_delete" ON portfolios
  FOR DELETE USING (
    get_user_role() = 'admin' OR auth.role() = 'service_role'
  );

-- =============================================================================
-- ACCOUNTS POLICIES
-- =============================================================================

-- Users can view accounts in portfolios they have access to
CREATE POLICY "accounts_select" ON accounts
  FOR SELECT USING (
    portfolio_id IN (
      SELECT portfolio_id FROM portfolios WHERE can_access_entity(entity_id)
    )
  );

-- Service role has full access
CREATE POLICY "accounts_service_all" ON accounts
  FOR ALL USING (auth.role() = 'service_role');

-- Advisors and admins can create accounts
CREATE POLICY "accounts_insert" ON accounts
  FOR INSERT WITH CHECK (
    (get_user_role() IN ('admin', 'advisor') 
     AND portfolio_id IN (
       SELECT portfolio_id FROM portfolios WHERE can_access_entity(entity_id)
     ))
    OR auth.role() = 'service_role'
  );

-- Advisors and admins can update accounts they have access to
CREATE POLICY "accounts_update" ON accounts
  FOR UPDATE USING (
    (get_user_role() IN ('admin', 'advisor')
     AND portfolio_id IN (
       SELECT portfolio_id FROM portfolios WHERE can_access_entity(entity_id)
     ))
    OR auth.role() = 'service_role'
  );

-- Only admins can delete accounts
CREATE POLICY "accounts_delete" ON accounts
  FOR DELETE USING (
    get_user_role() = 'admin' OR auth.role() = 'service_role'
  );

-- =============================================================================
-- INSTRUMENTS POLICIES (PUBLIC DATA)
-- =============================================================================

-- All authenticated users can view instruments (public market data)
CREATE POLICY "instruments_select_all" ON instruments
  FOR SELECT USING (auth.role() = 'authenticated');

-- Service role has full access
CREATE POLICY "instruments_service_all" ON instruments
  FOR ALL USING (auth.role() = 'service_role');

-- Only admins can modify instruments
CREATE POLICY "instruments_admin_write" ON instruments
  FOR ALL USING (
    get_user_role() = 'admin' OR auth.role() = 'service_role'
  );

-- =============================================================================
-- POSITIONS POLICIES
-- =============================================================================

-- Users can view positions in accounts they have access to
CREATE POLICY "positions_select" ON positions
  FOR SELECT USING (
    account_id IN (
      SELECT a.account_id FROM accounts a
      JOIN portfolios p ON a.portfolio_id = p.portfolio_id
      WHERE can_access_entity(p.entity_id)
    )
  );

-- Service role has full access
CREATE POLICY "positions_service_all" ON positions
  FOR ALL USING (auth.role() = 'service_role');

-- System and advisors can create positions
CREATE POLICY "positions_insert" ON positions
  FOR INSERT WITH CHECK (
    account_id IN (
      SELECT a.account_id FROM accounts a
      JOIN portfolios p ON a.portfolio_id = p.portfolio_id
      WHERE can_access_entity(p.entity_id)
      AND get_user_role() IN ('admin', 'advisor')
    )
    OR auth.role() = 'service_role'
  );

-- System and advisors can update positions  
CREATE POLICY "positions_update" ON positions
  FOR UPDATE USING (
    account_id IN (
      SELECT a.account_id FROM accounts a
      JOIN portfolios p ON a.portfolio_id = p.portfolio_id
      WHERE can_access_entity(p.entity_id)
      AND get_user_role() IN ('admin', 'advisor')
    )
    OR auth.role() = 'service_role'
  );

-- Only service role can delete positions
CREATE POLICY "positions_delete" ON positions
  FOR DELETE USING (auth.role() = 'service_role');

-- =============================================================================
-- TRANSACTIONS POLICIES
-- =============================================================================

-- Users can view transactions in accounts they have access to
CREATE POLICY "transactions_select" ON transactions
  FOR SELECT USING (
    account_id IN (
      SELECT a.account_id FROM accounts a
      JOIN portfolios p ON a.portfolio_id = p.portfolio_id
      WHERE can_access_entity(p.entity_id)
    )
  );

-- Service role has full access
CREATE POLICY "transactions_service_all" ON transactions
  FOR ALL USING (auth.role() = 'service_role');

-- Advisors and admins can create transactions
CREATE POLICY "transactions_insert" ON transactions
  FOR INSERT WITH CHECK (
    account_id IN (
      SELECT a.account_id FROM accounts a
      JOIN portfolios p ON a.portfolio_id = p.portfolio_id
      WHERE can_access_entity(p.entity_id)
      AND get_user_role() IN ('admin', 'advisor')
    )
    OR auth.role() = 'service_role'
  );

-- Advisors and admins can update transactions
CREATE POLICY "transactions_update" ON transactions
  FOR UPDATE USING (
    account_id IN (
      SELECT a.account_id FROM accounts a
      JOIN portfolios p ON a.portfolio_id = p.portfolio_id
      WHERE can_access_entity(p.entity_id)
      AND get_user_role() IN ('admin', 'advisor')
    )
    OR auth.role() = 'service_role'
  );

-- Only service role can delete transactions
CREATE POLICY "transactions_delete" ON transactions
  FOR DELETE USING (auth.role() = 'service_role');

-- =============================================================================
-- PRICES POLICIES (PUBLIC DATA)
-- =============================================================================

-- All authenticated users can view prices (public market data)
CREATE POLICY "prices_select_all" ON prices
  FOR SELECT USING (auth.role() = 'authenticated');

-- Service role has full access
CREATE POLICY "prices_service_all" ON prices
  FOR ALL USING (auth.role() = 'service_role');

-- Only admins and service can modify prices
CREATE POLICY "prices_admin_write" ON prices
  FOR ALL USING (
    get_user_role() = 'admin' OR auth.role() = 'service_role'
  );

-- =============================================================================
-- ALT POSITIONS POLICIES
-- =============================================================================

-- Users can view alt positions in accounts they have access to
CREATE POLICY "alt_positions_select" ON alt_positions
  FOR SELECT USING (
    account_id IN (
      SELECT a.account_id FROM accounts a
      JOIN portfolios p ON a.portfolio_id = p.portfolio_id
      WHERE can_access_entity(p.entity_id)
    )
  );

-- Service role has full access
CREATE POLICY "alt_positions_service_all" ON alt_positions
  FOR ALL USING (auth.role() = 'service_role');

-- Advisors and admins can create alt positions
CREATE POLICY "alt_positions_insert" ON alt_positions
  FOR INSERT WITH CHECK (
    account_id IN (
      SELECT a.account_id FROM accounts a
      JOIN portfolios p ON a.portfolio_id = p.portfolio_id
      WHERE can_access_entity(p.entity_id)
      AND get_user_role() IN ('admin', 'advisor')
    )
    OR auth.role() = 'service_role'
  );

-- Advisors and admins can update alt positions
CREATE POLICY "alt_positions_update" ON alt_positions
  FOR UPDATE USING (
    account_id IN (
      SELECT a.account_id FROM accounts a
      JOIN portfolios p ON a.portfolio_id = p.portfolio_id
      WHERE can_access_entity(p.entity_id)
      AND get_user_role() IN ('admin', 'advisor')
    )
    OR auth.role() = 'service_role'
  );

-- Only admins can delete alt positions
CREATE POLICY "alt_positions_delete" ON alt_positions
  FOR DELETE USING (
    get_user_role() = 'admin' OR auth.role() = 'service_role'
  );

-- =============================================================================
-- CONNECTORS POLICIES
-- =============================================================================

-- Admins can view all connectors
CREATE POLICY "connectors_admin_select" ON connectors
  FOR SELECT USING (get_user_role() = 'admin');

-- Service role has full access
CREATE POLICY "connectors_service_all" ON connectors
  FOR ALL USING (auth.role() = 'service_role');

-- Only admins can modify connectors
CREATE POLICY "connectors_admin_write" ON connectors
  FOR ALL USING (
    get_user_role() = 'admin' OR auth.role() = 'service_role'
  );

-- =============================================================================
-- CONNECTOR ACCOUNTS POLICIES
-- =============================================================================

-- Users can view connector accounts for entities they have access to
CREATE POLICY "connector_accounts_select" ON connector_accounts
  FOR SELECT USING (can_access_entity(entity_id));

-- Service role has full access
CREATE POLICY "connector_accounts_service_all" ON connector_accounts
  FOR ALL USING (auth.role() = 'service_role');

-- Advisors and admins can create connector accounts
CREATE POLICY "connector_accounts_insert" ON connector_accounts
  FOR INSERT WITH CHECK (
    (get_user_role() IN ('admin', 'advisor') AND can_access_entity(entity_id))
    OR auth.role() = 'service_role'
  );

-- Advisors and admins can update connector accounts
CREATE POLICY "connector_accounts_update" ON connector_accounts
  FOR UPDATE USING (
    (get_user_role() IN ('admin', 'advisor') AND can_access_entity(entity_id))
    OR auth.role() = 'service_role'
  );

-- Only admins can delete connector accounts
CREATE POLICY "connector_accounts_delete" ON connector_accounts
  FOR DELETE USING (
    get_user_role() = 'admin' OR auth.role() = 'service_role'
  );

-- =============================================================================
-- EVIDENCE PACKAGES POLICIES
-- =============================================================================

-- Users can view evidence for entities they have access to
CREATE POLICY "evidence_packages_select" ON evidence_packages
  FOR SELECT USING (
    -- Check if source entity is accessible
    CASE source_type
      WHEN 'account' THEN
        source_id IN (
          SELECT a.account_id FROM accounts a
          JOIN portfolios p ON a.portfolio_id = p.portfolio_id
          WHERE can_access_entity(p.entity_id)
        )
      WHEN 'transaction' THEN
        source_id IN (
          SELECT t.txn_id FROM transactions t
          JOIN accounts a ON t.account_id = a.account_id
          JOIN portfolios p ON a.portfolio_id = p.portfolio_id
          WHERE can_access_entity(p.entity_id)
        )
      WHEN 'position' THEN
        source_id IN (
          SELECT pos.position_id FROM positions pos
          JOIN accounts a ON pos.account_id = a.account_id
          JOIN portfolios p ON a.portfolio_id = p.portfolio_id
          WHERE can_access_entity(p.entity_id)
        )
      ELSE false
    END
  );

-- Service role has full access
CREATE POLICY "evidence_packages_service_all" ON evidence_packages
  FOR ALL USING (auth.role() = 'service_role');

-- System can create evidence packages
CREATE POLICY "evidence_packages_insert" ON evidence_packages
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Only service role can modify evidence
CREATE POLICY "evidence_packages_admin_write" ON evidence_packages
  FOR ALL USING (auth.role() = 'service_role');

-- =============================================================================
-- EXCEPTIONS POLICIES
-- =============================================================================

-- Users can view exceptions for entities they have access to
CREATE POLICY "exceptions_select" ON exceptions
  FOR SELECT USING (
    (entity_id IS NOT NULL AND can_access_entity(entity_id))
    OR
    (account_id IS NOT NULL AND account_id IN (
      SELECT a.account_id FROM accounts a
      JOIN portfolios p ON a.portfolio_id = p.portfolio_id
      WHERE can_access_entity(p.entity_id)
    ))
    OR
    get_user_role() = 'admin'
  );

-- Service role has full access
CREATE POLICY "exceptions_service_all" ON exceptions
  FOR ALL USING (auth.role() = 'service_role');

-- System can create exceptions
CREATE POLICY "exceptions_insert" ON exceptions
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Admins can update exceptions
CREATE POLICY "exceptions_update" ON exceptions
  FOR UPDATE USING (
    get_user_role() = 'admin' OR auth.role() = 'service_role'
  );

-- =============================================================================
-- REPORTS POLICIES (PERSONA-SCOPED)
-- =============================================================================

-- Users can view reports based on persona scope and entity access
CREATE POLICY "reports_persona_select" ON reports
  FOR SELECT USING (
    has_persona_access(persona_scope)
    AND (
      (entity_id IS NOT NULL AND can_access_entity(entity_id))
      OR
      (portfolio_id IS NOT NULL AND portfolio_id IN (
        SELECT portfolio_id FROM portfolios WHERE can_access_entity(entity_id)
      ))
    )
  );

-- Service role has full access
CREATE POLICY "reports_service_all" ON reports
  FOR ALL USING (auth.role() = 'service_role');

-- Users can create reports for entities they have access to
CREATE POLICY "reports_insert" ON reports
  FOR INSERT WITH CHECK (
    (entity_id IS NOT NULL AND can_access_entity(entity_id))
    OR
    (portfolio_id IS NOT NULL AND portfolio_id IN (
      SELECT portfolio_id FROM portfolios WHERE can_access_entity(entity_id)
    ))
    OR auth.role() = 'service_role'
  );

-- Users can update their own reports
CREATE POLICY "reports_update" ON reports
  FOR UPDATE USING (
    (created_by = auth.uid() 
     AND ((entity_id IS NOT NULL AND can_access_entity(entity_id))
          OR (portfolio_id IS NOT NULL AND portfolio_id IN (
            SELECT portfolio_id FROM portfolios WHERE can_access_entity(entity_id)
          ))))
    OR get_user_role() = 'admin'
    OR auth.role() = 'service_role'
  );

-- Only admins can delete reports
CREATE POLICY "reports_delete" ON reports
  FOR DELETE USING (
    get_user_role() = 'admin' OR auth.role() = 'service_role'
  );

-- =============================================================================
-- RON POLICIES (PUBLIC DATA)
-- =============================================================================

-- All authenticated users can view RON policies (public information)
CREATE POLICY "ron_policies_select_all" ON ron_policies
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only admins can modify RON policies
CREATE POLICY "ron_policies_admin_write" ON ron_policies
  FOR ALL USING (
    get_user_role() = 'admin' OR auth.role() = 'service_role'
  );

-- =============================================================================
-- BILLING POLICIES
-- =============================================================================

-- Users can view billing for entities they have access to
CREATE POLICY "billing_daily_select" ON billing_daily
  FOR SELECT USING (can_access_entity(entity_id));

-- Service role has full access
CREATE POLICY "billing_daily_service_all" ON billing_daily
  FOR ALL USING (auth.role() = 'service_role');

-- Only service role can modify billing data
CREATE POLICY "billing_daily_insert" ON billing_daily
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- =============================================================================
-- PERFORMANCE OPTIMIZATIONS FOR RLS
-- =============================================================================

-- Create partial indexes to optimize RLS queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_entities_accessible
  ON entities(entity_id, created_by)
  WHERE created_by IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_portfolios_entity_access
  ON portfolios(entity_id, portfolio_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_accounts_portfolio_access
  ON accounts(portfolio_id, account_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reports_persona_access
  ON reports(persona_scope, entity_id, portfolio_id)
  WHERE entity_id IS NOT NULL OR portfolio_id IS NOT NULL;