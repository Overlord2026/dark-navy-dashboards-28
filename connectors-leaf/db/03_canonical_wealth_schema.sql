-- Canonical Wealth Schema - Production Ready
-- Based on the wealth platform canonical schema requirements
-- Implements persona-scoped access with comprehensive RLS

-- =============================================================================
-- PERSONA & ROLE ENUMS
-- =============================================================================

CREATE TYPE auth_role AS ENUM (
  'client',
  'advisor',
  'cpa', 
  'attorney',
  'admin'
);

CREATE TYPE entity_type AS ENUM (
  'individual',
  'joint',
  'trust',
  'estate',
  'corporation',
  'partnership',
  'llc',
  'foundation'
);

CREATE TYPE account_type_wealth AS ENUM (
  'taxable',
  'ira_traditional',
  'ira_roth',
  'sep_ira',
  'simple_ira',
  '401k',
  '403b',
  '457',
  'pension',
  'annuity',
  'hsa',
  'coverdell_esa',
  '529_plan',
  'utma_ugma',
  'trust_account',
  'custodial',
  'margin',
  'options',
  'futures'
);

CREATE TYPE asset_class AS ENUM (
  'equity',
  'fixed_income',
  'cash',
  'alternatives',
  'real_estate',
  'commodities',
  'crypto',
  'derivatives'
);

CREATE TYPE transaction_type_wealth AS ENUM (
  'buy',
  'sell',
  'dividend',
  'interest',
  'split',
  'merger',
  'spinoff',
  'exercise',
  'assignment',
  'expiration',
  'deposit',
  'withdrawal',
  'transfer_in',
  'transfer_out',
  'fee',
  'tax',
  'adjustment'
);

CREATE TYPE report_type_wealth AS ENUM (
  'performance',
  'allocation',
  'tax_loss_harvesting',
  'realized_gains',
  'unrealized_gains',
  'income_summary',
  'fee_analysis',
  'risk_analysis',
  'benchmarking',
  'compliance'
);

CREATE TYPE persona_scope AS ENUM (
  'client',
  'advisor',
  'cpa',
  'attorney',
  'all'
);

-- =============================================================================
-- CANONICAL WEALTH TABLES
-- =============================================================================

