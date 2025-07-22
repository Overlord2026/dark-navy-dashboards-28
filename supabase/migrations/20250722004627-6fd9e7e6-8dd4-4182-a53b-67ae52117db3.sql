-- Security Training and Reporting System (Fixed)

-- Security training programs table
CREATE TABLE public.security_training_programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID,
  program_name TEXT NOT NULL,
  program_type TEXT NOT NULL CHECK (program_type IN ('phishing_simulation', 'zero_trust_training', 'general_security', 'compliance_training', 'incident_response')),
  description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  required_for_roles TEXT[] DEFAULT ARRAY['all'],
  training_materials JSONB DEFAULT '{}',
  quiz_questions JSONB DEFAULT '[]',
  passing_score INTEGER DEFAULT 80,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Security training schedules
CREATE TABLE public.security_training_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID,
  program_id UUID NOT NULL REFERENCES public.security_training_programs(id) ON DELETE CASCADE,
  schedule_name TEXT NOT NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('quarterly', 'monthly', 'annually', 'one_time')),
  next_due_date DATE NOT NULL,
  last_completed_date DATE,
  target_audience TEXT[] DEFAULT ARRAY['all_staff', 'contractors'],
  mandatory BOOLEAN NOT NULL DEFAULT true,
  reminder_days_before INTEGER DEFAULT 7,
  escalation_days_after INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Individual training completions
CREATE TABLE public.security_training_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID,
  user_id UUID NOT NULL,
  program_id UUID NOT NULL REFERENCES public.security_training_programs(id) ON DELETE CASCADE,
  schedule_id UUID REFERENCES public.security_training_schedules(id) ON DELETE SET NULL,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  score INTEGER,
  time_spent_minutes INTEGER,
  passed BOOLEAN DEFAULT false,
  attempts INTEGER DEFAULT 0,
  certificate_issued BOOLEAN DEFAULT false,
  certificate_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Phishing simulation campaigns
CREATE TABLE public.phishing_simulations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID,
  campaign_name TEXT NOT NULL,
  campaign_type TEXT NOT NULL CHECK (campaign_type IN ('email_phishing', 'sms_phishing', 'voice_phishing', 'social_engineering')),
  template_content JSONB NOT NULL DEFAULT '{}',
  target_users UUID[] NOT NULL DEFAULT '{}',
  launch_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'completed', 'cancelled')),
  success_criteria JSONB DEFAULT '{}',
  results_summary JSONB DEFAULT '{}',
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Phishing simulation results
CREATE TABLE public.phishing_simulation_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID,
  simulation_id UUID NOT NULL REFERENCES public.phishing_simulations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  email_opened BOOLEAN DEFAULT false,
  link_clicked BOOLEAN DEFAULT false,
  data_entered BOOLEAN DEFAULT false,
  reported_suspicious BOOLEAN DEFAULT false,
  time_to_report_minutes INTEGER,
  user_agent TEXT,
  ip_address INET,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  reported_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Security issue reports
CREATE TABLE public.security_issue_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID,
  reported_by_user_id UUID,
  reporter_name TEXT,
  reporter_email TEXT NOT NULL,
  reporter_phone TEXT,
  issue_type TEXT NOT NULL CHECK (issue_type IN ('phishing_email', 'suspicious_activity', 'data_breach', 'malware', 'unauthorized_access', 'policy_violation', 'physical_security', 'other')),
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  affected_systems TEXT[],
  evidence_urls TEXT[],
  incident_datetime TIMESTAMP WITH TIME ZONE,
  location TEXT,
  witnesses TEXT[],
  immediate_actions_taken TEXT,
  status TEXT NOT NULL DEFAULT 'reported' CHECK (status IN ('reported', 'investigating', 'confirmed', 'resolved', 'false_positive')),
  assigned_to UUID,
  resolution_notes TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_date DATE,
  anonymized BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Security review checklists
