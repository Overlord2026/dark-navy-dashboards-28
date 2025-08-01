-- Create tax rules and configuration tables
CREATE TABLE public.tax_brackets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tax_year INTEGER NOT NULL,
  filing_status TEXT NOT NULL DEFAULT 'single',
  min_income NUMERIC NOT NULL DEFAULT 0,
  max_income NUMERIC DEFAULT NULL, -- NULL for highest bracket
  rate NUMERIC NOT NULL,
  bracket_order INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  tenant_id UUID
);

CREATE TABLE public.tax_deductions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tax_year INTEGER NOT NULL,
  deduction_type TEXT NOT NULL, -- 'standard', 'itemized_cap', 'section199a', etc.
  filing_status TEXT NOT NULL DEFAULT 'single',
  amount NUMERIC NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  tenant_id UUID
);

CREATE TABLE public.tax_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_type TEXT NOT NULL, -- 'rmd_age', 'secure_act_rule', 'contribution_limit', etc.
  rule_name TEXT NOT NULL,
  rule_value JSONB NOT NULL, -- Flexible JSON for different rule types
  effective_year INTEGER NOT NULL,
  expires_year INTEGER DEFAULT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  tenant_id UUID
);

-- Enable RLS
ALTER TABLE public.tax_brackets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_deductions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_rules ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tax_brackets
CREATE POLICY "Anyone can view active tax brackets" ON public.tax_brackets
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage tax brackets" ON public.tax_brackets
  FOR ALL USING (has_any_role(ARRAY['admin', 'system_administrator', 'tenant_admin']));

-- RLS Policies for tax_deductions
CREATE POLICY "Anyone can view active tax deductions" ON public.tax_deductions
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage tax deductions" ON public.tax_deductions
  FOR ALL USING (has_any_role(ARRAY['admin', 'system_administrator', 'tenant_admin']));

-- RLS Policies for tax_rules
CREATE POLICY "Anyone can view active tax rules" ON public.tax_rules
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage tax rules" ON public.tax_rules
  FOR ALL USING (has_any_role(ARRAY['admin', 'system_administrator', 'tenant_admin']));

-- Create indexes for performance
CREATE INDEX idx_tax_brackets_year_status ON public.tax_brackets(tax_year, filing_status, is_active);
CREATE INDEX idx_tax_deductions_year_type ON public.tax_deductions(tax_year, deduction_type, is_active);
CREATE INDEX idx_tax_rules_type_year ON public.tax_rules(rule_type, effective_year, is_active);

-- Insert default 2024 tax brackets for single filers
INSERT INTO public.tax_brackets (tax_year, filing_status, min_income, max_income, rate, bracket_order) VALUES
(2024, 'single', 0, 11000, 10, 1),
(2024, 'single', 11001, 44725, 12, 2),
(2024, 'single', 44726, 95375, 22, 3),
(2024, 'single', 95376, 182050, 24, 4),
(2024, 'single', 182051, 231250, 32, 5),
(2024, 'single', 231251, 578125, 35, 6),
(2024, 'single', 578126, NULL, 37, 7);

-- Insert default 2024 standard deductions
INSERT INTO public.tax_deductions (tax_year, deduction_type, filing_status, amount, description) VALUES
(2024, 'standard', 'single', 13850, 'Standard deduction for single filers'),
(2024, 'standard', 'married_filing_jointly', 27700, 'Standard deduction for married filing jointly'),
(2024, 'standard', 'married_filing_separately', 13850, 'Standard deduction for married filing separately'),
(2024, 'standard', 'head_of_household', 20800, 'Standard deduction for head of household');

-- Insert default tax rules
INSERT INTO public.tax_rules (rule_type, rule_name, rule_value, effective_year, description) VALUES
('rmd_age', 'required_minimum_distribution_age', '{"age": 73}', 2024, 'Age when RMDs are required (SECURE Act 2.0)'),
('contribution_limit', 'traditional_ira_limit', '{"amount": 7000, "catch_up": 1000, "catch_up_age": 50}', 2024, 'Traditional IRA contribution limits'),
('contribution_limit', 'roth_ira_limit', '{"amount": 7000, "catch_up": 1000, "catch_up_age": 50}', 2024, 'Roth IRA contribution limits'),
('contribution_limit', '401k_limit', '{"amount": 23000, "catch_up": 7500, "catch_up_age": 50}', 2024, '401(k) contribution limits'),
('secure_act', 'inherited_ira_distribution', '{"years": 10, "applies_to": "non_spouse_beneficiaries"}', 2024, 'SECURE Act 10-year distribution rule'),
('tax_credit', 'child_tax_credit', '{"amount": 2000, "refundable_portion": 1600, "phase_out_agi": {"single": 200000, "married": 400000}}', 2024, 'Child Tax Credit amounts and phase-outs');

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_tax_tables_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tax_brackets_updated_at
  BEFORE UPDATE ON public.tax_brackets
  FOR EACH ROW
  EXECUTE FUNCTION update_tax_tables_updated_at();

CREATE TRIGGER update_tax_deductions_updated_at
  BEFORE UPDATE ON public.tax_deductions
  FOR EACH ROW
  EXECUTE FUNCTION update_tax_tables_updated_at();

CREATE TRIGGER update_tax_rules_updated_at
  BEFORE UPDATE ON public.tax_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_tax_tables_updated_at();