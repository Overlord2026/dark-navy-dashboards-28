-- Create outreach tracking tables for Founding 20 campaign
CREATE TABLE IF NOT EXISTS public.outreach_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  segment TEXT NOT NULL,        -- 'sports'
  org_name TEXT NOT NULL,
  first_name TEXT,
  email TEXT,
  phone TEXT,
  contact_type TEXT,            -- Exec | PR | Partnerships
  influence_level INTEGER,
  status TEXT DEFAULT 'not_contacted',  -- not_contacted | in_progress | responded | confirmed
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  personal_hook TEXT,
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

-- Create policies (public access for campaign tracking)
CREATE POLICY "Allow public access to outreach contacts" ON public.outreach_contacts
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public access to outreach events" ON public.outreach_events
  FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_outreach_contacts_segment ON public.outreach_contacts(segment);
CREATE INDEX IF NOT EXISTS idx_outreach_contacts_status ON public.outreach_contacts(status);
CREATE INDEX IF NOT EXISTS idx_outreach_events_contact_id ON public.outreach_events(contact_id);
CREATE INDEX IF NOT EXISTS idx_outreach_events_event_name ON public.outreach_events(event_name);