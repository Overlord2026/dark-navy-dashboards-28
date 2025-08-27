-- ===================== BFO OPS FIX PACK v2 - CORRECTED =====================
-- 1) Extensions (uuid + crypto)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ===================== 2) Tables (IF NOT EXISTS) =====================

-- 1) Micro-sites
CREATE TABLE IF NOT EXISTS public.iar_sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  iar_id UUID NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  theme JSONB NOT NULL DEFAULT '{}'::jsonb,
  sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  disclosures JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft',
  version TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.iar_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES public.iar_sites(id) ON DELETE CASCADE,
  path TEXT NOT NULL,
  blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2) Revenue share
CREATE TABLE IF NOT EXISTS public.rev_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  iar_id UUID NOT NULL,
  product TEXT NOT NULL,
  basis TEXT NOT NULL,
  split_pct NUMERIC NOT NULL,
  tiers JSONB NOT NULL DEFAULT '[]'::jsonb,
  eff_from DATE NOT NULL,
  eff_through DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.rev_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period DATE NOT NULL,
  iar_id UUID NOT NULL,
  household_id UUID NOT NULL,
  product TEXT NOT NULL,
  gross_cents BIGINT NOT NULL,
  split_cents BIGINT NOT NULL,
  net_cents BIGINT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  payout_id UUID,
  reasons JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.rev_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id TEXT NOT NULL,
  method TEXT NOT NULL,
  pay_date DATE NOT NULL,
  total_cents BIGINT NOT NULL,
  notes JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- 3) Automations
CREATE TABLE IF NOT EXISTS public.automations (
  key TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  inputs JSONB NOT NULL DEFAULT '{}'::jsonb,
  enabled BOOLEAN NOT NULL DEFAULT FALSE,
  price_cents INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.automation_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL,
  household_id UUID NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  status TEXT NOT NULL,
  explain JSONB NOT NULL DEFAULT '{}'::jsonb,
  attestation_hash TEXT
);

-- 4) Advisor transition (negative consent)
CREATE TABLE IF NOT EXISTS public.transitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advisor_id UUID NOT NULL,
  custodian TEXT NOT NULL,
  start_date DATE NOT NULL,
  consent_deadline DATE NOT NULL,
  policy_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.transition_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transition_id UUID NOT NULL REFERENCES public.transitions(id) ON DELETE CASCADE,
  household_id UUID NOT NULL,
  source_custodian TEXT NOT NULL,
  target_platform TEXT NOT NULL,
  keep_number BOOLEAN NOT NULL DEFAULT TRUE,
  status TEXT NOT NULL DEFAULT 'pending',
  last_event_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.transition_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transition_id UUID NOT NULL REFERENCES public.transitions(id) ON DELETE CASCADE,
  household_id UUID NOT NULL,
  email_hash TEXT NOT NULL,
  first_sent_at TIMESTAMPTZ,
  last_sent_at TIMESTAMPTZ,
  sends_count INTEGER NOT NULL DEFAULT 0,
  opened_count INTEGER NOT NULL DEFAULT 0,
  clicked_count INTEGER NOT NULL DEFAULT 0,
  opted_out BOOLEAN NOT NULL DEFAULT FALSE,
  bounced BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'pending',
  suppression_reason TEXT
);

CREATE TABLE IF NOT EXISTS public.transition_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transition_id UUID NOT NULL REFERENCES public.transitions(id) ON DELETE CASCADE,
  step TEXT NOT NULL,
  template_key TEXT NOT NULL,
  subject_tpl TEXT NOT NULL,
  body_tpl_md TEXT NOT NULL,
  from_name TEXT NOT NULL,
  from_email TEXT NOT NULL,
  reply_to TEXT,
  footer_disclaimer_md TEXT,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.transition_email_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transition_id UUID NOT NULL REFERENCES public.transitions(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES public.transition_contacts(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  send_after TIMESTAMPTZ NOT NULL,
  token_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.transition_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transition_id UUID NOT NULL REFERENCES public.transitions(id) ON DELETE CASCADE,
  contact_id UUID,
  event TEXT NOT NULL,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  ts TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5) Advisor due diligence
CREATE TABLE IF NOT EXISTS public.diligence_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advisor_name TEXT NOT NULL,
  crd TEXT,
  iard TEXT,
  sources JSONB NOT NULL DEFAULT '{}'::jsonb,
  score NUMERIC,
  flags JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.diligence_artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.diligence_cases(id) ON DELETE CASCADE,
  artifact_hash TEXT NOT NULL,
  kind TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Shared Vault objects
CREATE TABLE IF NOT EXISTS public.vault_objects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  object_hash TEXT UNIQUE NOT NULL,
  kind TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===================== 3) Indexes (IF NOT EXISTS) =====================
