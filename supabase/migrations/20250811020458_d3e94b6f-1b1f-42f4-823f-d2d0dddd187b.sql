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

-- Enable RLS and create policies for denial_telemetry if table was just created
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'denial_telemetry' AND policyname = 'Users can view denial telemetry in their tenant') THEN
    ALTER TABLE public.denial_telemetry ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Users can view denial telemetry in their tenant"
    ON public.denial_telemetry FOR SELECT
    USING (tenant_id = get_current_user_tenant_id());
    
    CREATE POLICY "System can insert denial telemetry"
    ON public.denial_telemetry FOR INSERT
    WITH CHECK (auth.role() = 'service_role' OR tenant_id = get_current_user_tenant_id());
  END IF;
END
$$;

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

-- Enable RLS and create policies for policy_tokens if table was just created
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'policy_tokens' AND policyname = 'Users can manage policy tokens in their tenant') THEN
    ALTER TABLE public.policy_tokens ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Users can manage policy tokens in their tenant"
    ON public.policy_tokens FOR ALL
    USING (tenant_id = get_current_user_tenant_id());
  END IF;
END
$$;

-- Add index for token hash lookups if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_policy_tokens_hash ON public.policy_tokens(token_hash);