-- Core primitives + approvals system with evidence packages, domain events, PBAT tokens

-- Evidence packages table
CREATE TABLE IF NOT EXISTS public.evidence_packages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    package_name TEXT NOT NULL,
    evidence_type TEXT NOT NULL, -- 'document', 'attestation', 'signature', 'biometric', 'workflow'
    package_data JSONB NOT NULL DEFAULT '{}',
    package_hash TEXT NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    metadata JSONB DEFAULT '{}',
    validity_period INTERVAL DEFAULT INTERVAL '1 year',
    expires_at TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked', 'pending'))
);

-- Domain events table
CREATE TABLE IF NOT EXISTS public.domain_events (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT NOT NULL,
    event_data JSONB NOT NULL DEFAULT '{}',
    aggregate_id UUID NOT NULL,
    aggregate_type TEXT NOT NULL,
    sequence_number BIGINT NOT NULL,
    occurred_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    event_hash TEXT NOT NULL,
    processed BOOLEAN NOT NULL DEFAULT false,
    processing_attempts INTEGER DEFAULT 0,
    last_processing_error TEXT,
    metadata JSONB DEFAULT '{}'
);

-- PBAT tokens table (Policy-Based Access Tokens)
CREATE TABLE IF NOT EXISTS public.pbat_tokens (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    token_hash TEXT NOT NULL UNIQUE,
    policy_id UUID NOT NULL,
    subject_id UUID NOT NULL, -- user or entity the token is for
    issuer_id UUID REFERENCES auth.users(id),
    token_type TEXT NOT NULL DEFAULT 'access' CHECK (token_type IN ('access', 'delegation', 'emergency')),
    scope JSONB NOT NULL DEFAULT '[]', -- array of permitted actions/resources
    constraints JSONB DEFAULT '{}', -- time, location, device constraints
    issued_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked_at TIMESTAMP WITH TIME ZONE,
    last_used_at TIMESTAMP WITH TIME ZONE,
    usage_count INTEGER DEFAULT 0,
    max_usage_count INTEGER,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked', 'suspended'))
);

