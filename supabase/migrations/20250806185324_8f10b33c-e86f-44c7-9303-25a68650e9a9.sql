-- Create VIP onboarding and organization portal system
CREATE TABLE public.vip_organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_name TEXT NOT NULL,
  organization_type TEXT NOT NULL, -- 'advisor', 'attorney', 'cpa', 'healthcare', 'imo_fmo', 'mastermind', etc.
  industry_segment TEXT,
  logo_url TEXT,
  brand_colors JSONB DEFAULT '{"primary": "#000000", "secondary": "#666666"}'::jsonb,
  custom_banner_url TEXT,
  contact_email TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_phone TEXT,
  linkedin_url TEXT,
  website_url TEXT,
  location TEXT,
  specialties TEXT[],
  firm_details JSONB DEFAULT '{}'::jsonb,
  vip_tier TEXT NOT NULL DEFAULT 'founding_member', -- 'founding_member', 'early_adopter', 'partner', 'thought_leader'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'invited', 'activated', 'active', 'inactive'
  magic_link_token TEXT UNIQUE,
  magic_link_expires_at TIMESTAMP WITH TIME ZONE,
  portal_subdomain TEXT UNIQUE,
  early_access_expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '6 months'),
  premium_features_unlocked JSONB DEFAULT '[]'::jsonb,
  onboarding_completed_at TIMESTAMP WITH TIME ZONE,
  first_login_at TIMESTAMP WITH TIME ZONE,
  referral_code TEXT UNIQUE,
  referred_by_user_id UUID REFERENCES public.profiles(id),
  admin_contact_id UUID REFERENCES public.profiles(id),
  concierge_notes TEXT,
  internal_notes TEXT,
  batch_import_id UUID,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  tenant_id UUID
);

-- Create VIP organization members table
CREATE TABLE public.vip_organization_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.vip_organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  email TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'member', -- 'admin', 'manager', 'member', 'pending'
  invitation_status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'accepted', 'declined'
  invitation_token TEXT UNIQUE,
  invitation_sent_at TIMESTAMP WITH TIME ZONE,
  joined_at TIMESTAMP WITH TIME ZONE,
  permissions JSONB DEFAULT '{"dashboard": true, "invite_members": false, "manage_org": false}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create VIP batch imports table for tracking bulk uploads
CREATE TABLE public.vip_batch_imports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_name TEXT NOT NULL,
  persona_type TEXT NOT NULL,
  total_records INTEGER NOT NULL DEFAULT 0,
  processed_records INTEGER NOT NULL DEFAULT 0,
  successful_imports INTEGER NOT NULL DEFAULT 0,
  failed_imports INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'processing', -- 'processing', 'completed', 'failed', 'cancelled'
  import_data JSONB,
  error_log JSONB DEFAULT '[]'::jsonb,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  tenant_id UUID
);

-- Create VIP outreach tracking
CREATE TABLE public.vip_outreach_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.vip_organizations(id) ON DELETE CASCADE,
  outreach_type TEXT NOT NULL, -- 'email', 'sms', 'linkedin', 'phone', 'video'
  outreach_method TEXT, -- 'manual', 'bulk', 'automated'
  template_used TEXT,
  subject_line TEXT,
  message_content TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  responded_at TIMESTAMP WITH TIME ZONE,
  response_text TEXT,
  follow_up_scheduled TIMESTAMP WITH TIME ZONE,
  sent_by UUID REFERENCES public.profiles(id),
  status TEXT DEFAULT 'sent', -- 'sent', 'delivered', 'opened', 'clicked', 'responded', 'bounced', 'failed'
  tracking_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create VIP referral network tracking (extends existing referrals)
CREATE TABLE public.vip_referral_networks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.vip_organizations(id) ON DELETE CASCADE,
  referrer_id UUID NOT NULL REFERENCES public.profiles(id),
  referee_id UUID REFERENCES public.profiles(id),
  referee_email TEXT,
  referee_organization TEXT,
  network_level INTEGER DEFAULT 1, -- 1st degree, 2nd degree, etc.
  referral_source TEXT, -- 'direct', 'magic_link', 'organization_invite', 'member_invite'
  activation_status TEXT DEFAULT 'pending', -- 'pending', 'activated', 'churned'
  activation_date TIMESTAMP WITH TIME ZONE,
  total_credits_earned NUMERIC DEFAULT 0,
  total_features_unlocked INTEGER DEFAULT 0,
  ltv_contribution NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.vip_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vip_organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vip_batch_imports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vip_outreach_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vip_referral_networks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for VIP Organizations
CREATE POLICY "Admins can manage all VIP organizations" ON public.vip_organizations
  FOR ALL USING (
    has_any_role(ARRAY['admin', 'system_administrator', 'tenant_admin'])
  );

