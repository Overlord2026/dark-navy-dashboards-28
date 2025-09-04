-- Compliance Persona System Database Migration

-- Create compliance configurations table
CREATE TABLE public.compliance_persona_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  persona TEXT NOT NULL,
  regulatory_bodies TEXT[] NOT NULL DEFAULT '{}',
  ce_hours_per_cycle INTEGER NOT NULL DEFAULT 0,
  ce_cycle_months INTEGER NOT NULL DEFAULT 12,
  ethics_hours INTEGER DEFAULT 0,
  specialty_requirements JSONB DEFAULT '{}',
  record_retention_client_years INTEGER NOT NULL DEFAULT 7,
  record_retention_transaction_years INTEGER NOT NULL DEFAULT 3,
  record_retention_communication_years INTEGER NOT NULL DEFAULT 3,
  record_retention_audit_years INTEGER NOT NULL DEFAULT 5,
  audit_frequency_internal_months INTEGER NOT NULL DEFAULT 12,
  audit_frequency_external_years INTEGER NOT NULL DEFAULT 3,
  audit_frequency_regulatory_years INTEGER,
  requires_state_registration BOOLEAN NOT NULL DEFAULT true,
  county_variances BOOLEAN NOT NULL DEFAULT false,
  federal_oversight BOOLEAN NOT NULL DEFAULT false,
  voice_ce_delivery BOOLEAN NOT NULL DEFAULT false,
  voice_compliance_alerts BOOLEAN NOT NULL DEFAULT false,
  voice_recording_requirements BOOLEAN NOT NULL DEFAULT false,
  voice_transcription_mandatory BOOLEAN NOT NULL DEFAULT false,
  premium_advanced_analytics BOOLEAN NOT NULL DEFAULT false,
  premium_custom_reporting BOOLEAN NOT NULL DEFAULT false,
  premium_ai_risk_scoring BOOLEAN NOT NULL DEFAULT false,
  premium_realtime_monitoring BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create geo-specific compliance configurations
CREATE TABLE public.compliance_geo_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state TEXT NOT NULL,
  county TEXT,
  municipality TEXT,
  persona TEXT NOT NULL,
  special_rules JSONB DEFAULT '{}',
  additional_requirements TEXT[] DEFAULT '{}',
  exemptions TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create voice CE sessions table
CREATE TABLE public.voice_ce_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  persona TEXT NOT NULL,
  course_id TEXT NOT NULL,
  course_name TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
  completion_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  hours_earned DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  progress_markers JSONB DEFAULT '[]',
  interaction_log JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create voice compliance alerts table
CREATE TABLE public.voice_compliance_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  persona TEXT NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('ce_deadline', 'audit_due', 'violation_detected', 'record_retention')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  message TEXT NOT NULL,
  voice_script TEXT NOT NULL,
  delivery_preference TEXT NOT NULL DEFAULT 'immediate' CHECK (delivery_preference IN ('immediate', 'scheduled', 'batch')),
  delivered_at TIMESTAMP WITH TIME ZONE,
  acknowledged BOOLEAN NOT NULL DEFAULT false,
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create compliance events table for audit trail
CREATE TABLE public.compliance_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  persona TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('ce_completion', 'audit_action', 'record_access', 'communication', 'violation')),
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
  requires_action BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create CE records table for voice and traditional CE
