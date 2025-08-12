-- Marketing Engine schema (fixed): remove subquery CHECK; enforce via can_publish_creative

-- 1) Offers table prerequisite
CREATE TABLE public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL DEFAULT get_current_user_tenant_id(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant users can view offers" ON public.offers FOR SELECT
  USING (tenant_id = get_current_user_tenant_id());
CREATE POLICY "Marketing managers can manage offers" ON public.offers FOR ALL
  USING (tenant_id = get_current_user_tenant_id() AND validate_user_role_access(ARRAY['marketing_manager','admin'], 'offer', id));

-- 2) Enum types
CREATE TYPE ad_platform AS ENUM ('meta', 'google', 'youtube', 'linkedin', 'twitter', 'tiktok', 'snapchat');
CREATE TYPE creative_type AS ENUM ('image', 'video', 'carousel', 'collection', 'text', 'audio');
CREATE TYPE ad_status AS ENUM ('draft', 'pending_approval', 'approved', 'rejected', 'active', 'paused', 'completed', 'archived');
CREATE TYPE approval_type AS ENUM ('creative', 'financial_promotion', 'compliance', 'brand_safety');
CREATE TYPE experiment_type AS ENUM ('ab_test', 'bandit_thompson', 'bandit_ucb', 'holdout');
CREATE TYPE bidding_strategy AS ENUM ('cost_cap', 'bid_cap', 'target_cost', 'lowest_cost', 'value_optimization');

-- 3) Core tables
CREATE TABLE public.creatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id UUID REFERENCES public.offers(id),
  tenant_id UUID NOT NULL DEFAULT get_current_user_tenant_id(),
  creative_type creative_type NOT NULL,
  name TEXT NOT NULL,
  url_or_blob TEXT,
  asset_metadata JSONB DEFAULT '{}',
  provenance_json JSONB NOT NULL DEFAULT '{}',
  disclosures_json JSONB NOT NULL DEFAULT '{}',
  authenticity_score NUMERIC(3,2) DEFAULT 0.95 CHECK (authenticity_score >= 0 AND authenticity_score <= 1),
  deepfake_checked BOOLEAN DEFAULT false,
  watermark_embedded BOOLEAN DEFAULT false,
  approval_status ad_status DEFAULT 'draft',
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  artifact_hash TEXT,
  approval_hash TEXT
);

CREATE TABLE public.ad_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL DEFAULT get_current_user_tenant_id(),
  platform ad_platform NOT NULL,
  platform_account_id TEXT NOT NULL,
  account_name TEXT NOT NULL,
  access_token_encrypted TEXT,
  account_status TEXT DEFAULT 'active',
  capabilities JSONB DEFAULT '{}',
  rate_limits JSONB DEFAULT '{}',
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(platform, platform_account_id, tenant_id)
);

