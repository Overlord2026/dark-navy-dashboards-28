-- Create reports storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('reports', 'reports', false)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for reports bucket
CREATE POLICY "Authenticated users can view reports" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'reports' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Service role can manage reports" 
ON storage.objects 
FOR ALL 
USING (
  bucket_id = 'reports' 
  AND auth.role() = 'service_role'
);

-- Update receipt_emit function to be more restrictive
CREATE OR REPLACE FUNCTION public.receipt_emit_secure(
    inputs_json JSONB,
    policy_json JSONB,
    outcome TEXT,
    reasons JSONB DEFAULT '[]'::jsonb,
    entity_id UUID DEFAULT NULL,
    model_hash TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
    receipt_id UUID;
    inputs_hash TEXT;
    policy_hash TEXT;
    leaf_hash TEXT;
    root_hash TEXT;
    leaves TEXT[];
BEGIN
    -- Only allow service role to call this function directly
    IF auth.role() != 'service_role' THEN
        RAISE EXCEPTION 'Access denied: Only service role can emit receipts directly';
    END IF;
    
    -- Generate new receipt ID
    receipt_id := gen_random_uuid();
    
    -- Compute input and policy hashes
    inputs_hash := public.sha256_hex(inputs_json::text);
    policy_hash := public.sha256_hex(policy_json::text);
    
    -- Create leaf hash from receipt components
    leaf_hash := public.sha256_hex(
        receipt_id::text || 
        COALESCE(entity_id::text, '') ||
        inputs_hash || 
        policy_hash || 
        outcome ||
        COALESCE(model_hash, '') ||
        reasons::text ||
        extract(epoch from now())::text
    );
    
    -- For demo: create a simple merkle root (in production, this would batch with other receipts)
    leaves := ARRAY[leaf_hash];
    root_hash := public.merkle_root(leaves);
    
    -- Insert the receipt
    INSERT INTO public.receipts (
        receipt_id,
        entity_id,
        inputs_hash,
        policy_hash,
        model_hash,
        reason_codes,
        outcome,
        leaf,
        root
    ) VALUES (
        receipt_id,
        entity_id,
        inputs_hash,
        policy_hash,
        model_hash,
        reasons,
        outcome,
        leaf_hash,
        root_hash
    );
    
    RETURN receipt_id;
END;
$$;

-- Grant execute permissions only to service role
GRANT EXECUTE ON FUNCTION public.receipt_emit_secure(JSONB, JSONB, TEXT, JSONB, UUID, TEXT) TO service_role;

-- Create a helper function for authenticated users to request receipt emission
CREATE OR REPLACE FUNCTION public.request_receipt_emission(
    inputs_json JSONB,
    policy_json JSONB,
    outcome TEXT,
    reasons JSONB DEFAULT '[]'::jsonb,
    entity_id UUID DEFAULT NULL,
    model_hash TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
    receipt_id UUID;
    current_tenant_id UUID;
BEGIN
    -- Verify user is authenticated
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Authentication required';
    END IF;
    
    -- Get current user's tenant ID
    current_tenant_id := get_current_user_tenant_id();
    
    -- Verify entity belongs to user's tenant (if entity_id provided)
    IF entity_id IS NOT NULL THEN
        IF NOT EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = entity_id 
            AND tenant_id = current_tenant_id
        ) THEN
            RAISE EXCEPTION 'Access denied: Entity does not belong to your tenant';
        END IF;
    END IF;
    
    -- Call the secure receipt emission function
    SELECT public.receipt_emit_secure(
        inputs_json, policy_json, outcome, reasons, entity_id, model_hash
    ) INTO receipt_id;
    
    RETURN receipt_id;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.request_receipt_emission(JSONB, JSONB, TEXT, JSONB, UUID, TEXT) TO authenticated;