-- Approval rules table
CREATE TABLE IF NOT EXISTS public.approval_rules (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    rule_name TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    action_type TEXT NOT NULL,
    conditions JSONB NOT NULL DEFAULT '{}', -- conditions that trigger this rule
    required_approvers INTEGER NOT NULL DEFAULT 1,
    approver_roles JSONB NOT NULL DEFAULT '[]', -- array of roles that can approve
    approval_threshold NUMERIC(3,2) DEFAULT 1.0, -- percentage required (0.5 = 50%, 1.0 = 100%)
    timeout_hours INTEGER DEFAULT 24,
    escalation_rules JSONB DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Approval requests table
CREATE TABLE IF NOT EXISTS public.approval_requests (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    request_title TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID NOT NULL,
    action_type TEXT NOT NULL,
    requester_id UUID REFERENCES auth.users(id),
    approval_rule_id UUID REFERENCES public.approval_rules(id),
    request_data JSONB NOT NULL DEFAULT '{}',
    required_approvals INTEGER NOT NULL DEFAULT 1,
    current_approvals INTEGER NOT NULL DEFAULT 0,
    approval_threshold NUMERIC(3,2) NOT NULL DEFAULT 1.0,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired', 'cancelled')),
    expires_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    metadata JSONB DEFAULT '{}'
);

-- Approval signals table (individual approvals/rejections)
CREATE TABLE IF NOT EXISTS public.approval_signals (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    approval_request_id UUID REFERENCES public.approval_requests(id) ON DELETE CASCADE,
    approver_id UUID REFERENCES auth.users(id),
    signal_type TEXT NOT NULL CHECK (signal_type IN ('approve', 'reject', 'abstain')),
    evidence_package_id UUID REFERENCES public.evidence_packages(id),
    signature_data JSONB DEFAULT '{}',
    comments TEXT,
    weight NUMERIC(3,2) DEFAULT 1.0, -- voting weight for this approver
    signaled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}'
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_evidence_packages_type ON public.evidence_packages(evidence_type);
CREATE INDEX IF NOT EXISTS idx_evidence_packages_created_by ON public.evidence_packages(created_by);
CREATE INDEX IF NOT EXISTS idx_evidence_packages_status ON public.evidence_packages(status);

CREATE INDEX IF NOT EXISTS idx_domain_events_type ON public.domain_events(event_type);
CREATE INDEX IF NOT EXISTS idx_domain_events_aggregate ON public.domain_events(aggregate_id, aggregate_type);
CREATE INDEX IF NOT EXISTS idx_domain_events_processed ON public.domain_events(processed);
CREATE INDEX IF NOT EXISTS idx_domain_events_occurred_at ON public.domain_events(occurred_at);

CREATE INDEX IF NOT EXISTS idx_pbat_tokens_hash ON public.pbat_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_pbat_tokens_subject ON public.pbat_tokens(subject_id);
CREATE INDEX IF NOT EXISTS idx_pbat_tokens_status ON public.pbat_tokens(status);
CREATE INDEX IF NOT EXISTS idx_pbat_tokens_expires_at ON public.pbat_tokens(expires_at);

CREATE INDEX IF NOT EXISTS idx_approval_rules_resource_action ON public.approval_rules(resource_type, action_type);
CREATE INDEX IF NOT EXISTS idx_approval_rules_active ON public.approval_rules(is_active);

CREATE INDEX IF NOT EXISTS idx_approval_requests_status ON public.approval_requests(status);
CREATE INDEX IF NOT EXISTS idx_approval_requests_requester ON public.approval_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_approval_requests_expires_at ON public.approval_requests(expires_at);

CREATE INDEX IF NOT EXISTS idx_approval_signals_request ON public.approval_signals(approval_request_id);
CREATE INDEX IF NOT EXISTS idx_approval_signals_approver ON public.approval_signals(approver_id);

-- Create unique constraint for sequence numbers per aggregate
CREATE UNIQUE INDEX IF NOT EXISTS idx_domain_events_sequence_unique 
ON public.domain_events(aggregate_id, sequence_number);

-- Enable RLS on all tables
ALTER TABLE public.evidence_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domain_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pbat_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_signals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for evidence_packages
CREATE POLICY "Users can create their own evidence packages" 
ON public.evidence_packages FOR INSERT 
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can view evidence packages they created or are referenced in" 
ON public.evidence_packages FOR SELECT 
USING (
  created_by = auth.uid() OR 
  exists(
    select 1 from public.approval_signals 
    where evidence_package_id = evidence_packages.id 
    and approver_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own evidence packages" 
ON public.evidence_packages FOR UPDATE 
USING (created_by = auth.uid());

-- RLS Policies for domain_events
CREATE POLICY "System can insert domain events" 
ON public.domain_events FOR INSERT 
WITH CHECK (true); -- Events can be created by system

CREATE POLICY "Users can view domain events for their aggregates" 
ON public.domain_events FOR SELECT 
USING (true); -- Events are viewable by authenticated users

-- RLS Policies for pbat_tokens
CREATE POLICY "Users can view their own PBAT tokens" 
ON public.pbat_tokens FOR SELECT 
USING (subject_id = auth.uid() OR issuer_id = auth.uid());

CREATE POLICY "Users can create PBAT tokens they are authorized to issue" 
ON public.pbat_tokens FOR INSERT 
WITH CHECK (issuer_id = auth.uid());

-- RLS Policies for approval_rules
CREATE POLICY "Authenticated users can view approval rules" 
ON public.approval_rules FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage approval rules" 
ON public.approval_rules FOR ALL 
USING (
  exists(
    select 1 from public.profiles 
    where id = auth.uid() 
    and role in ('admin', 'system_administrator')
  )
);

-- RLS Policies for approval_requests
CREATE POLICY "Users can create approval requests" 
ON public.approval_requests FOR INSERT 
WITH CHECK (requester_id = auth.uid());

CREATE POLICY "Users can view approval requests they created or can approve" 
ON public.approval_requests FOR SELECT 
USING (
  requester_id = auth.uid() OR
  exists(
    select 1 from public.approval_rules ar
    where ar.id = approval_requests.approval_rule_id
    and exists(
      select 1 from public.profiles p
      where p.id = auth.uid()
      and p.role = any(select jsonb_array_elements_text(ar.approver_roles))
    )
  )
);

CREATE POLICY "Requesters can update their own requests" 
ON public.approval_requests FOR UPDATE 
USING (requester_id = auth.uid());

-- RLS Policies for approval_signals
CREATE POLICY "Users can create approval signals" 
ON public.approval_signals FOR INSERT 
WITH CHECK (approver_id = auth.uid());

CREATE POLICY "Users can view approval signals for requests they are involved in" 
ON public.approval_signals FOR SELECT 
USING (
  approver_id = auth.uid() OR
  exists(
    select 1 from public.approval_requests ar
    where ar.id = approval_signals.approval_request_id
    and ar.requester_id = auth.uid()
  )
);

-- Trigger function to update approval request status based on signals
CREATE OR REPLACE FUNCTION public.update_approval_request_status()
RETURNS TRIGGER AS $$
DECLARE
  request_record public.approval_requests%ROWTYPE;
  total_weight NUMERIC;
  approval_count INTEGER;
  rejection_count INTEGER;
BEGIN
  -- Get the approval request
  SELECT * INTO request_record 
  FROM public.approval_requests 
  WHERE id = NEW.approval_request_id;
  
  -- Calculate current approval metrics
  SELECT 
    COUNT(*) FILTER (WHERE signal_type = 'approve'),
    COUNT(*) FILTER (WHERE signal_type = 'reject'),
    COALESCE(SUM(weight) FILTER (WHERE signal_type = 'approve'), 0)
  INTO approval_count, rejection_count, total_weight
  FROM public.approval_signals 
  WHERE approval_request_id = NEW.approval_request_id;
  
  -- Update the approval request
  UPDATE public.approval_requests
  SET 
    current_approvals = approval_count,
    status = CASE 
      WHEN rejection_count > 0 THEN 'rejected'
      WHEN total_weight >= request_record.approval_threshold * request_record.required_approvals THEN 'approved'
      ELSE 'pending'
    END,
    completed_at = CASE 
      WHEN rejection_count > 0 OR total_weight >= request_record.approval_threshold * request_record.required_approvals 
      THEN now() 
      ELSE NULL 
    END,
    updated_at = now()
  WHERE id = request_record.id;
  
  -- Emit domain event for status change
  INSERT INTO public.domain_events (
    event_type,
    event_data,
    aggregate_id,
    aggregate_type,
    sequence_number,
    event_hash
  ) VALUES (
    'approval_request_status_changed',
    jsonb_build_object(
      'request_id', request_record.id,
      'old_status', request_record.status,
      'new_status', CASE 
        WHEN rejection_count > 0 THEN 'rejected'
        WHEN total_weight >= request_record.approval_threshold * request_record.required_approvals THEN 'approved'
        ELSE 'pending'
      END,
      'approval_count', approval_count,
      'total_weight', total_weight,
      'signal_id', NEW.id,
      'approver_id', NEW.approver_id
    ),
    request_record.id,
    'approval_request',
    (
      SELECT COALESCE(MAX(sequence_number), 0) + 1 
      FROM public.domain_events 
      WHERE aggregate_id = request_record.id
    ),
    encode(digest(
      request_record.id::text || 
      CASE 
        WHEN rejection_count > 0 THEN 'rejected'
        WHEN total_weight >= request_record.approval_threshold * request_record.required_approvals THEN 'approved'
        ELSE 'pending'
      END ||
      now()::text, 
      'sha256'
    ), 'hex')
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for approval signal processing
CREATE TRIGGER trigger_update_approval_status
  AFTER INSERT ON public.approval_signals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_approval_request_status();

-- Helper functions for PBAT token management
CREATE OR REPLACE FUNCTION public.generate_pbat_token(
  p_policy_id UUID,
  p_subject_id UUID,
  p_scope JSONB,
  p_expires_in_hours INTEGER DEFAULT 24,
  p_token_type TEXT DEFAULT 'access'
) RETURNS TEXT AS $$
DECLARE
  token_value TEXT;
  token_hash TEXT;
BEGIN
  -- Generate secure random token
  token_value := encode(gen_random_bytes(32), 'base64');
  token_hash := encode(digest(token_value, 'sha256'), 'hex');
  
  -- Insert PBAT token
  INSERT INTO public.pbat_tokens (
    token_hash,
    policy_id,
    subject_id,
    issuer_id,
    token_type,
    scope,
    expires_at
  ) VALUES (
    token_hash,
    p_policy_id,
    p_subject_id,
    auth.uid(),
    p_token_type,
    p_scope,
    now() + (p_expires_in_hours || ' hours')::INTERVAL
  );
  
  -- Return the actual token (not the hash)
  RETURN token_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate PBAT token
CREATE OR REPLACE FUNCTION public.validate_pbat_token(
  p_token TEXT,
  p_required_scope TEXT DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
  token_hash TEXT;
  token_record public.pbat_tokens%ROWTYPE;
  result JSONB;
BEGIN
  token_hash := encode(digest(p_token, 'sha256'), 'hex');
  
  SELECT * INTO token_record
  FROM public.pbat_tokens
  WHERE token_hash = validate_pbat_token.token_hash
    AND status = 'active'
    AND expires_at > now();
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'reason', 'token_not_found_or_expired');
  END IF;
  
  -- Check scope if required
  IF p_required_scope IS NOT NULL THEN
    IF NOT (token_record.scope ? p_required_scope) THEN
      RETURN jsonb_build_object('valid', false, 'reason', 'insufficient_scope');
    END IF;
  END IF;
  
  -- Update usage tracking
  UPDATE public.pbat_tokens 
  SET 
    last_used_at = now(),
    usage_count = usage_count + 1
  WHERE id = token_record.id;
  
  RETURN jsonb_build_object(
    'valid', true,
    'subject_id', token_record.subject_id,
    'scope', token_record.scope,
    'token_type', token_record.token_type,
    'policy_id', token_record.policy_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;