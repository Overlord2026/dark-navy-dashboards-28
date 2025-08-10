-- Portfolio Risk Navigator GPS Tables
CREATE TABLE IF NOT EXISTS public.portfolio_positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    account_id UUID,
    symbol TEXT NOT NULL,
    asset_class TEXT NOT NULL,
    current_weight NUMERIC NOT NULL DEFAULT 0,
    target_weight NUMERIC,
    quantity NUMERIC NOT NULL DEFAULT 0,
    current_value NUMERIC NOT NULL DEFAULT 0,
    cost_basis NUMERIC,
    last_price NUMERIC,
    swag_phase TEXT, -- 'income_now', 'income_later', 'growth', 'legacy'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.portfolio_targets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    swag_phase TEXT NOT NULL,
    asset_class TEXT NOT NULL,
    target_allocation NUMERIC NOT NULL,
    min_allocation NUMERIC,
    max_allocation NUMERIC,
    rebalance_threshold NUMERIC DEFAULT 0.05,
    liquidity_requirement NUMERIC DEFAULT 0,
    fee_cap NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, swag_phase, asset_class)
);

CREATE TABLE IF NOT EXISTS public.rebalancing_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    trigger_type TEXT NOT NULL, -- 'drift', 'regime_change', 'cashflow', 'tax_calendar'
    trigger_data JSONB,
    current_positions JSONB NOT NULL,
    target_weights JSONB NOT NULL,
    recommended_trades JSONB NOT NULL,
    trade_rationale TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'executed', 'cancelled'
    execution_cost NUMERIC,
    tax_impact NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    executed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.recommendation_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    rebalancing_event_id UUID REFERENCES public.rebalancing_events(id),
    recommendation_type TEXT NOT NULL,
    input_snapshot JSONB NOT NULL,
    output_data JSONB NOT NULL,
    confidence_score NUMERIC,
    model_version TEXT,
    input_hash TEXT,
    rationale TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.private_fund_holdings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    fund_name TEXT NOT NULL,
    fund_type TEXT NOT NULL, -- 'private_equity', 'private_debt', 'real_estate', 'hedge_fund'
    commitment_amount NUMERIC NOT NULL,
    called_amount NUMERIC DEFAULT 0,
    current_value NUMERIC DEFAULT 0,
    vintage_year INTEGER,
    liquidity_status TEXT DEFAULT 'illiquid', -- 'liquid', 'limited', 'illiquid', 'gated'
    swag_phase TEXT,
    pm3_score NUMERIC, -- Private Manager Momentum score
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.manager_signals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    manager_name TEXT NOT NULL,
    signal_type TEXT NOT NULL, -- 'aum_trend', 'gating_change', 'secondary_price', 'coinvest', 'filings_cadence'
    signal_value NUMERIC,
    signal_date DATE NOT NULL,
    confidence_level NUMERIC DEFAULT 0.5,
    data_source TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.portfolio_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rebalancing_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendation_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.private_fund_holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manager_signals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their portfolio positions" ON public.portfolio_positions
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage their portfolio targets" ON public.portfolio_targets
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view their rebalancing events" ON public.rebalancing_events
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view their recommendation audit" ON public.recommendation_audit
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage their private fund holdings" ON public.private_fund_holdings
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Manager signals are viewable by all authenticated users" ON public.manager_signals
    FOR SELECT USING (true);

CREATE POLICY "System can insert manager signals" ON public.manager_signals
    FOR INSERT WITH CHECK (true);

-- Indexes for performance
CREATE INDEX idx_portfolio_positions_user_phase ON public.portfolio_positions(user_id, swag_phase);
CREATE INDEX idx_portfolio_targets_user_phase ON public.portfolio_targets(user_id, swag_phase);
CREATE INDEX idx_rebalancing_events_user_status ON public.rebalancing_events(user_id, status);
CREATE INDEX idx_manager_signals_name_date ON public.manager_signals(manager_name, signal_date DESC);