CREATE TABLE public.security_review_checklists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID,
  checklist_name TEXT NOT NULL,
  checklist_type TEXT NOT NULL CHECK (checklist_type IN ('code_review', 'product_planning', 'architecture_review', 'deployment_review')),
  checklist_items JSONB NOT NULL DEFAULT '[]',
  mandatory_items TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  version INTEGER DEFAULT 1,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Security review completions
CREATE TABLE public.security_review_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID,
  checklist_id UUID NOT NULL REFERENCES public.security_review_checklists(id) ON DELETE CASCADE,
  review_subject TEXT NOT NULL,
  review_type TEXT NOT NULL,
  reviewed_by UUID NOT NULL,
  review_date DATE NOT NULL DEFAULT CURRENT_DATE,
  checklist_responses JSONB NOT NULL DEFAULT '{}',
  overall_status TEXT NOT NULL CHECK (overall_status IN ('passed', 'failed', 'needs_revision')),
  security_concerns TEXT[],
  recommendations TEXT[],
  blocking_issues TEXT[],
  approved_for_production BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.security_training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_training_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_training_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phishing_simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phishing_simulation_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_issue_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_review_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_review_completions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for security training programs
CREATE POLICY "Admins can manage security training programs in their tenant"
ON public.security_training_programs FOR ALL
TO authenticated
USING (COALESCE(tenant_id, get_current_user_tenant_id()) = get_current_user_tenant_id() AND has_any_role(ARRAY['admin', 'tenant_admin', 'security_officer']));

CREATE POLICY "Users can view active security training programs"
ON public.security_training_programs FOR SELECT
TO authenticated
USING (COALESCE(tenant_id, get_current_user_tenant_id()) = get_current_user_tenant_id() AND is_active = true);

-- RLS Policies for training schedules
CREATE POLICY "Admins can manage training schedules in their tenant"
ON public.security_training_schedules FOR ALL
TO authenticated
USING (COALESCE(tenant_id, get_current_user_tenant_id()) = get_current_user_tenant_id() AND has_any_role(ARRAY['admin', 'tenant_admin', 'security_officer']));

CREATE POLICY "Users can view training schedules"
ON public.security_training_schedules FOR SELECT
TO authenticated
USING (COALESCE(tenant_id, get_current_user_tenant_id()) = get_current_user_tenant_id());

-- RLS Policies for training completions
CREATE POLICY "Users can manage their own training completions"
ON public.security_training_completions FOR ALL
TO authenticated
USING (COALESCE(tenant_id, get_current_user_tenant_id()) = get_current_user_tenant_id() AND (user_id = auth.uid() OR has_any_role(ARRAY['admin', 'tenant_admin', 'security_officer'])));

-- RLS Policies for phishing simulations
CREATE POLICY "Security officers can manage phishing simulations"
ON public.phishing_simulations FOR ALL
TO authenticated
USING (COALESCE(tenant_id, get_current_user_tenant_id()) = get_current_user_tenant_id() AND has_any_role(ARRAY['admin', 'tenant_admin', 'security_officer']));

-- RLS Policies for phishing results
CREATE POLICY "Security officers can manage phishing results"
ON public.phishing_simulation_results FOR ALL
TO authenticated
USING (COALESCE(tenant_id, get_current_user_tenant_id()) = get_current_user_tenant_id() AND has_any_role(ARRAY['admin', 'tenant_admin', 'security_officer']));

CREATE POLICY "Users can view their own phishing results"
ON public.phishing_simulation_results FOR SELECT
TO authenticated
USING (COALESCE(tenant_id, get_current_user_tenant_id()) = get_current_user_tenant_id() AND user_id = auth.uid());

-- RLS Policies for security issue reports
CREATE POLICY "Anyone can create security issue reports"
ON public.security_issue_reports FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can view their own reports"
ON public.security_issue_reports FOR SELECT
TO authenticated
USING (COALESCE(tenant_id, get_current_user_tenant_id()) = get_current_user_tenant_id() AND (reported_by_user_id = auth.uid() OR has_any_role(ARRAY['admin', 'tenant_admin', 'security_officer'])));

