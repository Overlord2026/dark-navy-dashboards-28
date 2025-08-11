-- Create denial telemetry table
CREATE TABLE public.policy_denials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  persona_id UUID NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  action_attempted TEXT NOT NULL,
  denial_reason TEXT NOT NULL,
  required_scopes TEXT[] NOT NULL,
  user_scopes TEXT[] NOT NULL,
  ip_address INET,
  user_agent TEXT,
  session_context JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on policy_denials
ALTER TABLE public.policy_denials ENABLE ROW LEVEL SECURITY;

-- Policy for tenant-scoped access to denials
CREATE POLICY "Tenant users can view their policy denials" 
ON public.policy_denials 
FOR SELECT 
USING (tenant_id = get_current_user_tenant_id());

-- Add unique constraint on persona_audit for fork detection
ALTER TABLE public.persona_audit 
ADD CONSTRAINT unique_tenant_block_number UNIQUE (tenant_id, block_number);

-- Add index on policy_tokens.token_hash for performance
CREATE INDEX IF NOT EXISTS idx_policy_tokens_token_hash 
ON public.policy_tokens (token_hash);

-- Update audit hash function to use SHA-256 with salt
CREATE OR REPLACE FUNCTION public.calculate_audit_hash_with_salt(
  p_inputs_hash text, 
  p_outputs_hash text, 
  p_parent_hash text, 
  p_block_number bigint, 
  p_timestamp timestamp with time zone,
  p_salt text DEFAULT 'fom_audit_salt_2024'
) RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  canonical_data text;
BEGIN
  -- Create canonical representation with salt
  canonical_data := p_salt || '|' || p_inputs_hash || '|' || p_outputs_hash || '|' || 
                   COALESCE(p_parent_hash, '') || '|' || p_block_number::text || '|' ||
                   extract(epoch from p_timestamp)::text;
  
  -- Return SHA-256 hash
  RETURN encode(digest(canonical_data, 'sha256'), 'hex');
END;
$function$;

-- Update persona_audit trigger to use new hash function
CREATE OR REPLACE FUNCTION public.persona_audit_before_insert()
RETURNS TRIGGER AS $function$
DECLARE
  parent_hash text;
  audit_hash text;
BEGIN
  -- Get parent hash (most recent block for this tenant)
  SELECT block_hash INTO parent_hash
  FROM public.persona_audit 
  WHERE tenant_id = NEW.tenant_id 
    AND block_number = (NEW.block_number - 1)
  LIMIT 1;
  
  -- Calculate hash with salt
  audit_hash := public.calculate_audit_hash_with_salt(
    NEW.inputs_hash, 
    NEW.outputs_hash, 
    parent_hash, 
    NEW.block_number, 
    NEW.created_at
  );
  
  NEW.block_hash := audit_hash;
  NEW.parent_hash := parent_hash;
  
  RETURN NEW;
END;
$function$ LANGUAGE plpgsql SECURITY DEFINER;