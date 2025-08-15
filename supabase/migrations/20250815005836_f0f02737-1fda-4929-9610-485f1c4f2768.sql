-- Connector Registry and Custody System
-- Tables for connectors, accounts, positions, transactions, reports, exceptions, billing

-- Core connector registry
CREATE TABLE public.connectors (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    connector_name TEXT NOT NULL,
    vendor_name TEXT NOT NULL,
    connector_type TEXT NOT NULL CHECK (connector_type IN ('custody', 'brokerage', 'bank', 'crypto', 'alternative')),
    api_endpoint TEXT,
    auth_type TEXT NOT NULL CHECK (auth_type IN ('oauth2', 'api_key', 'basic_auth', 'certificate')),
    capabilities JSONB DEFAULT '[]'::jsonb,
    rate_limits JSONB DEFAULT '{}'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'deprecated', 'disabled')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Connector accounts (connection instances)
CREATE TABLE public.connector_accounts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    connector_id UUID NOT NULL REFERENCES public.connectors(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    account_name TEXT NOT NULL,
    external_account_id TEXT NOT NULL,
    auth_data_encrypted TEXT, -- encrypted credentials
    sync_status TEXT NOT NULL DEFAULT 'pending' CHECK (sync_status IN ('pending', 'active', 'error', 'disabled')),
    last_sync_at TIMESTAMP WITH TIME ZONE,
    next_sync_at TIMESTAMP WITH TIME ZONE,
    sync_frequency TEXT DEFAULT 'daily' CHECK (sync_frequency IN ('realtime', 'hourly', 'daily', 'weekly')),
    error_count INTEGER DEFAULT 0,
    last_error_message TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(connector_id, external_account_id)
);

-- Canonical accounts table
CREATE TABLE public.accounts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    connector_account_id UUID NOT NULL REFERENCES public.connector_accounts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    account_number TEXT NOT NULL,
    account_name TEXT NOT NULL,
    account_type TEXT NOT NULL CHECK (account_type IN ('checking', 'savings', 'investment', 'retirement', 'trust', 'custody')),
    institution_name TEXT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    current_balance NUMERIC(15,2),
    available_balance NUMERIC(15,2),
    account_status TEXT NOT NULL DEFAULT 'active' CHECK (account_status IN ('active', 'closed', 'frozen', 'restricted')),
    metadata JSONB DEFAULT '{}'::jsonb,
    last_updated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(connector_account_id, account_number)
);

-- Canonical positions table
CREATE TABLE public.positions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    symbol TEXT NOT NULL,
    cusip TEXT,
    isin TEXT,
    asset_class TEXT NOT NULL CHECK (asset_class IN ('equity', 'fixed_income', 'cash', 'alternative', 'crypto', 'commodity')),
    asset_name TEXT NOT NULL,
    quantity NUMERIC(18,8) NOT NULL,
    unit_price NUMERIC(15,4),
    market_value NUMERIC(15,2),
    cost_basis NUMERIC(15,2),
    unrealized_gain_loss NUMERIC(15,2),
    currency TEXT NOT NULL DEFAULT 'USD',
    position_type TEXT NOT NULL DEFAULT 'long' CHECK (position_type IN ('long', 'short')),
    metadata JSONB DEFAULT '{}'::jsonb,
    as_of_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(account_id, symbol, as_of_date)
);

-- Canonical transactions table
CREATE TABLE public.transactions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    external_transaction_id TEXT NOT NULL,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('buy', 'sell', 'deposit', 'withdrawal', 'dividend', 'interest', 'fee', 'transfer')),
    symbol TEXT,
    quantity NUMERIC(18,8),
    price NUMERIC(15,4),
    amount NUMERIC(15,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    transaction_date DATE NOT NULL,
    settlement_date DATE,
    description TEXT,
    fees NUMERIC(15,2) DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(account_id, external_transaction_id)
);

-- Reports table with persona scope
CREATE TABLE public.reports (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    persona_id UUID NOT NULL,
    persona_scope TEXT NOT NULL CHECK (persona_scope IN ('client', 'advisor', 'family_office', 'institution')),
    report_type TEXT NOT NULL CHECK (report_type IN ('performance', 'holdings', 'transactions', 'allocation', 'compliance', 'tax')),
    report_name TEXT NOT NULL,
    parameters JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    file_url TEXT,
    file_size_bytes INTEGER,
    mime_type TEXT,
    generated_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    evidence_id UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Exceptions table for data quality and processing issues
CREATE TABLE public.exceptions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    entity_id UUID NOT NULL,
    entity_type TEXT NOT NULL CHECK (entity_type IN ('connector_account', 'account', 'position', 'transaction', 'report')),
    exception_type TEXT NOT NULL CHECK (exception_type IN ('data_quality', 'sync_failure', 'validation_error', 'rate_limit', 'auth_failure', 'processing_error')),
    severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    title TEXT NOT NULL,
    description TEXT,
    error_details JSONB DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'dismissed')),
    assigned_to UUID,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Billing daily table for usage tracking
CREATE TABLE public.billing_daily (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    entity_id UUID NOT NULL,
    billing_date DATE NOT NULL,
    active_synced_accounts INTEGER DEFAULT 0,
    alt_positions_monitored INTEGER DEFAULT 0,
    notarizations_completed INTEGER DEFAULT 0,
    vendor_costs JSONB DEFAULT '{}'::jsonb,
    total_vendor_cost NUMERIC(10,2) DEFAULT 0,
    base_cost NUMERIC(10,2) DEFAULT 0,
    alts_cost NUMERIC(10,2) DEFAULT 0,
    notary_cost NUMERIC(10,2) DEFAULT 0,
    total_estimated_cost NUMERIC(10,2) DEFAULT 0,
    calculated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(entity_id, billing_date)
);