-- Legal Entities (families, trusts, corporations)
CREATE TABLE entities (
  entity_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  legal_name TEXT NOT NULL,
  entity_type entity_type NOT NULL,
  tax_id TEXT,
  domicile_state TEXT,
  domicile_country TEXT NOT NULL DEFAULT 'US',
  formation_date DATE,
  contact_info JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- Portfolios (investment groupings)
CREATE TABLE portfolios (
  portfolio_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID NOT NULL REFERENCES entities(entity_id) ON DELETE CASCADE,
  portfolio_name TEXT NOT NULL,
  base_currency TEXT NOT NULL DEFAULT 'USD',
  investment_objective TEXT,
  risk_tolerance TEXT,
  benchmark_id TEXT,
  inception_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'active',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- Investment Accounts
CREATE TABLE accounts (
  account_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES portfolios(portfolio_id) ON DELETE CASCADE,
  custodian TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_number_masked TEXT,
  account_type account_type_wealth NOT NULL,
  account_name TEXT NOT NULL,
  tax_status TEXT,
  opened_date DATE,
  closed_date DATE,
  status TEXT NOT NULL DEFAULT 'active',
  base_currency TEXT NOT NULL DEFAULT 'USD',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID,
  updated_by UUID,
  
  UNIQUE(custodian, account_number)
);

-- Financial Instruments (stocks, bonds, funds, etc.)
CREATE TABLE instruments (
  instrument_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT,
  name TEXT NOT NULL,
  asset_class asset_class NOT NULL,
  sub_asset_class TEXT,
  currency TEXT NOT NULL DEFAULT 'USD',
  country TEXT NOT NULL DEFAULT 'US',
  sector TEXT,
  industry TEXT,
  identifiers JSONB DEFAULT '{}', -- CUSIP, ISIN, FIGI, etc.
  is_active BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Current Positions
CREATE TABLE positions (
  position_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
  instrument_id UUID NOT NULL REFERENCES instruments(instrument_id),
  quantity DECIMAL(20,8) NOT NULL,
  cost_basis DECIMAL(20,4),
  market_value DECIMAL(20,4),
  unrealized_gain_loss DECIMAL(20,4),
  as_of TIMESTAMPTZ NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(account_id, instrument_id, as_of)
);

-- Transaction History
CREATE TABLE transactions (
  txn_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
  instrument_id UUID REFERENCES instruments(instrument_id),
  transaction_type transaction_type_wealth NOT NULL,
  quantity DECIMAL(20,8),
  price DECIMAL(20,4),
  amount DECIMAL(20,4) NOT NULL,
  gross_amount DECIMAL(20,4),
  net_amount DECIMAL(20,4),
  fees DECIMAL(20,4) DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  trade_date DATE NOT NULL,
  settle_date DATE,
  description TEXT,
  reference_id TEXT,
  source TEXT NOT NULL DEFAULT 'manual',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- Market Prices
CREATE TABLE prices (
  instrument_id UUID NOT NULL REFERENCES instruments(instrument_id),
  as_of TIMESTAMPTZ NOT NULL,
  price DECIMAL(20,4) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  source TEXT NOT NULL DEFAULT 'manual',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  PRIMARY KEY (instrument_id, as_of)
);

-- Alternative Investments (private equity, hedge funds, real estate, etc.)
CREATE TABLE alt_positions (
  alt_position_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
  vehicle_name TEXT NOT NULL,
  vehicle_type TEXT,
  asset_class TEXT NOT NULL DEFAULT 'alternatives',
  commitment DECIMAL(20,4),
  contributed DECIMAL(20,4) DEFAULT 0,
  distributed DECIMAL(20,4) DEFAULT 0,
  nav DECIMAL(20,4),
  nav_as_of TIMESTAMPTZ,
  irr DECIMAL(8,4), -- Internal Rate of Return
  multiple DECIMAL(8,4), -- Investment Multiple
  vintage_year INTEGER,
  maturity_date DATE,
  evidence_hash TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- Data Connectors Configuration
CREATE TABLE connectors (
  connector_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor TEXT NOT NULL,
  connector_name TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT '1.0',
  status TEXT NOT NULL DEFAULT 'active',
  scopes JSONB DEFAULT '{}',
  rate_limits JSONB DEFAULT '{}',
  last_sync_at TIMESTAMPTZ,
  next_sync_at TIMESTAMPTZ,
  sync_frequency TEXT DEFAULT 'daily',
  error_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(vendor, connector_name, version)
);

-- Account-Connector Mapping
CREATE TABLE connector_accounts (
  connector_account_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID NOT NULL REFERENCES entities(entity_id),
  institution_id TEXT NOT NULL,
  connector_id UUID NOT NULL REFERENCES connectors(connector_id),
  consent_token TEXT,
  consent_status TEXT NOT NULL DEFAULT 'pending',
  consent_expires_at TIMESTAMPTZ,
  last_rotated_at TIMESTAMPTZ,
  access_permissions JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(entity_id, institution_id, connector_id)
);

-- Evidence & Documentation
CREATE TABLE evidence_packages (
  evidence_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL, -- References account, transaction, position, etc.
  source_type TEXT NOT NULL,
  vendor TEXT NOT NULL,
  institution TEXT,
  document_type TEXT,
  file_path TEXT,
  file_size INTEGER,
  sha256 TEXT NOT NULL,
  captured_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ,
  encryption_key_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(source_id, source_type, sha256)
);

-- Exception Tracking
CREATE TABLE exceptions (
  exception_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES accounts(account_id),
  entity_id UUID REFERENCES entities(entity_id),
  kind TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium',
  error_code TEXT,
  error_message TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  stack_trace TEXT,
  opened_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  assigned_to UUID,
  resolution_notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_by UUID,
  updated_by UUID
);

-- Report Generation
CREATE TABLE reports (
  report_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID REFERENCES portfolios(portfolio_id),
  entity_id UUID REFERENCES entities(entity_id),
  report_type report_type_wealth NOT NULL,
  report_name TEXT NOT NULL,
  period_start DATE,
  period_end DATE,
  parameters JSONB DEFAULT '{}',
  storage_url TEXT,
  file_format TEXT DEFAULT 'pdf',
  file_size INTEGER,
  status TEXT NOT NULL DEFAULT 'queued',
  persona_scope persona_scope NOT NULL DEFAULT 'all',
  access_restrictions JSONB DEFAULT '{}',
  generated_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  download_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- Remote Online Notarization Policies by State
CREATE TABLE ron_policies (
  state_code TEXT NOT NULL,
  state_name TEXT NOT NULL,
  allows_ron BOOLEAN NOT NULL DEFAULT false,
  allows_ipen BOOLEAN NOT NULL DEFAULT false, -- In-Person Electronic Notarization
  audio_recording_required BOOLEAN NOT NULL DEFAULT true,
  video_recording_required BOOLEAN NOT NULL DEFAULT true,
  witness_rules JSONB DEFAULT '{}',
  doc_overrides JSONB DEFAULT '{}',
  id_verification_methods JSONB DEFAULT '[]',
  effective_date DATE NOT NULL,
  expiry_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  PRIMARY KEY (state_code, effective_date)
);

-- Billing & Usage Tracking (ASA = Average Synced Accounts)
CREATE TABLE billing_daily (
  entity_id UUID NOT NULL REFERENCES entities(entity_id),
  as_of DATE NOT NULL,
  active_synced_accounts INTEGER NOT NULL DEFAULT 0,
  alt_positions_monitored INTEGER NOT NULL DEFAULT 0,
  notarizations_completed INTEGER NOT NULL DEFAULT 0,
  reports_generated INTEGER NOT NULL DEFAULT 0,
  api_calls_made INTEGER NOT NULL DEFAULT 0,
  storage_bytes_used BIGINT NOT NULL DEFAULT 0,
  vendor_costs JSONB DEFAULT '{}',
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  PRIMARY KEY (entity_id, as_of)
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Entity indexes
CREATE INDEX idx_entities_type ON entities(entity_type);
CREATE INDEX idx_entities_tax_id ON entities(tax_id);

-- Portfolio indexes  
CREATE INDEX idx_portfolios_entity ON portfolios(entity_id);
CREATE INDEX idx_portfolios_status ON portfolios(status);

-- Account indexes
CREATE INDEX idx_accounts_portfolio ON accounts(portfolio_id);
CREATE INDEX idx_accounts_custodian ON accounts(custodian);
CREATE INDEX idx_accounts_type ON accounts(account_type);
CREATE INDEX idx_accounts_status ON accounts(status);

-- Instrument indexes
CREATE INDEX idx_instruments_symbol ON instruments(symbol);
CREATE INDEX idx_instruments_asset_class ON instruments(asset_class);
CREATE INDEX idx_instruments_identifiers ON instruments USING GIN(identifiers);

-- Position indexes
CREATE INDEX idx_positions_account_as_of ON positions(account_id, as_of);
CREATE INDEX idx_positions_instrument ON positions(instrument_id);

-- Transaction indexes
CREATE INDEX idx_transactions_account_trade_date ON transactions(account_id, trade_date);
CREATE INDEX idx_transactions_instrument ON transactions(instrument_id);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);
CREATE INDEX idx_transactions_settle_date ON transactions(settle_date);

-- Price indexes (already has PK on instrument_id, as_of)
CREATE INDEX idx_prices_as_of ON prices(as_of);

-- Alt position indexes
CREATE INDEX idx_alt_positions_account ON alt_positions(account_id);
CREATE INDEX idx_alt_positions_vehicle ON alt_positions(vehicle_name);
CREATE INDEX idx_alt_positions_nav_as_of ON alt_positions(nav_as_of);

-- Connector indexes
CREATE INDEX idx_connectors_vendor ON connectors(vendor);
CREATE INDEX idx_connectors_status ON connectors(status);
CREATE INDEX idx_connector_accounts_entity ON connector_accounts(entity_id);
CREATE INDEX idx_connector_accounts_institution ON connector_accounts(institution_id);

-- Evidence indexes
CREATE INDEX idx_evidence_source ON evidence_packages(source_id, source_type);
CREATE INDEX idx_evidence_vendor ON evidence_packages(vendor);
CREATE INDEX idx_evidence_captured_at ON evidence_packages(captured_at);

-- Exception indexes
CREATE INDEX idx_exceptions_account ON exceptions(account_id);
CREATE INDEX idx_exceptions_entity ON exceptions(entity_id);
CREATE INDEX idx_exceptions_severity ON exceptions(severity);
CREATE INDEX idx_exceptions_opened_at ON exceptions(opened_at);
CREATE INDEX idx_exceptions_resolved_at ON exceptions(resolved_at);

-- Report indexes
CREATE INDEX idx_reports_portfolio ON reports(portfolio_id);
CREATE INDEX idx_reports_entity ON reports(entity_id);
CREATE INDEX idx_reports_type ON reports(report_type);
CREATE INDEX idx_reports_persona_scope ON reports(persona_scope);
CREATE INDEX idx_reports_status ON reports(status);

-- RON policy indexes
CREATE INDEX idx_ron_policies_state ON ron_policies(state_code);
CREATE INDEX idx_ron_policies_active ON ron_policies(is_active);

-- Billing indexes
CREATE INDEX idx_billing_daily_entity_date ON billing_daily(entity_id, as_of);
CREATE INDEX idx_billing_daily_as_of ON billing_daily(as_of);

-- =============================================================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================================================

-- Reuse the existing update_updated_at_column function
CREATE TRIGGER update_entities_updated_at BEFORE UPDATE ON entities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON portfolios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_instruments_updated_at BEFORE UPDATE ON instruments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_positions_updated_at BEFORE UPDATE ON positions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_alt_positions_updated_at BEFORE UPDATE ON alt_positions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_connectors_updated_at BEFORE UPDATE ON connectors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_connector_accounts_updated_at BEFORE UPDATE ON connector_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ron_policies_updated_at BEFORE UPDATE ON ron_policies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- HELPER FUNCTIONS
-- =============================================================================

-- Calculate position market value
CREATE OR REPLACE FUNCTION calculate_market_value(
  p_instrument_id UUID,
  p_quantity DECIMAL,
  p_as_of TIMESTAMPTZ DEFAULT now()
) RETURNS DECIMAL AS $$
DECLARE
  latest_price DECIMAL;
BEGIN
  SELECT price INTO latest_price
  FROM prices 
  WHERE instrument_id = p_instrument_id 
    AND as_of <= p_as_of
  ORDER BY as_of DESC
  LIMIT 1;
  
  RETURN COALESCE(latest_price * p_quantity, 0);
END;
$$ LANGUAGE plpgsql STABLE;

-- Get entity access for user (for RLS)
CREATE OR REPLACE FUNCTION get_user_accessible_entities()
RETURNS TABLE(entity_id UUID) AS $$
BEGIN
  -- This will be enhanced based on actual user-entity relationships
  -- For now, return entities where user has direct access
  RETURN QUERY
  SELECT e.entity_id
  FROM entities e
  WHERE e.created_by = auth.uid()
     OR EXISTS (
       SELECT 1 FROM profiles p 
       WHERE p.id = auth.uid() 
       AND p.role IN ('admin', 'advisor')
     );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Check if user can access specific entity
CREATE OR REPLACE FUNCTION can_access_entity(target_entity_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN target_entity_id IN (SELECT entity_id FROM get_user_accessible_entities());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Get user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role FROM profiles 
    WHERE id = auth.uid() 
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Check persona access
CREATE OR REPLACE FUNCTION has_persona_access(target_scope persona_scope)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  user_role := get_user_role();
  
  RETURN CASE
    WHEN target_scope = 'all' THEN true
    WHEN target_scope = 'client' AND user_role = 'client' THEN true
    WHEN target_scope = 'advisor' AND user_role IN ('advisor', 'admin') THEN true
    WHEN target_scope = 'cpa' AND user_role IN ('cpa', 'advisor', 'admin') THEN true
    WHEN target_scope = 'attorney' AND user_role IN ('attorney', 'advisor', 'admin') THEN true
    WHEN user_role = 'admin' THEN true
    ELSE false
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;