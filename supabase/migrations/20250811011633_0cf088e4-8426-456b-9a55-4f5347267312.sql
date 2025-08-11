-- Multi-Persona OS & Practice Management Platform Database Schema
-- Creating only new tables that don't exist yet

-- Personas table for tracking detected personas
CREATE TABLE IF NOT EXISTS public.personas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  persona_type text NOT NULL,
  confidence_score numeric(3,2) NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
  detected_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Persona signals for ML feature extraction
CREATE TABLE IF NOT EXISTS public.persona_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  signal_type text NOT NULL, -- page_sequence, dwell_time, click_periodicity, device_posture
  signal_value jsonb NOT NULL,
  confidence numeric(3,2) DEFAULT 0.5,
  collected_at timestamp with time zone NOT NULL DEFAULT now(),
  tenant_id uuid NOT NULL,
  session_id text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- RBAC roles for the policy system
CREATE TABLE IF NOT EXISTS public.rbac_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  role_name text NOT NULL,
  persona_types text[] NOT NULL DEFAULT '{}',
  description text,
  permissions jsonb NOT NULL DEFAULT '{}',
  jurisdiction text,
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, role_name)
);

-- Policies for declarative access control
CREATE TABLE IF NOT EXISTS public.policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  policy_name text NOT NULL,
  policy_dsl jsonb NOT NULL, -- Contains ALLOW/DENY/WHEN/JURISDICTION/REASON
  compiled_graph jsonb NOT NULL, -- Compiled decision graph
  target_resources text[] NOT NULL DEFAULT '{}',
  jurisdiction text,
  effective_from timestamp with time zone NOT NULL DEFAULT now(),
  effective_until timestamp with time zone,
  is_active boolean NOT NULL DEFAULT true,
  version integer NOT NULL DEFAULT 1,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, policy_name, version)
);

-- UI components registry
CREATE TABLE IF NOT EXISTS public.ui_components (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  component_name text NOT NULL,
  component_type text NOT NULL, -- button, form, dashboard, etc
  persona_restrictions text[] DEFAULT '{}',
  required_scopes text[] NOT NULL DEFAULT '{}',
  ui_config jsonb NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, component_name)
);

-- UI layouts per persona
CREATE TABLE IF NOT EXISTS public.ui_layouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  layout_name text NOT NULL,
  persona_type text NOT NULL,
  layout_config jsonb NOT NULL,
  component_ids uuid[] DEFAULT '{}',
  is_default boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, layout_name, persona_type)
);

-- Cryptographic audit trail with hash chains
CREATE TABLE IF NOT EXISTS public.persona_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  operation_type text NOT NULL, -- persona_classify, policy_evaluate, ui_compose
  inputs_hash text NOT NULL,
  outputs_hash text NOT NULL,
  parent_hash text,
  current_hash text NOT NULL,
  narrative text,
  metadata jsonb DEFAULT '{}',
  block_number bigint NOT NULL DEFAULT 1,
  timestamp timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Policy tokens for ephemeral JWT storage
CREATE TABLE IF NOT EXISTS public.policy_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_hash text NOT NULL UNIQUE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL,
  persona_id uuid,
  scopes text[] NOT NULL DEFAULT '{}',
  issued_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL,
  revoked_at timestamp with time zone,
  metadata jsonb DEFAULT '{}'
);

