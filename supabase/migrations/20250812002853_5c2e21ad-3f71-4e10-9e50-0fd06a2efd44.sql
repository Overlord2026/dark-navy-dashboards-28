-- AI Executive Suite Database Schema
-- Execution Plans, Steps, Approvals, and Plan RDS

-- Executive role types
CREATE TYPE public.executive_role AS ENUM ('cmo', 'cfo', 'coo', 'clo', 'ceo');

-- Plan status types
CREATE TYPE public.plan_status AS ENUM ('draft', 'pending_approval', 'approved', 'active', 'rejected', 'archived');

-- Step status types
CREATE TYPE public.step_status AS ENUM ('pending', 'in_progress', 'completed', 'failed', 'blocked');

-- Approval status types
CREATE TYPE public.approval_status AS ENUM ('pending', 'approved', 'rejected', 'expired');

-- Execution Plans table
CREATE TABLE public.execution_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  created_by UUID NOT NULL,
  plan_title TEXT NOT NULL,
  plan_description TEXT,
  executive_role public.executive_role NOT NULL,
  status public.plan_status NOT NULL DEFAULT 'draft',
  priority INTEGER DEFAULT 3, -- 1=highest, 5=lowest
  estimated_budget NUMERIC(15,2),
  estimated_duration_days INTEGER,
  target_start_date DATE,
  target_end_date DATE,
  plan_content JSONB NOT NULL DEFAULT '{}',
  artifact_hash TEXT, -- SHA-256 of plan content
  policy_hash TEXT, -- Hash of applicable policies
  model_version TEXT, -- AI model version used
  version_number INTEGER DEFAULT 1,
  parent_plan_id UUID REFERENCES public.execution_plans(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE,
  activated_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Plan Steps table
CREATE TABLE public.plan_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES public.execution_plans(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  step_title TEXT NOT NULL,
  step_description TEXT,
  responsible_role public.executive_role,
  assigned_to UUID, -- specific user assignment
  status public.step_status NOT NULL DEFAULT 'pending',
  estimated_duration_hours INTEGER,
  estimated_cost NUMERIC(12,2),
  dependencies JSONB DEFAULT '[]', -- array of step IDs
  deliverables JSONB DEFAULT '[]',
  approval_required BOOLEAN DEFAULT false,
  step_data JSONB DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Approvals table
CREATE TABLE public.approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES public.execution_plans(id) ON DELETE CASCADE,
  step_id UUID REFERENCES public.plan_steps(id) ON DELETE CASCADE,
  approver_id UUID NOT NULL,
  approver_role public.executive_role NOT NULL,
  approval_type TEXT NOT NULL, -- 'plan', 'step', 'budget', 'legal', etc.
  status public.approval_status NOT NULL DEFAULT 'pending',
  artifact_hash TEXT NOT NULL, -- Hash of what's being approved
  policy_hash TEXT NOT NULL, -- Hash of policies evaluated
  policy_evaluation JSONB, -- CLO policy DAG results
  approval_notes TEXT,
  conditions JSONB DEFAULT '[]', -- Any conditions attached
  expires_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  rejected_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Plan RDS (Receipt Data Structure) table
CREATE TABLE public.plan_rds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES public.execution_plans(id),
  inputs_hash TEXT NOT NULL, -- SHA-256 of plan inputs
  model_version TEXT NOT NULL,
  policy_selection_hash TEXT NOT NULL,
  approvals_hash TEXT NOT NULL, -- Hash of all approvals
  artifact_hash TEXT NOT NULL, -- Final artifact hash
  explanation_json JSONB NOT NULL,
  sha256_hash TEXT NOT NULL, -- Overall RDS hash
  merkle_root TEXT, -- Optional Merkle tree root
  anchor_txid TEXT, -- Optional blockchain anchor
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  anchored_at TIMESTAMP WITH TIME ZONE
);

-- Agent Capability Tokens table
CREATE TABLE public.agent_capabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  executive_role public.executive_role NOT NULL,
  capability_name TEXT NOT NULL,
  capability_config JSONB NOT NULL DEFAULT '{}',
  is_enabled BOOLEAN DEFAULT true,
  max_budget_per_action NUMERIC(12,2),
  requires_approval BOOLEAN DEFAULT true,
  approval_threshold NUMERIC(12,2),
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(tenant_id, executive_role, capability_name)
);

