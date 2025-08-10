-- Complete Founding 20 system tables

-- Outreach contacts for tracking targets
CREATE TABLE IF NOT EXISTS public.outreach_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  segment TEXT NOT NULL CHECK (segment IN ('sports', 'longevity', 'ria')),
  org_name TEXT NOT NULL,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  tier TEXT NOT NULL CHECK (tier IN ('gold', 'silver', 'bronze')),
  status TEXT NOT NULL DEFAULT 'not_contacted' CHECK (status IN ('not_contacted', 'initial_outreach', 'follow_up', 'meeting_scheduled', 'proposal_sent', 'negotiating', 'partnership_signed', 'declined')),
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  notes TEXT,
  next_action TEXT,
  next_action_date DATE,
  assigned_to UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Launch checklist items for tracking execution
CREATE TABLE IF NOT EXISTS public.launch_checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  segment TEXT NOT NULL CHECK (segment IN ('sports', 'longevity', 'ria')),
  tier TEXT NOT NULL CHECK (tier IN ('gold', 'silver', 'bronze')),
  target_name TEXT NOT NULL,
  action_item TEXT NOT NULL,
  owner TEXT,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'blocked')),
  priority INTEGER DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
  due_date DATE,
  completed_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Founding 20 email campaigns tracking
CREATE TABLE IF NOT EXISTS public.f20_email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_name TEXT NOT NULL,
  segment TEXT NOT NULL CHECK (segment IN ('sports', 'longevity', 'ria')),
  template_type TEXT NOT NULL CHECK (template_type IN ('cold_outreach', 'follow_up', 'overview_share', 'deck_share')),
  sender_name TEXT NOT NULL DEFAULT 'Boutique Family Office™',
  sender_email TEXT NOT NULL DEFAULT 'founding20@my.bfocfo.com',
  subject_line TEXT NOT NULL,
  template_content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- QR code generation tracking
CREATE TABLE IF NOT EXISTS public.f20_qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  segment TEXT NOT NULL CHECK (segment IN ('sports', 'longevity', 'ria')),
  target_name TEXT NOT NULL,
  qr_url TEXT NOT NULL,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  scan_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_scanned_at TIMESTAMPTZ
);

-- Asset generation and hosting tracking
CREATE TABLE IF NOT EXISTS public.f20_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_name TEXT NOT NULL,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('pdf_print', 'pdf_digital', 'png', 'pptx', 'html')),
  segment TEXT CHECK (segment IN ('sports', 'longevity', 'ria', 'overview', 'deck')),
  file_path TEXT,
  file_url TEXT,
  file_size_bytes BIGINT,
  generation_status TEXT NOT NULL DEFAULT 'pending' CHECK (generation_status IN ('pending', 'generating', 'completed', 'failed')),
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_downloaded_at TIMESTAMPTZ
);

-- Comprehensive analytics for all F20 events
CREATE TABLE IF NOT EXISTS public.f20_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  segment TEXT CHECK (segment IN ('sports', 'longevity', 'ria')),
  target_name TEXT,
  user_id UUID,
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.outreach_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.launch_checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.f20_email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.f20_qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.f20_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.f20_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all for now, can be restricted later)
CREATE POLICY "f20_contacts_policy" ON public.outreach_contacts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "f20_checklist_policy" ON public.launch_checklist_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "f20_campaigns_policy" ON public.f20_email_campaigns FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "f20_qr_policy" ON public.f20_qr_codes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "f20_assets_policy" ON public.f20_assets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "f20_analytics_policy" ON public.f20_analytics FOR ALL USING (true) WITH CHECK (true);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_outreach_contacts_updated_at BEFORE UPDATE ON public.outreach_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_launch_checklist_items_updated_at BEFORE UPDATE ON public.launch_checklist_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_f20_email_campaigns_updated_at BEFORE UPDATE ON public.f20_email_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();