CREATE TABLE public.compliance_ce_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  persona TEXT NOT NULL,
  course_id TEXT NOT NULL,
  course_name TEXT NOT NULL,
  provider TEXT NOT NULL,
  hours_earned DECIMAL(5,2) NOT NULL,
  ethics_hours DECIMAL(5,2) DEFAULT 0.00,
  specialty_type TEXT,
  completion_date DATE NOT NULL,
  expiration_date DATE NOT NULL,
  certificate_url TEXT,
  delivery_method TEXT NOT NULL CHECK (delivery_method IN ('in_person', 'online', 'voice_ai', 'hybrid')),
  state TEXT,
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  voice_session_id UUID REFERENCES public.voice_ce_sessions(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit actions table
CREATE TABLE public.compliance_audit_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  persona TEXT NOT NULL,
  audit_type TEXT NOT NULL CHECK (audit_type IN ('internal', 'external', 'regulatory', 'self')),
  triggered_by TEXT NOT NULL CHECK (triggered_by IN ('schedule', 'event', 'manual', 'ai_alert')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
  findings TEXT[] DEFAULT '{}',
  recommendations TEXT[] DEFAULT '{}',
  follow_up_required BOOLEAN NOT NULL DEFAULT false,
  due_date DATE NOT NULL,
  completed_date DATE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.compliance_persona_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_geo_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_ce_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_compliance_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_ce_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_audit_actions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for compliance_persona_configs (readable by all authenticated users)
CREATE POLICY "Everyone can view compliance configs" ON public.compliance_persona_configs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can modify compliance configs" ON public.compliance_persona_configs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'system_administrator')
    )
  );

-- Create RLS policies for compliance_geo_configs
CREATE POLICY "Everyone can view geo compliance configs" ON public.compliance_geo_configs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can modify geo compliance configs" ON public.compliance_geo_configs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'system_administrator')
    )
  );

-- Create RLS policies for voice_ce_sessions
CREATE POLICY "Users can manage their own voice CE sessions" ON public.voice_ce_sessions
  FOR ALL USING (user_id = auth.uid());

-- Create RLS policies for voice_compliance_alerts
CREATE POLICY "Users can manage their own voice compliance alerts" ON public.voice_compliance_alerts
  FOR ALL USING (user_id = auth.uid());

-- Create RLS policies for compliance_events
CREATE POLICY "Users can view their own compliance events" ON public.compliance_events
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can insert compliance events" ON public.compliance_events
  FOR INSERT WITH CHECK (true);

-- Create RLS policies for compliance_ce_records
CREATE POLICY "Users can manage their own CE records" ON public.compliance_ce_records
  FOR ALL USING (user_id = auth.uid());

