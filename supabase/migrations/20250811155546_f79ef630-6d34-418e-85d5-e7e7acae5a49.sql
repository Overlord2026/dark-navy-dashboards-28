-- ========= Missing Tables =========

CREATE TABLE IF NOT EXISTS public.sanction_hits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  source_registry TEXT NOT NULL,
  sanction_type TEXT CHECK (sanction_type IN ('disciplinary','suspension','revocation','other')),
  severity_level INTEGER CHECK (severity_level BETWEEN 1 AND 10),
  description TEXT,
  effective_date DATE,
  resolution_date DATE,
  impact_on_trust_score NUMERIC(4,3) DEFAULT 0.100 CHECK (impact_on_trust_score BETWEEN 0 AND 1),
  detected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  tenant_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.monitoring_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  job_type TEXT NOT NULL CHECK (job_type IN ('periodic','sanction_check','license_renewal')),
  frequency_days INTEGER NOT NULL DEFAULT 30,
  next_run_at TIMESTAMPTZ,
  last_run_at TIMESTAMPTZ,
  sla_hours INTEGER NOT NULL DEFAULT 24,
  priority INTEGER NOT NULL DEFAULT 5 CHECK (priority BETWEEN 1 AND 10),
  enabled BOOLEAN NOT NULL DEFAULT true,
  error_count INTEGER NOT NULL DEFAULT 0,
  max_retries INTEGER NOT NULL DEFAULT 3,
  tenant_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reconciliation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  source_jurisdiction TEXT NOT NULL,
  target_jurisdiction TEXT NOT NULL,
  license_number_source TEXT,
  license_number_target TEXT,
  reconciliation_status TEXT NOT NULL CHECK (reconciliation_status IN ('matched','conflicted','pending')),
  conflict_reasons JSONB DEFAULT '[]',
  resolution_method TEXT CHECK (resolution_method IN ('automatic','manual','escalated')),
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id),
  tenant_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ========= Helpful Indexes =========
CREATE INDEX IF NOT EXISTS idx_registry_records_prof ON public.registry_records(professional_id);
CREATE INDEX IF NOT EXISTS idx_registry_records_source ON public.registry_records(source_id);
CREATE INDEX IF NOT EXISTS idx_vetting_requests_prof ON public.vetting_requests(professional_id);
CREATE INDEX IF NOT EXISTS idx_trust_scores_prof ON public.trust_scores(professional_id);
CREATE INDEX IF NOT EXISTS idx_sanction_hits_prof ON public.sanction_hits(professional_id);
CREATE INDEX IF NOT EXISTS idx_monitoring_jobs_next_run ON public.monitoring_jobs(next_run_at) WHERE enabled = true;

-- ========= RLS Policies (multi-tenant template) =========
-- Assumes a jwt claim 'tenant_id' set via Supabase auth; adjust to your setup.

-- Enable RLS where missing
ALTER TABLE public.sanction_hits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monitoring_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reconciliation_logs ENABLE ROW LEVEL SECURITY;

-- Tenant-level isolation helpers
CREATE OR REPLACE FUNCTION public.current_tenant_id() RETURNS uuid LANGUAGE sql STABLE AS
$$ SELECT nullif(current_setting('request.jwt.claims', true)::jsonb->>'tenant_id','')::uuid $$;

-- vetting_requests
DROP POLICY IF EXISTS sel_vetting_requests ON public.vetting_requests;
CREATE POLICY sel_vetting_requests ON public.vetting_requests
  FOR SELECT USING (tenant_id IS NULL OR tenant_id = public.current_tenant_id());

DROP POLICY IF EXISTS ins_vetting_requests ON public.vetting_requests;
CREATE POLICY ins_vetting_requests ON public.vetting_requests
  FOR INSERT WITH CHECK (tenant_id IS NULL OR tenant_id = public.current_tenant_id());

DROP POLICY IF EXISTS upd_vetting_requests ON public.vetting_requests;
CREATE POLICY upd_vetting_requests ON public.vetting_requests
  FOR UPDATE USING (tenant_id IS NULL OR tenant_id = public.current_tenant_id());

