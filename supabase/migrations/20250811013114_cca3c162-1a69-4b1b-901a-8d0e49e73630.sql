-- Multi-Persona OS Hardening Migration (Fixed Constraint)

-- 1. Drop existing has_any_role function and recreate
DROP FUNCTION IF EXISTS public.has_any_role(text[]);

CREATE OR REPLACE FUNCTION public.has_any_role(required_roles text[])
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT COALESCE(role = ANY(required_roles), false) FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- 2. Create persona_kind ENUM and update personas table
CREATE TYPE public.persona_kind AS ENUM (
  'client', 'advisor', 'attorney', 'cpa', 'insurance_agent', 
  'consultant', 'coach', 'enterprise_admin', 'accountant', 
  'compliance', 'imo_fmo', 'agency', 'organization', 
  'healthcare_consultant', 'realtor', 'property_manager', 'vip_reserved'
);

-- Update personas table
ALTER TABLE public.personas 
  ALTER COLUMN confidence_score TYPE NUMERIC(5,4),
  ADD COLUMN persona_kind public.persona_kind;

-- Migrate existing data (safely handle null/empty persona_type)
UPDATE public.personas 
SET persona_kind = CASE 
  WHEN persona_type IS NULL OR persona_type = '' THEN 'client'
  ELSE persona_type::public.persona_kind
END;

ALTER TABLE public.personas ALTER COLUMN persona_kind SET NOT NULL;

-- 3. Create models table
CREATE TABLE public.models (
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

-- 4. Create persona_thresholds table
CREATE TABLE public.persona_thresholds (
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

-- 5. Update policy_tokens table
ALTER TABLE public.policy_tokens 
  ADD COLUMN hash_alg text NOT NULL DEFAULT 'sha256',
  ADD COLUMN token_body text NOT NULL DEFAULT '',
  ADD COLUMN token_hash text NOT NULL DEFAULT '';

-- Create uniqueness index on token_body hash
CREATE UNIQUE INDEX idx_policy_tokens_body_hash 
ON public.policy_tokens USING btree(encode(digest(token_body, 'sha256'), 'hex'));

-- 6. Create ui_layout_components junction table
CREATE TABLE public.ui_layout_components (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  layout_id uuid NOT NULL REFERENCES public.ui_layouts(id) ON DELETE CASCADE,
  component_id uuid NOT NULL REFERENCES public.ui_components(id) ON DELETE CASCADE,
  position integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(layout_id, component_id),
  UNIQUE(layout_id, position)
);

-- Migrate existing component_ids array to junction table (safely handle nulls)
INSERT INTO public.ui_layout_components (layout_id, component_id, position)
SELECT 
  ul.id as layout_id,
  unnest(ul.component_ids) as component_id,
  generate_series(1, array_length(ul.component_ids, 1)) as position
FROM public.ui_layouts ul
WHERE ul.component_ids IS NOT NULL AND array_length(ul.component_ids, 1) > 0;

-- Remove the old array column
ALTER TABLE public.ui_layouts DROP COLUMN IF EXISTS component_ids;

-- 7. Add BEFORE INSERT trigger for persona_audit
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

-- Add unique constraint on (tenant_id, block_number) safely
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'persona_audit_tenant_block_unique'
  ) THEN
    ALTER TABLE public.persona_audit 
    ADD CONSTRAINT persona_audit_tenant_block_unique UNIQUE (tenant_id, block_number);
  END IF;
END $$;

-- 8. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_models_tenant_active ON public.models(tenant_id, is_active);
CREATE INDEX IF NOT EXISTS idx_persona_thresholds_tenant ON public.persona_thresholds(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ui_layout_components_layout ON public.ui_layout_components(layout_id, position);
CREATE INDEX IF NOT EXISTS idx_policy_tokens_hash_alg ON public.policy_tokens(hash_alg, token_hash);

-- 9. Add RLS policies for new tables
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.persona_thresholds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ui_layout_components ENABLE ROW LEVEL SECURITY;

-- Models policies
CREATE POLICY "Tenant users can view models" 
ON public.models FOR SELECT 
USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Admins can manage models" 
ON public.models FOR ALL 
USING (tenant_id = get_current_user_tenant_id() AND has_any_role(ARRAY['admin', 'system_administrator']));

-- Persona thresholds policies  
CREATE POLICY "Tenant users can view thresholds" 
ON public.persona_thresholds FOR SELECT 
USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Admins can manage thresholds" 
ON public.persona_thresholds FOR ALL 
USING (tenant_id = get_current_user_tenant_id() AND has_any_role(ARRAY['admin', 'system_administrator']));

-- UI layout components policies
CREATE POLICY "Tenant users can view layout components" 
ON public.ui_layout_components FOR SELECT 
USING (layout_id IN (SELECT id FROM public.ui_layouts WHERE tenant_id = get_current_user_tenant_id()));

CREATE POLICY "Admins can manage layout components" 
ON public.ui_layout_components FOR ALL 
USING (layout_id IN (SELECT id FROM public.ui_layouts WHERE tenant_id = get_current_user_tenant_id() AND has_any_role(ARRAY['admin', 'system_administrator'])));

-- 10. Insert default thresholds for common persona transitions
INSERT INTO public.persona_thresholds (tenant_id, from_persona, to_persona, delta_confidence, min_hold_seconds)
SELECT 
  '00000000-0000-0000-0000-000000000000'::uuid, -- default tenant
  from_p.persona::public.persona_kind,
  to_p.persona::public.persona_kind,
  0.15, -- higher threshold for stability
  600   -- 10 minutes hold time
FROM (VALUES 
  ('client'), ('advisor'), ('attorney'), ('cpa'), ('insurance_agent')
) AS from_p(persona)
CROSS JOIN (VALUES 
  ('client'), ('advisor'), ('attorney'), ('cpa'), ('insurance_agent')
) AS to_p(persona)
WHERE from_p.persona != to_p.persona
ON CONFLICT (tenant_id, from_persona, to_persona) DO NOTHING;