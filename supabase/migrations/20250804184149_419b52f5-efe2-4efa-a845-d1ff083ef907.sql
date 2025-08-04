-- Accountant CE & Compliance Database Schema

-- 1. Accountant CE Requirements (state-specific rules)
CREATE TABLE public.accountant_ce_requirements (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  state text NOT NULL,
  credential_type text NOT NULL, -- CPA, EA, CFE, etc.
  ce_hours_required integer NOT NULL DEFAULT 40,
  renewal_cycle_months integer NOT NULL DEFAULT 12,
  reporting_deadline text, -- e.g., "December 31", "Birth month", etc.
  ethics_required boolean DEFAULT false,
  ethics_hours_required integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  notes text,
  audit_frequency_years integer DEFAULT 3, -- State audit cycle
  specialty_requirements jsonb DEFAULT '[]'::jsonb,
  UNIQUE(state, credential_type)
);

-- 2. Accountant CE Records (completed courses)
CREATE TABLE public.accountant_ce_records (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  credential_type text NOT NULL,
  state text NOT NULL,
  course_name text NOT NULL,
  provider text NOT NULL,
  ce_hours numeric NOT NULL DEFAULT 0,
  ethics_hours numeric DEFAULT 0,
  date_completed date NOT NULL,
  certificate_url text,
  certificate_number text,
  status text NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'pending_verification', 'verified', 'rejected')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  renewal_period text, -- e.g., "2024", "2023-2024" to track which renewal period
  notes text,
  provider_id uuid REFERENCES public.accountant_ce_providers(id)
);

-- 3. Accountant License Status
CREATE TABLE public.accountant_license_status (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  state text NOT NULL,
  credential_type text NOT NULL,
  license_number text NOT NULL,
  issue_date date,
  expiration_date date NOT NULL,
  renewal_status text NOT NULL DEFAULT 'active' CHECK (renewal_status IN ('active', 'expired', 'pending_renewal', 'suspended', 'revoked')),
  audit_flag boolean DEFAULT false,
  audit_selected_date date,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  notes text,
  ce_hours_completed numeric DEFAULT 0,
  ce_hours_required numeric DEFAULT 40,
  ethics_hours_completed numeric DEFAULT 0,
  ethics_hours_required numeric DEFAULT 0,
  UNIQUE(user_id, state, credential_type)
);

-- 4. Accountant CE Providers
CREATE TABLE public.accountant_ce_providers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_name text NOT NULL,
  approved_states text[] DEFAULT '{}',
  url text,
  specialty text[],
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  provider_code text,
  contact_info jsonb DEFAULT '{}'::jsonb,
  course_catalog_url text
);

-- 5. Accountant CE Alerts
CREATE TABLE public.accountant_ce_alerts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  alert_type text NOT NULL CHECK (alert_type IN ('renewal_due', 'ce_deficit', 'ethics_required', 'audit_selected', 'deadline_warning')),
  due_date date,
  resolved boolean DEFAULT false,
  resolved_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  notes text,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  license_id uuid REFERENCES public.accountant_license_status(id),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS on all tables
ALTER TABLE public.accountant_ce_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accountant_ce_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accountant_license_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accountant_ce_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accountant_ce_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for accountant_ce_requirements (Public read, admin write)
CREATE POLICY "Anyone can view CE requirements" 
ON public.accountant_ce_requirements 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage CE requirements" 
ON public.accountant_ce_requirements 
FOR ALL 
USING (has_any_role(ARRAY['admin', 'system_administrator', 'compliance_officer']));

-- RLS Policies for accountant_ce_records
CREATE POLICY "Users can view their own CE records" 
ON public.accountant_ce_records 
FOR SELECT 
USING (user_id = auth.uid() OR has_any_role(ARRAY['admin', 'system_administrator', 'compliance_officer']));

CREATE POLICY "Users can create their own CE records" 
ON public.accountant_ce_records 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own CE records" 
ON public.accountant_ce_records 
FOR UPDATE 
USING (user_id = auth.uid() OR has_any_role(ARRAY['admin', 'system_administrator', 'compliance_officer']));

CREATE POLICY "Users can delete their own CE records" 
ON public.accountant_ce_records 
FOR DELETE 
USING (user_id = auth.uid() OR has_any_role(ARRAY['admin', 'system_administrator', 'compliance_officer']));

-- RLS Policies for accountant_license_status
CREATE POLICY "Users can view their own license status" 
ON public.accountant_license_status 
FOR SELECT 
USING (user_id = auth.uid() OR has_any_role(ARRAY['admin', 'system_administrator', 'compliance_officer']));