-- Indexes for performance (only create if they don't exist)
CREATE INDEX IF NOT EXISTS idx_personas_user_tenant ON public.personas(user_id, tenant_id);
CREATE INDEX IF NOT EXISTS idx_personas_type_confidence ON public.personas(persona_type, confidence_score DESC);
CREATE INDEX IF NOT EXISTS idx_persona_signals_user_type ON public.persona_signals(user_id, signal_type);
CREATE INDEX IF NOT EXISTS idx_persona_signals_collected_at ON public.persona_signals(collected_at DESC);
CREATE INDEX IF NOT EXISTS idx_rbac_roles_tenant_active ON public.rbac_roles(tenant_id, is_active);
CREATE INDEX IF NOT EXISTS idx_policies_tenant_active ON public.policies(tenant_id, is_active);
CREATE INDEX IF NOT EXISTS idx_policies_resources ON public.policies USING GIN(target_resources);
CREATE INDEX IF NOT EXISTS idx_ui_components_tenant_active ON public.ui_components(tenant_id, is_active);
CREATE INDEX IF NOT EXISTS idx_ui_layouts_tenant_persona ON public.ui_layouts(tenant_id, persona_type, is_active);
CREATE INDEX IF NOT EXISTS idx_persona_audit_tenant_block ON public.persona_audit(tenant_id, block_number DESC);
CREATE INDEX IF NOT EXISTS idx_persona_audit_parent_hash ON public.persona_audit(parent_hash);
CREATE INDEX IF NOT EXISTS idx_policy_tokens_user_expires ON public.policy_tokens(user_id, expires_at);
CREATE INDEX IF NOT EXISTS idx_policy_tokens_hash ON public.policy_tokens(token_hash);

-- RLS Policies
ALTER TABLE public.personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.persona_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rbac_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ui_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ui_layouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.persona_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policy_tokens ENABLE ROW LEVEL SECURITY;

-- Helper function for tenant access (create or replace)
CREATE OR REPLACE FUNCTION public.get_current_user_tenant_id()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT tenant_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- RLS Policies (drop and recreate to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own personas" ON public.personas;
DROP POLICY IF EXISTS "Users can create their own personas" ON public.personas;
DROP POLICY IF EXISTS "System admins can manage all personas" ON public.personas;

CREATE POLICY "Users can view their own personas" ON public.personas
  FOR SELECT USING (user_id = auth.uid() AND tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can create their own personas" ON public.personas
  FOR INSERT WITH CHECK (user_id = auth.uid() AND tenant_id = get_current_user_tenant_id());

CREATE POLICY "System admins can manage all personas" ON public.personas
  FOR ALL USING (has_any_role(ARRAY['system_administrator', 'admin']));

-- Continue with other RLS policies...
DROP POLICY IF EXISTS "Users can manage their signals" ON public.persona_signals;
CREATE POLICY "Users can manage their signals" ON public.persona_signals
  FOR ALL USING (user_id = auth.uid() AND tenant_id = get_current_user_tenant_id());

DROP POLICY IF EXISTS "Tenant members can view roles" ON public.rbac_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.rbac_roles;
CREATE POLICY "Tenant members can view roles" ON public.rbac_roles
  FOR SELECT USING (tenant_id = get_current_user_tenant_id());
CREATE POLICY "Admins can manage roles" ON public.rbac_roles
  FOR ALL USING (has_any_role(ARRAY['system_administrator', 'admin', 'tenant_admin']));

DROP POLICY IF EXISTS "Tenant members can view policies" ON public.policies;
DROP POLICY IF EXISTS "Admins can manage policies" ON public.policies;
CREATE POLICY "Tenant members can view policies" ON public.policies
  FOR SELECT USING (tenant_id = get_current_user_tenant_id());
CREATE POLICY "Admins can manage policies" ON public.policies
  FOR ALL USING (has_any_role(ARRAY['system_administrator', 'admin', 'tenant_admin']));

DROP POLICY IF EXISTS "Tenant members can view UI components" ON public.ui_components;
DROP POLICY IF EXISTS "Admins can manage UI components" ON public.ui_components;
CREATE POLICY "Tenant members can view UI components" ON public.ui_components
  FOR SELECT USING (tenant_id = get_current_user_tenant_id());
CREATE POLICY "Admins can manage UI components" ON public.ui_components
  FOR ALL USING (has_any_role(ARRAY['system_administrator', 'admin', 'tenant_admin']));

DROP POLICY IF EXISTS "Tenant members can view UI layouts" ON public.ui_layouts;
DROP POLICY IF EXISTS "Admins can manage UI layouts" ON public.ui_layouts;
CREATE POLICY "Tenant members can view UI layouts" ON public.ui_layouts
  FOR SELECT USING (tenant_id = get_current_user_tenant_id());
CREATE POLICY "Admins can manage UI layouts" ON public.ui_layouts
  FOR ALL USING (has_any_role(ARRAY['system_administrator', 'admin', 'tenant_admin']));

DROP POLICY IF EXISTS "Admins can view audit logs" ON public.persona_audit;
DROP POLICY IF EXISTS "System can create audit records" ON public.persona_audit;
CREATE POLICY "Admins can view audit logs" ON public.persona_audit
  FOR SELECT USING (has_any_role(ARRAY['system_administrator', 'admin', 'tenant_admin']));
CREATE POLICY "System can create audit records" ON public.persona_audit
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view their own tokens" ON public.policy_tokens;
DROP POLICY IF EXISTS "System can manage tokens" ON public.policy_tokens;
CREATE POLICY "Users can view their own tokens" ON public.policy_tokens
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "System can manage tokens" ON public.policy_tokens
  FOR ALL USING (has_any_role(ARRAY['system_administrator', 'admin']));

-- Audit utility functions
CREATE OR REPLACE FUNCTION public.get_next_audit_block_number(p_tenant_id uuid)
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(MAX(block_number), 0) + 1 
  FROM public.persona_audit 
  WHERE tenant_id = p_tenant_id;
$$;

CREATE OR REPLACE FUNCTION public.calculate_audit_hash(
  p_inputs_hash text,
  p_outputs_hash text,
  p_parent_hash text,
  p_block_number bigint,
  p_timestamp timestamp with time zone
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  canonical_data text;
BEGIN
  canonical_data := p_inputs_hash || '|' || p_outputs_hash || '|' || 
                   COALESCE(p_parent_hash, '') || '|' || p_block_number::text || '|' ||
                   extract(epoch from p_timestamp)::text;
  
  RETURN encode(digest(canonical_data, 'sha256'), 'hex');
END;
$$;