CREATE POLICY "Security officers can manage all reports"
ON public.security_issue_reports FOR ALL
TO authenticated
USING (COALESCE(tenant_id, get_current_user_tenant_id()) = get_current_user_tenant_id() AND has_any_role(ARRAY['admin', 'tenant_admin', 'security_officer']));

-- RLS Policies for security review checklists
CREATE POLICY "Security officers can manage review checklists"
ON public.security_review_checklists FOR ALL
TO authenticated
USING (COALESCE(tenant_id, get_current_user_tenant_id()) = get_current_user_tenant_id() AND has_any_role(ARRAY['admin', 'tenant_admin', 'security_officer']));

CREATE POLICY "Users can view active checklists"
ON public.security_review_checklists FOR SELECT
TO authenticated
USING (COALESCE(tenant_id, get_current_user_tenant_id()) = get_current_user_tenant_id() AND is_active = true);

-- RLS Policies for security review completions
CREATE POLICY "Users can manage security review completions"
ON public.security_review_completions FOR ALL
TO authenticated
USING (COALESCE(tenant_id, get_current_user_tenant_id()) = get_current_user_tenant_id() AND (reviewed_by = auth.uid() OR has_any_role(ARRAY['admin', 'tenant_admin', 'security_officer'])));

-- Create indexes for performance
CREATE INDEX idx_security_training_schedules_next_due ON public.security_training_schedules(next_due_date) WHERE next_due_date IS NOT NULL;
CREATE INDEX idx_security_training_completions_user_program ON public.security_training_completions(user_id, program_id);
CREATE INDEX idx_phishing_simulations_status ON public.phishing_simulations(status, launch_date);
CREATE INDEX idx_security_issue_reports_status ON public.security_issue_reports(status, severity, created_at);
CREATE INDEX idx_security_review_completions_date ON public.security_review_completions(review_date, overall_status);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_security_training_programs_updated_at
  BEFORE UPDATE ON public.security_training_programs
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_security_training_schedules_updated_at
  BEFORE UPDATE ON public.security_training_schedules
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_security_training_completions_updated_at
  BEFORE UPDATE ON public.security_training_completions
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_phishing_simulations_updated_at
  BEFORE UPDATE ON public.phishing_simulations
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_security_issue_reports_updated_at
  BEFORE UPDATE ON public.security_issue_reports
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_security_review_checklists_updated_at
  BEFORE UPDATE ON public.security_review_checklists
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_security_review_completions_updated_at
  BEFORE UPDATE ON public.security_review_completions
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

-- Function to calculate next training due date
CREATE OR REPLACE FUNCTION public.calculate_next_training_due_date(p_frequency TEXT, p_last_completed DATE DEFAULT NULL)
RETURNS DATE
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  base_date DATE;
BEGIN
  base_date := COALESCE(p_last_completed, CURRENT_DATE);
  
  RETURN CASE p_frequency
    WHEN 'quarterly' THEN base_date + INTERVAL '3 months'
    WHEN 'monthly' THEN base_date + INTERVAL '1 month'
    WHEN 'annually' THEN base_date + INTERVAL '1 year'
    ELSE base_date + INTERVAL '3 months'
  END;
END;
$$;

-- Function to update training schedule after completion
CREATE OR REPLACE FUNCTION public.update_training_schedule_on_completion()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.completed_at IS NOT NULL AND OLD.completed_at IS NULL THEN
    UPDATE public.security_training_schedules
    SET 
      last_completed_date = NEW.completed_at::DATE,
      next_due_date = public.calculate_next_training_due_date(frequency, NEW.completed_at::DATE),
      updated_at = now()
    WHERE id = NEW.schedule_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to update training schedules
CREATE TRIGGER update_training_schedule_on_completion
  AFTER UPDATE ON public.security_training_completions
  FOR EACH ROW EXECUTE FUNCTION public.update_training_schedule_on_completion();