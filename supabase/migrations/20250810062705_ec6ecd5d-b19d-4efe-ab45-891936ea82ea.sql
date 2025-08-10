-- Create compliance_rules table
CREATE TABLE IF NOT EXISTS public.compliance_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jurisdiction TEXT NOT NULL,
  regulator TEXT NOT NULL,
  profession TEXT[] NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  summary_plain TEXT,
  credit_type TEXT,
  effective_date DATE,
  status TEXT DEFAULT 'active',
  source_url TEXT,
  impacted_personas TEXT[],
  last_checked TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create persona_compliance_subscriptions table
CREATE TABLE IF NOT EXISTS public.persona_compliance_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  persona_type TEXT NOT NULL,
  compliance_feed TEXT NOT NULL,
  subscription_status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create ce_courses table
CREATE TABLE IF NOT EXISTS public.ce_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  profession TEXT[] NOT NULL,
  jurisdiction TEXT[] NOT NULL,
  credit_hours NUMERIC,
  credit_type TEXT,
  provider TEXT,
  price NUMERIC DEFAULT 0,
  delivery_url TEXT,
  accreditation_id TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create user_ce_progress table
CREATE TABLE IF NOT EXISTS public.user_ce_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  course_id UUID REFERENCES public.ce_courses(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'enrolled',
  completion_date DATE,
  certificate_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Update ce_sales table to match new schema
DROP TABLE IF EXISTS public.ce_sales CASCADE;
CREATE TABLE public.ce_sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  course_id UUID REFERENCES public.ce_courses(id) ON DELETE SET NULL,
  price NUMERIC,
  currency TEXT DEFAULT 'USD',
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.compliance_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.persona_compliance_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ce_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_ce_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ce_sales ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active compliance rules" ON public.compliance_rules
  FOR SELECT USING (status = 'active');

CREATE POLICY "Anyone can view active CE courses" ON public.ce_courses
  FOR SELECT USING (true);

CREATE POLICY "Users can view their own CE progress" ON public.user_ce_progress
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own CE progress" ON public.user_ce_progress
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own CE sales" ON public.ce_sales
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Service role can manage all tables" ON public.compliance_rules
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage persona subscriptions" ON public.persona_compliance_subscriptions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage CE courses" ON public.ce_courses
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage CE progress" ON public.user_ce_progress
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage CE sales" ON public.ce_sales
  FOR ALL USING (auth.role() = 'service_role');

-- Seed CE courses data
INSERT INTO public.ce_courses (title, description, profession, jurisdiction, credit_hours, credit_type, provider, price, delivery_url) VALUES
('Advisor Ethics 2-Hr 2025', 'Meets annual ethics update', ARRAY['financial_advisor'], ARRAY['US-FED','FL','CA'], 2, 'Ethics', 'Kaplan', 49, 'https://provider.example/ethics-advisor'),
('AML for Advisors', 'Anti-money laundering refresher', ARRAY['financial_advisor','insurance_agent'], ARRAY['US-FED'], 2, 'AML', 'FIN Ed', 59, 'https://provider.example/aml'),
('Attorney Ethics & Tech', 'CLE on ethics and tech competence', ARRAY['attorney'], ARRAY['CA','NY','FL'], 3, 'Ethics', 'State Bar CLE', 149, 'https://provider.example/cle-ethics-tech'),
('CPA GAAP 2025 Update', 'Accounting standards update', ARRAY['cpa_accountant'], ARRAY['US-FED'], 4, 'Accounting', 'AICPA Partner', 129, 'https://provider.example/cpa-gaap'),
('Realtor Fair Housing Essentials', 'Meets fair housing/ethics', ARRAY['realtor'], ARRAY['NY','IL','CA','FL'], 3, 'Ethics', 'NAR Partner', 79, 'https://provider.example/realtor-fh'),
('HIPAA Compliance for Physicians', 'Privacy and security refresher', ARRAY['physician','dentist','healthcare_longevity_expert'], ARRAY['US-FED'], 2, 'HIPAA', 'MedCE', 99, 'https://provider.example/hipaa'),
('Opioid Prescribing Best Practices', 'Meets many state CME mandates', ARRAY['physician','dentist'], ARRAY['US-FED','FL','KY','MA'], 2, 'Opioid Prescribing', 'MedCE', 119, 'https://provider.example/opioid'),
('NCAA NIL Compliance Fundamentals', 'For athlete managers & sports agents', ARRAY['sports_agent','athlete_nil','coach_consultant'], ARRAY['US-FED','TX','CA','FL'], 2, 'NIL Compliance', 'SportsLaw Edu', 149, 'https://provider.example/nil'),
('Insurance Annuity Suitability CE', 'State annuity suitability requirement', ARRAY['insurance_agent'], ARRAY['TX','FL','CA'], 4, 'Annuity Suitability', 'NAIC Partner', 99, 'https://provider.example/annuity');

-- Seed compliance rules data
INSERT INTO public.compliance_rules (jurisdiction, regulator, profession, title, description, summary_plain, credit_type, effective_date, status, impacted_personas) VALUES
('US-FED', 'FINRA', ARRAY['financial_advisor'], 'Annual Ethics Requirement Update', 'All financial advisors must complete updated ethics training by end of year.', 'Complete your 2025 ethics requirement to maintain compliance.', 'Ethics', '2025-12-31', 'active', ARRAY['financial_advisor']),
('FL', 'Florida Bar', ARRAY['attorney'], 'Technology Competence CLE', 'Florida attorneys must complete technology competence continuing legal education.', 'Stay current with technology requirements for legal practice.', 'Ethics', '2025-06-30', 'active', ARRAY['attorney']),
('US-FED', 'CMS', ARRAY['physician','dentist'], 'HIPAA Privacy Update', 'Healthcare providers must complete updated HIPAA training.', 'Ensure compliance with latest HIPAA privacy regulations.', 'HIPAA', '2025-08-15', 'active', ARRAY['physician','dentist','healthcare_longevity_expert']),
('TX', 'Texas Real Estate Commission', ARRAY['realtor'], 'Fair Housing Requirements', 'Texas realtors must complete fair housing education.', 'Meet Texas fair housing education requirements.', 'Ethics', '2025-09-30', 'active', ARRAY['realtor']);