CREATE POLICY "Users can create their own license status" 
ON public.accountant_license_status 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own license status" 
ON public.accountant_license_status 
FOR UPDATE 
USING (user_id = auth.uid() OR has_any_role(ARRAY['admin', 'system_administrator', 'compliance_officer']));

-- RLS Policies for accountant_ce_providers (Public read, admin write)
CREATE POLICY "Anyone can view active CE providers" 
ON public.accountant_ce_providers 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage CE providers" 
ON public.accountant_ce_providers 
FOR ALL 
USING (has_any_role(ARRAY['admin', 'system_administrator', 'compliance_officer']));

-- RLS Policies for accountant_ce_alerts
CREATE POLICY "Users can view their own CE alerts" 
ON public.accountant_ce_alerts 
FOR SELECT 
USING (user_id = auth.uid() OR has_any_role(ARRAY['admin', 'system_administrator', 'compliance_officer']));

CREATE POLICY "Users can create their own CE alerts" 
ON public.accountant_ce_alerts 
FOR INSERT 
WITH CHECK (user_id = auth.uid() OR has_any_role(ARRAY['admin', 'system_administrator', 'compliance_officer']));

CREATE POLICY "Users can update their own CE alerts" 
ON public.accountant_ce_alerts 
FOR UPDATE 
USING (user_id = auth.uid() OR has_any_role(ARRAY['admin', 'system_administrator', 'compliance_officer']));

-- Create indexes for performance
CREATE INDEX idx_accountant_ce_requirements_state_credential ON public.accountant_ce_requirements(state, credential_type);
CREATE INDEX idx_accountant_ce_records_user_id ON public.accountant_ce_records(user_id);
CREATE INDEX idx_accountant_ce_records_renewal_period ON public.accountant_ce_records(renewal_period);
CREATE INDEX idx_accountant_license_status_user_id ON public.accountant_license_status(user_id);
CREATE INDEX idx_accountant_license_status_expiration ON public.accountant_license_status(expiration_date);
CREATE INDEX idx_accountant_ce_alerts_user_id ON public.accountant_ce_alerts(user_id);
CREATE INDEX idx_accountant_ce_alerts_due_date ON public.accountant_ce_alerts(due_date);

-- Update timestamp triggers
CREATE TRIGGER update_accountant_ce_requirements_updated_at 
BEFORE UPDATE ON public.accountant_ce_requirements 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_accountant_ce_records_updated_at 
BEFORE UPDATE ON public.accountant_ce_records 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_accountant_license_status_updated_at 
BEFORE UPDATE ON public.accountant_license_status 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_accountant_ce_providers_updated_at 
BEFORE UPDATE ON public.accountant_ce_providers 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample CE requirements data
INSERT INTO public.accountant_ce_requirements (state, credential_type, ce_hours_required, renewal_cycle_months, reporting_deadline, ethics_required, ethics_hours_required, notes) VALUES
('TX', 'CPA', 40, 12, 'December 31', true, 4, 'Texas CPA renewal requirements'),
('CA', 'CPA', 80, 24, 'Last day of birth month', true, 4, 'California CPA biennial renewal'),
('FL', 'CPA', 80, 24, 'June 30', true, 4, 'Florida CPA biennial renewal'),
('NY', 'CPA', 40, 36, 'July 31', true, 4, 'New York CPA triennial renewal'),
('IL', 'CPA', 40, 36, 'September 30', true, 4, 'Illinois CPA triennial renewal'),
('ALL', 'EA', 72, 36, 'December 31', true, 6, 'IRS Enrolled Agent requirements - valid in all states');

-- Insert sample CE providers
INSERT INTO public.accountant_ce_providers (provider_name, approved_states, url, specialty, provider_code) VALUES
('Becker Professional Education', ARRAY['TX', 'CA', 'FL', 'NY', 'IL', 'ALL'], 'https://www.becker.com', ARRAY['General CPE', 'Ethics', 'Tax', 'Audit'], 'BECKER'),
('Surgent CPE', ARRAY['TX', 'CA', 'FL', 'NY', 'IL', 'ALL'], 'https://www.surgentcpe.com', ARRAY['General CPE', 'Ethics', 'Tax'], 'SURGENT'),
('Thomson Reuters CPE', ARRAY['TX', 'CA', 'FL', 'NY', 'IL', 'ALL'], 'https://tax.thomsonreuters.com', ARRAY['Tax', 'Accounting'], 'TR'),
('AICPA', ARRAY['TX', 'CA', 'FL', 'NY', 'IL', 'ALL'], 'https://www.aicpa.org', ARRAY['General CPE', 'Ethics', 'Specialized'], 'AICPA');