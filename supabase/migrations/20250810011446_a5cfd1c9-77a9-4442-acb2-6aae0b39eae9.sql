-- Create outreach tables for Founding 20 campaign
CREATE TABLE IF NOT EXISTS public.outreach_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  segment TEXT NOT NULL,
  org_name TEXT NOT NULL,
  first_name TEXT,
  email TEXT,
  phone TEXT,
  contact_type TEXT,
  influence_level INTEGER,
  status TEXT DEFAULT 'not_contacted',
  utm_source TEXT, 
  utm_medium TEXT, 
  utm_campaign TEXT, 
  utm_content TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.outreach_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES public.outreach_contacts(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  payload JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.outreach_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outreach_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "contacts_access" ON public.outreach_contacts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "events_access" ON public.outreach_events FOR ALL USING (true) WITH CHECK (true);