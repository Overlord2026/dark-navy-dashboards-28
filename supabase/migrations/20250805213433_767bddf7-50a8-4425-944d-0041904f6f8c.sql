-- Universal Multi-Persona Seat Licensing System

-- First, let's create an enum for professional persona types
CREATE TYPE public.professional_persona AS ENUM (
  'advisor',
  'attorney', 
  'cpa',
  'insurance_agent',
  'consultant',
  'coach',
  'enterprise_admin'
);

-- Update existing advisor_seat_packages to be universal professional_seat_packages
DROP TABLE IF EXISTS public.advisor_seat_packages CASCADE;

CREATE TABLE public.professional_seat_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_user_id UUID NOT NULL,
  persona_type public.professional_persona NOT NULL,
  tenant_id UUID,
  package_name TEXT NOT NULL,
  total_seats INTEGER NOT NULL DEFAULT 0,
  used_seats INTEGER NOT NULL DEFAULT 0,
  remaining_seats INTEGER GENERATED ALWAYS AS (total_seats - used_seats) STORED,
  package_type TEXT NOT NULL DEFAULT 'standard', -- 'standard', 'premium', 'enterprise'
  price_per_seat NUMERIC(10,2),
  billing_frequency TEXT DEFAULT 'monthly', -- 'monthly', 'annual'
  purchase_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  expiration_date TIMESTAMPTZ,
  auto_renew BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'suspended', 'expired'
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Update advisor_invitations to be universal professional_invitations
DROP TABLE IF EXISTS public.advisor_invitations CASCADE;

CREATE TABLE public.professional_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_user_id UUID NOT NULL,
  persona_type public.professional_persona NOT NULL,
  tenant_id UUID,
  invitation_code TEXT UNIQUE NOT NULL,
  invitation_url TEXT,
  max_uses INTEGER DEFAULT 1,
  uses_remaining INTEGER,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  branding_config JSONB DEFAULT '{}', -- persona-specific branding
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Update advisor_client_links to be universal professional_client_links  
DROP TABLE IF EXISTS public.advisor_client_links CASCADE;

CREATE TABLE public.professional_client_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_user_id UUID NOT NULL,
  client_user_id UUID NOT NULL,
  persona_type public.professional_persona NOT NULL,
  tenant_id UUID,
  invitation_id UUID REFERENCES public.professional_invitations(id),
  seat_package_id UUID REFERENCES public.professional_seat_packages(id),
  relationship_type TEXT DEFAULT 'primary', -- 'primary', 'secondary', 'referral'
  client_tier TEXT DEFAULT 'basic', -- 'basic', 'premium', 'enterprise'
  linked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'suspended', 'transferred'
  billing_owner TEXT DEFAULT 'professional', -- 'professional', 'client'
  compliance_notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(professional_user_id, client_user_id, persona_type)
);

-- Create audit trail table for compliance
CREATE TABLE public.seat_license_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_user_id UUID NOT NULL,
  client_user_id UUID,
  persona_type public.professional_persona NOT NULL,
  action_type TEXT NOT NULL, -- 'seat_purchased', 'client_linked', 'seat_transferred', 'client_upgraded', etc.
  action_details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  performed_by UUID, -- who performed the action
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.professional_seat_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_client_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seat_license_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for professional_seat_packages
CREATE POLICY "Professionals can manage their own seat packages"
ON public.professional_seat_packages
FOR ALL
USING (professional_user_id = auth.uid());

CREATE POLICY "Tenant admins can view seat packages in their tenant"
ON public.professional_seat_packages
FOR SELECT
USING (
  tenant_id = get_current_user_tenant_id() 
  AND has_any_role(ARRAY['admin', 'tenant_admin'])
);

-- RLS Policies for professional_invitations
CREATE POLICY "Professionals can manage their own invitations"
ON public.professional_invitations
FOR ALL
USING (professional_user_id = auth.uid());

-- RLS Policies for professional_client_links
CREATE POLICY "Professionals can view their linked clients"
ON public.professional_client_links
FOR SELECT
USING (professional_user_id = auth.uid());

CREATE POLICY "Clients can view their professional links"
ON public.professional_client_links
FOR SELECT
USING (client_user_id = auth.uid());

CREATE POLICY "Professionals can create client links"
ON public.professional_client_links
FOR INSERT
WITH CHECK (professional_user_id = auth.uid());

