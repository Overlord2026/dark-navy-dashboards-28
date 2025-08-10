-- Create IP Watch logs table
CREATE TABLE IF NOT EXISTS public.ip_watch_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL, -- mention, domain, copy, feature
  term TEXT,
  source TEXT,
  date_found DATE,
  risk_level TEXT, -- info, warning, critical
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on IP Watch logs
ALTER TABLE public.ip_watch_logs ENABLE ROW LEVEL SECURITY;

-- Allow service role to manage IP Watch logs
CREATE POLICY "Service role can manage IP Watch logs" ON public.ip_watch_logs
  FOR ALL USING (auth.role() = 'service_role');

-- Allow authenticated users to view IP Watch logs
CREATE POLICY "Users can view IP Watch logs" ON public.ip_watch_logs
  FOR SELECT USING (auth.role() = 'authenticated');

-- Seed IP Watch demo data
INSERT INTO public.ip_watch_logs (type, term, source, date_found, risk_level, link) VALUES
('mention', 'Boutique Family Office', 'LinkedIn', '2025-07-01', 'info', 'https://linkedin.com/example'),
('domain', 'boutiquefamilyofficeexample.com', 'WHOIS', '2025-07-02', 'warning', 'https://whois.example'),
('copy', 'Healthspan + Wealthspan platform copy', 'Website Monitor', '2025-07-03', 'critical', 'https://competitor.example'),
('feature', 'AI Executive Suite similar feature', 'Product Hunt', '2025-07-04', 'warning', 'https://producthunt.com/example');