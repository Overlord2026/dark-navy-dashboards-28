-- Multi-Persona OS & Practice Management Platform Database Schema

-- Personas table for tracking detected personas
CREATE TABLE public.personas (
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
CREATE TABLE public.persona_signals (
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
CREATE TABLE public.rbac_roles (
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
CREATE TABLE public.policies (
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
CREATE TABLE public.ui_components (
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
CREATE TABLE public.ui_layouts (
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

-- Compliance records for professional personas
CREATE TABLE public.compliance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL,
  record_type text NOT NULL, -- license, ce, cle, cpe
  credential_id text,
  state_jurisdiction text,
  status text NOT NULL DEFAULT 'active', -- active, expired, suspended, pending
  issue_date date,
  expiration_date date,
  renewal_date date,
  compliance_metadata jsonb DEFAULT '{}',
  last_verified timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Cryptographic audit trail with hash chains
CREATE TABLE public.persona_audit (
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
CREATE TABLE public.policy_tokens (
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

-- Indexes for performance
CREATE INDEX idx_personas_user_tenant ON public.personas(user_id, tenant_id);
CREATE INDEX idx_personas_type_confidence ON public.personas(persona_type, confidence_score DESC);
CREATE INDEX idx_persona_signals_user_type ON public.persona_signals(user_id, signal_type);
CREATE INDEX idx_persona_signals_collected_at ON public.persona_signals(collected_at DESC);
CREATE INDEX idx_rbac_roles_tenant_active ON public.rbac_roles(tenant_id, is_active);
CREATE INDEX idx_policies_tenant_active ON public.policies(tenant_id, is_active);
CREATE INDEX idx_policies_resources ON public.policies USING GIN(target_resources);
CREATE INDEX idx_ui_components_tenant_active ON public.ui_components(tenant_id, is_active);
CREATE INDEX idx_ui_layouts_tenant_persona ON public.ui_layouts(tenant_id, persona_type, is_active);
CREATE INDEX idx_compliance_records_user_status ON public.compliance_records(user_id, status);
CREATE INDEX idx_compliance_records_jurisdiction ON public.compliance_records(state_jurisdiction, record_type);
CREATE INDEX idx_persona_audit_tenant_block ON public.persona_audit(tenant_id, block_number DESC);
CREATE INDEX idx_persona_audit_parent_hash ON public.persona_audit(parent_hash);
CREATE INDEX idx_policy_tokens_user_expires ON public.policy_tokens(user_id, expires_at);
CREATE INDEX idx_policy_tokens_hash ON public.policy_tokens(token_hash);

-- RLS Policies
ALTER TABLE public.personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.persona_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rbac_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ui_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ui_layouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.persona_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policy_tokens ENABLE ROW LEVEL SECURITY;

-- Helper function for tenant access
CREATE OR REPLACE FUNCTION public.get_current_user_tenant_id()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT tenant_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- Personas RLS
CREATE POLICY "Users can view their own personas" ON public.personas
  FOR SELECT USING (user_id = auth.uid() AND tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can create their own personas" ON public.personas
  FOR INSERT WITH CHECK (user_id = auth.uid() AND tenant_id = get_current_user_tenant_id());

CREATE POLICY "System admins can manage all personas" ON public.personas
  FOR ALL USING (has_any_role(ARRAY['system_administrator', 'admin']));

-- Persona Signals RLS
CREATE POLICY "Users can manage their signals" ON public.persona_signals
  FOR ALL USING (user_id = auth.uid() AND tenant_id = get_current_user_tenant_id());

-- RBAC Roles RLS
CREATE POLICY "Tenant members can view roles" ON public.rbac_roles
  FOR SELECT USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Admins can manage roles" ON public.rbac_roles
  FOR ALL USING (has_any_role(ARRAY['system_administrator', 'admin', 'tenant_admin']));

-- Policies RLS
CREATE POLICY "Tenant members can view policies" ON public.policies
  FOR SELECT USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Admins can manage policies" ON public.policies
  FOR ALL USING (has_any_role(ARRAY['system_administrator', 'admin', 'tenant_admin']));

-- UI Components RLS
CREATE POLICY "Tenant members can view UI components" ON public.ui_components
  FOR SELECT USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Admins can manage UI components" ON public.ui_components
  FOR ALL USING (has_any_role(ARRAY['system_administrator', 'admin', 'tenant_admin']));

-- UI Layouts RLS
CREATE POLICY "Tenant members can view UI layouts" ON public.ui_layouts
  FOR SELECT USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Admins can manage UI layouts" ON public.ui_layouts
  FOR ALL USING (has_any_role(ARRAY['system_administrator', 'admin', 'tenant_admin']));

-- Compliance Records RLS
CREATE POLICY "Users can manage their compliance records" ON public.compliance_records
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Compliance officers can view all records" ON public.compliance_records
  FOR SELECT USING (has_any_role(ARRAY['system_administrator', 'admin', 'compliance_officer']));

-- Persona Audit RLS
CREATE POLICY "Admins can view audit logs" ON public.persona_audit
  FOR SELECT USING (has_any_role(ARRAY['system_administrator', 'admin', 'tenant_admin']));

CREATE POLICY "System can create audit records" ON public.persona_audit
  FOR INSERT WITH CHECK (true);

-- Policy Tokens RLS
CREATE POLICY "Users can view their own tokens" ON public.policy_tokens
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can manage tokens" ON public.policy_tokens
  FOR ALL USING (has_any_role(ARRAY['system_administrator', 'admin']));

-- Audit sequence function
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

-- Hash chain integrity function
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