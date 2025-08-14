-- Connector & Evidence Service - Canonical Schema
-- Production-ready database schema with RLS policies and audit trails

-- =============================================================================
-- ENUMS
-- =============================================================================

CREATE TYPE provider_type AS ENUM (
  'bridgeft',
  'byallaccounts', 
  'plaid',
  'akoya',
  'canoe',
  'icapital'
);

CREATE TYPE account_type AS ENUM (
  'checking',
  'savings', 
  'investment',
  'retirement',
  'loan',
  'credit'
);

CREATE TYPE transaction_type AS ENUM (
  'debit',
  'credit',
  'transfer',
  'fee',
  'dividend',
  'interest'
);

CREATE TYPE security_type AS ENUM (
  'stock',
  'bond',
  'mutual_fund',
  'etf',
  'option',
  'future',
  'commodity',
  'cash',
  'alternative'
);

CREATE TYPE connection_status AS ENUM (
  'active',
  'inactive',
  'error',
  'reconnect_required'
);

CREATE TYPE sync_frequency AS ENUM (
  'daily',
  'weekly',
  'monthly',
  'manual'
);

CREATE TYPE notary_provider AS ENUM (
  'docusign',
  'notarycam'
);

CREATE TYPE notarization_status AS ENUM (
  'pending',
  'in_progress',
  'completed',
  'failed',
  'cancelled'
);

CREATE TYPE report_type AS ENUM (
  'account_summary',
  'transaction_history',
  'position_summary',
  'performance',
  'tax_summary',
  'notarization_certificate'
);

CREATE TYPE report_status AS ENUM (
  'queued',
  'generating',
  'completed',
  'failed'
);

CREATE TYPE file_format AS ENUM (
  'pdf',
  'csv',
  'json',
  'xlsx'
);

CREATE TYPE exception_type AS ENUM (
  'sync_error',
  'validation_error',
  'api_error',
  'timeout',
  'authentication_error'
);

CREATE TYPE severity_level AS ENUM (
  'low',
  'medium',
  'high',
  'critical'
);

CREATE TYPE resolution_status AS ENUM (
  'open',
  'investigating',
  'resolved',
  'wont_fix'
);

-- =============================================================================
-- BASE TABLES
-- =============================================================================

-- Connections Table
CREATE TABLE connector_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  user_id UUID NOT NULL,
  provider provider_type NOT NULL,
  external_connection_id TEXT NOT NULL,
  status connection_status NOT NULL DEFAULT 'active',
  last_sync_at TIMESTAMPTZ,
  next_sync_at TIMESTAMPTZ,
  sync_frequency sync_frequency NOT NULL DEFAULT 'daily',
  error_count INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  access_token_encrypted TEXT,
  refresh_token_encrypted TEXT,
  expires_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID,
  updated_by UUID,
  
  UNIQUE(tenant_id, provider, external_connection_id)
);

-- Accounts Table
CREATE TABLE connector_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  connection_id UUID NOT NULL REFERENCES connector_connections(id) ON DELETE CASCADE,
  external_id TEXT NOT NULL,
  provider provider_type NOT NULL,
  account_type account_type NOT NULL,
  account_name TEXT NOT NULL,
  account_number TEXT,
  institution_name TEXT NOT NULL,
  institution_id TEXT,
  balance DECIMAL(20,4),
  currency TEXT NOT NULL DEFAULT 'USD',
  is_active BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID,
  updated_by UUID,
  
  UNIQUE(tenant_id, provider, external_id)
);

-- Transactions Table
CREATE TABLE connector_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  account_id UUID NOT NULL REFERENCES connector_accounts(id) ON DELETE CASCADE,
  external_id TEXT NOT NULL,
  amount DECIMAL(20,4) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  transaction_type transaction_type NOT NULL,
  transaction_date TIMESTAMPTZ NOT NULL,
  settlement_date TIMESTAMPTZ,
  description TEXT NOT NULL,
  category TEXT,
  subcategory TEXT,
  merchant_name TEXT,
  reference_number TEXT,
  is_pending BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID,
  updated_by UUID,
  
  UNIQUE(tenant_id, account_id, external_id)
);

-- Positions Table
CREATE TABLE connector_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  account_id UUID NOT NULL REFERENCES connector_accounts(id) ON DELETE CASCADE,
  security_id UUID,
  external_id TEXT NOT NULL,
  symbol TEXT,
  cusip TEXT,
  isin TEXT,
  security_name TEXT NOT NULL,
  security_type security_type NOT NULL,
  quantity DECIMAL(20,8) NOT NULL,
  unit_price DECIMAL(20,4),
  market_value DECIMAL(20,4),
  cost_basis DECIMAL(20,4),
  currency TEXT NOT NULL DEFAULT 'USD',
  as_of_date TIMESTAMPTZ NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID,
  updated_by UUID,
  
  UNIQUE(tenant_id, account_id, external_id, as_of_date)
);

