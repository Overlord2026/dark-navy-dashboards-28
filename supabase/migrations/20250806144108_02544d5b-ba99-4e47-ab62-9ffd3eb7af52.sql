-- Create enums for VIP system
CREATE TYPE public.persona_type AS ENUM (
  'family_office', 'advisor', 'attorney', 'cpa', 'healthcare', 
  'insurance', 'consultant', 'coach', 'other'
);

CREATE TYPE public.invite_status AS ENUM (
  'pending', 'sent', 'viewed', 'activated', 'expired', 'error'
);

CREATE TYPE public.invite_channel AS ENUM (
  'email', 'sms', 'linkedin', 'direct'
);

-- Create vip_invites table
CREATE TABLE public.vip_invites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  firm TEXT,
  persona_type persona_type NOT NULL,
  email TEXT NOT NULL,
  linkedin_url TEXT,
  phone TEXT,
  invite_status invite_status NOT NULL DEFAULT 'pending',
  activation_link TEXT,
  persona_group TEXT,
  batch_name TEXT,
  slug TEXT NOT NULL UNIQUE,
  specialty TEXT,
  region TEXT,
  source TEXT,
  is_vip BOOLEAN NOT NULL DEFAULT true,
  is_public_directory BOOLEAN NOT NULL DEFAULT false,
  activated_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  tenant_id UUID
);

-- Create vip_invitation_tracking table
CREATE TABLE public.vip_invitation_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invite_id UUID NOT NULL REFERENCES public.vip_invites(id) ON DELETE CASCADE,
  channel invite_channel NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  viewed_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vip_admin_activity_log table
CREATE TABLE public.vip_admin_activity_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  target_invite_id UUID REFERENCES public.vip_invites(id),
  details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  tenant_id UUID
);

-- Create vip_landing_page_views table
CREATE TABLE public.vip_landing_page_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invite_id UUID NOT NULL REFERENCES public.vip_invites(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'
);

-- Enable RLS
ALTER TABLE public.vip_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vip_invitation_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vip_admin_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vip_landing_page_views ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vip_invites
CREATE POLICY "Admins can manage all VIP invites" ON public.vip_invites
  FOR ALL USING (
    has_any_role(ARRAY['admin', 'system_administrator', 'tenant_admin'])
  );

CREATE POLICY "Public can view public directory invites" ON public.vip_invites
  FOR SELECT USING (
    is_public_directory = true AND invite_status = 'activated'
  );

CREATE POLICY "Invitees can view their own invite by slug" ON public.vip_invites
  FOR SELECT USING (true);

-- RLS Policies for vip_invitation_tracking
CREATE POLICY "Admins can manage invitation tracking" ON public.vip_invitation_tracking
  FOR ALL USING (
    has_any_role(ARRAY['admin', 'system_administrator', 'tenant_admin'])
  );

-- RLS Policies for vip_admin_activity_log
CREATE POLICY "Admins can view activity logs" ON public.vip_admin_activity_log
  FOR SELECT USING (
    has_any_role(ARRAY['admin', 'system_administrator', 'tenant_admin'])
  );

-- RLS Policies for vip_landing_page_views
CREATE POLICY "Admins can view landing page analytics" ON public.vip_landing_page_views
  FOR SELECT USING (
    has_any_role(ARRAY['admin', 'system_administrator', 'tenant_admin'])
  );

CREATE POLICY "System can log page views" ON public.vip_landing_page_views
  FOR INSERT WITH CHECK (true);