-- Policy DAG Nodes for CLO evaluation
CREATE TABLE public.clo_policy_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  node_type TEXT NOT NULL, -- 'condition', 'action', 'gate'
  node_name TEXT NOT NULL,
  node_config JSONB NOT NULL DEFAULT '{}',
  evaluation_logic TEXT, -- SQL or logic expression
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Policy DAG Edges
CREATE TABLE public.clo_policy_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  from_node_id UUID NOT NULL REFERENCES public.clo_policy_nodes(id),
  to_node_id UUID NOT NULL REFERENCES public.clo_policy_nodes(id),
  edge_weight NUMERIC(3,2) DEFAULT 1.0,
  condition_expression TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.execution_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_rds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_capabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clo_policy_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clo_policy_edges ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Executive Suite

-- Execution Plans Policies
CREATE POLICY "Users can view plans in their tenant"
ON public.execution_plans FOR SELECT
USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Executives can create plans for their role"
ON public.execution_plans FOR INSERT
WITH CHECK (
  tenant_id = get_current_user_tenant_id() AND
  (
    (executive_role = 'cmo' AND has_any_role(ARRAY['cmo', 'executive', 'admin'])) OR
    (executive_role = 'cfo' AND has_any_role(ARRAY['cfo', 'executive', 'admin'])) OR
    (executive_role = 'coo' AND has_any_role(ARRAY['coo', 'executive', 'admin'])) OR
    (executive_role = 'clo' AND has_any_role(ARRAY['clo', 'legal', 'admin'])) OR
    has_any_role(ARRAY['ceo', 'admin'])
  )
);

CREATE POLICY "Plan creators and executives can update plans"
ON public.execution_plans FOR UPDATE
USING (
  tenant_id = get_current_user_tenant_id() AND
  (
    created_by = auth.uid() OR
    has_any_role(ARRAY['ceo', 'admin']) OR
    (executive_role = 'cmo' AND has_any_role(ARRAY['cmo', 'executive'])) OR
    (executive_role = 'cfo' AND has_any_role(ARRAY['cfo', 'executive'])) OR
    (executive_role = 'coo' AND has_any_role(ARRAY['coo', 'executive'])) OR
    (executive_role = 'clo' AND has_any_role(ARRAY['clo', 'legal']))
  )
);

-- Plan Steps Policies
CREATE POLICY "Users can view steps for plans in their tenant"
ON public.plan_steps FOR SELECT
USING (
  plan_id IN (
    SELECT id FROM public.execution_plans 
    WHERE tenant_id = get_current_user_tenant_id()
  )
);

CREATE POLICY "Executives can manage steps for their plans"
ON public.plan_steps FOR ALL
USING (
  plan_id IN (
    SELECT id FROM public.execution_plans 
    WHERE tenant_id = get_current_user_tenant_id() AND
    (
      created_by = auth.uid() OR
      has_any_role(ARRAY['ceo', 'admin']) OR
      (responsible_role = 'cmo' AND has_any_role(ARRAY['cmo', 'executive'])) OR
      (responsible_role = 'cfo' AND has_any_role(ARRAY['cfo', 'executive'])) OR
      (responsible_role = 'coo' AND has_any_role(ARRAY['coo', 'executive'])) OR
      (responsible_role = 'clo' AND has_any_role(ARRAY['clo', 'legal']))
    )
  )
);