CREATE TABLE public.ad_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL DEFAULT get_current_user_tenant_id(),
  account_id UUID NOT NULL REFERENCES public.ad_accounts(id),
  platform_campaign_id TEXT,
  campaign_name TEXT NOT NULL,
  objective TEXT NOT NULL,
  status ad_status DEFAULT 'draft',
  total_budget NUMERIC(12,2),
  daily_budget NUMERIC(12,2),
  bid_strategy bidding_strategy DEFAULT 'lowest_cost',
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  targeting_config JSONB DEFAULT '{}',
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.ad_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.ad_campaigns(id),
  platform_adset_id TEXT,
  adset_name TEXT NOT NULL,
  status ad_status DEFAULT 'draft',
  budget NUMERIC(12,2),
  bid_amount NUMERIC(8,4),
  targeting JSONB DEFAULT '{}',
  placement JSONB DEFAULT '{}',
  optimization_goal TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  adset_id UUID NOT NULL REFERENCES public.ad_sets(id),
  creative_id UUID NOT NULL REFERENCES public.creatives(id),
  platform_ad_id TEXT,
  ad_name TEXT NOT NULL,
  status ad_status DEFAULT 'draft',
  headline TEXT,
  description TEXT,
  call_to_action TEXT,
  link_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.io_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL DEFAULT get_current_user_tenant_id(),
  campaign_id UUID REFERENCES public.ad_campaigns(id),
  arm TEXT NOT NULL,
  allocated_budget NUMERIC(12,2) NOT NULL,
  spent_budget NUMERIC(12,2) DEFAULT 0,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  pacing_config JSONB DEFAULT '{}',
  exclusivity_constraints JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL DEFAULT get_current_user_tenant_id(),
  campaign_id UUID REFERENCES public.ad_campaigns(id),
  experiment_name TEXT NOT NULL,
  experiment_type experiment_type NOT NULL,
  arms JSONB NOT NULL,
  random_seed INTEGER DEFAULT EXTRACT(EPOCH FROM now())::INTEGER,
  priors JSONB DEFAULT '{}',
  traffic_allocation JSONB DEFAULT '{}',
  status TEXT DEFAULT 'draft',
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  confidence_threshold NUMERIC(3,2) DEFAULT 0.95,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.metrics_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL DEFAULT get_current_user_tenant_id(),
  ad_id UUID REFERENCES public.ads(id),
  campaign_id UUID REFERENCES public.ad_campaigns(id),
  date DATE NOT NULL,
  platform ad_platform NOT NULL,
  spend NUMERIC(10,2) DEFAULT 0,
  impressions BIGINT DEFAULT 0,
  clicks BIGINT DEFAULT 0,
  conversions BIGINT DEFAULT 0,
  revenue NUMERIC(12,2) DEFAULT 0,
  emv NUMERIC(12,2) DEFAULT 0,
  cpa NUMERIC(8,2) DEFAULT 0,
  roas NUMERIC(6,3) DEFAULT 0,
  ctr NUMERIC(5,4) DEFAULT 0,
  cvr NUMERIC(5,4) DEFAULT 0,
  cpm NUMERIC(8,2) DEFAULT 0,
  video_views BIGINT DEFAULT 0,
  video_completion_rate NUMERIC(5,4) DEFAULT 0,
  engagement_rate NUMERIC(5,4) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(ad_id, campaign_id, date, platform)
);

CREATE TABLE public.creative_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creative_id UUID NOT NULL REFERENCES public.creatives(id),
  approval_type approval_type NOT NULL,
  approver_id UUID NOT NULL REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'pending',
  comments TEXT,
  artifact_hash TEXT NOT NULL,
  policy_hash TEXT NOT NULL,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.ad_rds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL DEFAULT get_current_user_tenant_id(),
  ad_id UUID NOT NULL REFERENCES public.ads(id),
  inputs_hash TEXT NOT NULL,
  approval_hash TEXT NOT NULL,
  policy_hash TEXT NOT NULL,
  platform_response JSONB,
  explanation_json JSONB,
  sha256 TEXT NOT NULL,
  merkle_root TEXT,
  anchor_txid TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.io_rds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL DEFAULT get_current_user_tenant_id(),
  allocation_id UUID NOT NULL REFERENCES public.io_allocations(id),
  budget_inputs_hash TEXT NOT NULL,
  allocation_algorithm TEXT NOT NULL,
  constraints_hash TEXT NOT NULL,
  allocation_result JSONB NOT NULL,
  sha256 TEXT NOT NULL,
  merkle_root TEXT,
  anchor_txid TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.payment_rds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL DEFAULT get_current_user_tenant_id(),
  campaign_id UUID REFERENCES public.ad_campaigns(id),
  payment_type TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  payment_inputs_hash TEXT NOT NULL,
  authorization_hash TEXT NOT NULL,
  payment_processor_response JSONB,
  sha256 TEXT NOT NULL,
  merkle_root TEXT,
  anchor_txid TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.platform_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL DEFAULT get_current_user_tenant_id(),
  ad_id UUID REFERENCES public.ads(id),
  campaign_id UUID REFERENCES public.ad_campaigns(id),
  platform ad_platform NOT NULL,
  operation TEXT NOT NULL,
  status TEXT NOT NULL,
  platform_message TEXT,
  error_code TEXT,
  error_details JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4) RLS enable
ALTER TABLE public.creatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.io_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creative_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_rds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.io_rds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_rds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_responses ENABLE ROW LEVEL SECURITY;

-- 5) Policies
CREATE POLICY "Tenant users can view creatives" ON public.creatives FOR SELECT
  USING (tenant_id = get_current_user_tenant_id());
CREATE POLICY "Marketing managers can manage creatives" ON public.creatives FOR ALL
  USING (tenant_id = get_current_user_tenant_id() AND validate_user_role_access(ARRAY['marketing_manager','admin'], 'creative', id));

CREATE POLICY "Tenant users can view ad accounts" ON public.ad_accounts FOR SELECT
  USING (tenant_id = get_current_user_tenant_id());
