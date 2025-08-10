-- Create overview analytics table
CREATE TABLE IF NOT EXISTS public.overview_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  segment TEXT,
  action TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.overview_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY "overview_analytics_access" ON public.overview_analytics FOR ALL USING (true) WITH CHECK (true);