-- Approvals Policies
CREATE POLICY "Users can view approvals in their tenant"
ON public.approvals FOR SELECT
USING (
  plan_id IN (
    SELECT id FROM public.execution_plans 
    WHERE tenant_id = get_current_user_tenant_id()
  )
);

CREATE POLICY "Approvers can manage their approvals"
ON public.approvals FOR ALL
USING (
  approver_id = auth.uid() OR
  has_any_role(ARRAY['ceo', 'admin']) OR
  plan_id IN (
    SELECT id FROM public.execution_plans 
    WHERE tenant_id = get_current_user_tenant_id() AND created_by = auth.uid()
  )
);

-- Agent Capabilities Policies
CREATE POLICY "Users can view capabilities in their tenant"
ON public.agent_capabilities FOR SELECT
USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Admins can manage agent capabilities"
ON public.agent_capabilities FOR ALL
USING (
  tenant_id = get_current_user_tenant_id() AND
  has_any_role(ARRAY['admin', 'ceo'])
);

-- CLO Policy Nodes Policies
CREATE POLICY "Users can view policy nodes in their tenant"
ON public.clo_policy_nodes FOR SELECT
USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "CLO and admins can manage policy nodes"
ON public.clo_policy_nodes FOR ALL
USING (
  tenant_id = get_current_user_tenant_id() AND
  has_any_role(ARRAY['clo', 'legal', 'admin'])
);

-- CLO Policy Edges Policies
CREATE POLICY "Users can view policy edges in their tenant"
ON public.clo_policy_edges FOR SELECT
USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "CLO and admins can manage policy edges"
ON public.clo_policy_edges FOR ALL
USING (
  tenant_id = get_current_user_tenant_id() AND
  has_any_role(ARRAY['clo', 'legal', 'admin'])
);

-- Plan RDS Policies
CREATE POLICY "Users can view plan RDS in their tenant"
ON public.plan_rds FOR SELECT
USING (
  plan_id IN (
    SELECT id FROM public.execution_plans 
    WHERE tenant_id = get_current_user_tenant_id()
  )
);

-- Indexes for performance
CREATE INDEX idx_execution_plans_tenant_status ON public.execution_plans(tenant_id, status);
CREATE INDEX idx_execution_plans_role_status ON public.execution_plans(executive_role, status);
CREATE INDEX idx_plan_steps_plan_id ON public.plan_steps(plan_id);
CREATE INDEX idx_plan_steps_status ON public.plan_steps(status);
CREATE INDEX idx_approvals_plan_id ON public.approvals(plan_id);
CREATE INDEX idx_approvals_approver_status ON public.approvals(approver_id, status);
CREATE INDEX idx_plan_rds_plan_id ON public.plan_rds(plan_id);
CREATE INDEX idx_agent_capabilities_tenant_role ON public.agent_capabilities(tenant_id, executive_role);
CREATE INDEX idx_clo_policy_nodes_tenant ON public.clo_policy_nodes(tenant_id);
CREATE INDEX idx_clo_policy_edges_tenant ON public.clo_policy_edges(tenant_id);

-- Helper Functions