CREATE POLICY "Marketing managers can manage ad accounts" ON public.ad_accounts FOR ALL
  USING (tenant_id = get_current_user_tenant_id() AND validate_user_role_access(ARRAY['marketing_manager','admin'], 'ad_account', id));

CREATE POLICY "Tenant users can view campaigns" ON public.ad_campaigns FOR SELECT
  USING (tenant_id = get_current_user_tenant_id());
CREATE POLICY "Marketing managers can manage campaigns" ON public.ad_campaigns FOR ALL
  USING (tenant_id = get_current_user_tenant_id() AND validate_user_role_access(ARRAY['marketing_manager','admin'], 'campaign', id));

CREATE POLICY "Users can view ad sets for their campaigns" ON public.ad_sets FOR SELECT
  USING (campaign_id IN (SELECT id FROM public.ad_campaigns WHERE tenant_id = get_current_user_tenant_id()));
CREATE POLICY "Marketing managers can manage ad sets" ON public.ad_sets FOR ALL
  USING (campaign_id IN (SELECT id FROM public.ad_campaigns WHERE tenant_id = get_current_user_tenant_id() AND validate_user_role_access(ARRAY['marketing_manager','admin'], 'campaign', id)));

CREATE POLICY "Users can view ads for their campaigns" ON public.ads FOR SELECT
  USING (adset_id IN (SELECT id FROM public.ad_sets WHERE campaign_id IN (SELECT id FROM public.ad_campaigns WHERE tenant_id = get_current_user_tenant_id())));
CREATE POLICY "Marketing managers can manage ads" ON public.ads FOR ALL
  USING (adset_id IN (SELECT id FROM public.ad_sets WHERE campaign_id IN (SELECT id FROM public.ad_campaigns WHERE tenant_id = get_current_user_tenant_id() AND validate_user_role_access(ARRAY['marketing_manager','admin'], 'campaign', id))));

CREATE POLICY "Tenant users can view IO allocations" ON public.io_allocations FOR SELECT
  USING (tenant_id = get_current_user_tenant_id());
CREATE POLICY "CFO and admins can manage IO allocations" ON public.io_allocations FOR ALL
  USING (tenant_id = get_current_user_tenant_id() AND validate_user_role_access(ARRAY['cfo','marketing_manager','admin'], 'budget', id));

CREATE POLICY "Tenant users can view experiments" ON public.experiments FOR SELECT
  USING (tenant_id = get_current_user_tenant_id());
CREATE POLICY "Marketing and data roles can manage experiments" ON public.experiments FOR ALL
  USING (tenant_id = get_current_user_tenant_id() AND validate_user_role_access(ARRAY['marketing_manager','data_analyst','admin'], 'experiment', id));

CREATE POLICY "Tenant users can view metrics" ON public.metrics_daily FOR SELECT
  USING (tenant_id = get_current_user_tenant_id());
CREATE POLICY "System can insert metrics" ON public.metrics_daily FOR INSERT
  WITH CHECK (auth.role() = 'service_role' OR validate_user_role_access(ARRAY['marketing_manager','admin'], 'metrics', NULL));

CREATE POLICY "Users can view approvals for their creatives" ON public.creative_approvals FOR SELECT
  USING (creative_id IN (SELECT id FROM public.creatives WHERE tenant_id = get_current_user_tenant_id()));
CREATE POLICY "Compliance officers can manage approvals" ON public.creative_approvals FOR ALL
  USING (validate_user_role_access(ARRAY['compliance_officer','marketing_manager','admin'], 'approval', id));

CREATE POLICY "Tenant users can view ad RDS" ON public.ad_rds FOR SELECT
  USING (tenant_id = get_current_user_tenant_id());
CREATE POLICY "System can insert ad RDS" ON public.ad_rds FOR INSERT
  WITH CHECK (auth.role() = 'service_role' OR validate_user_role_access(ARRAY['admin'], 'audit', NULL));

CREATE POLICY "Tenant users can view IO RDS" ON public.io_rds FOR SELECT
  USING (tenant_id = get_current_user_tenant_id());
CREATE POLICY "System can insert IO RDS" ON public.io_rds FOR INSERT
  WITH CHECK (auth.role() = 'service_role' OR validate_user_role_access(ARRAY['admin'], 'audit', NULL));

