-- Portfolio Risk Navigator GPS Database Schema

-- Portfolio positions table
CREATE TABLE IF NOT EXISTS public.portfolio_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  account_id UUID NOT NULL,
  symbol TEXT NOT NULL,
  asset_class TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  cost_basis NUMERIC,
  market_value NUMERIC,
  as_of_date DATE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolio targets table
CREATE TABLE IF NOT EXISTS public.portfolio_targets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  phase TEXT NOT NULL, -- Now/Later/Growth/Legacy
  asset_class TEXT NOT NULL,
  target_weight NUMERIC NOT NULL,
  drift_threshold NUMERIC DEFAULT 0.05,
  model_version TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rebalancing events table
CREATE TABLE IF NOT EXISTS public.rebalancing_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  account_id UUID NOT NULL,
  trigger_type TEXT NOT NULL, -- drift/regime/cashflow/tax
  trigger_data JSONB,
  trades JSONB NOT NULL,
  rationale TEXT,
  execution_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  executed_at TIMESTAMPTZ
);

-- Recommendation audit table
CREATE TABLE IF NOT EXISTS public.recommendation_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  input_snapshot JSONB NOT NULL,
  optimization_results JSONB NOT NULL,
  rationale TEXT NOT NULL,
  rationale_hash TEXT NOT NULL,
  model_version TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Private fund holdings table
CREATE TABLE IF NOT EXISTS public.private_fund_holdings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  fund_id TEXT NOT NULL,
  fund_name TEXT NOT NULL,
  committed_capital NUMERIC NOT NULL,
  called_capital NUMERIC NOT NULL,
  market_value NUMERIC NOT NULL,
  liquidity_term TEXT,
  vintage_year INTEGER,
  fund_type TEXT, -- private_equity/private_debt/real_estate
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Manager signals table
CREATE TABLE IF NOT EXISTS public.manager_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manager_id TEXT NOT NULL,
  manager_name TEXT NOT NULL,
  aum_trend NUMERIC,
  gating_changes INTEGER DEFAULT 0,
  secondary_price_signal NUMERIC,
  manager_coinvest BOOLEAN DEFAULT FALSE,
  filings_cadence INTEGER,
  pm3_score NUMERIC,
  computed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_portfolio_positions_user_id ON public.portfolio_positions(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_positions_as_of_date ON public.portfolio_positions(as_of_date);
CREATE INDEX IF NOT EXISTS idx_portfolio_targets_user_phase ON public.portfolio_targets(user_id, phase);
CREATE INDEX IF NOT EXISTS idx_rebalancing_events_user_id ON public.rebalancing_events(user_id);
CREATE INDEX IF NOT EXISTS idx_private_fund_holdings_user_id ON public.private_fund_holdings(user_id);
CREATE INDEX IF NOT EXISTS idx_manager_signals_manager_id ON public.manager_signals(manager_id);

-- Enable RLS
ALTER TABLE public.portfolio_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rebalancing_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendation_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.private_fund_holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manager_signals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own portfolio positions" ON public.portfolio_positions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own portfolio positions" ON public.portfolio_positions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own portfolio targets" ON public.portfolio_targets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own portfolio targets" ON public.portfolio_targets
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own rebalancing events" ON public.rebalancing_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own rebalancing events" ON public.rebalancing_events
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own recommendation audit" ON public.recommendation_audit
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own recommendation audit" ON public.recommendation_audit
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own private fund holdings" ON public.private_fund_holdings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own private fund holdings" ON public.private_fund_holdings
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view manager signals" ON public.manager_signals
  FOR SELECT USING (true);

CREATE POLICY "System can update manager signals" ON public.manager_signals
  FOR ALL USING (auth.role() = 'service_role');