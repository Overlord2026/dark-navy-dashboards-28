-- Enhance leads table with enrichment and Plaid data
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS enrichment_data JSONB DEFAULT '{}';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS catchlight_score INTEGER;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS catchlight_confidence NUMERIC(5,2);
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS enrichment_status TEXT DEFAULT 'pending';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS plaid_verified_data JSONB DEFAULT '{}';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS verified_net_worth NUMERIC;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS plaid_consent_given BOOLEAN DEFAULT FALSE;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS plaid_verification_status TEXT DEFAULT 'not_requested';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS auto_assigned BOOLEAN DEFAULT FALSE;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS assignment_reason TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS enrichment_requested_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS enrichment_completed_at TIMESTAMP WITH TIME ZONE;

-- Create lead routing rules table
CREATE TABLE IF NOT EXISTS public.lead_routing_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  rule_name TEXT NOT NULL,
  rule_priority INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  conditions JSONB NOT NULL DEFAULT '{}',
  actions JSONB NOT NULL DEFAULT '{}',
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lead enrichment log table
CREATE TABLE IF NOT EXISTS public.lead_enrichment_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  enrichment_type TEXT NOT NULL,
  provider TEXT NOT NULL,
  status TEXT NOT NULL,
  request_data JSONB DEFAULT '{}',
  response_data JSONB DEFAULT '{}',
  error_message TEXT,
  processing_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lead scoring analytics table
CREATE TABLE IF NOT EXISTS public.lead_scoring_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  analytics_date DATE NOT NULL,
  total_leads INTEGER DEFAULT 0,
  enriched_leads INTEGER DEFAULT 0,
  high_score_leads INTEGER DEFAULT 0,
  plaid_verified_leads INTEGER DEFAULT 0,
  auto_assigned_leads INTEGER DEFAULT 0,
  conversion_by_score JSONB DEFAULT '{}',
  avg_enrichment_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.lead_routing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_enrichment_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_scoring_analytics ENABLE ROW LEVEL SECURITY;