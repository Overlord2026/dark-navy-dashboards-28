-- Create enum types
CREATE TYPE persona_type AS ENUM ('client', 'advisor', 'cpa', 'attorney', 'insurance', 'medicare', 'healthcare', 'realtor', 'coach', 'elite');
CREATE TYPE application_status AS ENUM ('submitted', 'in_review', 'approved', 'declined', 'needs_info');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'converted', 'unqualified');
CREATE TYPE campaign_status AS ENUM ('draft', 'active', 'paused', 'completed');
CREATE TYPE campaign_channel AS ENUM ('email', 'sms', 'social', 'direct');
CREATE TYPE event_type AS ENUM ('sent', 'delivered', 'opened', 'clicked', 'replied', 'bounced');

-- Professional applications table
CREATE TABLE public.professional_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  persona_type persona_type NOT NULL,
  name TEXT NOT NULL,
  firm TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  jurisdictions TEXT[],
  years_experience INTEGER,
  licenses JSONB DEFAULT '{}',
  disclosures JSONB DEFAULT '{}',
  brand_logo_url TEXT,
  headshot_url TEXT,
  bio TEXT,
  specialties TEXT[],
  status application_status NOT NULL DEFAULT 'submitted',
  reviewer_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Marketplace professionals table
CREATE TABLE public.marketplace_professionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  application_id UUID REFERENCES public.professional_applications(id),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  persona_type persona_type NOT NULL,
  name TEXT NOT NULL,
  firm TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  jurisdictions TEXT[],
  years_experience INTEGER,
  bio TEXT,
  specialties TEXT[],
  headshot_url TEXT,
  brand_logo_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  verification_expires_at TIMESTAMP WITH TIME ZONE,
  profile_views INTEGER DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0
);

-- Leads table
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  persona_tag persona_type,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  source TEXT,
  tags TEXT[],
  status lead_status DEFAULT 'new',
  notes TEXT,
  metadata JSONB DEFAULT '{}'
);

-- Campaigns table
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  persona_target persona_type,
  channels campaign_channel[],
  status campaign_status DEFAULT 'draft',
  schedule_json JSONB DEFAULT '{}',
  template_id UUID,
  settings JSONB DEFAULT '{}'
);

-- Campaign events table
CREATE TABLE public.campaign_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE NOT NULL,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  event_type event_type NOT NULL,
  channel campaign_channel,
  metadata JSONB DEFAULT '{}',
  success BOOLEAN DEFAULT true
);

-- Sequence templates table
CREATE TABLE public.sequence_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  persona_type persona_type,
  channel campaign_channel NOT NULL,
  template_data JSONB NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id)
);

-- User onboarding state table
CREATE TABLE public.user_onboarding_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  persona_type persona_type,
  current_step TEXT,
  completed_steps TEXT[],
  progress_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.professional_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sequence_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_onboarding_state ENABLE ROW LEVEL SECURITY;

-- RLS Policies for professional_applications
CREATE POLICY "Users can view own applications" ON public.professional_applications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create own applications" ON public.professional_applications
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own applications" ON public.professional_applications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all applications" ON public.professional_applications
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'system_administrator'))
  );

-- RLS Policies for marketplace_professionals
CREATE POLICY "Anyone can view active professionals" ON public.marketplace_professionals
  FOR SELECT USING (is_active = true);

CREATE POLICY "Professionals can update own profiles" ON public.marketplace_professionals
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all profiles" ON public.marketplace_professionals
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'system_administrator'))
  );

-- RLS Policies for leads
CREATE POLICY "Users can manage own leads" ON public.leads
  FOR ALL USING (owner_id = auth.uid());

CREATE POLICY "Admins can view all leads" ON public.leads
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'system_administrator'))
  );

-- RLS Policies for campaigns
CREATE POLICY "Users can manage own campaigns" ON public.campaigns
  FOR ALL USING (owner_id = auth.uid());

CREATE POLICY "Admins can view all campaigns" ON public.campaigns
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'system_administrator'))
  );

-- RLS Policies for campaign_events
CREATE POLICY "Users can view own campaign events" ON public.campaign_events
  FOR SELECT USING (
    campaign_id IN (SELECT id FROM public.campaigns WHERE owner_id = auth.uid())
  );

CREATE POLICY "System can insert campaign events" ON public.campaign_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all campaign events" ON public.campaign_events
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'system_administrator'))
  );

-- RLS Policies for sequence_templates
CREATE POLICY "Anyone can view default templates" ON public.sequence_templates
  FOR SELECT USING (is_default = true);

CREATE POLICY "Users can view own templates" ON public.sequence_templates
  FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Users can create templates" ON public.sequence_templates
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Admins can manage all templates" ON public.sequence_templates
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'system_administrator'))
  );

-- RLS Policies for user_onboarding_state
CREATE POLICY "Users can manage own onboarding state" ON public.user_onboarding_state
  FOR ALL USING (user_id = auth.uid());

-- Create indexes
CREATE INDEX idx_professional_applications_persona_type ON public.professional_applications(persona_type);
CREATE INDEX idx_professional_applications_status ON public.professional_applications(status);
CREATE INDEX idx_marketplace_professionals_persona_type ON public.marketplace_professionals(persona_type);
CREATE INDEX idx_marketplace_professionals_active ON public.marketplace_professionals(is_active);
CREATE INDEX idx_leads_owner_id ON public.leads(owner_id);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_campaigns_owner_id ON public.campaigns(owner_id);
CREATE INDEX idx_campaign_events_campaign_id ON public.campaign_events(campaign_id);
CREATE INDEX idx_sequence_templates_persona_type ON public.sequence_templates(persona_type);

-- Insert default sequence templates
INSERT INTO public.sequence_templates (name, persona_type, channel, template_data, is_default) VALUES
('Advisor Welcome Sequence', 'advisor', 'email', '{"subject": "Welcome to BFO Marketplace", "content": "Welcome to your practice management platform..."}', true),
('CPA Onboarding Sequence', 'cpa', 'email', '{"subject": "Your CPA Tools Are Ready", "content": "Get started with CE tracking and client management..."}', true),
('Attorney Welcome Sequence', 'attorney', 'email', '{"subject": "Legal Practice Tools Ready", "content": "Access estate workflows and CLE tracking..."}', true),
('Insurance Agent Setup', 'insurance', 'email', '{"subject": "Compliant Tools for Insurance Pros", "content": "Start using call recording and quote flows..."}', true),
('Healthcare Professional Welcome', 'healthcare', 'email', '{"subject": "Health Hub Ready for You", "content": "Begin with proactive health tools..."}', true),
('Realtor Platform Welcome', 'realtor', 'email', '{"subject": "Your Property Management Hub", "content": "Access listings and owner portals..."}', true),
('Coach Platform Setup', 'coach', 'email', '{"subject": "Your Coaching Platform is Ready", "content": "Set up programs and payment links..."}', true),
('Elite Family Office Welcome', 'elite', 'email', '{"subject": "Elite Family Office Portal", "content": "Access multi-entity controls and premium analytics..."}', true);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_professional_applications_updated_at
  BEFORE UPDATE ON public.professional_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketplace_professionals_updated_at
  BEFORE UPDATE ON public.marketplace_professionals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sequence_templates_updated_at
  BEFORE UPDATE ON public.sequence_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_onboarding_state_updated_at
  BEFORE UPDATE ON public.user_onboarding_state
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();