-- Notarizations Table
CREATE TABLE connector_notarizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  document_id UUID NOT NULL,
  user_id UUID NOT NULL,
  notary_provider notary_provider NOT NULL,
  notary_session_id TEXT NOT NULL,
  status notarization_status NOT NULL DEFAULT 'pending',
  state_jurisdiction TEXT NOT NULL,
  notary_public_id TEXT,
  notary_commission_expires TIMESTAMPTZ,
  notarization_date TIMESTAMPTZ,
  video_recording_url TEXT,
  certificate_url TEXT,
  audit_trail JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID,
  updated_by UUID,
  
  UNIQUE(tenant_id, notary_provider, notary_session_id)
);

-- State Notary Policies Table
CREATE TABLE notary_state_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_code TEXT NOT NULL,
  state_name TEXT NOT NULL,
  docusign_enabled BOOLEAN NOT NULL DEFAULT false,
  notarycam_enabled BOOLEAN NOT NULL DEFAULT false,
  remote_notary_allowed BOOLEAN NOT NULL DEFAULT false,
  audio_recording_required BOOLEAN NOT NULL DEFAULT true,
  video_recording_required BOOLEAN NOT NULL DEFAULT true,
  id_verification_methods JSONB DEFAULT '[]',
  additional_requirements JSONB DEFAULT '{}',
  effective_date DATE NOT NULL,
  expiry_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(state_code, effective_date)
);

-- Reports Table
CREATE TABLE connector_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  user_id UUID NOT NULL,
  report_type report_type NOT NULL,
  parameters JSONB NOT NULL DEFAULT '{}',
  status report_status NOT NULL DEFAULT 'queued',
  file_url TEXT,
  file_format file_format NOT NULL DEFAULT 'pdf',
  file_size_bytes BIGINT,
  generated_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  download_count INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- Audit Logs Table
CREATE TABLE connector_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  user_id UUID,
  ip_address INET,
  user_agent TEXT,
  changes JSONB,
  previous_values JSONB,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID
);

-- Exceptions Table
CREATE TABLE connector_exceptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  exception_type exception_type NOT NULL,
  severity severity_level NOT NULL,
  source TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  error_message TEXT NOT NULL,
  error_code TEXT,
  stack_trace TEXT,
  resolution_status resolution_status NOT NULL DEFAULT 'open',
  assigned_to UUID,
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- Billing Usage Table
CREATE TABLE connector_billing_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  user_id UUID,
  connection_id UUID REFERENCES connector_connections(id),
  usage_type TEXT NOT NULL, -- 'asa_count', 'api_call', 'report_generation', 'notarization'
  usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_cost DECIMAL(10,4),
  total_cost DECIMAL(10,4),
  billing_period TEXT, -- 'YYYY-MM'
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Events Table (for event sourcing)
CREATE TABLE connector_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  tenant_id UUID NOT NULL,
  user_id UUID,
  source TEXT NOT NULL,
  correlation_id UUID,
  payload JSONB NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ,
  
  UNIQUE(event_id)
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Performance indexes
CREATE INDEX idx_connector_connections_tenant_user ON connector_connections(tenant_id, user_id);
CREATE INDEX idx_connector_connections_status ON connector_connections(status);
CREATE INDEX idx_connector_connections_next_sync ON connector_connections(next_sync_at) WHERE status = 'active';

CREATE INDEX idx_connector_accounts_tenant_connection ON connector_accounts(tenant_id, connection_id);
CREATE INDEX idx_connector_accounts_provider_external ON connector_accounts(provider, external_id);

CREATE INDEX idx_connector_transactions_account_date ON connector_transactions(account_id, transaction_date);
CREATE INDEX idx_connector_transactions_tenant_date ON connector_transactions(tenant_id, transaction_date);

CREATE INDEX idx_connector_positions_account_date ON connector_positions(account_id, as_of_date);
CREATE INDEX idx_connector_positions_tenant_date ON connector_positions(tenant_id, as_of_date);

CREATE INDEX idx_connector_notarizations_tenant_user ON connector_notarizations(tenant_id, user_id);
CREATE INDEX idx_connector_notarizations_status ON connector_notarizations(status);

CREATE INDEX idx_connector_reports_tenant_user ON connector_reports(tenant_id, user_id);
CREATE INDEX idx_connector_reports_status ON connector_reports(status);

CREATE INDEX idx_connector_audit_logs_tenant_entity ON connector_audit_logs(tenant_id, entity_type, entity_id);
CREATE INDEX idx_connector_audit_logs_user_date ON connector_audit_logs(user_id, created_at);