CREATE POLICY "Tenant users can view payment RDS" ON public.payment_rds FOR SELECT
  USING (tenant_id = get_current_user_tenant_id());
CREATE POLICY "System can insert payment RDS" ON public.payment_rds FOR INSERT
  WITH CHECK (auth.role() = 'service_role' OR validate_user_role_access(ARRAY['admin'], 'audit', NULL));

CREATE POLICY "Tenant users can view platform responses" ON public.platform_responses FOR SELECT
  USING (tenant_id = get_current_user_tenant_id());
CREATE POLICY "System can manage platform responses" ON public.platform_responses FOR ALL
  USING (auth.role() = 'service_role' OR validate_user_role_access(ARRAY['marketing_manager','admin'], 'platform', id));

-- 6) Indexes
CREATE INDEX idx_creatives_tenant_status ON public.creatives(tenant_id, approval_status);
CREATE INDEX idx_creatives_offer ON public.creatives(offer_id);
CREATE INDEX idx_ad_campaigns_tenant_status ON public.ad_campaigns(tenant_id, status);
CREATE INDEX idx_ad_campaigns_dates ON public.ad_campaigns(start_date, end_date);
CREATE INDEX idx_ads_creative ON public.ads(creative_id);
CREATE INDEX idx_metrics_daily_date ON public.metrics_daily(date DESC);
CREATE INDEX idx_metrics_daily_campaign ON public.metrics_daily(campaign_id, date DESC);
CREATE INDEX idx_metrics_daily_platform ON public.metrics_daily(platform, date DESC);
CREATE INDEX idx_io_allocations_dates ON public.io_allocations(start_date, end_date);
CREATE INDEX idx_experiments_status ON public.experiments(status, start_date);
CREATE INDEX idx_creative_approvals_creative ON public.creative_approvals(creative_id, approval_type);
CREATE INDEX idx_platform_responses_status ON public.platform_responses(status, created_at DESC);

-- 7) Triggers & helper functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;$$ LANGUAGE plpgsql;

CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON public.offers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_creatives_updated_at BEFORE UPDATE ON public.creatives
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ad_accounts_updated_at BEFORE UPDATE ON public.ad_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ad_campaigns_updated_at BEFORE UPDATE ON public.ad_campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ad_sets_updated_at BEFORE UPDATE ON public.ad_sets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ads_updated_at BEFORE UPDATE ON public.ads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_io_allocations_updated_at BEFORE UPDATE ON public.io_allocations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_experiments_updated_at BEFORE UPDATE ON public.experiments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Hash utilities
CREATE OR REPLACE FUNCTION calculate_creative_artifact_hash(creative_data JSONB)
RETURNS TEXT
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  RETURN encode(digest(creative_data::TEXT, 'sha256'), 'hex');
END;$$;

CREATE OR REPLACE FUNCTION validate_creative_approval(p_creative_id UUID, p_approval_type approval_type)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE approval_count INT; required_count INT; BEGIN
  SELECT COUNT(*) INTO approval_count FROM public.creative_approvals
   WHERE creative_id = p_creative_id AND approval_type = p_approval_type AND status = 'approved';
  required_count := CASE WHEN p_approval_type = 'financial_promotion' THEN 2 ELSE 1 END;
  RETURN approval_count >= required_count; END;$$;

