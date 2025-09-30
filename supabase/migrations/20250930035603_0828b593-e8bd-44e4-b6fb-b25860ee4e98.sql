-- Retirement Analysis Persistence Schema
-- Stores scenarios, versions, Monte Carlo runs, and results

-- Table 1: Retirement Scenarios (top-level container)
CREATE TABLE IF NOT EXISTS public.retirement_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table 2: Retirement Versions (snapshots of inputs + policy)
CREATE TABLE IF NOT EXISTS public.retirement_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id UUID NOT NULL REFERENCES public.retirement_scenarios(id) ON DELETE CASCADE,
  label TEXT NOT NULL DEFAULT 'v1',
  inputs JSONB NOT NULL DEFAULT '{}',
  policy JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table 3: Retirement Runs (Monte Carlo execution metadata)
CREATE TABLE IF NOT EXISTS public.retirement_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version_id UUID NOT NULL REFERENCES public.retirement_versions(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed')),
  n_paths INTEGER NOT NULL DEFAULT 5000,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table 4: Retirement Results (Monte Carlo simulation results)
CREATE TABLE IF NOT EXISTS public.retirement_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL REFERENCES public.retirement_runs(id) ON DELETE CASCADE,
  success_probability NUMERIC,
  terminal_p10 NUMERIC,
  terminal_p50 NUMERIC,
  terminal_p90 NUMERIC,
  breach_rate NUMERIC,
  etay_value NUMERIC,
  seay_value NUMERIC,
  full_results JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_retirement_scenarios_user_id ON public.retirement_scenarios(user_id);
CREATE INDEX IF NOT EXISTS idx_retirement_versions_scenario_id ON public.retirement_versions(scenario_id);
CREATE INDEX IF NOT EXISTS idx_retirement_runs_version_id ON public.retirement_runs(version_id);
CREATE INDEX IF NOT EXISTS idx_retirement_runs_status ON public.retirement_runs(status);
CREATE INDEX IF NOT EXISTS idx_retirement_results_run_id ON public.retirement_results(run_id);

-- RLS Policies: Users can only access their own data
ALTER TABLE public.retirement_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retirement_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retirement_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retirement_results ENABLE ROW LEVEL SECURITY;

-- Scenarios: Users manage their own
CREATE POLICY "Users can manage their own scenarios"
  ON public.retirement_scenarios
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Versions: Users access via scenario ownership
CREATE POLICY "Users can manage versions for their scenarios"
  ON public.retirement_versions
  FOR ALL
  USING (
    scenario_id IN (
      SELECT id FROM public.retirement_scenarios WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    scenario_id IN (
      SELECT id FROM public.retirement_scenarios WHERE user_id = auth.uid()
    )
  );

-- Runs: Users access via version ownership
CREATE POLICY "Users can manage runs for their versions"
  ON public.retirement_runs
  FOR ALL
  USING (
    version_id IN (
      SELECT v.id FROM public.retirement_versions v
      JOIN public.retirement_scenarios s ON s.id = v.scenario_id
      WHERE s.user_id = auth.uid()
    )
  )
  WITH CHECK (
    version_id IN (
      SELECT v.id FROM public.retirement_versions v
      JOIN public.retirement_scenarios s ON s.id = v.scenario_id
      WHERE s.user_id = auth.uid()
    )
  );

-- Results: Users can read, service role can insert
CREATE POLICY "Users can read results for their runs"
  ON public.retirement_results
  FOR SELECT
  USING (
    run_id IN (
      SELECT r.id FROM public.retirement_runs r
      JOIN public.retirement_versions v ON v.id = r.version_id
      JOIN public.retirement_scenarios s ON s.id = v.scenario_id
      WHERE s.user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can insert results"
  ON public.retirement_results
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Trigger to update updated_at on scenarios
CREATE OR REPLACE FUNCTION public.update_retirement_scenarios_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER retirement_scenarios_updated_at
  BEFORE UPDATE ON public.retirement_scenarios
  FOR EACH ROW
  EXECUTE FUNCTION public.update_retirement_scenarios_updated_at();