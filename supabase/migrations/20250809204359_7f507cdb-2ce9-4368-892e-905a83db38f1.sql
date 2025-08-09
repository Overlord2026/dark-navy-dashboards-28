-- Create retirement confidence submissions table
CREATE TABLE public.retirement_confidence_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  persona TEXT NOT NULL DEFAULT 'client-family',
  answers_json JSONB NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  email TEXT,
  phone TEXT,
  first_name TEXT,
  last_name TEXT,
  lead_source TEXT NOT NULL DEFAULT 'Retirement Confidence Scorecard',
  marketing_opt_in BOOLEAN DEFAULT false,
  follow_up_opt_in BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create roadmap intake sessions table
CREATE TABLE public.roadmap_intake_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  scorecard_submission_id UUID REFERENCES public.retirement_confidence_submissions(id),
  session_data JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending',
  pre_filled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create contacts table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  email TEXT NOT NULL,
  phone TEXT,
  first_name TEXT,
  last_name TEXT,
  lead_source TEXT,
  lead_score INTEGER DEFAULT 0,
  pipeline_stage TEXT DEFAULT 'new',
  assigned_advisor_id UUID,
  marketing_opt_in BOOLEAN DEFAULT false,
  follow_up_opt_in BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create analytics events table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.analytics_scorecard_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  session_id TEXT,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  submission_id UUID REFERENCES public.retirement_confidence_submissions(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.retirement_confidence_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_intake_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_scorecard_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for retirement_confidence_submissions
CREATE POLICY "Users can create scorecard submissions" ON public.retirement_confidence_submissions
  FOR INSERT WITH CHECK (
    (user_id = auth.uid()) OR 
    (user_id IS NULL AND email IS NOT NULL) OR
    has_any_role(ARRAY['admin', 'system_administrator'])
  );

CREATE POLICY "Users can view their own submissions" ON public.retirement_confidence_submissions
  FOR SELECT USING (
    (user_id = auth.uid()) OR 
    has_any_role(ARRAY['admin', 'system_administrator', 'advisor'])
  );

CREATE POLICY "Advisors can update submissions" ON public.retirement_confidence_submissions
  FOR UPDATE USING (
    has_any_role(ARRAY['admin', 'system_administrator', 'advisor'])
  );

-- RLS Policies for roadmap_intake_sessions
CREATE POLICY "Users can manage their intake sessions" ON public.roadmap_intake_sessions
  FOR ALL USING (
    (user_id = auth.uid()) OR 
    has_any_role(ARRAY['admin', 'system_administrator', 'advisor'])
  );

-- RLS Policies for contacts
CREATE POLICY "Users can view their contact records" ON public.contacts
  FOR SELECT USING (
    (user_id = auth.uid()) OR 
    has_any_role(ARRAY['admin', 'system_administrator', 'advisor'])
  );

CREATE POLICY "System can create contacts" ON public.contacts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Advisors can update contacts" ON public.contacts
  FOR UPDATE USING (
    has_any_role(ARRAY['admin', 'system_administrator', 'advisor'])
  );

-- RLS Policies for analytics events
CREATE POLICY "Users can create analytics events" ON public.analytics_scorecard_events
  FOR INSERT WITH CHECK (
    (user_id = auth.uid()) OR 
    (user_id IS NULL) OR
    has_any_role(ARRAY['admin', 'system_administrator'])
  );

CREATE POLICY "Admins can view analytics events" ON public.analytics_scorecard_events
  FOR SELECT USING (
    has_any_role(ARRAY['admin', 'system_administrator'])
  );

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_retirement_confidence_submissions_updated_at
  BEFORE UPDATE ON public.retirement_confidence_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roadmap_intake_sessions_updated_at
  BEFORE UPDATE ON public.roadmap_intake_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate scorecard score
CREATE OR REPLACE FUNCTION calculate_retirement_confidence_score(answers JSONB)
RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 0;
  answer_value INTEGER;
BEGIN
  -- Question 1: Current age vs retirement readiness (0-10 points)
  answer_value := COALESCE((answers->>'q1')::INTEGER, 0);
  score := score + LEAST(answer_value, 10);
  
  -- Question 2: Emergency fund adequacy (0-15 points)
  answer_value := COALESCE((answers->>'q2')::INTEGER, 0);
  score := score + LEAST(answer_value, 15);
  
  -- Question 3: Retirement savings rate (0-15 points)
  answer_value := COALESCE((answers->>'q3')::INTEGER, 0);
  score := score + LEAST(answer_value, 15);
  
  -- Question 4: Debt management (0-10 points)
  answer_value := COALESCE((answers->>'q4')::INTEGER, 0);
  score := score + LEAST(answer_value, 10);
  
  -- Question 5: Investment diversification (0-10 points)
  answer_value := COALESCE((answers->>'q5')::INTEGER, 0);
  score := score + LEAST(answer_value, 10);
  
  -- Question 6: Healthcare planning (0-10 points)
  answer_value := COALESCE((answers->>'q6')::INTEGER, 0);
  score := score + LEAST(answer_value, 10);
  
  -- Question 7: Estate planning (0-10 points)
  answer_value := COALESCE((answers->>'q7')::INTEGER, 0);
  score := score + LEAST(answer_value, 10);
  
  -- Question 8: Social Security knowledge (0-5 points)
  answer_value := COALESCE((answers->>'q8')::INTEGER, 0);
  score := score + LEAST(answer_value, 5);
  
  -- Question 9: Tax planning (0-10 points)
  answer_value := COALESCE((answers->>'q9')::INTEGER, 0);
  score := score + LEAST(answer_value, 10);
  
  -- Question 10: Confidence level (0-5 points)
  answer_value := COALESCE((answers->>'q10')::INTEGER, 0);
  score := score + LEAST(answer_value, 5);
  
  -- Ensure score is within bounds
  RETURN GREATEST(0, LEAST(100, score));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to process scorecard submission
CREATE OR REPLACE FUNCTION process_scorecard_submission()
RETURNS TRIGGER AS $$
DECLARE
  calculated_score INTEGER;
  contact_record_id UUID;
BEGIN
  -- Calculate the score
  calculated_score := calculate_retirement_confidence_score(NEW.answers_json);
  NEW.score := calculated_score;
  
  -- Create or update contact record
  INSERT INTO public.contacts (
    user_id, email, phone, first_name, last_name, 
    lead_source, lead_score, pipeline_stage, 
    marketing_opt_in, follow_up_opt_in, metadata
  ) VALUES (
    NEW.user_id, NEW.email, NEW.phone, NEW.first_name, NEW.last_name,
    NEW.lead_source, calculated_score, 'qualified_scorecard_lead',
    NEW.marketing_opt_in, NEW.follow_up_opt_in,
    jsonb_build_object(
      'scorecard_submission_id', NEW.id,
      'retirement_confidence_score', calculated_score,
      'submission_date', NEW.created_at
    )
  ) ON CONFLICT (email) DO UPDATE SET
    lead_score = GREATEST(contacts.lead_score, calculated_score),
    pipeline_stage = CASE 
      WHEN contacts.pipeline_stage = 'new' THEN 'qualified_scorecard_lead'
      ELSE contacts.pipeline_stage
    END,
    metadata = contacts.metadata || jsonb_build_object(
      'latest_scorecard_score', calculated_score,
      'latest_submission_date', NEW.created_at
    ),
    updated_at = now()
  RETURNING id INTO contact_record_id;
  
  -- Create roadmap intake session with pre-filled data
  INSERT INTO public.roadmap_intake_sessions (
    user_id, scorecard_submission_id, session_data, pre_filled, status
  ) VALUES (
    NEW.user_id, NEW.id,
    jsonb_build_object(
      'retirement_age_target', COALESCE(NEW.answers_json->>'retirement_age', '67'),
      'current_age', COALESCE(NEW.answers_json->>'current_age', '45'),
      'current_assets_estimate', COALESCE(NEW.answers_json->>'current_savings', '0'),
      'monthly_expense_estimate', COALESCE(NEW.answers_json->>'monthly_expenses', '5000'),
      'confidence_score', calculated_score,
      'from_scorecard', true
    ),
    true, 'pending'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for scorecard submission processing
CREATE TRIGGER process_scorecard_submission_trigger
  BEFORE INSERT ON public.retirement_confidence_submissions
  FOR EACH ROW EXECUTE FUNCTION process_scorecard_submission();

-- Create indexes for performance
CREATE INDEX idx_retirement_confidence_submissions_user_id ON public.retirement_confidence_submissions(user_id);
CREATE INDEX idx_retirement_confidence_submissions_email ON public.retirement_confidence_submissions(email);
CREATE INDEX idx_retirement_confidence_submissions_created_at ON public.retirement_confidence_submissions(created_at);
CREATE INDEX idx_roadmap_intake_sessions_user_id ON public.roadmap_intake_sessions(user_id);
CREATE INDEX idx_roadmap_intake_sessions_scorecard_id ON public.roadmap_intake_sessions(scorecard_submission_id);
CREATE INDEX idx_contacts_email ON public.contacts(email);
CREATE INDEX idx_contacts_lead_source ON public.contacts(lead_source);
CREATE INDEX idx_analytics_scorecard_events_submission_id ON public.analytics_scorecard_events(submission_id);