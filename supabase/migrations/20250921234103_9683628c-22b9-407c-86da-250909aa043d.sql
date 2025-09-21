-- Create enhanced retirement scenario management tables

-- Client relationships for advisors
CREATE TABLE public.advisor_clients (
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
CREATE TABLE public.retirement_scenarios (
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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  FOREIGN KEY (parent_scenario_id) REFERENCES public.retirement_scenarios(id)
);

-- Scenario comparisons and analysis sessions
CREATE TABLE public.scenario_comparisons (
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

-- Meeting logs and scenario presentations
CREATE TABLE public.client_meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advisor_id UUID NOT NULL,
  client_id UUID NOT NULL,
  meeting_date DATE NOT NULL,
  meeting_type TEXT DEFAULT 'review', -- review, planning, presentation, follow_up
  scenarios_presented UUID[],
  meeting_notes TEXT,
  action_items JSONB DEFAULT '[]',
  next_meeting_scheduled DATE,
  meeting_duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.advisor_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retirement_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenario_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_meetings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for advisor_clients
CREATE POLICY "Advisors can manage their own clients" ON public.advisor_clients
  FOR ALL USING (advisor_id = auth.uid());

-- RLS Policies for retirement_scenarios  
CREATE POLICY "Advisors can manage their client scenarios" ON public.retirement_scenarios
  FOR ALL USING (advisor_id = auth.uid());

-- RLS Policies for scenario_comparisons
CREATE POLICY "Advisors can manage their comparisons" ON public.scenario_comparisons
  FOR ALL USING (advisor_id = auth.uid());

-- RLS Policies for client_meetings
CREATE POLICY "Advisors can manage their meetings" ON public.client_meetings
  FOR ALL USING (advisor_id = auth.uid());

-- Create indexes for performance
CREATE INDEX idx_advisor_clients_advisor ON public.advisor_clients(advisor_id);
CREATE INDEX idx_retirement_scenarios_advisor_client ON public.retirement_scenarios(advisor_id, client_id);
CREATE INDEX idx_retirement_scenarios_parent ON public.retirement_scenarios(parent_scenario_id);
CREATE INDEX idx_scenario_comparisons_advisor ON public.scenario_comparisons(advisor_id);
CREATE INDEX idx_client_meetings_advisor_date ON public.client_meetings(advisor_id, meeting_date);

-- Create update triggers
CREATE TRIGGER update_advisor_clients_updated_at
  BEFORE UPDATE ON public.advisor_clients
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER update_retirement_scenarios_updated_at
  BEFORE UPDATE ON public.retirement_scenarios
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER update_scenario_comparisons_updated_at
  BEFORE UPDATE ON public.scenario_comparisons
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER update_client_meetings_updated_at
  BEFORE UPDATE ON public.client_meetings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();