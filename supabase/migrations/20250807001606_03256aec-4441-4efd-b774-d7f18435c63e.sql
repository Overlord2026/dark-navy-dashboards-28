-- Create VIP invitations table for global outreach management
CREATE TABLE IF NOT EXISTS public.vip_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Invitation details
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  persona TEXT NOT NULL,
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'opened', 'signed_up', 'bounced')),
  sent_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  signed_up_at TIMESTAMP WITH TIME ZONE,
  
  -- Invitation metadata
  invitation_code TEXT UNIQUE,
  invitation_url TEXT,
  source TEXT DEFAULT 'admin_invite',
  
  -- Response tracking
  email_opens INTEGER DEFAULT 0,
  link_clicks INTEGER DEFAULT 0,
  last_activity_at TIMESTAMP WITH TIME ZONE,
  
  created_by UUID REFERENCES auth.users(id)
);

-- Create global campaign analytics table
CREATE TABLE IF NOT EXISTS public.global_campaign_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Time period
  date_recorded DATE NOT NULL,
  region TEXT NOT NULL,
  language TEXT NOT NULL,
  
  -- Invitation metrics
  invitations_sent INTEGER DEFAULT 0,
  invitations_opened INTEGER DEFAULT 0,
  invitations_clicked INTEGER DEFAULT 0,
  
  -- Conversion metrics
  signups INTEGER DEFAULT 0,
  profile_completions INTEGER DEFAULT 0,
  advisor_connections INTEGER DEFAULT 0,
  
  -- Engagement metrics
  avg_time_on_platform INTEGER DEFAULT 0, -- seconds
  feature_adoption_rate NUMERIC(5,2) DEFAULT 0,
  user_retention_7d NUMERIC(5,2) DEFAULT 0,
  
  UNIQUE(date_recorded, region, language)
);

-- Create legal document templates table
CREATE TABLE IF NOT EXISTS public.legal_document_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Template identification
  title TEXT NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('privacy', 'terms', 'disclosure', 'disclaimer', 'cookie_policy')),
  language TEXT NOT NULL,
  
  -- Content
  content TEXT NOT NULL,
  template_variables JSONB DEFAULT '{}'::jsonb,
  
  -- Compliance
  compliance_regions TEXT[] NOT NULL DEFAULT '{}',
  regulatory_framework TEXT[],
  last_legal_review TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES auth.users(id),
  
  -- Status
  is_active BOOLEAN DEFAULT false,
  version_number INTEGER DEFAULT 1,
  parent_template_id UUID REFERENCES public.legal_document_templates(id),
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  
  UNIQUE(document_type, language, version_number)
);

-- Enable RLS on new tables
ALTER TABLE public.vip_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_campaign_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_document_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for VIP invitations
CREATE POLICY "Admins can manage VIP invitations" ON public.vip_invitations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'system_administrator', 'tenant_admin')
    )
  );

-- RLS Policies for campaign metrics
CREATE POLICY "Admins can view campaign metrics" ON public.global_campaign_metrics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'system_administrator', 'tenant_admin')
    )
  );

-- RLS Policies for legal templates
CREATE POLICY "Admins can manage legal templates" ON public.legal_document_templates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'system_administrator', 'tenant_admin')
    )
  );

CREATE POLICY "Anyone can view active legal templates" ON public.legal_document_templates
  FOR SELECT USING (is_active = true);

-- Create indexes for performance
CREATE INDEX idx_vip_invitations_email ON public.vip_invitations(email);
CREATE INDEX idx_vip_invitations_status ON public.vip_invitations(status);
CREATE INDEX idx_vip_invitations_language ON public.vip_invitations(language);
CREATE INDEX idx_vip_invitations_country ON public.vip_invitations(country);

CREATE INDEX idx_campaign_metrics_date_region ON public.global_campaign_metrics(date_recorded, region);
CREATE INDEX idx_campaign_metrics_language ON public.global_campaign_metrics(language);

CREATE INDEX idx_legal_templates_type_lang ON public.legal_document_templates(document_type, language);
CREATE INDEX idx_legal_templates_active ON public.legal_document_templates(is_active);

-- Create function to generate VIP invitation codes
CREATE OR REPLACE FUNCTION public.generate_vip_invitation_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  code TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- Generate VIP invitation code with prefix
    code := 'VIP-' || upper(substring(encode(gen_random_bytes(8), 'base64') from 1 for 8));
    code := replace(code, '/', '');
    code := replace(code, '+', '');
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.vip_invitations WHERE invitation_code = code) INTO exists_check;
    
    IF NOT exists_check THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN code;
END;
$$;

-- Create trigger to auto-generate invitation codes
CREATE OR REPLACE FUNCTION public.set_vip_invitation_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path TO ''
AS $$
BEGIN
  IF NEW.invitation_code IS NULL THEN
    NEW.invitation_code := public.generate_vip_invitation_code();
  END IF;
  
  -- Generate invitation URL
  NEW.invitation_url := 'https://my.bfocfo.com/invite/' || NEW.invitation_code;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_set_vip_invitation_code
  BEFORE INSERT ON public.vip_invitations
  FOR EACH ROW
  EXECUTE FUNCTION public.set_vip_invitation_code();

-- Create trigger to update timestamp
CREATE TRIGGER trigger_update_vip_invitations_timestamp
  BEFORE UPDATE ON public.vip_invitations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER trigger_update_legal_templates_timestamp
  BEFORE UPDATE ON public.legal_document_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_modified_column();