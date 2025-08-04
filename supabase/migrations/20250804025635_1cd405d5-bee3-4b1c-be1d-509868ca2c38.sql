-- Create comprehensive compliance tables for the compliance officer persona

-- Mock audit system
CREATE TABLE public.mock_audits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  audit_name TEXT NOT NULL,
  audit_type TEXT NOT NULL CHECK (audit_type IN ('SEC', 'STATE', 'FINRA', 'DOL', 'INSURANCE', 'CUSTOM')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed', 'archived')),
  template_id UUID,
  firm_id UUID NOT NULL,
  created_by UUID NOT NULL,
  assigned_to UUID,
  scheduled_date TIMESTAMP WITH TIME ZONE,
  started_date TIMESTAMP WITH TIME ZONE,
  completed_date TIMESTAMP WITH TIME ZONE,
  overall_score NUMERIC(3,1),
  findings_count INTEGER DEFAULT 0,
  critical_findings INTEGER DEFAULT 0,
  audit_data JSONB DEFAULT '{}',
  evidence_urls TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Mock audit checklists and templates
CREATE TABLE public.audit_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  audit_type TEXT NOT NULL,
  description TEXT,
  checklist_items JSONB NOT NULL DEFAULT '[]',
  evidence_requirements JSONB DEFAULT '[]',
  scoring_criteria JSONB DEFAULT '{}',
  is_system_template BOOLEAN DEFAULT true,
  created_by UUID,
  firm_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Compliance tasks and deadlines
CREATE TABLE public.compliance_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  task_type TEXT NOT NULL CHECK (task_type IN ('filing', 'training', 'review', 'audit', 'document', 'other')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'overdue', 'cancelled')),
  regulatory_type TEXT,
  assigned_to UUID,
  created_by UUID NOT NULL,
  firm_id UUID NOT NULL,
  due_date DATE,
  start_date DATE,
  completed_date TIMESTAMP WITH TIME ZONE,
  recurring_rule TEXT,
  parent_task_id UUID,
  compliance_category TEXT,
  evidence_required BOOLEAN DEFAULT false,
  evidence_urls TEXT[],
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Document vault with retention policies
CREATE TABLE public.compliance_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_name TEXT NOT NULL,
  document_type TEXT NOT NULL,
  document_category TEXT,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  version_number INTEGER DEFAULT 1,
  is_current_version BOOLEAN DEFAULT true,
  parent_document_id UUID,
  firm_id UUID NOT NULL,
  uploaded_by UUID NOT NULL,
  reviewed_by UUID,
  approved_by UUID,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'under_review', 'approved', 'expired', 'archived')),
  retention_period_years INTEGER,
  expiration_date DATE,
  last_reviewed_date DATE,
  tags TEXT[],
  compliance_flags JSONB DEFAULT '{}',
  access_log JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Continuing education tracking
CREATE TABLE public.ce_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  firm_id UUID NOT NULL,
  license_type TEXT NOT NULL,
  license_number TEXT,
  license_state TEXT,
  ce_period_start DATE NOT NULL,
  ce_period_end DATE NOT NULL,
  required_hours NUMERIC(4,1) NOT NULL,
  completed_hours NUMERIC(4,1) DEFAULT 0,
  ethics_hours_required NUMERIC(4,1) DEFAULT 0,
  ethics_hours_completed NUMERIC(4,1) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired', 'exempt')),
  compliance_status TEXT DEFAULT 'on_track' CHECK (compliance_status IN ('on_track', 'at_risk', 'behind', 'non_compliant')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- CE course completions
CREATE TABLE public.ce_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ce_tracking_id UUID NOT NULL REFERENCES public.ce_tracking(id) ON DELETE CASCADE,
  course_name TEXT NOT NULL,
  provider_name TEXT,
  completion_date DATE NOT NULL,
  hours_earned NUMERIC(4,1) NOT NULL,
  ethics_hours NUMERIC(4,1) DEFAULT 0,
  certificate_url TEXT,
  course_type TEXT,
  verification_code TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Regulatory alerts and news
CREATE TABLE public.regulatory_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('SEC', 'FINRA', 'STATE', 'IRS', 'DOL', 'INSURANCE', 'GENERAL')),
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  regulatory_body TEXT,
  effective_date DATE,
  deadline_date DATE,
  source_url TEXT,
  is_system_alert BOOLEAN DEFAULT true,
  created_by UUID,
  target_audience TEXT[],
  action_required BOOLEAN DEFAULT false,
  action_items TEXT[],
  related_documents UUID[],
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'superseded')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Compliance violations and incidents
CREATE TABLE public.compliance_incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  incident_title TEXT NOT NULL,
  incident_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description TEXT NOT NULL,
  firm_id UUID NOT NULL,
  reported_by UUID,
  assigned_to UUID,
  discovery_date DATE NOT NULL,
  resolution_date DATE,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
  regulatory_impact TEXT,
  root_cause TEXT,
  corrective_actions TEXT[],
  prevention_measures TEXT[],
  estimated_cost NUMERIC(12,2),
  actual_cost NUMERIC(12,2),
  regulatory_filing_required BOOLEAN DEFAULT false,
  regulatory_filing_date DATE,
  is_anonymous BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Risk assessments
