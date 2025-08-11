-- Multi-Persona OS Hardening Migration (Targeted)

-- 1. Recreate has_any_role function with CASCADE to handle dependencies
DROP FUNCTION IF EXISTS public.has_any_role(text[]) CASCADE;

CREATE OR REPLACE FUNCTION public.has_any_role(required_roles text[])
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT COALESCE(role = ANY(required_roles), false) FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- 2. Create persona_kind ENUM only if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'persona_kind') THEN
    CREATE TYPE public.persona_kind AS ENUM (
      'client', 'advisor', 'attorney', 'cpa', 'insurance_agent', 
      'consultant', 'coach', 'enterprise_admin', 'accountant', 
      'compliance', 'imo_fmo', 'agency', 'organization', 
      'healthcare_consultant', 'realtor', 'property_manager', 'vip_reserved'
    );
  END IF;
END $$;

-- 3. Update personas table (only if columns don't exist)
DO $$
BEGIN
  -- Check and add persona_kind column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'personas' AND column_name = 'persona_kind'
  ) THEN
    ALTER TABLE public.personas ADD COLUMN persona_kind public.persona_kind;
    
    -- Migrate existing data
    UPDATE public.personas 
    SET persona_kind = CASE 
      WHEN persona_type IS NULL OR persona_type = '' THEN 'client'
      ELSE persona_type::public.persona_kind
    END;
    
    ALTER TABLE public.personas ALTER COLUMN persona_kind SET NOT NULL;
  END IF;
  
  -- Update confidence_score precision
  ALTER TABLE public.personas ALTER COLUMN confidence_score TYPE NUMERIC(5,4);
END $$;

-- 4. Create models table (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  model_name text NOT NULL,
  version text NOT NULL,
  model_type text NOT NULL, -- 'classifier', 'feature_extractor', etc.
  model_config jsonb NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, model_name, version)
);

-- 5. Create persona_thresholds table (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.persona_thresholds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  from_persona public.persona_kind NOT NULL,
  to_persona public.persona_kind NOT NULL,
  delta_confidence NUMERIC(5,4) NOT NULL DEFAULT 0.1,
  min_hold_seconds integer NOT NULL DEFAULT 300,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, from_persona, to_persona)
);

-- 6. Update policy_tokens table (add columns safely)
DO $$
BEGIN
  -- Add hash_alg column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'policy_tokens' AND column_name = 'hash_alg'
  ) THEN
    ALTER TABLE public.policy_tokens ADD COLUMN hash_alg text NOT NULL DEFAULT 'sha256';
  END IF;
  
  -- Add token_body column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'policy_tokens' AND column_name = 'token_body'
  ) THEN
    ALTER TABLE public.policy_tokens ADD COLUMN token_body text NOT NULL DEFAULT '';
  END IF;
  
  -- Add token_hash column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'policy_tokens' AND column_name = 'token_hash'
  ) THEN
    ALTER TABLE public.policy_tokens ADD COLUMN token_hash text NOT NULL DEFAULT '';
  END IF;
END $$;

-- 7. Create ui_layout_components junction table (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.ui_layout_components (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  layout_id uuid NOT NULL REFERENCES public.ui_layouts(id) ON DELETE CASCADE,
  component_id uuid NOT NULL REFERENCES public.ui_components(id) ON DELETE CASCADE,
  position integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(layout_id, component_id),
  UNIQUE(layout_id, position)
);

-- 8. Add BEFORE INSERT trigger for persona_audit
CREATE OR REPLACE FUNCTION public.persona_audit_before_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  next_block_number bigint;
  previous_hash text;
  canonical_data text;
BEGIN
  -- Get next block number for this tenant
  SELECT COALESCE(MAX(block_number), 0) + 1 
  INTO next_block_number
  FROM public.persona_audit 
  WHERE tenant_id = NEW.tenant_id;
  
  -- Get parent hash (last record's hash)
  SELECT current_hash INTO previous_hash
  FROM public.persona_audit 
  WHERE tenant_id = NEW.tenant_id 
  ORDER BY block_number DESC 
  LIMIT 1;
  
  -- Set computed values
  NEW.block_number := next_block_number;
  NEW.parent_hash := COALESCE(previous_hash, '');
  
  -- Build canonical data for hashing
  canonical_data := NEW.inputs_hash || '|' || NEW.outputs_hash || '|' || 
                   COALESCE(NEW.parent_hash, '') || '|' || NEW.block_number::text || '|' ||
                   extract(epoch from NEW.created_at)::text;
  
  -- Compute current hash
  NEW.current_hash := encode(digest(canonical_data, 'sha256'), 'hex');
  
  RETURN NEW;
END;
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS persona_audit_before_insert_trigger ON public.persona_audit;
CREATE TRIGGER persona_audit_before_insert_trigger
  BEFORE INSERT ON public.persona_audit
  FOR EACH ROW
  EXECUTE FUNCTION public.persona_audit_before_insert();

-- 9. Create indexes and constraints safely
CREATE INDEX IF NOT EXISTS idx_models_tenant_active ON public.models(tenant_id, is_active);
CREATE INDEX IF NOT EXISTS idx_persona_thresholds_tenant ON public.persona_thresholds(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ui_layout_components_layout ON public.ui_layout_components(layout_id, position);
CREATE INDEX IF NOT EXISTS idx_policy_tokens_hash_alg ON public.policy_tokens(hash_alg, token_hash);
CREATE UNIQUE INDEX IF NOT EXISTS idx_policy_tokens_body_hash 
ON public.policy_tokens USING btree(encode(digest(token_body, 'sha256'), 'hex'));

-- 10. Enable RLS and create policies for new tables
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.persona_thresholds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ui_layout_components ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'models' AND policyname = 'Tenant users can view models'
  ) THEN
    CREATE POLICY "Tenant users can view models" 
    ON public.models FOR SELECT 
    USING (tenant_id = get_current_user_tenant_id());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'models' AND policyname = 'Admins can manage models'
  ) THEN
    CREATE POLICY "Admins can manage models" 
    ON public.models FOR ALL 
    USING (tenant_id = get_current_user_tenant_id() AND has_any_role(ARRAY['admin', 'system_administrator']));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'persona_thresholds' AND policyname = 'Tenant users can view thresholds'
  ) THEN
    CREATE POLICY "Tenant users can view thresholds" 
    ON public.persona_thresholds FOR SELECT 
    USING (tenant_id = get_current_user_tenant_id());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'persona_thresholds' AND policyname = 'Admins can manage thresholds'
  ) THEN
    CREATE POLICY "Admins can manage thresholds" 
    ON public.persona_thresholds FOR ALL 
    USING (tenant_id = get_current_user_tenant_id() AND has_any_role(ARRAY['admin', 'system_administrator']));
  END IF;
END $$;

-- 11. Insert default thresholds
INSERT INTO public.persona_thresholds (tenant_id, from_persona, to_persona, delta_confidence, min_hold_seconds)
SELECT 
  '00000000-0000-0000-0000-000000000000'::uuid,
  from_p.persona::public.persona_kind,
  to_p.persona::public.persona_kind,
  0.15,
  600
FROM (VALUES 
  ('client'), ('advisor'), ('attorney'), ('cpa'), ('insurance_agent')
) AS from_p(persona)
CROSS JOIN (VALUES 
  ('client'), ('advisor'), ('attorney'), ('cpa'), ('insurance_agent')
) AS to_p(persona)
WHERE from_p.persona != to_p.persona
ON CONFLICT (tenant_id, from_persona, to_persona) DO NOTHING;