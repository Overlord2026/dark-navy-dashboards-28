-- Create tenant invitations table
CREATE TABLE public.tenant_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  invited_email TEXT NOT NULL,
  inviter_user_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('advisor', 'client')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
  invitation_token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '7 days'),
  accepted_at TIMESTAMP WITH TIME ZONE,
  segments TEXT[] DEFAULT '{}',
  advisor_role TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tenant_invitations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Tenant admins can manage invitations for their tenant"
ON public.tenant_invitations
FOR ALL
USING (tenant_id = (SELECT tenant_id FROM profiles WHERE id = auth.uid()));

-- Create advisor assignments table
CREATE TABLE public.advisor_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  advisor_id UUID NOT NULL,
  client_id UUID,
  tenant_id UUID NOT NULL,
  segments TEXT[] DEFAULT '{}',
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  notes TEXT
);

-- Enable RLS on advisor assignments
ALTER TABLE public.advisor_assignments ENABLE ROW LEVEL SECURITY;

-- Policies for advisor assignments
CREATE POLICY "Advisors can view their assignments"
ON public.advisor_assignments
FOR SELECT
USING (advisor_id = auth.uid() OR tenant_id = (SELECT tenant_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Tenant admins can manage assignments"
ON public.advisor_assignments
FOR ALL
USING (tenant_id = (SELECT tenant_id FROM profiles WHERE id = auth.uid()));

-- Add segments and advisor_role to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS segments TEXT[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS advisor_role TEXT;