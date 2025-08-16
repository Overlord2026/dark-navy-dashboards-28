-- IP Watch & Enforcement System Migration (excluding existing policies table)
-- Creates tables for monitoring, receipts, enforcement queue

-- Enable pgcrypto extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- IP Hits table for monitoring CPC clusters/keywords
CREATE TABLE IF NOT EXISTS public.ip_hits (
    hit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source TEXT NOT NULL,
    ref TEXT,
    title TEXT,
    abstract TEXT,
    cpcs JSONB DEFAULT '[]'::jsonb,
    ts TIMESTAMP WITH TIME ZONE DEFAULT now(),
    entity_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Receipts table for canonical receipts with dual-anchor support
CREATE TABLE IF NOT EXISTS public.receipts (
    receipt_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID,
    inputs_hash TEXT NOT NULL,
    policy_hash TEXT NOT NULL,
    model_hash TEXT,
    reason_codes JSONB DEFAULT '[]'::jsonb,
    outcome TEXT NOT NULL,
    leaf TEXT NOT NULL,
    root TEXT NOT NULL,
    worm_uri TEXT,
    txid TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enforcement queue for actions requiring approval
CREATE TABLE IF NOT EXISTS public.enforcement_queue (
    item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID,
    action TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    priority INTEGER DEFAULT 3,
    ref_hit_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add foreign key constraint for ref_hit_id if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'enforcement_queue_ref_hit_id_fkey'
        AND table_name = 'enforcement_queue'
    ) THEN
        ALTER TABLE public.enforcement_queue 
        ADD CONSTRAINT enforcement_queue_ref_hit_id_fkey 
        FOREIGN KEY (ref_hit_id) REFERENCES public.ip_hits(hit_id);
    END IF;
END $$;

-- Performance indexes (only create if they don't exist)
CREATE INDEX IF NOT EXISTS idx_ip_hits_ts ON public.ip_hits(ts DESC);
CREATE INDEX IF NOT EXISTS idx_ip_hits_entity_id ON public.ip_hits(entity_id);
CREATE INDEX IF NOT EXISTS idx_receipts_root ON public.receipts(root);
CREATE INDEX IF NOT EXISTS idx_receipts_entity_id ON public.receipts(entity_id);
CREATE INDEX IF NOT EXISTS idx_receipts_created_at ON public.receipts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enforcement_queue_status ON public.enforcement_queue(status);
CREATE INDEX IF NOT EXISTS idx_enforcement_queue_entity_id ON public.enforcement_queue(entity_id);
CREATE INDEX IF NOT EXISTS idx_enforcement_queue_priority ON public.enforcement_queue(priority DESC);

-- Enable RLS on new tables
ALTER TABLE public.ip_hits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enforcement_queue ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tenant scoping
-- IP Hits policies
CREATE POLICY "Users can view IP hits for their tenant" ON public.ip_hits
    FOR SELECT USING (
        entity_id IN (
            SELECT id FROM public.profiles 
            WHERE tenant_id = get_current_user_tenant_id()
        ) OR entity_id IS NULL
    );

CREATE POLICY "Service role can manage all IP hits" ON public.ip_hits
    FOR ALL USING (auth.role() = 'service_role');

-- Receipts policies
CREATE POLICY "Users can view receipts for their tenant" ON public.receipts
    FOR SELECT USING (
        entity_id IN (
            SELECT id FROM public.profiles 
            WHERE tenant_id = get_current_user_tenant_id()
        ) OR entity_id IS NULL
    );

CREATE POLICY "Service role can manage all receipts" ON public.receipts
    FOR ALL USING (auth.role() = 'service_role');

-- Enforcement queue policies
CREATE POLICY "Users can view enforcement items for their tenant" ON public.enforcement_queue
    FOR SELECT USING (
        entity_id IN (
            SELECT id FROM public.profiles 
            WHERE tenant_id = get_current_user_tenant_id()
        ) OR entity_id IS NULL
    );

CREATE POLICY "Admins can manage enforcement queue" ON public.enforcement_queue
    FOR ALL USING (
        auth.role() = 'service_role'
    );

-- SQL Functions for IP Watch operations

-- Pure SQL SHA256 function
CREATE OR REPLACE FUNCTION public.sha256_hex(input_text TEXT)
RETURNS TEXT
LANGUAGE SQL
IMMUTABLE
PARALLEL SAFE
AS $$
    SELECT encode(digest(input_text, 'sha256'), 'hex');
$$;

-- Simple pairwise Merkle root calculation (demo implementation)
CREATE OR REPLACE FUNCTION public.merkle_root(leaves TEXT[])
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
    current_level TEXT[];
    next_level TEXT[];
    i INTEGER;
    left_hash TEXT;
    right_hash TEXT;
    combined_hash TEXT;
BEGIN
    -- WARNING: This is a demo implementation only
    -- Production systems should use proper Merkle tree libraries
    
    IF array_length(leaves, 1) IS NULL OR array_length(leaves, 1) = 0 THEN
        RAISE EXCEPTION 'Cannot compute merkle root of empty array';
    END IF;
    
    -- Start with the input leaves
    current_level := leaves;
    
    -- Keep hashing pairs until we have a single root
    WHILE array_length(current_level, 1) > 1 LOOP
        next_level := ARRAY[]::TEXT[];
        
        -- Process pairs
        FOR i IN 1..array_length(current_level, 1) BY 2 LOOP
            left_hash := current_level[i];
            
            -- If odd number of elements, duplicate the last one
            IF i + 1 <= array_length(current_level, 1) THEN
                right_hash := current_level[i + 1];
            ELSE
                right_hash := left_hash;
            END IF;
            
            -- Hash the concatenated pair
            combined_hash := public.sha256_hex(left_hash || right_hash);
            next_level := array_append(next_level, combined_hash);
        END LOOP;
        
        current_level := next_level;
    END LOOP;
    
    RETURN current_level[1];
END;
$$;

-- Receipt emission function
CREATE OR REPLACE FUNCTION public.receipt_emit(
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

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.sha256_hex(TEXT) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.merkle_root(TEXT[]) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.receipt_emit(JSONB, JSONB, TEXT, JSONB, UUID, TEXT) TO authenticated, service_role;

-- Update timestamp triggers (only if function doesn't exist)
CREATE OR REPLACE FUNCTION public.update_ip_watch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Create triggers for new tables
DROP TRIGGER IF EXISTS update_ip_hits_updated_at ON public.ip_hits;
CREATE TRIGGER update_ip_hits_updated_at
    BEFORE UPDATE ON public.ip_hits
    FOR EACH ROW
    EXECUTE FUNCTION public.update_ip_watch_updated_at();

DROP TRIGGER IF EXISTS update_enforcement_queue_updated_at ON public.enforcement_queue;
CREATE TRIGGER update_enforcement_queue_updated_at
    BEFORE UPDATE ON public.enforcement_queue
    FOR EACH ROW
    EXECUTE FUNCTION public.update_ip_watch_updated_at();