CREATE POLICY "Organization contacts can view their organization" ON public.vip_organizations
  FOR SELECT USING (
    admin_contact_id = auth.uid() OR 
    id IN (
      SELECT organization_id FROM public.vip_organization_members 
      WHERE user_id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- RLS Policies for VIP Organization Members
CREATE POLICY "Admins can manage all VIP org members" ON public.vip_organization_members
  FOR ALL USING (
    has_any_role(ARRAY['admin', 'system_administrator', 'tenant_admin'])
  );

CREATE POLICY "Organization admins can manage their members" ON public.vip_organization_members
  FOR ALL USING (
    organization_id IN (
      SELECT id FROM public.vip_organizations 
      WHERE admin_contact_id = auth.uid()
    ) OR
    organization_id IN (
      SELECT organization_id FROM public.vip_organization_members 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Members can view their organization" ON public.vip_organization_members
  FOR SELECT USING (user_id = auth.uid());

-- RLS Policies for VIP Batch Imports
CREATE POLICY "Admins can manage batch imports" ON public.vip_batch_imports
  FOR ALL USING (
    has_any_role(ARRAY['admin', 'system_administrator', 'tenant_admin']) AND
    (tenant_id = get_current_user_tenant_id() OR get_current_user_role() = 'system_administrator')
  );

-- RLS Policies for VIP Outreach Log
CREATE POLICY "Admins can manage outreach logs" ON public.vip_outreach_log
  FOR ALL USING (
    has_any_role(ARRAY['admin', 'system_administrator', 'tenant_admin']) OR
    sent_by = auth.uid()
  );

-- RLS Policies for VIP Referral Networks
CREATE POLICY "Users can view their referral networks" ON public.vip_referral_networks
  FOR SELECT USING (
    referrer_id = auth.uid() OR 
    referee_id = auth.uid() OR
    has_any_role(ARRAY['admin', 'system_administrator', 'tenant_admin'])
  );

CREATE POLICY "System can manage referral networks" ON public.vip_referral_networks
  FOR ALL USING (
    has_any_role(ARRAY['admin', 'system_administrator', 'tenant_admin'])
  );

-- Create indexes for performance
CREATE INDEX idx_vip_organizations_status ON public.vip_organizations(status);
CREATE INDEX idx_vip_organizations_type ON public.vip_organizations(organization_type);
CREATE INDEX idx_vip_organizations_magic_token ON public.vip_organizations(magic_link_token);
CREATE INDEX idx_vip_organizations_referral_code ON public.vip_organizations(referral_code);
CREATE INDEX idx_vip_org_members_org_id ON public.vip_organization_members(organization_id);
CREATE INDEX idx_vip_org_members_user_id ON public.vip_organization_members(user_id);
CREATE INDEX idx_vip_referral_networks_org_id ON public.vip_referral_networks(organization_id);
CREATE INDEX idx_vip_referral_networks_referrer ON public.vip_referral_networks(referrer_id);

-- Create functions for VIP management
CREATE OR REPLACE FUNCTION public.generate_vip_magic_link(p_organization_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  magic_token TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- Generate secure random token
    magic_token := encode(gen_random_bytes(32), 'base64');
    magic_token := replace(magic_token, '/', '_');
    magic_token := replace(magic_token, '+', '-');
    
    -- Check if token already exists
    SELECT EXISTS(
      SELECT 1 FROM public.vip_organizations WHERE magic_link_token = magic_token
    ) INTO exists_check;
    
    IF NOT exists_check THEN
      EXIT;
    END IF;
  END LOOP;
  
  -- Update organization with magic link
  UPDATE public.vip_organizations 
  SET 
    magic_link_token = magic_token,
    magic_link_expires_at = now() + INTERVAL '30 days',
    status = 'invited',
    updated_at = now()
  WHERE id = p_organization_id;
  
  RETURN magic_token;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_vip_referral_code(p_organization_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  referral_code TEXT;
  org_name TEXT;
  exists_check BOOLEAN;
BEGIN
  -- Get organization name for code prefix
  SELECT organization_name INTO org_name
  FROM public.vip_organizations
  WHERE id = p_organization_id;
  
  LOOP
    -- Generate code with org prefix
    referral_code := upper(left(regexp_replace(org_name, '[^a-zA-Z0-9]', '', 'g'), 3)) || 
                    '-VIP-' || 
                    upper(substring(encode(gen_random_bytes(4), 'base64') from 1 for 6));
    referral_code := replace(referral_code, '/', '');
    referral_code := replace(referral_code, '+', '');
    
    -- Check if code already exists
    SELECT EXISTS(
      SELECT 1 FROM public.vip_organizations WHERE referral_code = referral_code
    ) INTO exists_check;
    
    IF NOT exists_check THEN
      EXIT;
    END IF;
  END LOOP;
  
  -- Update organization with referral code
  UPDATE public.vip_organizations 
  SET referral_code = referral_code, updated_at = now()
  WHERE id = p_organization_id;
  
  RETURN referral_code;
END;
$$;

CREATE OR REPLACE FUNCTION public.activate_vip_organization(p_magic_token TEXT, p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  org_record RECORD;
  result JSONB;
BEGIN
  -- Find organization by magic token
  SELECT * INTO org_record
  FROM public.vip_organizations
  WHERE magic_link_token = p_magic_token
    AND magic_link_expires_at > now()
    AND status IN ('pending', 'invited');
  
  IF org_record IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Invalid or expired magic link'
    );
  END IF;
  
  -- Update organization status
  UPDATE public.vip_organizations
  SET 
    status = 'activated',
    admin_contact_id = p_user_id,
    onboarding_completed_at = now(),
    first_login_at = now(),
    updated_at = now()
  WHERE id = org_record.id;
  
  -- Add user as admin member
  INSERT INTO public.vip_organization_members (
    organization_id, user_id, email, name, role, 
    invitation_status, joined_at
  ) VALUES (
    org_record.id, p_user_id, org_record.contact_email, 
    org_record.contact_name, 'admin', 'accepted', now()
  );
  
  -- Generate referral code if not exists
  IF org_record.referral_code IS NULL THEN
    PERFORM public.generate_vip_referral_code(org_record.id);
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'organization_id', org_record.id,
    'organization_name', org_record.organization_name
  );
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_vip_organizations_updated_at
  BEFORE UPDATE ON public.vip_organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_vip_organization_members_updated_at
  BEFORE UPDATE ON public.vip_organization_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_vip_referral_networks_updated_at
  BEFORE UPDATE ON public.vip_referral_networks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_modified_column();