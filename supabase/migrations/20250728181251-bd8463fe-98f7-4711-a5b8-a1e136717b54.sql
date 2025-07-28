-- Quick Advisor Proposal (QAP) Database Schema

-- Securities table for ticker resolution
CREATE TABLE IF NOT EXISTS public.securities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticker text NOT NULL UNIQUE,
  name text NOT NULL,
  asset_class text NOT NULL, -- equity, bond, etf, mutual_fund, etc
  sector text,
  market_cap_category text, -- large, mid, small
  expense_ratio numeric,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Investment models table
CREATE TABLE IF NOT EXISTS public.investment_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  risk_level integer CHECK (risk_level >= 1 AND risk_level <= 10),
  target_allocation jsonb NOT NULL, -- {"equity": 60, "bond": 30, "alternative": 10}
  model_securities jsonb NOT NULL, -- [{"ticker": "SPY", "weight": 0.6, "asset_class": "equity"}]
  fee_structure jsonb, -- {"management_fee": 0.01, "performance_fee": 0.05}
  tax_efficiency_score numeric DEFAULT 5,
  is_active boolean DEFAULT true,
  created_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Draft proposals table
CREATE TABLE IF NOT EXISTS public.draft_proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  advisor_id uuid NOT NULL,
  prospect_name text NOT NULL,
  prospect_email text,
  current_holdings jsonb NOT NULL, -- parsed from statement
  recommended_model_id uuid REFERENCES public.investment_models(id),
  model_scores jsonb, -- top 3 model scores
  advisor_overrides jsonb DEFAULT '{}', -- any manual adjustments
  proposal_data jsonb NOT NULL, -- complete proposal content
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'finalized', 'sent')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Proposal audit table
CREATE TABLE IF NOT EXISTS public.proposal_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid REFERENCES public.draft_proposals(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  action text NOT NULL, -- upload, parse, model_fit, override, generate, send
  details jsonb DEFAULT '{}',
  timestamp timestamp with time zone DEFAULT now(),
  ip_address inet,
  user_agent text
);

-- Proposal overrides table
CREATE TABLE IF NOT EXISTS public.proposal_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid REFERENCES public.draft_proposals(id) ON DELETE CASCADE,
  override_type text NOT NULL, -- risk_adjustment, asset_allocation, security_replacement
  original_value jsonb NOT NULL,
  new_value jsonb NOT NULL,
  reason text,
  created_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.securities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draft_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_overrides ENABLE ROW LEVEL SECURITY;

-- RLS Policies for securities (public read, admin write)
CREATE POLICY "Anyone can view securities" ON public.securities
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage securities" ON public.securities
  FOR ALL USING (has_any_role(ARRAY['admin', 'system_administrator']));

-- RLS Policies for investment models
CREATE POLICY "Users can view models in their tenant" ON public.investment_models
  FOR SELECT USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Advisors can create models in their tenant" ON public.investment_models
  FOR INSERT WITH CHECK (
    tenant_id = get_current_user_tenant_id() AND 
    has_any_role(ARRAY['advisor', 'admin', 'system_administrator'])
  );

CREATE POLICY "Advisors can update their own models" ON public.investment_models
  FOR UPDATE USING (
    tenant_id = get_current_user_tenant_id() AND 
    (created_by = auth.uid() OR has_any_role(ARRAY['admin', 'system_administrator']))
  );

-- RLS Policies for draft proposals
CREATE POLICY "Advisors can manage their proposals" ON public.draft_proposals
  FOR ALL USING (
    tenant_id = get_current_user_tenant_id() AND 
    (advisor_id = auth.uid() OR has_any_role(ARRAY['admin', 'system_administrator']))
  );

-- RLS Policies for proposal audit
CREATE POLICY "Users can view audit logs for their proposals" ON public.proposal_audit
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.draft_proposals dp 
      WHERE dp.id = proposal_audit.proposal_id 
      AND dp.tenant_id = get_current_user_tenant_id()
      AND (dp.advisor_id = auth.uid() OR has_any_role(ARRAY['admin', 'system_administrator']))
    )
  );

CREATE POLICY "System can insert audit logs" ON public.proposal_audit
  FOR INSERT WITH CHECK (true);

-- RLS Policies for proposal overrides
CREATE POLICY "Advisors can manage overrides for their proposals" ON public.proposal_overrides
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.draft_proposals dp 
      WHERE dp.id = proposal_overrides.proposal_id 
      AND dp.tenant_id = get_current_user_tenant_id()
      AND (dp.advisor_id = auth.uid() OR has_any_role(ARRAY['admin', 'system_administrator']))
    )
  );

