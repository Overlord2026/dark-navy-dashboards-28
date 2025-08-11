-- ===================================================
-- Patent #9: Automated Professional Vetting Engine - Fixed Schema
-- ===================================================

-- Core Vetting Tables (Fixed tenant_id references)
CREATE TABLE IF NOT EXISTS public.vetting_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  request_type TEXT NOT NULL DEFAULT 'initial' CHECK (request_type IN ('initial', 'periodic', 'triggered', 'manual')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'escalated')),
  priority INTEGER NOT NULL DEFAULT 5 CHECK (priority BETWEEN 1 AND 10),
  requested_by UUID REFERENCES auth.users(id),
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  sla_deadline TIMESTAMP WITH TIME ZONE,
  escalation_level INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  tenant_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.credential_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_name TEXT NOT NULL UNIQUE,
  source_type TEXT NOT NULL CHECK (source_type IN ('cfp_board', 'finra', 'state_bar', 'cpa_board', 'medical_board', 'insurance_board', 'other')),
  api_endpoint TEXT,
  auth_method TEXT CHECK (auth_method IN ('api_key', 'oauth', 'basic_auth', 'cert_auth')),
  rate_limit_per_minute INTEGER DEFAULT 60,
  rate_limit_per_day INTEGER DEFAULT 1000,
  timeout_seconds INTEGER DEFAULT 30,
  circuit_breaker_config JSONB DEFAULT '{"failure_threshold": 5, "recovery_timeout": 300}',
  data_retention_days INTEGER DEFAULT 90,
  is_active BOOLEAN NOT NULL DEFAULT true,
  jurisdiction TEXT,
  supported_verifications JSONB DEFAULT '[]',
  reliability_score NUMERIC(3,2) DEFAULT 0.95,
  average_response_time_ms INTEGER DEFAULT 2000,
  last_health_check TIMESTAMP WITH TIME ZONE,
  health_status TEXT DEFAULT 'unknown' CHECK (health_status IN ('healthy', 'degraded', 'down', 'unknown')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.registry_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vetting_request_id UUID NOT NULL REFERENCES public.vetting_requests(id) ON DELETE CASCADE,
  source_id UUID NOT NULL REFERENCES public.credential_sources(id),
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  query_parameters JSONB NOT NULL,
  raw_response JSONB NOT NULL,
  parsed_data JSONB DEFAULT '{}',
  match_score NUMERIC(4,3) DEFAULT 0.000 CHECK (match_score BETWEEN 0 AND 1),
  field_confidence JSONB DEFAULT '{}',
  identity_matches JSONB DEFAULT '{}',
  license_status TEXT,
  license_number TEXT,
  license_expiry DATE,
  disciplinary_actions JSONB DEFAULT '[]',
  verification_status TEXT NOT NULL CHECK (verification_status IN ('verified', 'partial', 'failed', 'conflicted')),
  cache_key TEXT,
  cache_expires_at TIMESTAMP WITH TIME ZONE,
  query_duration_ms INTEGER,
  response_code INTEGER,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  tenant_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.sanction_hits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registry_record_id UUID NOT NULL REFERENCES public.registry_records(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  hit_type TEXT NOT NULL CHECK (hit_type IN ('disciplinary', 'criminal', 'regulatory', 'civil', 'administrative')),
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  source_jurisdiction TEXT,
  violation_date DATE,
  resolution_date DATE,
  status TEXT NOT NULL CHECK (status IN ('active', 'resolved', 'pending', 'dismissed')),
  description TEXT,
  details JSONB DEFAULT '{}',
  impact_on_trust_score NUMERIC(4,3) DEFAULT 0.000,
  requires_human_review BOOLEAN DEFAULT true,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  disposition TEXT CHECK (disposition IN ('verified', 'false_positive', 'requires_escalation', 'monitoring')),
  tenant_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.trust_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  base_score NUMERIC(4,3) NOT NULL DEFAULT 0.500 CHECK (base_score BETWEEN 0 AND 1),
  computed_score NUMERIC(4,3) NOT NULL DEFAULT 0.500 CHECK (computed_score BETWEEN 0 AND 1),
  streak_count INTEGER NOT NULL DEFAULT 0,
  streak_bonus NUMERIC(4,3) DEFAULT 0.000,
  decay_factor NUMERIC(4,3) DEFAULT 0.99 CHECK (decay_factor BETWEEN 0 AND 1),
  days_since_last_verification INTEGER DEFAULT 0,
  last_verification_date TIMESTAMP WITH TIME ZONE,
  last_adverse_event_date TIMESTAMP WITH TIME ZONE,
  score_history JSONB DEFAULT '[]',
  component_scores JSONB DEFAULT '{}',
  confidence_level NUMERIC(4,3) DEFAULT 0.500,
  tier TEXT NOT NULL DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  tier_updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  access_permissions JSONB DEFAULT '[]',
  flags JSONB DEFAULT '[]',
  tenant_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.monitoring_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  job_type TEXT NOT NULL CHECK (job_type IN ('periodic_reverification', 'sanction_check', 'license_renewal', 'anomaly_check')),
  frequency_days INTEGER NOT NULL DEFAULT 30,
  next_execution TIMESTAMP WITH TIME ZONE NOT NULL,
  last_execution TIMESTAMP WITH TIME ZONE,
  sla_hours INTEGER NOT NULL DEFAULT 24,
  priority INTEGER NOT NULL DEFAULT 5 CHECK (priority BETWEEN 1 AND 10),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'running', 'completed', 'failed', 'paused')),
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  backoff_multiplier NUMERIC(3,2) DEFAULT 2.0,
  config JSONB DEFAULT '{}',
  last_result JSONB,
  error_message TEXT,
  escalation_triggered BOOLEAN DEFAULT false,
  escalated_at TIMESTAMP WITH TIME ZONE,
  escalated_to UUID REFERENCES auth.users(id),
  tenant_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reconciliation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  reconciliation_type TEXT NOT NULL CHECK (reconciliation_type IN ('license_conflict', 'jurisdiction_mismatch', 'identity_ambiguity', 'status_discrepancy')),
  source_records JSONB NOT NULL,
  conflict_details JSONB NOT NULL,
  resolution_method TEXT CHECK (resolution_method IN ('auto_resolved', 'manual_override', 'escalated', 'pending')),
  resolution_reason TEXT,
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  confidence_score NUMERIC(4,3),
  impact_assessment JSONB DEFAULT '{}',
  requires_follow_up BOOLEAN DEFAULT false,
  follow_up_date DATE,
  tenant_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Blockchain Anchoring Tables
