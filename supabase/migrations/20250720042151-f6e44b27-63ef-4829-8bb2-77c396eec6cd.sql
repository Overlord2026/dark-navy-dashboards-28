
-- Fix and enhance the tenant_invitations table for advisor magic link invitations
-- First, check if table exists and drop/recreate with proper structure
DROP TABLE IF EXISTS public.tenant_invitations CASCADE;

-- Create enhanced tenant_invitations table for advisor magic link invitations
CREATE TABLE public.tenant_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  email TEXT NOT NULL,
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'advisor',
  advisor_role TEXT,
  segments TEXT[],
  notes TEXT,
  invitation_token TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'expired', 'accepted', 'cancelled')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '7 days'),
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tenant_invitations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tenant_invitations
CREATE POLICY "Tenant admins can view their tenant invitations" 
  ON public.tenant_invitations 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND tenant_id = tenant_invitations.tenant_id 
      AND role IN ('admin', 'tenant_admin', 'system_administrator')
    )
  );

CREATE POLICY "Tenant admins can create invitations for their tenant" 
  ON public.tenant_invitations 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND tenant_id = tenant_invitations.tenant_id 
      AND role IN ('admin', 'tenant_admin', 'system_administrator')
    )
  );

CREATE POLICY "Tenant admins can update their tenant invitations" 
  ON public.tenant_invitations 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND tenant_id = tenant_invitations.tenant_id 
      AND role IN ('admin', 'tenant_admin', 'system_administrator')
    )
  );

-- Allow public access for magic link validation (needed for redemption)
CREATE POLICY "Public can read invitations for token validation" 
  ON public.tenant_invitations 
  FOR SELECT 
  USING (true);

-- Indexes for performance
CREATE INDEX idx_tenant_invitations_tenant_id ON public.tenant_invitations(tenant_id);
CREATE INDEX idx_tenant_invitations_token ON public.tenant_invitations(invitation_token);
CREATE INDEX idx_tenant_invitations_email ON public.tenant_invitations(email);
CREATE INDEX idx_tenant_invitations_status ON public.tenant_invitations(status);

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_tenant_invitations_updated_at
  BEFORE UPDATE ON public.tenant_invitations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