-- Function to find best model fit using cosine similarity
CREATE OR REPLACE FUNCTION public.best_model_for_holdings(holdings jsonb)
RETURNS TABLE(model_id uuid, score numeric, model_name text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  tenant_id_val uuid;
BEGIN
  -- Get current user's tenant
  SELECT get_current_user_tenant_id() INTO tenant_id_val;
  
  RETURN QUERY
  WITH holding_allocation AS (
    -- Calculate current allocation percentages from holdings
    SELECT 
      COALESCE(h.value->>'asset_class', 'unknown') as asset_class,
      SUM((h.value->>'market_value')::numeric) as class_value
    FROM jsonb_array_elements(holdings) h
    GROUP BY h.value->>'asset_class'
  ),
  total_value AS (
    SELECT SUM(class_value) as total FROM holding_allocation
  ),
  current_allocation AS (
    SELECT 
      ha.asset_class,
      CASE WHEN tv.total > 0 THEN ha.class_value / tv.total ELSE 0 END as percentage
    FROM holding_allocation ha, total_value tv
  ),
  model_scores AS (
    SELECT 
      im.id,
      im.name,
      -- Simple cosine similarity calculation
      SUM(
        COALESCE(ca.percentage, 0) * 
        COALESCE((im.target_allocation->>ca.asset_class)::numeric / 100, 0)
      ) / (
        SQRT(SUM(COALESCE(ca.percentage, 0) ^ 2)) * 
        SQRT(SUM(COALESCE((im.target_allocation->>ca.asset_class)::numeric / 100, 0) ^ 2))
      ) as similarity_score
    FROM public.investment_models im
    CROSS JOIN current_allocation ca
    WHERE im.tenant_id = tenant_id_val AND im.is_active = true
    GROUP BY im.id, im.name
    HAVING SQRT(SUM(COALESCE(ca.percentage, 0) ^ 2)) > 0
      AND SQRT(SUM(COALESCE((im.target_allocation->>ca.asset_class)::numeric / 100, 0) ^ 2)) > 0
  )
  SELECT ms.id, ms.similarity_score, ms.name
  FROM model_scores ms
  ORDER BY ms.similarity_score DESC
  LIMIT 3;
END;
$$;

-- Function to log proposal actions
CREATE OR REPLACE FUNCTION public.log_proposal_action(
  p_proposal_id uuid,
  p_action text,
  p_details jsonb DEFAULT '{}',
  p_user_id uuid DEFAULT auth.uid()
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  audit_id uuid;
BEGIN
  INSERT INTO public.proposal_audit (
    proposal_id, user_id, action, details, ip_address
  ) VALUES (
    p_proposal_id, p_user_id, p_action, p_details, inet_client_addr()
  ) RETURNING id INTO audit_id;
  
  RETURN audit_id;
END;
$$;

-- Seed some basic securities data
INSERT INTO public.securities (ticker, name, asset_class, sector, expense_ratio) VALUES
('SPY', 'SPDR S&P 500 ETF Trust', 'etf', 'equity', 0.0945),
('VTI', 'Vanguard Total Stock Market ETF', 'etf', 'equity', 0.03),
('BND', 'Vanguard Total Bond Market ETF', 'etf', 'bond', 0.035),
('VEA', 'Vanguard FTSE Developed Markets ETF', 'etf', 'international_equity', 0.05),
('VWO', 'Vanguard FTSE Emerging Markets ETF', 'etf', 'emerging_markets', 0.10),
('VXUS', 'Vanguard Total International Stock ETF', 'etf', 'international_equity', 0.08),
('VTEB', 'Vanguard Tax-Exempt Bond ETF', 'etf', 'municipal_bond', 0.05),
('REIT', 'iShares Core U.S. REIT ETF', 'etf', 'real_estate', 0.19)
ON CONFLICT (ticker) DO NOTHING;

-- Create storage bucket for proposals
INSERT INTO storage.buckets (id, name, public) 
VALUES ('proposals', 'proposals', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for proposals bucket
CREATE POLICY "Advisors can upload proposals" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'proposals' AND 
    has_any_role(ARRAY['advisor', 'admin', 'system_administrator'])
  );

CREATE POLICY "Advisors can view their tenant proposals" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'proposals' AND 
    has_any_role(ARRAY['advisor', 'admin', 'system_administrator'])
  );

CREATE POLICY "Advisors can update their proposals" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'proposals' AND 
    has_any_role(ARRAY['advisor', 'admin', 'system_administrator'])
  );

CREATE POLICY "Advisors can delete their proposals" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'proposals' AND 
    has_any_role(ARRAY['advisor', 'admin', 'system_administrator'])
  );