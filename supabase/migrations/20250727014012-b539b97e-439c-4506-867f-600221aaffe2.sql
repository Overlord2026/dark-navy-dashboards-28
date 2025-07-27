-- Create compliance_audit_trail table
CREATE TABLE public.compliance_audit_trail (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  action_type TEXT NOT NULL,
  performed_by UUID NOT NULL,
  ip_address INET,
  user_agent TEXT,
  details JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create investment_compliance table
CREATE TABLE public.investment_compliance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  offering_id TEXT NOT NULL,
  compliance_status TEXT NOT NULL DEFAULT 'pending' CHECK (compliance_status IN ('pending', 'approved', 'under_review', 'rejected')),
  due_diligence_status TEXT NOT NULL DEFAULT 'not_started' CHECK (due_diligence_status IN ('not_started', 'in_progress', 'completed', 'expired')),
  sec_status TEXT NOT NULL DEFAULT 'pending' CHECK (sec_status IN ('pending', 'compliant', 'non_compliant')),
  finra_status TEXT NOT NULL DEFAULT 'pending' CHECK (finra_status IN ('pending', 'compliant', 'non_compliant')),
  last_reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID,
  documents_verified BOOLEAN NOT NULL DEFAULT false,
  risk_assessment JSONB DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lending_partners table
CREATE TABLE public.lending_partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  contact_info JSONB DEFAULT '{}',
  compliance_status TEXT NOT NULL DEFAULT 'pending' CHECK (compliance_status IN ('pending', 'approved', 'under_review', 'rejected')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create loan_requests table
CREATE TABLE public.loan_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  partner_id UUID REFERENCES public.lending_partners(id),
  loan_type TEXT NOT NULL,
  requested_amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'in_review')),
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.compliance_audit_trail ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_compliance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lending_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_requests ENABLE ROW LEVEL SECURITY;

-- RLS policies for compliance_audit_trail
CREATE POLICY "Service role can manage audit trail" ON public.compliance_audit_trail
FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admins can view audit trail" ON public.compliance_audit_trail
FOR SELECT USING (has_any_role(ARRAY['admin', 'system_administrator', 'tenant_admin']));

-- RLS policies for investment_compliance
CREATE POLICY "Service role can manage investment compliance" ON public.investment_compliance
FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admins can manage investment compliance" ON public.investment_compliance
FOR ALL USING (has_any_role(ARRAY['admin', 'system_administrator', 'tenant_admin']));

-- RLS policies for lending_partners
CREATE POLICY "Service role can manage lending partners" ON public.lending_partners
FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Users can view active lending partners" ON public.lending_partners
FOR SELECT USING (is_active = true AND compliance_status = 'approved');

CREATE POLICY "Admins can manage lending partners" ON public.lending_partners
FOR ALL USING (has_any_role(ARRAY['admin', 'system_administrator', 'tenant_admin']));

-- RLS policies for loan_requests
CREATE POLICY "Users can manage their own loan requests" ON public.loan_requests
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage loan requests" ON public.loan_requests
FOR ALL USING (auth.role() = 'service_role');

-- Create updated_at triggers
CREATE TRIGGER update_investment_compliance_updated_at
BEFORE UPDATE ON public.investment_compliance
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_lending_partners_updated_at
BEFORE UPDATE ON public.lending_partners
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_loan_requests_updated_at
BEFORE UPDATE ON public.loan_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

-- Create indexes for performance
CREATE INDEX idx_compliance_audit_trail_entity ON public.compliance_audit_trail(entity_type, entity_id);
CREATE INDEX idx_compliance_audit_trail_timestamp ON public.compliance_audit_trail(timestamp DESC);
CREATE INDEX idx_investment_compliance_offering ON public.investment_compliance(offering_id);
CREATE INDEX idx_investment_compliance_status ON public.investment_compliance(compliance_status);
CREATE INDEX idx_lending_partners_active ON public.lending_partners(is_active, compliance_status);
CREATE INDEX idx_loan_requests_user ON public.loan_requests(user_id);
CREATE INDEX idx_loan_requests_partner ON public.loan_requests(partner_id);