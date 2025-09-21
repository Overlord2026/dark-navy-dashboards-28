-- Create the missing tables for enhanced retirement scenario management
-- Skip client_meetings since it already exists

-- Client relationships for advisors
CREATE TABLE IF NOT EXISTS public.advisor_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advisor_id UUID NOT NULL,
  client_id UUID NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT,
  relationship_status TEXT DEFAULT 'active',
  next_meeting_date DATE,
  last_meeting_date DATE,
  meeting_frequency TEXT DEFAULT 'quarterly', -- quarterly, semi_annual, annual
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(advisor_id, client_id)
);

-- Enhanced retirement scenarios with versioning
CREATE TABLE IF NOT EXISTS public.retirement_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advisor_id UUID NOT NULL,
  client_id UUID NOT NULL,
  scenario_name TEXT NOT NULL,
  scenario_description TEXT,
  version_number INTEGER DEFAULT 1,
  parent_scenario_id UUID, -- For versioning (points to previous version)
  is_current_version BOOLEAN DEFAULT true,
  scenario_status TEXT DEFAULT 'draft', -- draft, active, archived, presented
  
  -- Analysis inputs (comprehensive JSON)
  analysis_inputs JSONB NOT NULL DEFAULT '{}',
  analysis_results JSONB DEFAULT '{}',
  
  -- Meeting context
  created_for_meeting_date DATE,
  presented_date DATE,
  
  -- Scenario metadata
  tags TEXT[],
  assumptions_notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint for parent_scenario_id if table doesn't have it
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'retirement_scenarios_parent_scenario_id_fkey'
  ) THEN
    ALTER TABLE public.retirement_scenarios 
    ADD CONSTRAINT retirement_scenarios_parent_scenario_id_fkey 
    FOREIGN KEY (parent_scenario_id) REFERENCES public.retirement_scenarios(id);
  END IF;
END $$;

-- Scenario comparisons and analysis sessions
CREATE TABLE IF NOT EXISTS public.scenario_comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advisor_id UUID NOT NULL,
  client_id UUID NOT NULL,
  comparison_name TEXT NOT NULL,
  scenario_ids UUID[] NOT NULL, -- Array of scenario IDs being compared
  comparison_results JSONB DEFAULT '{}',
  presentation_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE public.advisor_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retirement_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenario_comparisons ENABLE ROW LEVEL SECURITY;

-- RLS Policies for advisor_clients
DROP POLICY IF EXISTS "Advisors can manage their own clients" ON public.advisor_clients;
CREATE POLICY "Advisors can manage their own clients" ON public.advisor_clients
  FOR ALL USING (advisor_id = auth.uid());

-- RLS Policies for retirement_scenarios  
DROP POLICY IF EXISTS "Advisors can manage their client scenarios" ON public.retirement_scenarios;
CREATE POLICY "Advisors can manage their client scenarios" ON public.retirement_scenarios
  FOR ALL USING (advisor_id = auth.uid());

-- RLS Policies for scenario_comparisons
DROP POLICY IF EXISTS "Advisors can manage their comparisons" ON public.scenario_comparisons;
CREATE POLICY "Advisors can manage their comparisons" ON public.scenario_comparisons
  FOR ALL USING (advisor_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_advisor_clients_advisor ON public.advisor_clients(advisor_id);
CREATE INDEX IF NOT EXISTS idx_retirement_scenarios_advisor_client ON public.retirement_scenarios(advisor_id, client_id);
CREATE INDEX IF NOT EXISTS idx_retirement_scenarios_parent ON public.retirement_scenarios(parent_scenario_id);
CREATE INDEX IF NOT EXISTS idx_scenario_comparisons_advisor ON public.scenario_comparisons(advisor_id);

-- Create update triggers
DROP TRIGGER IF EXISTS update_advisor_clients_updated_at ON public.advisor_clients;
CREATE TRIGGER update_advisor_clients_updated_at
  BEFORE UPDATE ON public.advisor_clients
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS update_retirement_scenarios_updated_at ON public.retirement_scenarios;
CREATE TRIGGER update_retirement_scenarios_updated_at
  BEFORE UPDATE ON public.retirement_scenarios
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS update_scenario_comparisons_updated_at ON public.scenario_comparisons;
CREATE TRIGGER update_scenario_comparisons_updated_at
  BEFORE UPDATE ON public.scenario_comparisons
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();