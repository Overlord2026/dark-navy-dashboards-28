-- Create IP families table if not exists
CREATE TABLE IF NOT EXISTS public.ip_families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_code TEXT NOT NULL UNIQUE,
  fam_title TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create IP filings table if not exists
CREATE TABLE IF NOT EXISTS public.ip_filings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_code TEXT NOT NULL REFERENCES public.ip_families(family_code),
  filing_kind TEXT NOT NULL CHECK (filing_kind IN ('PROVISIONAL', 'NONPROVISIONAL', 'PCT', 'OTHER')),
  filing_title TEXT NOT NULL,
  filing_date DATE,
  application_no TEXT,
  status TEXT DEFAULT 'pending',
  artifact_url_1 TEXT,
  artifact_url_2 TEXT,
  artifact_url_3 TEXT,
  artifact_url_4 TEXT,
  artifact_url_5 TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create view for IP filings by family
CREATE OR REPLACE VIEW public.v_ip_filings_by_family AS
SELECT 
  f.family_code,
  fam.fam_title,
  f.filing_kind,
  f.filing_title,
  f.application_no,
  f.filing_date,
  f.status,
  f.artifact_url_1,
  f.artifact_url_2,
  f.artifact_url_3,
  f.artifact_url_4,
  f.artifact_url_5,
  f.notes,
  f.created_at
FROM public.ip_filings f
LEFT JOIN public.ip_families fam ON f.family_code = fam.family_code
ORDER BY f.filing_date DESC NULLS LAST, f.created_at DESC;

-- Enable RLS
ALTER TABLE public.ip_families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ip_filings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin access
CREATE POLICY "Admins can manage IP families" ON public.ip_families FOR ALL USING (public.has_any_role(ARRAY['admin', 'system_administrator']));
CREATE POLICY "Admins can manage IP filings" ON public.ip_filings FOR ALL USING (public.has_any_role(ARRAY['admin', 'system_administrator']));

-- Insert sample families
INSERT INTO public.ip_families (family_code, fam_title, notes) VALUES
  ('P6', 'Platform 6 Core', 'Main platform technologies'),
  ('AIES', 'AI Ethics Suite', 'AI governance and ethics framework'),
  ('NIL', 'Name, Image, Likeness', 'NIL marketplace technologies'),
  ('EstateRON', 'Estate Remote Online Notarization', 'Estate planning automation'),
  ('RuleSync', 'Rule Synchronization', 'Compliance rule management'),
  ('TradingOS', 'Trading Operating System', 'Investment trading platform'),
  ('401k', '401k Management', 'Retirement plan administration'),
  ('Healthcare', 'Healthcare Solutions', 'Health data management'),
  ('Explainability', 'AI Explainability', 'AI transparency tools'),
  ('Other', 'Other Technologies', 'Miscellaneous filings')
ON CONFLICT (family_code) DO NOTHING;

-- Insert sample filings
INSERT INTO public.ip_filings (family_code, filing_kind, filing_title, filing_date, application_no, status, artifact_url_1, artifact_url_2, notes) VALUES
  ('P6', 'PROVISIONAL', 'Wallet Consent Protocol', '2024-01-15', '63/862,941', 'filed', 'https://example.com/p6_wallet_consent.pdf', NULL, 'Initial provisional filing for wallet consent system'),
  ('AIES', 'NONPROVISIONAL', 'AI Ethics Framework', '2024-02-20', '18/123,456', 'pending', 'https://example.com/aies_ethics.pdf', 'https://example.com/aies_claims.pdf', 'Continuation of provisional filing'),
  ('NIL', 'PCT', 'NIL Value Assessment System', '2024-03-10', 'PCT/US2024/123456', 'filed', 'https://example.com/nil_assessment.pdf', NULL, 'International filing for NIL valuation'),
  ('EstateRON', 'PROVISIONAL', 'Remote Estate Document Execution', '2024-04-05', '63/912,345', 'filed', 'https://example.com/estate_ron.pdf', NULL, 'Estate planning remote notarization'),
  ('RuleSync', 'OTHER', 'Regulatory Compliance Automation', '2024-05-12', 'TR2024-001', 'pending', NULL, NULL, 'Trademark application for RuleSync')
ON CONFLICT DO NOTHING;