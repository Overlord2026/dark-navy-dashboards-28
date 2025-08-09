-- AI Marketing Engine Core Tables
-- NOTE: This migration is deferred - do not execute yet

-- Create marketing campaigns table
CREATE TABLE public.marketing_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  persona TEXT NOT NULL,
  objective TEXT NOT NULL,
  geo_targeting TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft',
  version_hash TEXT NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  total_budget NUMERIC(10,2) NOT NULL DEFAULT 0,
  daily_budget NUMERIC(10,2) NOT NULL DEFAULT 0,
  start_date DATE,
  end_date DATE,
  metadata JSONB DEFAULT '{}'
);

-- Create marketing creatives table
CREATE TABLE public.marketing_creatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.marketing_campaigns(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  headline TEXT NOT NULL,
  description TEXT,
  call_to_action TEXT,
  copy JSONB NOT NULL DEFAULT '{}',
  assets JSONB DEFAULT '{}',
  approved_version BOOLEAN DEFAULT false,
  compliance_findings JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create marketing approvals table
CREATE TABLE public.marketing_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.marketing_campaigns(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  approver_id UUID NOT NULL,
  decision TEXT NOT NULL CHECK (decision IN ('approved', 'rejected', 'changes_requested')),
  comment TEXT NOT NULL,
  decided_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create marketing audit logs table
CREATE TABLE public.marketing_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.marketing_campaigns(id) ON DELETE CASCADE,
  event TEXT NOT NULL,
  payload JSONB DEFAULT '{}',
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID NOT NULL,
  user_role TEXT NOT NULL
);

-- Create marketing spend snapshots table
CREATE TABLE public.marketing_spend_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.marketing_campaigns(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  metrics JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create marketing settings table
CREATE TABLE public.marketing_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data JSONB NOT NULL DEFAULT '{}',
  updated_by UUID NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_marketing_campaigns_status ON public.marketing_campaigns(status);
CREATE INDEX idx_marketing_campaigns_persona ON public.marketing_campaigns(persona);
CREATE INDEX idx_marketing_campaigns_created_by ON public.marketing_campaigns(created_by);
CREATE INDEX idx_marketing_creatives_campaign_id ON public.marketing_creatives(campaign_id);
CREATE INDEX idx_marketing_creatives_channel ON public.marketing_creatives(channel);
CREATE INDEX idx_marketing_approvals_campaign_id ON public.marketing_approvals(campaign_id);
CREATE INDEX idx_marketing_audit_logs_campaign_id ON public.marketing_audit_logs(campaign_id);
CREATE INDEX idx_marketing_spend_snapshots_campaign_id ON public.marketing_spend_snapshots(campaign_id);
CREATE INDEX idx_marketing_spend_snapshots_date ON public.marketing_spend_snapshots(date);

-- Enable RLS on all tables
ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_creatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_spend_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_settings ENABLE ROW LEVEL SECURITY;