-- Repeat the same pattern for all tables created/enabled:
DO $$
DECLARE t text;
BEGIN
  FOR t IN
    SELECT unnest(ARRAY[
      'credential_sources',
      'registry_records',
      'trust_scores',
      'sanction_hits',
      'monitoring_jobs',
      'reconciliation_logs'
    ])
  LOOP
    EXECUTE format('
      DROP POLICY IF EXISTS sel_%1$s ON public.%1$s;
      CREATE POLICY sel_%1$s ON public.%1$s FOR SELECT USING (tenant_id IS NULL OR tenant_id = public.current_tenant_id());
      DROP POLICY IF EXISTS ins_%1$s ON public.%1$s;
      CREATE POLICY ins_%1$s ON public.%1$s FOR INSERT WITH CHECK (tenant_id IS NULL OR tenant_id = public.current_tenant_id());
      DROP POLICY IF EXISTS upd_%1$s ON public.%1$s;
      CREATE POLICY upd_%1$s ON public.%1$s FOR UPDATE USING (tenant_id IS NULL OR tenant_id = public.current_tenant_id());
    ', t);
  END LOOP;
END $$;

-- ========= Trust score maintenance (function + trigger) =========
CREATE OR REPLACE FUNCTION public.recompute_trust_score(p_professional_id uuid)
RETURNS void LANGUAGE plpgsql AS $$
DECLARE
  ts record;
  adverse_hits int;
  days_since int;
  new_score numeric(4,3);
  new_tier text;
BEGIN
  SELECT * INTO ts
  FROM public.trust_scores
  WHERE professional_id = p_professional_id
  ORDER BY updated_at DESC
  LIMIT 1;

  IF ts IS NULL THEN
    RETURN;
  END IF;

  SELECT COUNT(*) INTO adverse_hits
  FROM public.sanction_hits
  WHERE professional_id = p_professional_id
    AND (sanction_type IN ('disciplinary','suspension','revocation'));

  IF ts.last_verification_date IS NULL THEN
    days_since := 999;
  ELSE
    days_since := GREATEST(0, (now()::date - ts.last_verification_date::date));
  END IF;

  IF adverse_hits > 0 THEN
    -- Reset to base on adverse
    new_score := ts.base_score;
  ELSE
    new_score := ROUND(ts.base_score * (POWER(ts.decay_factor, days_since)) + (COALESCE(ts.streak_bonus,0) * COALESCE(ts.streak_count,0)), 3);
    new_score := LEAST(GREATEST(new_score, 0.000), 1.000);
  END IF;

  -- Tiering
  new_tier := CASE
    WHEN new_score >= 0.90 THEN 'platinum'
    WHEN new_score >= 0.75 THEN 'gold'
    WHEN new_score >= 0.60 THEN 'silver'
    ELSE 'bronze'
  END;

  UPDATE public.trust_scores
  SET computed_score = new_score,
      tier = new_tier,
      tier_updated_at = CASE WHEN tier <> new_tier THEN now() ELSE tier_updated_at END,
      updated_at = now()
  WHERE id = ts.id;
END $$;

-- Trigger: whenever a sanction hit or trust row changes, recompute
CREATE OR REPLACE FUNCTION public.trigger_recompute_trust_score()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  PERFORM public.recompute_trust_score(
    COALESCE(NEW.professional_id, OLD.professional_id)
  );
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_recompute_trust_on_sanction ON public.sanction_hits;
CREATE TRIGGER trg_recompute_trust_on_sanction
AFTER INSERT OR UPDATE OR DELETE ON public.sanction_hits
FOR EACH ROW EXECUTE FUNCTION public.trigger_recompute_trust_score();

DROP TRIGGER IF EXISTS trg_recompute_trust_on_trust_scores ON public.trust_scores;
CREATE TRIGGER trg_recompute_trust_on_trust_scores
AFTER INSERT OR UPDATE ON public.trust_scores
FOR EACH ROW EXECUTE FUNCTION public.trigger_recompute_trust_score();