CREATE TABLE public.compliance_risk_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_name TEXT NOT NULL,
  firm_id UUID NOT NULL,
  conducted_by UUID NOT NULL,
  assessment_date DATE NOT NULL,
  assessment_type TEXT NOT NULL,
  scope_description TEXT,
  risk_categories JSONB NOT NULL DEFAULT '[]',
  overall_risk_score NUMERIC(3,1),
  risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  findings JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  mitigation_plan JSONB DEFAULT '{}',
  next_assessment_date DATE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'approved', 'archived')),
  approved_by UUID,
  approved_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.mock_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ce_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ce_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regulatory_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_risk_assessments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for compliance officers and related roles
CREATE POLICY "Compliance officers can manage audits in their firm" ON public.mock_audits
FOR ALL USING (
  firm_id IN (
    SELECT tenant_id FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('compliance_officer', 'compliance_provider', 'admin', 'system_administrator', 'tenant_admin')
  )
);

CREATE POLICY "Compliance officers can view audit templates" ON public.audit_templates
FOR SELECT USING (
  is_system_template = true OR 
  firm_id IN (
    SELECT tenant_id FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('compliance_officer', 'compliance_provider', 'admin', 'system_administrator', 'tenant_admin')
  )
);

CREATE POLICY "Compliance officers can manage tasks in their firm" ON public.compliance_tasks
FOR ALL USING (
  firm_id IN (
    SELECT tenant_id FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('compliance_officer', 'compliance_provider', 'admin', 'system_administrator', 'tenant_admin')
  )
);

CREATE POLICY "Compliance officers can manage documents in their firm" ON public.compliance_documents
FOR ALL USING (
  firm_id IN (
    SELECT tenant_id FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('compliance_officer', 'compliance_provider', 'admin', 'system_administrator', 'tenant_admin')
  )
);

CREATE POLICY "Users can view their CE tracking" ON public.ce_tracking
FOR SELECT USING (
  user_id = auth.uid() OR 
  firm_id IN (
    SELECT tenant_id FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('compliance_officer', 'compliance_provider', 'admin', 'system_administrator', 'tenant_admin')
  )
);

CREATE POLICY "Compliance officers can manage CE tracking" ON public.ce_tracking
FOR ALL USING (
  firm_id IN (
    SELECT tenant_id FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('compliance_officer', 'compliance_provider', 'admin', 'system_administrator', 'tenant_admin')
  )
);

CREATE POLICY "Users can view regulatory alerts" ON public.regulatory_alerts
FOR SELECT USING (true);

CREATE POLICY "Compliance officers can manage incidents in their firm" ON public.compliance_incidents
FOR ALL USING (
  firm_id IN (
    SELECT tenant_id FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('compliance_officer', 'compliance_provider', 'admin', 'system_administrator', 'tenant_admin')
  )
);

CREATE POLICY "Compliance officers can manage risk assessments in their firm" ON public.compliance_risk_assessments
FOR ALL USING (
  firm_id IN (
    SELECT tenant_id FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('compliance_officer', 'compliance_provider', 'admin', 'system_administrator', 'tenant_admin')
  )
);

-- Create indexes for performance
CREATE INDEX idx_mock_audits_firm_status ON public.mock_audits(firm_id, status);
CREATE INDEX idx_compliance_tasks_assigned_due ON public.compliance_tasks(assigned_to, due_date);
CREATE INDEX idx_compliance_documents_firm_type ON public.compliance_documents(firm_id, document_type);
CREATE INDEX idx_ce_tracking_user_period ON public.ce_tracking(user_id, ce_period_end);
CREATE INDEX idx_regulatory_alerts_type_date ON public.regulatory_alerts(alert_type, created_at);
CREATE INDEX idx_compliance_incidents_firm_status ON public.compliance_incidents(firm_id, status);