-- Create RLS policies for compliance_audit_actions
CREATE POLICY "Users can manage their own audit actions" ON public.compliance_audit_actions
  FOR ALL USING (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX idx_compliance_persona_configs_persona ON public.compliance_persona_configs(persona);
CREATE INDEX idx_compliance_geo_configs_state_persona ON public.compliance_geo_configs(state, persona);
CREATE INDEX idx_voice_ce_sessions_user_status ON public.voice_ce_sessions(user_id, status);
CREATE INDEX idx_voice_compliance_alerts_user_priority ON public.voice_compliance_alerts(user_id, priority);
CREATE INDEX idx_compliance_events_user_type ON public.compliance_events(user_id, event_type);
CREATE INDEX idx_compliance_ce_records_user_persona ON public.compliance_ce_records(user_id, persona);
CREATE INDEX idx_compliance_audit_actions_user_status ON public.compliance_audit_actions(user_id, status);

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION update_compliance_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER compliance_persona_configs_updated_at
  BEFORE UPDATE ON public.compliance_persona_configs
  FOR EACH ROW EXECUTE FUNCTION update_compliance_updated_at();

CREATE TRIGGER compliance_geo_configs_updated_at
  BEFORE UPDATE ON public.compliance_geo_configs
  FOR EACH ROW EXECUTE FUNCTION update_compliance_updated_at();

CREATE TRIGGER voice_ce_sessions_updated_at
  BEFORE UPDATE ON public.voice_ce_sessions
  FOR EACH ROW EXECUTE FUNCTION update_compliance_updated_at();

CREATE TRIGGER voice_compliance_alerts_updated_at
  BEFORE UPDATE ON public.voice_compliance_alerts
  FOR EACH ROW EXECUTE FUNCTION update_compliance_updated_at();

CREATE TRIGGER compliance_ce_records_updated_at
  BEFORE UPDATE ON public.compliance_ce_records
  FOR EACH ROW EXECUTE FUNCTION update_compliance_updated_at();

CREATE TRIGGER compliance_audit_actions_updated_at
  BEFORE UPDATE ON public.compliance_audit_actions
  FOR EACH ROW EXECUTE FUNCTION update_compliance_updated_at();

-- Insert default compliance configurations
INSERT INTO public.compliance_persona_configs (
  persona, regulatory_bodies, ce_hours_per_cycle, ce_cycle_months, ethics_hours,
  specialty_requirements, record_retention_client_years, record_retention_transaction_years,
  record_retention_communication_years, record_retention_audit_years,
  audit_frequency_internal_months, audit_frequency_external_years, audit_frequency_regulatory_years,
  requires_state_registration, county_variances, federal_oversight,
  voice_ce_delivery, voice_compliance_alerts, voice_recording_requirements, voice_transcription_mandatory,
  premium_advanced_analytics, premium_custom_reporting, premium_ai_risk_scoring, premium_realtime_monitoring
) VALUES 
-- Financial Advisors
('advisor', ARRAY['SEC', 'FINRA', 'STATE_SECURITIES'], 30, 36, 2,
 '{"retirement_planning": 4, "estate_planning": 6, "tax_planning": 4}',
 7, 3, 3, 5, 12, 3, 2, true, false, true,
 true, true, true, false, true, true, true, true),

-- CPAs/Accountants
('cpa', ARRAY['AICPA', 'IRS', 'STATE_BOARD_ACCOUNTANCY'], 40, 12, 4,
 '{"tax_preparation": 8, "audit": 12, "forensic_accounting": 6}',
 7, 7, 5, 7, 6, 3, 3, true, false, true,
 true, true, false, false, true, true, false, true),

-- Estate Planning Attorneys
('attorney', ARRAY['STATE_BAR', 'ABA', 'STATE_ETHICS_BOARD'], 15, 12, 3,
 '{"estate_planning": 6, "tax_law": 4, "elder_law": 5}',
 10, 7, 7, 10, 12, 5, 3, true, true, false,
 true, true, true, true, true, true, true, true),

-- Insurance Agents
('insurance', ARRAY['NAIC', 'STATE_INSURANCE_DEPT', 'FINRA'], 24, 24, 3,
 '{"life_insurance": 8, "health_insurance": 6, "variable_products": 12, "medicare_supplement": 8, "long_term_care": 8, "property_casualty": 20}',
 10, 10, 5, 10, 12, 3, 2, true, false, true,
 true, true, true, false, true, true, true, true),

-- Healthcare Providers
('healthcare', ARRAY['HHS', 'STATE_HEALTH_DEPT', 'MEDICAL_BOARD'], 50, 24, 4,
 '{"medical_ethics": 8, "hipaa_compliance": 6, "patient_safety": 10}',
 7, 7, 7, 6, 6, 2, 1, true, true, true,
 true, true, true, true, true, true, true, true),

-- Consultants/Coaches
('consultant', ARRAY['ICF', 'CCE', 'PROFESSIONAL_ASSOCIATION'], 20, 36, 3,
 '{"professional_ethics": 3, "continuing_education": 5}',
 7, 3, 3, 5, 24, 5, NULL, false, false, false,
 true, false, false, false, false, false, false, false);

-- Insert some sample geo-specific configurations
INSERT INTO public.compliance_geo_configs (state, county, persona, special_rules, additional_requirements, exemptions) VALUES
('CA', NULL, 'advisor', '{"additional_ethics_hours": 2}', ARRAY['ca_state_exam'], ARRAY[]),
('NY', 'New York', 'attorney', '{"bar_exam_required": true}', ARRAY['ny_bar_membership'], ARRAY[]),
('FL', NULL, 'insurance', '{"hurricane_insurance_required": true}', ARRAY['fl_insurance_license'], ARRAY['flood_insurance']);