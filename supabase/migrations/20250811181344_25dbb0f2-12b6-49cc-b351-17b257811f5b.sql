-- =====================================================================
-- NIL Core Tables Migration
-- Creates NIL-specific tables with tenant isolation and RLS
-- =====================================================================

-- Create NIL-specific enums
DO $$ BEGIN
  CREATE TYPE public.nil_party_type AS ENUM ('athlete', 'brand', 'agency', 'institution', 'advisor');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN  
  CREATE TYPE public.nil_eligibility_status AS ENUM ('eligible', 'ineligible', 'pending', 'suspended');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.nil_deal_status AS ENUM ('draft', 'active', 'completed', 'cancelled', 'disputed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.nil_deliverable_status AS ENUM ('pending', 'in_progress', 'submitted', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.nil_event_type AS ENUM ('content_upload', 'authenticity_verification', 'compliance_check', 'payout_processed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.nil_payout_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'disputed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- NIL Parties table
CREATE TABLE IF NOT EXISTS public.nil_parties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  party_type public.nil_party_type NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  verification_status TEXT DEFAULT 'pending',
  kyc_data JSONB DEFAULT '{}',
  social_media_handles JSONB DEFAULT '{}',
  legal_documents JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- NIL Eligibility table  
CREATE TABLE IF NOT EXISTS public.nil_eligibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  athlete_id UUID NOT NULL REFERENCES public.nil_parties(id) ON DELETE CASCADE,
  institution TEXT NOT NULL,
  sport TEXT NOT NULL,
  eligibility_status public.nil_eligibility_status NOT NULL DEFAULT 'pending',
  ncaa_compliance JSONB DEFAULT '{}',
  state_regulations JSONB DEFAULT '{}',
  last_verified_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  verification_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- NIL Deals table
CREATE TABLE IF NOT EXISTS public.nil_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  athlete_id UUID NOT NULL REFERENCES public.nil_parties(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES public.nil_parties(id) ON DELETE CASCADE,
  deal_title TEXT NOT NULL,
  deal_description TEXT,
  deal_value NUMERIC(12,2),
  deal_status public.nil_deal_status NOT NULL DEFAULT 'draft',
  contract_terms JSONB DEFAULT '{}',
  deliverables_count INTEGER DEFAULT 0,
  start_date DATE,
  end_date DATE,
  compliance_approved BOOLEAN DEFAULT false,
  smart_contract_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- NIL Deliverables table
CREATE TABLE IF NOT EXISTS public.nil_deliverables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  deal_id UUID NOT NULL REFERENCES public.nil_deals(id) ON DELETE CASCADE,
  deliverable_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  requirements JSONB DEFAULT '{}',
  deliverable_status public.nil_deliverable_status NOT NULL DEFAULT 'pending',
  content_hash TEXT,
  watermark_id TEXT,
  authenticity_score NUMERIC(4,3),
  submitted_content JSONB DEFAULT '{}',
  review_notes TEXT,
  due_date DATE,
  submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- NIL Events table  
CREATE TABLE IF NOT EXISTS public.nil_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  event_type public.nil_event_type NOT NULL,
  deal_id UUID REFERENCES public.nil_deals(id) ON DELETE SET NULL,
  deliverable_id UUID REFERENCES public.nil_deliverables(id) ON DELETE SET NULL,
  party_id UUID REFERENCES public.nil_parties(id) ON DELETE SET NULL,
  event_data JSONB DEFAULT '{}',
  authenticity_score NUMERIC(4,3),
  content_hash TEXT,
  watermark_id TEXT,
  zk_receipt TEXT,
  merkle_root TEXT,
  chain_anchor_tx TEXT,
  verification_metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- NIL Payouts table
CREATE TABLE IF NOT EXISTS public.nil_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  deal_id UUID NOT NULL REFERENCES public.nil_deals(id) ON DELETE CASCADE,
  athlete_id UUID NOT NULL REFERENCES public.nil_parties(id) ON DELETE CASCADE,
  payout_amount NUMERIC(12,2) NOT NULL,
  payout_status public.nil_payout_status NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  transaction_hash TEXT,
  payout_date DATE,
  tax_withholding NUMERIC(12,2) DEFAULT 0,
  fees NUMERIC(12,2) DEFAULT 0,
  net_amount NUMERIC(12,2),
  compliance_checks JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- NIL Compliance Snapshots table
CREATE TABLE IF NOT EXISTS public.nil_compliance_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  athlete_id UUID NOT NULL REFERENCES public.nil_parties(id) ON DELETE CASCADE,
  snapshot_date DATE NOT NULL,
  ncaa_status TEXT,
  state_compliance JSONB DEFAULT '{}',
  active_deals_count INTEGER DEFAULT 0,
  total_earnings NUMERIC(12,2) DEFAULT 0,
  compliance_score NUMERIC(4,3),
  violations JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_nil_parties_tenant_id ON public.nil_parties(tenant_id);
CREATE INDEX IF NOT EXISTS idx_nil_parties_type ON public.nil_parties(party_type);
CREATE INDEX IF NOT EXISTS idx_nil_eligibility_tenant_id ON public.nil_eligibility(tenant_id);
CREATE INDEX IF NOT EXISTS idx_nil_eligibility_athlete ON public.nil_eligibility(athlete_id);
CREATE INDEX IF NOT EXISTS idx_nil_deals_tenant_id ON public.nil_deals(tenant_id);
CREATE INDEX IF NOT EXISTS idx_nil_deals_athlete ON public.nil_deals(athlete_id);
CREATE INDEX IF NOT EXISTS idx_nil_deals_brand ON public.nil_deals(brand_id);
CREATE INDEX IF NOT EXISTS idx_nil_deliverables_tenant_id ON public.nil_deliverables(tenant_id);
CREATE INDEX IF NOT EXISTS idx_nil_deliverables_deal_id ON public.nil_deliverables(deal_id);
CREATE INDEX IF NOT EXISTS idx_nil_events_tenant_id ON public.nil_events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_nil_events_deal_id ON public.nil_events(deal_id);
CREATE INDEX IF NOT EXISTS idx_nil_events_deliverable_id ON public.nil_events(deliverable_id);
CREATE INDEX IF NOT EXISTS idx_nil_payouts_tenant_id ON public.nil_payouts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_nil_payouts_deal_id ON public.nil_payouts(deal_id);
CREATE INDEX IF NOT EXISTS idx_nil_compliance_tenant_id ON public.nil_compliance_snapshots(tenant_id);
CREATE INDEX IF NOT EXISTS idx_nil_compliance_athlete ON public.nil_compliance_snapshots(athlete_id);

-- Enable RLS on all NIL tables
ALTER TABLE public.nil_parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nil_eligibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nil_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nil_deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nil_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nil_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nil_compliance_snapshots ENABLE ROW LEVEL SECURITY;

-- Create triggers for auto-fill tenant_id from JWT
DO $$
DECLARE
  table_names TEXT[] := ARRAY[
    'nil_parties',
    'nil_eligibility', 
    'nil_deals',
    'nil_deliverables',
    'nil_events',
    'nil_payouts',
    'nil_compliance_snapshots'
  ];
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY table_names
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS set_tenant_id_%I ON public.%I;
      CREATE TRIGGER set_tenant_id_%I
      BEFORE INSERT OR UPDATE ON public.%I
      FOR EACH ROW EXECUTE FUNCTION app.set_tenant_id();
    ', tbl, tbl, tbl, tbl);
  END LOOP;
END $$;

-- Bootstrap RLS policies (permissive during migration)
DO $$
DECLARE
  table_names TEXT[] := ARRAY[
    'nil_parties',
    'nil_eligibility',
    'nil_deals', 
    'nil_deliverables',
    'nil_events',
    'nil_payouts',
    'nil_compliance_snapshots'
  ];
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY table_names
  LOOP
    EXECUTE format('
      DROP POLICY IF EXISTS p_%s_rw ON public.%s;
      CREATE POLICY p_%s_rw ON public.%s
      USING (tenant_id IS NULL OR tenant_id = app.jwt_tenant_id())
      WITH CHECK (tenant_id IS NULL OR tenant_id = app.jwt_tenant_id());
    ', tbl, tbl, tbl, tbl);
  END LOOP;
END $$;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_nil_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add updated_at triggers to tables that have updated_at columns
DROP TRIGGER IF EXISTS update_nil_parties_updated_at ON public.nil_parties;
CREATE TRIGGER update_nil_parties_updated_at
  BEFORE UPDATE ON public.nil_parties
  FOR EACH ROW EXECUTE FUNCTION public.update_nil_updated_at();

DROP TRIGGER IF EXISTS update_nil_eligibility_updated_at ON public.nil_eligibility;
CREATE TRIGGER update_nil_eligibility_updated_at
  BEFORE UPDATE ON public.nil_eligibility  
  FOR EACH ROW EXECUTE FUNCTION public.update_nil_updated_at();

DROP TRIGGER IF EXISTS update_nil_deals_updated_at ON public.nil_deals;
CREATE TRIGGER update_nil_deals_updated_at
  BEFORE UPDATE ON public.nil_deals
  FOR EACH ROW EXECUTE FUNCTION public.update_nil_updated_at();

DROP TRIGGER IF EXISTS update_nil_deliverables_updated_at ON public.nil_deliverables;
CREATE TRIGGER update_nil_deliverables_updated_at
  BEFORE UPDATE ON public.nil_deliverables
  FOR EACH ROW EXECUTE FUNCTION public.update_nil_updated_at();

DROP TRIGGER IF EXISTS update_nil_payouts_updated_at ON public.nil_payouts;
CREATE TRIGGER update_nil_payouts_updated_at
  BEFORE UPDATE ON public.nil_payouts
  FOR EACH ROW EXECUTE FUNCTION public.update_nil_updated_at();