CREATE OR REPLACE FUNCTION can_publish_creative(p_creative_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE c RECORD; ok_creative BOOLEAN; ok_compliance BOOLEAN; ok_financial BOOLEAN; BEGIN
  SELECT * INTO c FROM public.creatives WHERE id = p_creative_id; IF c IS NULL THEN RETURN FALSE; END IF;
  IF c.authenticity_score < 0.9 THEN RETURN FALSE; END IF;
  SELECT validate_creative_approval(p_creative_id, 'creative') INTO ok_creative;
  SELECT validate_creative_approval(p_creative_id, 'compliance') INTO ok_compliance;
  SELECT validate_creative_approval(p_creative_id, 'financial_promotion') INTO ok_financial;
  RETURN ok_creative AND ok_compliance AND (ok_financial OR NOT EXISTS (
    SELECT 1 FROM public.creative_approvals WHERE creative_id = p_creative_id AND approval_type = 'financial_promotion')); END;$$;

CREATE OR REPLACE FUNCTION emit_ad_rds(p_ad_id UUID, p_inputs JSONB, p_approvals JSONB, p_policy_hash TEXT, p_explanation JSONB DEFAULT '{}')
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_id UUID; v_inputs_hash TEXT; v_approval_hash TEXT; v_rds JSONB; v_sha TEXT; BEGIN
  v_inputs_hash := encode(digest(p_inputs::TEXT, 'sha256'), 'hex');
  v_approval_hash := encode(digest(p_approvals::TEXT, 'sha256'), 'hex');
  v_rds := jsonb_build_object('ad_id', p_ad_id, 'inputs_hash', v_inputs_hash, 'approval_hash', v_approval_hash, 'policy_hash', p_policy_hash, 'explanation', p_explanation, 'timestamp', extract(epoch from now()));
  v_sha := encode(digest(v_rds::TEXT, 'sha256'), 'hex');
  INSERT INTO public.ad_rds (ad_id, inputs_hash, approval_hash, policy_hash, explanation_json, sha256)
  VALUES (p_ad_id, v_inputs_hash, v_approval_hash, p_policy_hash, p_explanation, v_sha) RETURNING id INTO v_id; RETURN v_id; END;$$;

CREATE OR REPLACE FUNCTION emit_io_rds(p_allocation_id UUID, p_budget_inputs JSONB, p_algorithm TEXT, p_constraints JSONB, p_result JSONB)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_id UUID; v_budget_hash TEXT; v_constraints_hash TEXT; v_rds JSONB; v_sha TEXT; BEGIN
  v_budget_hash := encode(digest(p_budget_inputs::TEXT, 'sha256'), 'hex');
  v_constraints_hash := encode(digest(p_constraints::TEXT, 'sha256'), 'hex');
  v_rds := jsonb_build_object('allocation_id', p_allocation_id, 'budget_inputs_hash', v_budget_hash, 'algorithm', p_algorithm, 'constraints_hash', v_constraints_hash, 'result', p_result, 'timestamp', extract(epoch from now()));
  v_sha := encode(digest(v_rds::TEXT, 'sha256'), 'hex');
  INSERT INTO public.io_rds (allocation_id, budget_inputs_hash, allocation_algorithm, constraints_hash, allocation_result, sha256)
  VALUES (p_allocation_id, v_budget_hash, p_algorithm, v_constraints_hash, p_result, v_sha) RETURNING id INTO v_id; RETURN v_id; END;$$;

CREATE OR REPLACE FUNCTION emit_payment_rds(p_campaign_id UUID, p_payment_type TEXT, p_amount NUMERIC, p_inputs JSONB, p_authorization JSONB, p_processor_response JSONB DEFAULT '{}')
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_id UUID; v_inputs_hash TEXT; v_auth_hash TEXT; v_rds JSONB; v_sha TEXT; BEGIN
  v_inputs_hash := encode(digest(p_inputs::TEXT, 'sha256'), 'hex');
  v_auth_hash := encode(digest(p_authorization::TEXT, 'sha256'), 'hex');
  v_rds := jsonb_build_object('campaign_id', p_campaign_id, 'payment_type', p_payment_type, 'amount', p_amount, 'inputs_hash', v_inputs_hash, 'authorization_hash', v_auth_hash, 'processor_response', p_processor_response, 'timestamp', extract(epoch from now()));
  v_sha := encode(digest(v_rds::TEXT, 'sha256'), 'hex');
  INSERT INTO public.payment_rds (campaign_id, payment_type, amount, payment_inputs_hash, authorization_hash, payment_processor_response, sha256)
  VALUES (p_campaign_id, p_payment_type, p_amount, v_inputs_hash, v_auth_hash, p_processor_response, v_sha) RETURNING id INTO v_id; RETURN v_id; END;$$;

-- 8) Artifact hash trigger
CREATE OR REPLACE FUNCTION update_creative_artifact_hash()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE j JSONB; BEGIN
  j := jsonb_build_object('creative_type', NEW.creative_type, 'name', NEW.name, 'url_or_blob', NEW.url_or_blob, 'asset_metadata', NEW.asset_metadata, 'disclosures_json', NEW.disclosures_json, 'provenance_json', NEW.provenance_json);
  NEW.artifact_hash := calculate_creative_artifact_hash(j);
  NEW.updated_at := now(); RETURN NEW; END;$$;
CREATE TRIGGER trg_update_creative_artifact_hash BEFORE INSERT OR UPDATE ON public.creatives FOR EACH ROW EXECUTE FUNCTION update_creative_artifact_hash();