CREATE INDEX IF NOT EXISTS idx_iar_sites_iar_id ON public.iar_sites(iar_id);
CREATE INDEX IF NOT EXISTS idx_iar_sites_slug ON public.iar_sites(slug);
CREATE INDEX IF NOT EXISTS idx_rev_ledger_period ON public.rev_ledger(period);
CREATE INDEX IF NOT EXISTS idx_rev_ledger_iar_id ON public.rev_ledger(iar_id);
CREATE INDEX IF NOT EXISTS idx_automation_runs_household ON public.automation_runs(household_id);
CREATE INDEX IF NOT EXISTS idx_transition_contacts_transition ON public.transition_contacts(transition_id);
CREATE INDEX IF NOT EXISTS idx_transition_email_queue_scheduled ON public.transition_email_queue(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_transition_events_transition ON public.transition_events(transition_id);
CREATE INDEX IF NOT EXISTS idx_diligence_artifacts_case ON public.diligence_artifacts(case_id);

-- ===================== 4) RLS & Policies =====================
-- Enable RLS (idempotent)
ALTER TABLE public.iar_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iar_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rev_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rev_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rev_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transition_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transition_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transition_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transition_email_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transition_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diligence_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diligence_artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_objects ENABLE ROW LEVEL SECURITY;

-- Basic permissive policies (proper syntax)
DROP POLICY IF EXISTS p_iar_sites_all ON public.iar_sites;
CREATE POLICY p_iar_sites_all ON public.iar_sites FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS p_iar_pages_all ON public.iar_pages;
CREATE POLICY p_iar_pages_all ON public.iar_pages FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS p_rev_rules_all ON public.rev_rules;
CREATE POLICY p_rev_rules_all ON public.rev_rules FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS p_rev_ledger_all ON public.rev_ledger;
CREATE POLICY p_rev_ledger_all ON public.rev_ledger FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS p_rev_payouts_all ON public.rev_payouts;
CREATE POLICY p_rev_payouts_all ON public.rev_payouts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS p_automations_all ON public.automations;
CREATE POLICY p_automations_all ON public.automations FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS p_automation_runs_all ON public.automation_runs;
CREATE POLICY p_automation_runs_all ON public.automation_runs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS p_transitions_all ON public.transitions;
CREATE POLICY p_transitions_all ON public.transitions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS p_transition_accounts_all ON public.transition_accounts;
CREATE POLICY p_transition_accounts_all ON public.transition_accounts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS p_transition_contacts_all ON public.transition_contacts;
CREATE POLICY p_transition_contacts_all ON public.transition_contacts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS p_transition_emails_all ON public.transition_emails;
CREATE POLICY p_transition_emails_all ON public.transition_emails FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS p_transition_email_queue_all ON public.transition_email_queue;
CREATE POLICY p_transition_email_queue_all ON public.transition_email_queue FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS p_transition_events_all ON public.transition_events;
CREATE POLICY p_transition_events_all ON public.transition_events FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS p_diligence_cases_all ON public.diligence_cases;
CREATE POLICY p_diligence_cases_all ON public.diligence_cases FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS p_diligence_artifacts_all ON public.diligence_artifacts;
CREATE POLICY p_diligence_artifacts_all ON public.diligence_artifacts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS p_vault_objects_all ON public.vault_objects;
CREATE POLICY p_vault_objects_all ON public.vault_objects FOR ALL USING (true) WITH CHECK (true);

-- ===================== 5) Seeds (JSONB with ::jsonb) =====================
INSERT INTO public.automations (key, name, inputs, enabled, price_cents) VALUES
('rebalance',   'Portfolio Rebalancing', '{"frequency":"monthly","threshold":5}'::jsonb,  false, 500)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.automations (key, name, inputs, enabled, price_cents) VALUES
('tlh',         'Tax Loss Harvesting',   '{"min_loss":1000,"frequency":"weekly"}'::jsonb, false, 1000)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.automations (key, name, inputs, enabled, price_cents) VALUES
('drift_check', 'Drift Monitoring',      '{"threshold":10,"frequency":"daily"}'::jsonb,   false, 250)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.automations (key, name, inputs, enabled, price_cents) VALUES
('cash_sweep',  'Cash Management',       '{"target_pct":5,"frequency":"weekly"}'::jsonb,  false, 300)
ON CONFLICT (key) DO NOTHING;