CREATE INDEX idx_connector_exceptions_tenant_status ON connector_exceptions(tenant_id, resolution_status);
CREATE INDEX idx_connector_exceptions_severity ON connector_exceptions(severity);

CREATE INDEX idx_connector_billing_usage_tenant_date ON connector_billing_usage(tenant_id, usage_date);
CREATE INDEX idx_connector_billing_usage_period ON connector_billing_usage(billing_period);

CREATE INDEX idx_connector_events_tenant_type ON connector_events(tenant_id, event_type);
CREATE INDEX idx_connector_events_correlation ON connector_events(correlation_id);
CREATE INDEX idx_connector_events_processed ON connector_events(processed_at) WHERE processed_at IS NULL;

-- =============================================================================
-- FUNCTIONS & TRIGGERS
-- =============================================================================

-- Updated timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_connector_connections_updated_at BEFORE UPDATE ON connector_connections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_connector_accounts_updated_at BEFORE UPDATE ON connector_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_connector_transactions_updated_at BEFORE UPDATE ON connector_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_connector_positions_updated_at BEFORE UPDATE ON connector_positions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_connector_notarizations_updated_at BEFORE UPDATE ON connector_notarizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_connector_reports_updated_at BEFORE UPDATE ON connector_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_connector_exceptions_updated_at BEFORE UPDATE ON connector_exceptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notary_state_policies_updated_at BEFORE UPDATE ON notary_state_policies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Audit logging trigger
CREATE OR REPLACE FUNCTION log_connector_audit()
RETURNS TRIGGER AS $$
DECLARE
  tenant_uuid UUID;
  user_uuid UUID;
BEGIN
  -- Get tenant_id from the record
  IF TG_OP = 'DELETE' THEN
    tenant_uuid := OLD.tenant_id;
  ELSE
    tenant_uuid := NEW.tenant_id;
  END IF;

  -- Get current user (if available)
  user_uuid := auth.uid();

  -- Insert audit log
  INSERT INTO connector_audit_logs (
    tenant_id,
    event_type,
    entity_type,
    entity_id,
    user_id,
    ip_address,
    changes,
    previous_values
  ) VALUES (
    tenant_uuid,
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    user_uuid,
    inet_client_addr(),
    CASE WHEN TG_OP != 'DELETE' THEN row_to_json(NEW)::jsonb ELSE NULL END,
    CASE WHEN TG_OP != 'INSERT' THEN row_to_json(OLD)::jsonb ELSE NULL END
  );

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit triggers to main tables
CREATE TRIGGER audit_connector_connections AFTER INSERT OR UPDATE OR DELETE ON connector_connections FOR EACH ROW EXECUTE FUNCTION log_connector_audit();
CREATE TRIGGER audit_connector_accounts AFTER INSERT OR UPDATE OR DELETE ON connector_accounts FOR EACH ROW EXECUTE FUNCTION log_connector_audit();
CREATE TRIGGER audit_connector_transactions AFTER INSERT OR UPDATE OR DELETE ON connector_transactions FOR EACH ROW EXECUTE FUNCTION log_connector_audit();
CREATE TRIGGER audit_connector_positions AFTER INSERT OR UPDATE OR DELETE ON connector_positions FOR EACH ROW EXECUTE FUNCTION log_connector_audit();
CREATE TRIGGER audit_connector_notarizations AFTER INSERT OR UPDATE OR DELETE ON connector_notarizations FOR EACH ROW EXECUTE FUNCTION log_connector_audit();

-- Helper function to get current user's tenant
CREATE OR REPLACE FUNCTION get_current_user_tenant_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT tenant_id 
    FROM profiles 
    WHERE id = auth.uid() 
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Next sync calculation function
CREATE OR REPLACE FUNCTION calculate_next_sync(frequency sync_frequency, last_sync TIMESTAMPTZ DEFAULT now())
RETURNS TIMESTAMPTZ AS $$
BEGIN
  RETURN CASE frequency
    WHEN 'daily' THEN last_sync + INTERVAL '1 day'
    WHEN 'weekly' THEN last_sync + INTERVAL '7 days'
    WHEN 'monthly' THEN last_sync + INTERVAL '1 month'
    ELSE NULL -- manual sync
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- State notary policy lookup function
CREATE OR REPLACE FUNCTION get_notary_policy(state_code TEXT, provider notary_provider)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT CASE provider
      WHEN 'docusign' THEN docusign_enabled
      WHEN 'notarycam' THEN notarycam_enabled
    END
    FROM notary_state_policies
    WHERE state_code = $1
      AND is_active = true
      AND effective_date <= CURRENT_DATE
      AND (expiry_date IS NULL OR expiry_date > CURRENT_DATE)
    ORDER BY effective_date DESC
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;