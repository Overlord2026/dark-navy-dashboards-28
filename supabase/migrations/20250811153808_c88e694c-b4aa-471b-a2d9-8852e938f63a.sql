-- Create the core vetting tables first (simple version)
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

-- Enable RLS
ALTER TABLE public.vetting_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credential_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registry_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trust_scores ENABLE ROW LEVEL SECURITY;