-- Create indexes for performance
CREATE INDEX idx_connector_accounts_user_id ON public.connector_accounts(user_id);
CREATE INDEX idx_connector_accounts_sync_status ON public.connector_accounts(sync_status);
CREATE INDEX idx_connector_accounts_next_sync ON public.connector_accounts(next_sync_at) WHERE sync_status = 'active';

CREATE INDEX idx_accounts_user_id ON public.accounts(user_id);
CREATE INDEX idx_accounts_connector_account ON public.connector_accounts(id);

CREATE INDEX idx_positions_account_id ON public.positions(account_id);
CREATE INDEX idx_positions_user_id ON public.positions(user_id);
CREATE INDEX idx_positions_as_of_date ON public.positions(as_of_date);

CREATE INDEX idx_transactions_account_id ON public.transactions(account_id);
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_date ON public.transactions(transaction_date);

CREATE INDEX idx_reports_user_persona ON public.reports(user_id, persona_id);
CREATE INDEX idx_reports_scope_type ON public.reports(persona_scope, report_type);
CREATE INDEX idx_reports_status ON public.reports(status);

CREATE INDEX idx_exceptions_entity ON public.exceptions(entity_type, entity_id);
CREATE INDEX idx_exceptions_status ON public.exceptions(status);
CREATE INDEX idx_exceptions_severity ON public.exceptions(severity);

CREATE INDEX idx_billing_daily_entity_date ON public.billing_daily(entity_id, billing_date);

-- RLS Policies

-- Connectors (admin only can manage)
ALTER TABLE public.connectors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage connectors" ON public.connectors FOR ALL USING (has_any_role(ARRAY['admin', 'system_administrator']));
CREATE POLICY "Users can view active connectors" ON public.connectors FOR SELECT USING (status = 'active');

-- Connector accounts (users own their connections)
ALTER TABLE public.connector_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their connector accounts" ON public.connector_accounts FOR ALL USING (user_id = auth.uid());

-- Accounts (users own their accounts)
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their accounts" ON public.accounts FOR ALL USING (user_id = auth.uid());

-- Positions (users own their positions)
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their positions" ON public.positions FOR ALL USING (user_id = auth.uid());

-- Transactions (users own their transactions)
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their transactions" ON public.transactions FOR ALL USING (user_id = auth.uid());

-- Reports (access by persona scope)
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access reports by persona scope" ON public.reports FOR ALL USING (
    user_id = auth.uid() OR 
    (persona_scope = 'advisor' AND persona_id IN (
        SELECT advisor_id FROM advisor_client_links WHERE client_user_id = auth.uid()
    )) OR
    (persona_scope = 'family_office' AND user_id IN (
        SELECT user_id FROM profiles WHERE tenant_id = get_current_user_tenant_id()
    ))
);

-- Exceptions (users can view their exceptions, admins can view all)
ALTER TABLE public.exceptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their exceptions" ON public.exceptions FOR SELECT USING (
    entity_id IN (
        SELECT id FROM connector_accounts WHERE user_id = auth.uid()
        UNION
        SELECT id FROM accounts WHERE user_id = auth.uid()
        UNION 
        SELECT id FROM reports WHERE user_id = auth.uid()
    ) OR has_any_role(ARRAY['admin', 'system_administrator'])
);
CREATE POLICY "Admins can manage exceptions" ON public.exceptions FOR ALL USING (has_any_role(ARRAY['admin', 'system_administrator']));

-- Billing (admins only)
ALTER TABLE public.billing_daily ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage billing" ON public.billing_daily FOR ALL USING (has_any_role(ARRAY['admin', 'system_administrator']));

-- Seed data for connectors
INSERT INTO public.connectors (connector_name, vendor_name, connector_type, api_endpoint, auth_type, capabilities) VALUES
('Schwab Custody API', 'Charles Schwab', 'custody', 'https://api.schwab.com/custody/v1', 'oauth2', '["accounts", "positions", "transactions", "real_time"]'),
('Fidelity Institutional', 'Fidelity', 'custody', 'https://api.fidelity.com/institutional/v2', 'api_key', '["accounts", "positions", "transactions"]'),
('Pershing NetX360', 'BNY Mellon Pershing', 'custody', 'https://netx360.pershing.com/api/v1', 'certificate', '["accounts", "positions", "transactions", "corporate_actions"]'),
('Interactive Brokers', 'Interactive Brokers', 'brokerage', 'https://api.interactivebrokers.com/v1', 'oauth2', '["accounts", "positions", "transactions", "trading"]'),
('TD Ameritrade Institutional', 'TD Ameritrade', 'custody', 'https://api.tdameritrade.com/v1', 'oauth2', '["accounts", "positions", "transactions", "market_data"]');

-- Seed billing daily data (demo)
INSERT INTO public.billing_daily (entity_id, billing_date, active_synced_accounts, alt_positions_monitored, notarizations_completed, total_estimated_cost) VALUES
(gen_random_uuid(), CURRENT_DATE - INTERVAL '1 day', 15, 8, 2, 350.00),
(gen_random_uuid(), CURRENT_DATE - INTERVAL '2 days', 18, 12, 1, 425.00),
(gen_random_uuid(), CURRENT_DATE - INTERVAL '3 days', 12, 6, 3, 290.00);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_connectors_updated_at BEFORE UPDATE ON public.connectors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_connector_accounts_updated_at BEFORE UPDATE ON public.connector_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON public.accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_positions_updated_at BEFORE UPDATE ON public.positions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON public.reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exceptions_updated_at BEFORE UPDATE ON public.exceptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_billing_daily_updated_at BEFORE UPDATE ON public.billing_daily FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();