CREATE POLICY "Professionals can update their client links"
ON public.professional_client_links
FOR UPDATE
USING (professional_user_id = auth.uid());

-- RLS Policies for audit log
CREATE POLICY "Users can view audit logs for their actions"
ON public.seat_license_audit_log
FOR SELECT
USING (
  professional_user_id = auth.uid() 
  OR client_user_id = auth.uid()
  OR performed_by = auth.uid()
);

CREATE POLICY "Service role can insert audit logs"
ON public.seat_license_audit_log
FOR INSERT
WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_professional_seat_packages_user_persona ON public.professional_seat_packages(professional_user_id, persona_type);
CREATE INDEX idx_professional_invitations_code ON public.professional_invitations(invitation_code);
CREATE INDEX idx_professional_invitations_user_persona ON public.professional_invitations(professional_user_id, persona_type);
CREATE INDEX idx_professional_client_links_professional ON public.professional_client_links(professional_user_id, persona_type);
CREATE INDEX idx_professional_client_links_client ON public.professional_client_links(client_user_id);
CREATE INDEX idx_seat_audit_log_professional ON public.seat_license_audit_log(professional_user_id, persona_type);

-- Functions for seat management
CREATE OR REPLACE FUNCTION public.generate_professional_invitation_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  code TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- Generate 8-character alphanumeric code
    code := upper(substring(encode(gen_random_bytes(6), 'base64') from 1 for 8));
    code := replace(code, '/', '');
    code := replace(code, '+', '');
    
    -- Check if code already exists
    SELECT EXISTS(
      SELECT 1 FROM public.professional_invitations WHERE invitation_code = code
    ) INTO exists_check;
    
    IF NOT exists_check THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN code;
END;
$$;

-- Function to update seat usage when client is linked
CREATE OR REPLACE FUNCTION public.update_seat_usage()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Update used_seats count when a client is linked/unlinked
  IF TG_OP = 'INSERT' THEN
    UPDATE public.professional_seat_packages
    SET used_seats = used_seats + 1,
        updated_at = now()
    WHERE id = NEW.seat_package_id;
    
    -- Log the action
    INSERT INTO public.seat_license_audit_log (
      professional_user_id, client_user_id, persona_type, 
      action_type, action_details, performed_by
    ) VALUES (
      NEW.professional_user_id, NEW.client_user_id, NEW.persona_type,
      'client_linked', 
      jsonb_build_object('seat_package_id', NEW.seat_package_id, 'relationship_type', NEW.relationship_type),
      auth.uid()
    );
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.professional_seat_packages
    SET used_seats = used_seats - 1,
        updated_at = now()
    WHERE id = OLD.seat_package_id;
    
    -- Log the action
    INSERT INTO public.seat_license_audit_log (
      professional_user_id, client_user_id, persona_type,
      action_type, action_details, performed_by
    ) VALUES (
      OLD.professional_user_id, OLD.client_user_id, OLD.persona_type,
      'client_unlinked',
      jsonb_build_object('seat_package_id', OLD.seat_package_id),
      auth.uid()
    );
    
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$;

-- Create trigger for seat usage updates
CREATE TRIGGER trigger_update_seat_usage
  AFTER INSERT OR DELETE ON public.professional_client_links
  FOR EACH ROW
  EXECUTE FUNCTION public.update_seat_usage();

-- Function to check if professional has available seats
CREATE OR REPLACE FUNCTION public.check_available_seats(
  p_professional_user_id UUID,
  p_persona_type public.professional_persona
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  available_seats INTEGER := 0;
BEGIN
  SELECT COALESCE(SUM(remaining_seats), 0)
  INTO available_seats
  FROM public.professional_seat_packages
  WHERE professional_user_id = p_professional_user_id
    AND persona_type = p_persona_type
    AND status = 'active'
    AND (expiration_date IS NULL OR expiration_date > now());
  
  RETURN available_seats > 0;
END;
$$;

-- Update existing advisor_invitation_usage to reference new table
DROP TABLE IF EXISTS public.advisor_invitation_usage CASCADE;

-- Create updated timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add updated_at triggers
CREATE TRIGGER update_professional_seat_packages_updated_at
  BEFORE UPDATE ON public.professional_seat_packages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_professional_invitations_updated_at
  BEFORE UPDATE ON public.professional_invitations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_professional_client_links_updated_at
  BEFORE UPDATE ON public.professional_client_links
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();