-- Functions
CREATE OR REPLACE FUNCTION public.generate_vip_invite_slug(p_name TEXT, p_firm TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Create base slug from name and firm
  base_slug := lower(replace(replace(coalesce(p_name, '') || '-' || coalesce(p_firm, ''), ' ', '-'), '.', ''));
  base_slug := regexp_replace(base_slug, '[^a-z0-9\-]', '', 'g');
  base_slug := regexp_replace(base_slug, '\-+', '-', 'g');
  base_slug := trim(base_slug, '-');
  
  final_slug := base_slug;
  
  -- Ensure uniqueness
  WHILE EXISTS (SELECT 1 FROM public.vip_invites WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE OR REPLACE FUNCTION public.log_vip_admin_activity(
  p_admin_user_id UUID,
  p_action_type TEXT,
  p_target_invite_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  activity_id UUID;
BEGIN
  INSERT INTO public.vip_admin_activity_log (
    admin_user_id, action_type, target_invite_id, details, tenant_id
  ) VALUES (
    p_admin_user_id, p_action_type, p_target_invite_id, p_details, get_current_user_tenant_id()
  ) RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Triggers
CREATE OR REPLACE FUNCTION public.update_vip_invite_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vip_invites_timestamp
  BEFORE UPDATE ON public.vip_invites
  FOR EACH ROW
  EXECUTE FUNCTION public.update_vip_invite_timestamp();

-- Sample VIP data
INSERT INTO public.vip_invites (name, firm, persona_type, email, slug, batch_name, specialty, region, source) VALUES
-- Family Offices
('Harrison Wealth', 'Harrison Family Office', 'family_office', 'contact@harrisonwealth.com', 'harrison-wealth-family-office', 'Elite 100', 'Multi-Family Office', 'New York', 'LinkedIn'),
('Rockefeller Capital', 'Rockefeller Capital Management', 'family_office', 'info@rockco.com', 'rockefeller-capital-management', 'Elite 100', 'Investment Management', 'New York', 'Industry Directory'),
('Bessemer Trust', 'Bessemer Trust Company', 'family_office', 'contact@bessemer.com', 'bessemer-trust-company', 'Elite 100', 'Wealth Management', 'New York', 'Forbes List'),

-- Advisors
('Michael Thompson', 'Thompson Wealth Advisors', 'advisor', 'mthompson@thompsonwealth.com', 'michael-thompson-thompson-wealth-advisors', 'VIP 100', 'Retirement Planning', 'California', 'NAPFA Directory'),
('Sarah Chen', 'Chen Financial Planning', 'advisor', 'sarah@chenfinancial.com', 'sarah-chen-chen-financial-planning', 'VIP 100', 'Tax Planning', 'Texas', 'LinkedIn'),
('David Rodriguez', 'Rodriguez Investment Management', 'advisor', 'david@rodriguezim.com', 'david-rodriguez-rodriguez-investment-management', 'VIP 100', 'Estate Planning', 'Florida', 'Barron\'s Top 100'),

-- Attorneys
('Jennifer Walsh', 'Walsh Estate Law', 'attorney', 'jwalsh@walshestatelaw.com', 'jennifer-walsh-walsh-estate-law', 'Legal 100', 'Estate Planning', 'California', 'Super Lawyers'),
('Robert Kim', 'Kim Family Law Group', 'attorney', 'rkim@kimfamilylaw.com', 'robert-kim-kim-family-law-group', 'Legal 100', 'Family Law', 'New York', 'Martindale-Hubbell'),
('Lisa Martinez', 'Martinez Tax Attorneys', 'attorney', 'lisa@martineztax.com', 'lisa-martinez-martinez-tax-attorneys', 'Legal 100', 'Tax Law', 'Illinois', 'State Bar Directory'),

-- CPAs
('John Anderson', 'Anderson CPA Group', 'cpa', 'john@andersoncpa.com', 'john-anderson-anderson-cpa-group', 'CPA 100', 'Tax Planning', 'California', 'AICPA Directory'),
('Maria Gonzalez', 'Gonzalez Accounting Services', 'cpa', 'maria@gonzalezaccounting.com', 'maria-gonzalez-gonzalez-accounting-services', 'CPA 100', 'Business Advisory', 'Texas', 'LinkedIn'),
('Thomas Lee', 'Lee & Associates CPAs', 'cpa', 'thomas@leeassociatescpa.com', 'thomas-lee-lee-associates-cpas', 'CPA 100', 'Forensic Accounting', 'New York', 'Top 100 CPAs'),

-- Healthcare
('Dr. Amanda Foster', 'Foster Longevity Clinic', 'healthcare', 'afoster@fosterlongevity.com', 'dr-amanda-foster-foster-longevity-clinic', 'Health 100', 'Longevity Medicine', 'California', 'A4M Directory'),
('Dr. Steven Park', 'Park Wellness Center', 'healthcare', 'spark@parkwellness.com', 'dr-steven-park-park-wellness-center', 'Health 100', 'Functional Medicine', 'Florida', 'LinkedIn'),
('Dr. Rachel Green', 'Green Concierge Medicine', 'healthcare', 'rgreen@greenconcierge.com', 'dr-rachel-green-green-concierge-medicine', 'Health 100', 'Concierge Medicine', 'New York', 'Concierge Medicine Directory');