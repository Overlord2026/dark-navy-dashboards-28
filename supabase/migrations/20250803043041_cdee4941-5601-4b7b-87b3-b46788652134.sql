-- Create vault encryption keys table for role-based access
CREATE TABLE public.vault_encryption_keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vault_id UUID NOT NULL,
  role_type TEXT NOT NULL CHECK (role_type IN ('owner', 'admin', 'member', 'viewer', 'executor')),
  encrypted_master_key TEXT NOT NULL,
  key_derivation_salt TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(vault_id, role_type)
);

-- Enable RLS
ALTER TABLE public.vault_encryption_keys ENABLE ROW LEVEL SECURITY;

-- Create policies for vault encryption keys
CREATE POLICY "Users can view encryption keys for their vaults"
ON public.vault_encryption_keys
FOR SELECT
USING (
  vault_id IN (
    SELECT id FROM public.family_vaults 
    WHERE user_id = auth.uid() OR id IN (
      SELECT vault_id FROM public.vault_members 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  )
);

CREATE POLICY "Vault owners can manage encryption keys"
ON public.vault_encryption_keys
FOR ALL
USING (
  vault_id IN (
    SELECT id FROM public.family_vaults 
    WHERE user_id = auth.uid()
  )
);

-- Create vault sessions table for tracking secure access
CREATE TABLE public.vault_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vault_id UUID NOT NULL,
  user_id UUID NOT NULL,
  session_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  two_factor_verified BOOLEAN NOT NULL DEFAULT false,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.vault_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for vault sessions
CREATE POLICY "Users can manage their own vault sessions"
ON public.vault_sessions
FOR ALL
USING (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX idx_vault_encryption_keys_vault_id ON public.vault_encryption_keys(vault_id);
CREATE INDEX idx_vault_encryption_keys_role ON public.vault_encryption_keys(role_type);
CREATE INDEX idx_vault_sessions_user_id ON public.vault_sessions(user_id);
CREATE INDEX idx_vault_sessions_vault_id ON public.vault_sessions(vault_id);
CREATE INDEX idx_vault_sessions_expires_at ON public.vault_sessions(expires_at);

-- Add cleanup function for expired sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_vault_sessions()
RETURNS VOID AS $$
BEGIN
  DELETE FROM public.vault_sessions 
  WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Add 2FA enforcement check function
CREATE OR REPLACE FUNCTION public.verify_vault_2fa_requirement(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_2fa_enabled BOOLEAN;
BEGIN
  SELECT two_factor_enabled INTO user_2fa_enabled
  FROM public.profiles 
  WHERE id = p_user_id;
  
  IF NOT COALESCE(user_2fa_enabled, false) THEN
    RAISE EXCEPTION 'Two-factor authentication is required for vault access';
  END IF;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';