-- Create trust scoring pipeline and proper org structure

-- Create orgs table if it doesn't exist (for compatibility)
CREATE TABLE IF NOT EXISTS public.orgs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create a default org if none exists
INSERT INTO public.orgs (id, name) 
SELECT gen_random_uuid(), 'Default Organization'
WHERE NOT EXISTS (SELECT 1 FROM public.orgs)
LIMIT 1;

-- Create persona_sessions table for active session tracking
CREATE TABLE IF NOT EXISTS public.persona_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  user_id UUID NOT NULL,
  persona_id UUID,
  persona_kind TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add unique index for one active session per user/org
CREATE UNIQUE INDEX IF NOT EXISTS uq_persona_active_per_user_org
  ON public.persona_sessions (org_id, user_id) WHERE active = true;

-- Trust scoring pipeline tables
CREATE TABLE IF NOT EXISTS public.monitoring_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
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
  org_id UUID NOT NULL,
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
CREATE INDEX IF NOT EXISTS idx_trust_scores_org_prof_time 
  ON public.trust_scores (org_id, professional_id, computed_at DESC);

-- Create view for latest trust scores
CREATE OR REPLACE VIEW public.v_professional_latest_trust AS
SELECT DISTINCT ON (org_id, professional_id)
  org_id,
  professional_id,
  computed_score,
  tier,
  computed_at
FROM public.trust_scores
ORDER BY org_id, professional_id, computed_at DESC;

-- Trust recompute function
CREATE OR REPLACE FUNCTION public.recompute_trust(p_org UUID, p_prof UUID)
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
  WHERE org_id = p_org AND professional_id = p_prof
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
    org_id, professional_id, base_score, decay_factor, 
    streak_count, computed_score, tier, notes
  ) VALUES (
    p_org, p_prof, COALESCE(v_prev_record.base_score, 0.8),
    COALESCE(v_prev_record.decay_factor, 0.99),
    COALESCE(v_prev_record.streak_count, 0) + 1,
    v_new_score, v_tier, 'Auto-computed'
  ) RETURNING id INTO v_new_id;
  
  RETURN v_new_id;
END;
$$;

-- RPC for enqueuing trust recompute
CREATE OR REPLACE FUNCTION public.enqueue_trust_recompute(
  p_org UUID, 
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
  INSERT INTO public.monitoring_jobs (org_id, professional_id, kind, due_at)
  VALUES (p_org, p_prof, 'trust_recompute', due_at)
  RETURNING id INTO v_job_id;
  
  RETURN v_job_id;
END;
$$;

-- Enable RLS on new tables
ALTER TABLE public.orgs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.persona_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monitoring_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trust_scores ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies
CREATE POLICY "Users can view orgs" ON public.orgs
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their persona sessions" ON public.persona_sessions
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Org members can view monitoring jobs" ON public.monitoring_jobs
  FOR SELECT USING (true);

CREATE POLICY "Org members can view trust scores" ON public.trust_scores
  FOR SELECT USING (true);

-- Insert some sample trust data for demonstration
DO $$
DECLARE 
  v_org UUID;
  v_prof1 UUID := gen_random_uuid();
  v_prof2 UUID := gen_random_uuid();
BEGIN
  SELECT id INTO v_org FROM public.orgs LIMIT 1;
  
  -- Insert sample monitoring jobs
  INSERT INTO public.monitoring_jobs (org_id, professional_id, kind, due_at) VALUES
    (v_org, v_prof1, 'trust_recompute', NOW() + INTERVAL '1 hour'),
    (v_org, v_prof2, 'trust_recompute', NOW() + INTERVAL '2 hours');
    
  -- Insert sample trust scores
  INSERT INTO public.trust_scores (org_id, professional_id, computed_score, tier) VALUES
    (v_org, v_prof1, 0.85, 'Gold'),
    (v_org, v_prof2, 0.92, 'Platinum');
END $$;