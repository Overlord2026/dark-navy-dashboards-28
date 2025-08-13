-- Simple trust scoring pipeline without org dependency

-- Trust scoring pipeline tables using tenant_id (which exists in personas table)
CREATE TABLE IF NOT EXISTS public.monitoring_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  professional_id UUID NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('trust_recompute')),
  due_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'done', 'error')) DEFAULT 'pending',
  last_error TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.trust_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  professional_id UUID NOT NULL,
  base_score NUMERIC NOT NULL DEFAULT 0.8,
  decay_factor NUMERIC NOT NULL DEFAULT 0.99,
  streak_count INTEGER NOT NULL DEFAULT 0,
  computed_score NUMERIC NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('Standard', 'Silver', 'Gold', 'Platinum')),
  computed_at TIMESTAMPTZ DEFAULT now(),
  notes TEXT
);

-- Add index for trust scores
CREATE INDEX IF NOT EXISTS idx_trust_scores_tenant_prof_time 
  ON public.trust_scores (tenant_id, professional_id, computed_at DESC);

-- Create view for latest trust scores
CREATE OR REPLACE VIEW public.v_professional_latest_trust AS
SELECT DISTINCT ON (tenant_id, professional_id)
  tenant_id,
  professional_id,
  computed_score,
  tier,
  computed_at
FROM public.trust_scores
ORDER BY tenant_id, professional_id, computed_at DESC;

-- Trust recompute function
CREATE OR REPLACE FUNCTION public.recompute_trust(p_tenant UUID, p_prof UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_prev_record RECORD;
  v_days INTEGER;
  v_new_score NUMERIC;
  v_tier TEXT;
  v_new_id UUID;
  v_streak_bonus NUMERIC := 0.1;
BEGIN
  -- Lock and get previous record
  SELECT * INTO v_prev_record
  FROM public.trust_scores
  WHERE tenant_id = p_tenant AND professional_id = p_prof
  ORDER BY computed_at DESC
  LIMIT 1
  FOR UPDATE SKIP LOCKED;
  
  -- Calculate days since last computation
  v_days := GREATEST(1, 
    DATE_PART('day', NOW() - COALESCE(v_prev_record.computed_at, NOW() - INTERVAL '1 day'))::INTEGER
  );
  
  -- Compute new score
  v_new_score := COALESCE(v_prev_record.base_score, 0.8) * 
                 POWER(COALESCE(v_prev_record.decay_factor, 0.99), v_days) +
                 (v_streak_bonus * COALESCE(v_prev_record.streak_count, 0));
  
  -- Clamp score [0,1]
  v_new_score := GREATEST(0, LEAST(1, v_new_score));
  
  -- Determine tier
  v_tier := CASE 
    WHEN v_new_score >= 0.9 THEN 'Platinum'
    WHEN v_new_score >= 0.75 THEN 'Gold'
    WHEN v_new_score >= 0.5 THEN 'Silver'
    ELSE 'Standard'
  END;
  
  -- Insert new score
  INSERT INTO public.trust_scores (
    tenant_id, professional_id, base_score, decay_factor, 
    streak_count, computed_score, tier, notes
  ) VALUES (
    p_tenant, p_prof, COALESCE(v_prev_record.base_score, 0.8),
    COALESCE(v_prev_record.decay_factor, 0.99),
    COALESCE(v_prev_record.streak_count, 0) + 1,
    v_new_score, v_tier, 'Auto-computed'
  ) RETURNING id INTO v_new_id;
  
  RETURN v_new_id;
END;
$$;

-- RPC for enqueuing trust recompute
CREATE OR REPLACE FUNCTION public.enqueue_trust_recompute(
  p_tenant UUID, 
  p_prof UUID, 
  due_at TIMESTAMPTZ DEFAULT NOW()
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_job_id UUID;
BEGIN
  INSERT INTO public.monitoring_jobs (tenant_id, professional_id, kind, due_at)
  VALUES (p_tenant, p_prof, 'trust_recompute', due_at)
  RETURNING id INTO v_job_id;
  
  RETURN v_job_id;
END;
$$;

-- Enable RLS on new tables
ALTER TABLE public.monitoring_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trust_scores ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies
CREATE POLICY "Users can view monitoring jobs for their tenant" ON public.monitoring_jobs
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.personas WHERE tenant_id = monitoring_jobs.tenant_id AND user_id = auth.uid()));

CREATE POLICY "Users can view trust scores for their tenant" ON public.trust_scores
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.personas WHERE tenant_id = trust_scores.tenant_id AND user_id = auth.uid()));

-- Insert some sample trust data for demonstration
DO $$
DECLARE 
  v_tenant UUID;
  v_prof1 UUID := gen_random_uuid();
  v_prof2 UUID := gen_random_uuid();
BEGIN
  SELECT tenant_id INTO v_tenant FROM public.personas LIMIT 1;
  
  IF v_tenant IS NOT NULL THEN
    -- Insert sample monitoring jobs
    INSERT INTO public.monitoring_jobs (tenant_id, professional_id, kind, due_at) VALUES
      (v_tenant, v_prof1, 'trust_recompute', NOW() + INTERVAL '1 hour'),
      (v_tenant, v_prof2, 'trust_recompute', NOW() + INTERVAL '2 hours');
      
    -- Insert sample trust scores
    INSERT INTO public.trust_scores (tenant_id, professional_id, computed_score, tier) VALUES
      (v_tenant, v_prof1, 0.85, 'Gold'),
      (v_tenant, v_prof2, 0.92, 'Platinum');
  END IF;
END $$;