-- Function to calculate artifact hash
CREATE OR REPLACE FUNCTION public.calculate_artifact_hash(content JSONB)
RETURNS TEXT AS $$
BEGIN
  RETURN encode(digest(content::text, 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate plan can be activated
CREATE OR REPLACE FUNCTION public.validate_plan_activation(plan_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  plan_record RECORD;
  required_approvals INTEGER;
  received_approvals INTEGER;
  clo_approval_exists BOOLEAN;
BEGIN
  -- Get plan details
  SELECT * INTO plan_record FROM public.execution_plans WHERE id = plan_id;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Check plan status
  IF plan_record.status != 'approved' THEN
    RETURN FALSE;
  END IF;
  
  -- Check CLO approval exists and is approved
  SELECT EXISTS(
    SELECT 1 FROM public.approvals 
    WHERE plan_id = plan_id 
    AND approver_role = 'clo' 
    AND status = 'approved'
    AND (expires_at IS NULL OR expires_at > now())
  ) INTO clo_approval_exists;
  
  IF NOT clo_approval_exists THEN
    RETURN FALSE;
  END IF;
  
  -- Check all required approvals are in place
  SELECT COUNT(*) INTO required_approvals
  FROM public.plan_steps 
  WHERE plan_id = plan_id AND approval_required = true;
  
  SELECT COUNT(*) INTO received_approvals
  FROM public.approvals a
  JOIN public.plan_steps s ON a.step_id = s.id
  WHERE s.plan_id = plan_id 
  AND s.approval_required = true
  AND a.status = 'approved'
  AND (a.expires_at IS NULL OR a.expires_at > now());
  
  RETURN received_approvals >= required_approvals;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate plan RDS
CREATE OR REPLACE FUNCTION public.generate_plan_rds(
  p_plan_id UUID,
  p_inputs_hash TEXT,
  p_model_version TEXT,
  p_policy_selection_hash TEXT,
  p_explanation JSONB
) RETURNS UUID AS $$
DECLARE
  rds_id UUID;
  approvals_hash TEXT;
  artifact_hash TEXT;
  combined_hash TEXT;
BEGIN
  -- Calculate approvals hash
  SELECT encode(digest(
    array_to_string(
      array_agg(a.artifact_hash || a.policy_hash ORDER BY a.created_at),
      ''
    ), 'sha256'
  ), 'hex') INTO approvals_hash
  FROM public.approvals a
  WHERE a.plan_id = p_plan_id AND a.status = 'approved';
  
  -- Get artifact hash from plan
  SELECT execution_plans.artifact_hash INTO artifact_hash
  FROM public.execution_plans 
  WHERE id = p_plan_id;
  
  -- Calculate combined hash
  combined_hash := encode(digest(
    p_inputs_hash || p_model_version || p_policy_selection_hash || 
    COALESCE(approvals_hash, '') || COALESCE(artifact_hash, ''), 
    'sha256'
  ), 'hex');
  
  -- Insert RDS record
  INSERT INTO public.plan_rds (
    plan_id, inputs_hash, model_version, policy_selection_hash,
    approvals_hash, artifact_hash, explanation_json, sha256_hash
  ) VALUES (
    p_plan_id, p_inputs_hash, p_model_version, p_policy_selection_hash,
    COALESCE(approvals_hash, ''), COALESCE(artifact_hash, ''), 
    p_explanation, combined_hash
  ) RETURNING id INTO rds_id;
  
  RETURN rds_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update artifact hash when plan content changes
CREATE OR REPLACE FUNCTION public.update_plan_artifact_hash()
RETURNS TRIGGER AS $$
BEGIN
  NEW.artifact_hash = public.calculate_artifact_hash(NEW.plan_content);
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_execution_plans_artifact_hash
  BEFORE UPDATE OF plan_content ON public.execution_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_plan_artifact_hash();

-- Trigger to update timestamps
CREATE TRIGGER update_execution_plans_updated_at
  BEFORE UPDATE ON public.execution_plans
  FOR EACH ROW EXECUTE FUNCTION fn_touch_updated_at();

CREATE TRIGGER update_plan_steps_updated_at
  BEFORE UPDATE ON public.plan_steps
  FOR EACH ROW EXECUTE FUNCTION fn_touch_updated_at();

CREATE TRIGGER update_approvals_updated_at
  BEFORE UPDATE ON public.approvals
  FOR EACH ROW EXECUTE FUNCTION fn_touch_updated_at();

CREATE TRIGGER update_agent_capabilities_updated_at
  BEFORE UPDATE ON public.agent_capabilities
  FOR EACH ROW EXECUTE FUNCTION fn_touch_updated_at();

CREATE TRIGGER update_clo_policy_nodes_updated_at
  BEFORE UPDATE ON public.clo_policy_nodes
  FOR EACH ROW EXECUTE FUNCTION fn_touch_updated_at();