CREATE TABLE IF NOT EXISTS public.digital_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_type TEXT NOT NULL CHECK (asset_type IN ('verification_bundle', 'trust_score_snapshot', 'evidence_package')),
  content_hash TEXT NOT NULL,
  asset_data JSONB NOT NULL,
  metadata JSONB DEFAULT '{}',
  tenant_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.fingerprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  digital_asset_id UUID NOT NULL REFERENCES public.digital_assets(id) ON DELETE CASCADE,
  algorithm TEXT NOT NULL DEFAULT 'SHA-256',
  hash_value TEXT NOT NULL,
  salt TEXT,
  computation_metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.merkle_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_number SERIAL,
  merkle_root TEXT NOT NULL,
  included_assets UUID[] NOT NULL,
  tree_metadata JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'anchored', 'failed')),
  anchor_transaction_id TEXT,
  tenant_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  anchored_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.chain_anchors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merkle_batch_id UUID NOT NULL REFERENCES public.merkle_batches(id) ON DELETE CASCADE,
  chain_type TEXT NOT NULL DEFAULT 'ethereum' CHECK (chain_type IN ('ethereum', 'bitcoin', 'polygon', 'private')),
  transaction_hash TEXT NOT NULL,
  block_number BIGINT,
  confirmation_count INTEGER DEFAULT 0,
  gas_used BIGINT,
  gas_price TEXT,
  anchor_cost_wei TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  error_message TEXT,
  receipt JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  confirmed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.attestations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  digital_asset_id UUID NOT NULL REFERENCES public.digital_assets(id) ON DELETE CASCADE,
  attestor_id UUID NOT NULL REFERENCES auth.users(id),
  attestation_type TEXT NOT NULL CHECK (attestation_type IN ('verification', 'review', 'audit', 'dispute')),
  signature TEXT NOT NULL,
  signature_algorithm TEXT NOT NULL DEFAULT 'ECDSA',
  public_key TEXT NOT NULL,
  attestation_data JSONB NOT NULL,
  validity_period INTERVAL,
  expires_at TIMESTAMP WITH TIME ZONE,
  revoked_at TIMESTAMP WITH TIME ZONE,
  revocation_reason TEXT,
  tenant_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  digital_asset_id UUID NOT NULL REFERENCES public.digital_assets(id) ON DELETE CASCADE,
  license_type TEXT NOT NULL,
  issuer TEXT NOT NULL,
  terms_hash TEXT NOT NULL,
  granted_to UUID NOT NULL REFERENCES auth.users(id),
  usage_rights JSONB NOT NULL DEFAULT '{}',
  restrictions JSONB DEFAULT '{}',
  effective_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expiration_date TIMESTAMP WITH TIME ZONE,
  is_transferable BOOLEAN DEFAULT false,
  transfer_restrictions JSONB DEFAULT '{}',
  revoked_at TIMESTAMP WITH TIME ZONE,
  revocation_reason TEXT,
  tenant_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_vetting_requests_professional_status ON public.vetting_requests(professional_id, status);
CREATE INDEX IF NOT EXISTS idx_vetting_requests_sla_deadline ON public.vetting_requests(sla_deadline) WHERE status IN ('pending', 'in_progress');
CREATE INDEX IF NOT EXISTS idx_registry_records_professional_verification ON public.registry_records(professional_id, verification_status);
CREATE INDEX IF NOT EXISTS idx_registry_records_cache_key ON public.registry_records(cache_key) WHERE cache_expires_at > now();
CREATE INDEX IF NOT EXISTS idx_sanction_hits_professional_severity ON public.sanction_hits(professional_id, severity, status);
CREATE INDEX IF NOT EXISTS idx_trust_scores_professional_current ON public.trust_scores(professional_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_monitoring_jobs_next_execution ON public.monitoring_jobs(next_execution) WHERE status = 'scheduled';
CREATE INDEX IF NOT EXISTS idx_reconciliation_logs_professional_unresolved ON public.reconciliation_logs(professional_id) WHERE resolution_method IS NULL;
CREATE INDEX IF NOT EXISTS idx_digital_assets_content_hash ON public.digital_assets(content_hash);
CREATE INDEX IF NOT EXISTS idx_merkle_batches_status ON public.merkle_batches(status, created_at);

-- Enable RLS
ALTER TABLE public.vetting_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credential_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registry_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sanction_hits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trust_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monitoring_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reconciliation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fingerprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merkle_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chain_anchors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attestations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;