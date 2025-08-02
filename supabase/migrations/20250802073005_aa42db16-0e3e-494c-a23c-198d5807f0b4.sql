-- Create leads table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advisor_id UUID NOT NULL,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  lead_status TEXT DEFAULT 'new',
  lead_source TEXT DEFAULT 'unknown',
  lead_value NUMERIC DEFAULT 0,
  acquisition_cost NUMERIC DEFAULT 0,
  campaign_id UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on leads table
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create policy for advisors to manage their own leads
CREATE POLICY "Advisors can manage their own leads" ON public.leads
FOR ALL
USING (advisor_id = auth.uid());

-- Create updated_at trigger for leads
CREATE OR REPLACE FUNCTION update_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at_trigger
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION update_leads_updated_at();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leads_advisor_id ON public.leads(advisor_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(lead_status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON public.leads(lead_source);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at);