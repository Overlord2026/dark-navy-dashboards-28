-- Insurance Agent CE Tracking System

-- Table for Insurance Agent Profiles
CREATE TABLE IF NOT EXISTS public.insurance_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  license_type TEXT NOT NULL, -- ('Life', 'Health', 'Variable', 'P&C', 'LTC', etc.)
  nmls_id TEXT, -- for mortgage, if needed
  state TEXT NOT NULL,
  license_number TEXT NOT NULL,
  license_expiry DATE,
  ce_credits_required INT DEFAULT 20,
  ce_credits_completed INT DEFAULT 0,
  ce_reporting_period_start DATE,
  ce_reporting_period_end DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- CE Course Completion Tracking Table
CREATE TABLE IF NOT EXISTS public.ce_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES insurance_agents(id) ON DELETE CASCADE,
  course_name TEXT NOT NULL,
  course_type TEXT, -- ('Ethics', 'Annuity', 'LTC', etc.)
  provider_name TEXT,
  completion_date DATE,
  credits_earned INT DEFAULT 0,
  certificate_url TEXT,
  verified BOOLEAN DEFAULT false,
  verified_by UUID,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- License Renewal & CE Reminder Events
CREATE TABLE IF NOT EXISTS public.ce_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES insurance_agents(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('CE Due Soon', 'License Expiry', 'Deficiency', 'Compliance Check')),
  reminder_status TEXT DEFAULT 'pending' CHECK (reminder_status IN ('pending', 'sent', 'acknowledged', 'resolved')),
  trigger_date TIMESTAMP WITH TIME ZONE,
  resolved_date TIMESTAMP WITH TIME ZONE,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for all tables
ALTER TABLE public.insurance_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ce_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ce_reminders ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checks
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- RLS Policies for Insurance Agents
CREATE POLICY "Agents can manage own profile"
  ON public.insurance_agents
  FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Compliance officers can view all agents"
  ON public.insurance_agents
  FOR SELECT
  USING (public.get_current_user_role() IN ('compliance_officer', 'admin', 'system_administrator'));

-- RLS Policies for CE Courses
CREATE POLICY "Agents can manage own courses"
  ON public.ce_courses
  FOR ALL
  USING ((SELECT user_id FROM public.insurance_agents WHERE id = agent_id) = auth.uid());

CREATE POLICY "Compliance officers can view all courses"
  ON public.ce_courses
  FOR SELECT
  USING (public.get_current_user_role() IN ('compliance_officer', 'admin', 'system_administrator'));

CREATE POLICY "Compliance officers can verify courses"
  ON public.ce_courses
  FOR UPDATE
  USING (public.get_current_user_role() IN ('compliance_officer', 'admin', 'system_administrator'));

-- RLS Policies for CE Reminders
CREATE POLICY "Agents can view own reminders"
  ON public.ce_reminders
  FOR SELECT
  USING ((SELECT user_id FROM public.insurance_agents WHERE id = agent_id) = auth.uid());

CREATE POLICY "Compliance officers can manage all reminders"
  ON public.ce_reminders
  FOR ALL
  USING (public.get_current_user_role() IN ('compliance_officer', 'admin', 'system_administrator'));

-- Create indexes for better performance
CREATE INDEX idx_insurance_agents_user_id ON public.insurance_agents(user_id);
CREATE INDEX idx_insurance_agents_state ON public.insurance_agents(state);
CREATE INDEX idx_insurance_agents_license_expiry ON public.insurance_agents(license_expiry);
CREATE INDEX idx_ce_courses_agent_id ON public.ce_courses(agent_id);
CREATE INDEX idx_ce_courses_completion_date ON public.ce_courses(completion_date);
CREATE INDEX idx_ce_reminders_agent_id ON public.ce_reminders(agent_id);
CREATE INDEX idx_ce_reminders_trigger_date ON public.ce_reminders(trigger_date);

-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update trigger to insurance_agents table
CREATE TRIGGER update_insurance_agents_updated_at
  BEFORE UPDATE ON public.insurance_agents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to automatically create reminders for expiring licenses
CREATE OR REPLACE FUNCTION public.check_license_expiry()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Create reminders for licenses expiring in 30 days
  INSERT INTO public.ce_reminders (agent_id, reminder_type, trigger_date, message)
  SELECT 
    id,
    'License Expiry',
    license_expiry - INTERVAL '30 days',
    'Your ' || license_type || ' license expires on ' || license_expiry::text || '. Please renew soon.'
  FROM public.insurance_agents
  WHERE license_expiry IS NOT NULL
    AND license_expiry BETWEEN now() + INTERVAL '30 days' AND now() + INTERVAL '31 days'
    AND status = 'active'
    AND NOT EXISTS (
      SELECT 1 FROM public.ce_reminders 
      WHERE agent_id = insurance_agents.id 
        AND reminder_type = 'License Expiry'
        AND reminder_status = 'pending'
    );

  -- Create reminders for CE credit deficiencies
  INSERT INTO public.ce_reminders (agent_id, reminder_type, trigger_date, message)
  SELECT 
    id,
    'CE Due Soon',
    ce_reporting_period_end - INTERVAL '60 days',
    'You have completed ' || ce_credits_completed || ' of ' || ce_credits_required || ' required CE credits. Period ends ' || ce_reporting_period_end::text || '.'
  FROM public.insurance_agents
  WHERE ce_reporting_period_end IS NOT NULL
    AND ce_credits_completed < ce_credits_required
    AND ce_reporting_period_end BETWEEN now() + INTERVAL '60 days' AND now() + INTERVAL '61 days'
    AND status = 'active'
    AND NOT EXISTS (
      SELECT 1 FROM public.ce_reminders 
      WHERE agent_id = insurance_agents.id 
        AND reminder_type = 'CE Due Soon'
        AND reminder_status = 'pending'
    );
END;
$$;

-- Function to update CE credits when courses are added/verified
CREATE OR REPLACE FUNCTION public.update_agent_ce_credits()
RETURNS TRIGGER AS $$
BEGIN
  -- Update total CE credits for the agent
  UPDATE public.insurance_agents
  SET ce_credits_completed = (
    SELECT COALESCE(SUM(credits_earned), 0)
    FROM public.ce_courses
    WHERE agent_id = NEW.agent_id
      AND verified = true
      AND completion_date BETWEEN 
        (SELECT ce_reporting_period_start FROM public.insurance_agents WHERE id = NEW.agent_id) AND
        (SELECT ce_reporting_period_end FROM public.insurance_agents WHERE id = NEW.agent_id)
  )
  WHERE id = NEW.agent_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update CE credits when courses are added or verified
CREATE TRIGGER update_ce_credits_on_course_change
  AFTER INSERT OR UPDATE ON public.ce_courses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_agent_ce_credits();