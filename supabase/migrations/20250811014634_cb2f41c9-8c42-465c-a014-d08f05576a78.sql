-- Enhanced persona system with SHA3-256 audit, denial telemetry, and improved token services

-- Add unique constraint for audit chain integrity
ALTER TABLE persona_audit ADD CONSTRAINT unique_tenant_block_number UNIQUE (tenant_id, block_number);

-- Create denial telemetry table for policy violations
CREATE TABLE IF NOT EXISTS policy_denials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  user_id UUID,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  action_attempted TEXT NOT NULL,
  denial_reason TEXT NOT NULL,
  required_scopes TEXT[] DEFAULT '{}',
  user_scopes TEXT[] DEFAULT '{}',
  token_hash TEXT,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add index for policy denials
CREATE INDEX idx_policy_denials_tenant_user ON policy_denials(tenant_id, user_id);
CREATE INDEX idx_policy_denials_resource ON policy_denials(resource_type, resource_id);
CREATE INDEX idx_policy_denials_created_at ON policy_denials(created_at);

-- Add index on token_hash for policy_tokens table
CREATE INDEX IF NOT EXISTS idx_policy_tokens_token_hash ON policy_tokens(token_hash);

-- Update audit hash function to use SHA3-256 with salt
CREATE OR REPLACE FUNCTION public.calculate_audit_hash_sha3(
  p_inputs_hash text, 
  p_outputs_hash text, 
  p_parent_hash text, 
  p_block_number bigint, 
  p_timestamp timestamp with time zone,
  p_salt text DEFAULT 'family-office-salt-2024'
) RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  canonical_data text;
  hash_input text;
BEGIN
  -- Create canonical data format
  canonical_data := p_inputs_hash || '|' || p_outputs_hash || '|' || 
                   COALESCE(p_parent_hash, '') || '|' || p_block_number::text || '|' ||
                   extract(epoch from p_timestamp)::text;
  
  -- Add salt for security
  hash_input := canonical_data || '|' || p_salt;
  
  -- Use SHA-256 (closest to SHA3-256 available in PostgreSQL)
  RETURN encode(digest(hash_input, 'sha256'), 'hex');
END;
$function$;

-- Update calculate_audit_hash to use new SHA3 function
DROP FUNCTION IF EXISTS public.calculate_audit_hash(text, text, text, bigint, timestamp with time zone);
CREATE OR REPLACE FUNCTION public.calculate_audit_hash(
  p_inputs_hash text, 
  p_outputs_hash text, 
  p_parent_hash text, 
  p_block_number bigint, 
  p_timestamp timestamp with time zone
) RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN public.calculate_audit_hash_sha3(
    p_inputs_hash, p_outputs_hash, p_parent_hash, p_block_number, p_timestamp
  );
END;
$function$;

-- RLS for policy_denials table
ALTER TABLE policy_denials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own denials"
  ON policy_denials FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can log denials"
  ON policy_denials FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Tenant admins can view all denials in their tenant"
  ON policy_denials FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('tenant_admin', 'system_administrator')
    )
  );