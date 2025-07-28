-- Phase 3: Advanced Analytics, Compliance, and KYC Tables (Fixed)

-- Analytics aggregation tables
CREATE TABLE public.lending_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  metric_type TEXT NOT NULL, -- 'daily', 'weekly', 'monthly'
  loan_volume INTEGER DEFAULT 0,
  total_loan_amount NUMERIC DEFAULT 0,
  avg_approval_time_hours NUMERIC DEFAULT 0,
  conversion_rate NUMERIC DEFAULT 0,
  partner_performance JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Lead routing and optimization
CREATE TABLE public.lead_routing_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  rule_name TEXT NOT NULL,
  criteria JSONB NOT NULL, -- loan amount, credit score, purpose, etc.
  preferred_partners UUID[], -- ordered by preference
  weight_score NUMERIC DEFAULT 1.0,
  is_active BOOLEAN DEFAULT true,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Lead routing decisions log
CREATE TABLE public.lead_routing_decisions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  loan_request_id UUID NOT NULL,
  rule_id UUID,
  recommended_partner_id UUID,
  score NUMERIC,
  reasoning JSONB,
  decision_factors JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- KYC verification workflows
CREATE TABLE public.kyc_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL, -- 'client', 'partner'
  entity_id UUID NOT NULL,
  verification_type TEXT NOT NULL, -- 'identity', 'address', 'income', 'business'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'verified', 'failed', 'expired'
  provider TEXT, -- 'manual', 'jumio', 'onfido', etc.
  verification_data JSONB,
  risk_score NUMERIC,
  verified_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  retry_count INTEGER DEFAULT 0,
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- API integration configurations
CREATE TABLE public.api_integration_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  integration_name TEXT NOT NULL, -- 'rocket_mortgage', 'experian', 'docusign'
  integration_type TEXT NOT NULL, -- 'lending', 'credit_bureau', 'document_signing'
  config_data JSONB NOT NULL,
  api_endpoints JSONB,
  authentication_method TEXT, -- 'api_key', 'oauth2', 'certificate'
  credentials_encrypted TEXT,
  rate_limits JSONB,
  is_sandbox BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT false,
  last_health_check TIMESTAMP WITH TIME ZONE,
  health_status TEXT DEFAULT 'unknown',
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Partner performance metrics
CREATE TABLE public.partner_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID NOT NULL,
  metric_period DATE NOT NULL,
  loans_received INTEGER DEFAULT 0,
  loans_approved INTEGER DEFAULT 0,
  loans_funded INTEGER DEFAULT 0,
  avg_approval_time_hours NUMERIC DEFAULT 0,
  avg_funding_time_hours NUMERIC DEFAULT 0,
  approval_rate NUMERIC DEFAULT 0,
  funding_rate NUMERIC DEFAULT 0,
  client_satisfaction_score NUMERIC DEFAULT 0,
  total_volume NUMERIC DEFAULT 0,
  calculated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.lending_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_routing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_routing_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_integration_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lending_analytics
CREATE POLICY "Tenant users can view analytics in their tenant" 
ON public.lending_analytics 
FOR SELECT 
USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Admins can manage analytics" 
ON public.lending_analytics 
FOR ALL 
USING (has_any_role(ARRAY['admin', 'tenant_admin', 'system_administrator']));

-- RLS Policies for lead_routing_rules
CREATE POLICY "Tenant admins can manage routing rules" 
ON public.lead_routing_rules 
FOR ALL 
USING ((tenant_id = get_current_user_tenant_id()) AND has_any_role(ARRAY['admin', 'tenant_admin']));

-- RLS Policies for lead_routing_decisions
CREATE POLICY "Users can view routing decisions for their loans" 
ON public.lead_routing_decisions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM loan_requests lr 
    WHERE lr.id = lead_routing_decisions.loan_request_id 
    AND lr.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all routing decisions" 
ON public.lead_routing_decisions 
FOR SELECT 
USING (has_any_role(ARRAY['admin', 'tenant_admin', 'system_administrator']));

-- RLS Policies for kyc_verifications
CREATE POLICY "Users can view their own KYC verifications" 
ON public.kyc_verifications 
FOR SELECT 
USING (
  (entity_type = 'client' AND entity_id = auth.uid()) OR
  has_any_role(ARRAY['admin', 'tenant_admin', 'system_administrator'])
);

CREATE POLICY "Admins can manage KYC verifications" 
ON public.kyc_verifications 
FOR ALL 
USING (has_any_role(ARRAY['admin', 'tenant_admin', 'system_administrator']));

-- RLS Policies for api_integration_configs
CREATE POLICY "Tenant admins can manage API integrations" 
ON public.api_integration_configs 
FOR ALL 
USING ((tenant_id = get_current_user_tenant_id()) AND has_any_role(ARRAY['admin', 'tenant_admin']));

-- RLS Policies for partner_metrics
CREATE POLICY "Partners can view their own metrics" 
ON public.partner_metrics 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM lending_partners lp 
    WHERE lp.id = partner_metrics.partner_id 
    AND lp.contact_info->>'email' = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

CREATE POLICY "Admins can view all partner metrics" 
ON public.partner_metrics 
FOR SELECT 
USING (has_any_role(ARRAY['admin', 'tenant_admin', 'system_administrator']));

-- Create indexes for performance
CREATE INDEX idx_lending_analytics_tenant_period ON public.lending_analytics(tenant_id, period_start, period_end);
CREATE INDEX idx_lead_routing_rules_tenant ON public.lead_routing_rules(tenant_id, is_active);
CREATE INDEX idx_lead_routing_decisions_loan ON public.lead_routing_decisions(loan_request_id);
CREATE INDEX idx_kyc_verifications_entity ON public.kyc_verifications(entity_type, entity_id);
CREATE INDEX idx_partner_metrics_partner_period ON public.partner_metrics(partner_id, metric_period);

-- Add update triggers
CREATE TRIGGER update_lending_analytics_updated_at
  BEFORE UPDATE ON public.lending_analytics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lead_routing_rules_updated_at
  BEFORE UPDATE ON public.lead_routing_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_kyc_verifications_updated_at
  BEFORE UPDATE ON public.kyc_verifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_api_integration_configs_updated_at
  BEFORE UPDATE ON public.api_integration_configs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for real-time updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.lending_analytics;
ALTER PUBLICATION supabase_realtime ADD TABLE public.lead_routing_decisions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.kyc_verifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.partner_metrics;

-- Set replica identity for realtime
ALTER TABLE public.lending_analytics REPLICA IDENTITY FULL;
ALTER TABLE public.lead_routing_decisions REPLICA IDENTITY FULL;
ALTER TABLE public.kyc_verifications REPLICA IDENTITY FULL;
ALTER TABLE public.partner_metrics REPLICA IDENTITY FULL;