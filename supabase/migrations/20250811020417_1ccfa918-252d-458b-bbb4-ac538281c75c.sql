-- Create denial_telemetry table with RLS
CREATE TABLE IF NOT EXISTS public.denial_telemetry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  user_id UUID NOT NULL,
  policy_node_id TEXT NOT NULL,
  reason_code TEXT NOT NULL,
  block_id BIGINT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for denial_telemetry
ALTER TABLE public.denial_telemetry ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view denial telemetry in their tenant"
ON public.denial_telemetry FOR SELECT
USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "System can insert denial telemetry"
ON public.denial_telemetry FOR INSERT
WITH CHECK (auth.role() = 'service_role' OR tenant_id = get_current_user_tenant_id());

-- Add unique constraint to persona_audit for append-only enforcement
ALTER TABLE public.persona_audit 
ADD CONSTRAINT unique_tenant_block_number 
UNIQUE (tenant_id, block_number);

-- Prevent updates on persona_audit (append-only)
CREATE OR REPLACE FUNCTION public.prevent_persona_audit_updates()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Updates not allowed on persona_audit table - append-only';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_persona_audit_updates
BEFORE UPDATE ON public.persona_audit
FOR EACH ROW EXECUTE FUNCTION public.prevent_persona_audit_updates();

-- Fork detection trigger for persona_audit
CREATE OR REPLACE FUNCTION public.detect_persona_audit_fork()
RETURNS TRIGGER AS $$
DECLARE
  existing_hash TEXT;
BEGIN
  -- Check if block already exists with different hash
  SELECT current_hash INTO existing_hash
  FROM public.persona_audit
  WHERE tenant_id = NEW.tenant_id AND block_number = NEW.block_number;
  
  IF existing_hash IS NOT NULL AND existing_hash != NEW.current_hash THEN
    RAISE EXCEPTION 'Fork detected: block % already exists with different hash. Expected: %, Got: %', 
      NEW.block_number, existing_hash, NEW.current_hash;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER detect_persona_audit_fork
BEFORE INSERT ON public.persona_audit
FOR EACH ROW EXECUTE FUNCTION public.detect_persona_audit_fork();

-- Enhanced SHA3-256 audit hash function
CREATE OR REPLACE FUNCTION public.calculate_audit_hash_sha3(
  p_tenant_id UUID,
  p_persona_id UUID,
  p_event_type TEXT,
  p_inputs_hash TEXT,
  p_outputs_hash TEXT,
  p_salt TEXT DEFAULT 'fom_audit_salt_2024'
) RETURNS TEXT AS $$
BEGIN
  -- Use SHA3-256 for enhanced security
  RETURN encode(
    digest(
      p_tenant_id::TEXT || 
      p_persona_id::TEXT || 
      p_event_type || 
      p_inputs_hash || 
      p_outputs_hash || 
      p_salt,
      'sha3-256'
    ),
    'hex'
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Policy tokens table for minimal-scope tokenization
CREATE TABLE IF NOT EXISTS public.policy_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  token_body JSONB NOT NULL,
  scopes TEXT[] NOT NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID
);

ALTER TABLE public.policy_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage policy tokens in their tenant"
ON public.policy_tokens FOR ALL
USING (tenant_id = get_current_user_tenant_id());

-- Add index for token hash lookups
CREATE INDEX IF NOT EXISTS idx_policy_tokens_hash ON public.policy_tokens(token_hash);

-- SQL helper function for role checks
CREATE OR REPLACE FUNCTION public.has_any_role(required_roles TEXT[])
RETURNS BOOLEAN AS $$
BEGIN
  RETURN COALESCE(
    (SELECT role = ANY(required_roles) 
     FROM public.profiles 
     WHERE id = auth.uid() 
     LIMIT 1), 
    false
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;