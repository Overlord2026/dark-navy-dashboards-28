-- Create practice revenue table
CREATE TABLE IF NOT EXISTS public.practice_revenue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  persona_type TEXT NOT NULL,
  revenue_date DATE NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  amount NUMERIC NOT NULL,
  source_channel TEXT,
  client_id UUID,
  campaign_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create practice expenses table
CREATE TABLE IF NOT EXISTS public.practice_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  persona_type TEXT NOT NULL,
  expense_date DATE NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  amount NUMERIC NOT NULL,
  vendor TEXT,
  is_recurring BOOLEAN DEFAULT false,
  contract_end_date DATE,
  campaign_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create practice benchmarks table
CREATE TABLE IF NOT EXISTS public.practice_benchmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  persona_type TEXT NOT NULL,
  metric TEXT NOT NULL,
  value NUMERIC NOT NULL,
  source TEXT NOT NULL,
  period TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create vendor benchmarks table
CREATE TABLE IF NOT EXISTS public.vendor_benchmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_name TEXT NOT NULL,
  category TEXT NOT NULL,
  avg_cost NUMERIC,
  currency TEXT DEFAULT 'USD',
  source TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create property financials table
CREATE TABLE IF NOT EXISTS public.property_financials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  property_name TEXT,
  property_type TEXT,
  revenue_date DATE,
  revenue_amount NUMERIC,
  expense_date DATE,
  expense_amount NUMERIC,
  expense_category TEXT,
  vendor TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create bill pay table
CREATE TABLE IF NOT EXISTS public.bill_pay (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  bill_name TEXT NOT NULL,
  category TEXT,
  amount NUMERIC NOT NULL,
  due_date DATE NOT NULL,
  vendor TEXT,
  autopay BOOLEAN DEFAULT false,
  last_paid DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.practice_revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_financials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bill_pay ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own practice revenue" ON public.practice_revenue
  FOR ALL USING (true); -- Will be tenant-aware in production

CREATE POLICY "Users can manage their own practice expenses" ON public.practice_expenses
  FOR ALL USING (true); -- Will be tenant-aware in production

CREATE POLICY "Users can view practice benchmarks" ON public.practice_benchmarks
  FOR SELECT USING (true);

CREATE POLICY "Users can view vendor benchmarks" ON public.vendor_benchmarks
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own property financials" ON public.property_financials
  FOR ALL USING (owner_id = auth.uid());

CREATE POLICY "Users can manage their own bills" ON public.bill_pay
  FOR ALL USING (user_id = auth.uid());

-- Service role policies
CREATE POLICY "Service role can manage all data" ON public.practice_revenue
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage expenses" ON public.practice_expenses
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage benchmarks" ON public.practice_benchmarks
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage vendor benchmarks" ON public.vendor_benchmarks
  FOR ALL USING (auth.role() = 'service_role');

-- Seed demo data
INSERT INTO public.practice_revenue (persona_type, revenue_date, category, description, amount, source_channel) VALUES
('financial_advisor', '2025-07-01', 'mgmt_fee', 'AUM fees', 18500, 'Schwab'),
('financial_advisor', '2025-07-05', 'commission', 'Annuity placement', 8500, 'Insurance Carrier'),
('attorney', '2025-07-01', 'legal_fees', 'Estate planning consultation', 5000, 'Direct'),
('cpa_accountant', '2025-07-02', 'tax_prep', 'Business tax return', 2500, 'Direct'),
('physician', '2025-07-03', 'consultation', 'Patient consultation', 300, 'Insurance'),
('realtor', '2025-07-04', 'commission', 'Home sale commission', 12000, 'MLS');

INSERT INTO public.practice_expenses (persona_type, expense_date, category, description, amount, vendor, is_recurring) VALUES
('financial_advisor', '2025-07-02', 'marketing', 'LinkedIn ads', 1200, 'LinkedIn', false),
('financial_advisor', '2025-07-03', 'tech', 'CRM subscription', 350, 'Salesforce', true),
('attorney', '2025-07-02', 'legal_research', 'Westlaw subscription', 400, 'Westlaw', true),
('cpa_accountant', '2025-07-01', 'software', 'Tax software license', 800, 'Intuit', true),
('physician', '2025-07-03', 'equipment', 'Medical equipment lease', 1500, 'MedEquip Inc', true),
('realtor', '2025-07-04', 'marketing', 'Property listing ads', 600, 'Zillow', false);

INSERT INTO public.practice_benchmarks (persona_type, metric, value, source, period) VALUES
('financial_advisor', 'gross_margin_pct', 0.57, 'platform_avg', '2025-Q1'),
('financial_advisor', 'gross_margin_pct', 0.55, 'industry_avg', '2025-Q1'),
('attorney', 'hourly_rate', 450, 'market_avg', '2025-Q1'),
('cpa_accountant', 'tax_return_avg', 750, 'industry_avg', '2025-Q1'),
('physician', 'patient_volume_monthly', 480, 'specialty_avg', '2025-Q1'),
('realtor', 'deals_per_month', 2.5, 'market_avg', '2025-Q1');

INSERT INTO public.vendor_benchmarks (vendor_name, category, avg_cost, source) VALUES
('Salesforce', 'CRM', 300, 'industry_survey'),
('LinkedIn', 'Marketing', 1000, 'platform_data'),
('Westlaw', 'Legal Research', 380, 'legal_industry'),
('Intuit', 'Tax Software', 750, 'accounting_industry'),
('Zillow', 'Real Estate Marketing', 500, 'realestate_data'),
('Microsoft', 'Office Software', 150, 'business_software');