-- RLS Policies for Consent System

-- Enable RLS on all tables
ALTER TABLE personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE persona_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE reason_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE revocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE xr_attestations ENABLE ROW LEVEL SECURITY;

-- Personas: row-owner policy
CREATE POLICY "Users can manage their own personas" ON personas
FOR ALL USING (user_id = auth.uid());

-- Persona Sessions: row-owner policy
CREATE POLICY "Users can manage their own persona sessions" ON persona_sessions
FOR ALL USING (user_id = auth.uid());

-- Consent Tokens: per-tenant + subject/issuer access
CREATE POLICY "Users can view consent tokens they are subject or issuer of" ON consent_tokens
FOR SELECT USING (subject_user = auth.uid() OR issuer_user = auth.uid());

CREATE POLICY "Users can create consent tokens as issuer" ON consent_tokens
FOR INSERT WITH CHECK (issuer_user = auth.uid());

CREATE POLICY "Users can update consent tokens they issued or are subject of" ON consent_tokens
FOR UPDATE USING (subject_user = auth.uid() OR issuer_user = auth.uid());

-- Reason Receipts: per-tenant policy (users can see their own receipts)
CREATE POLICY "Users can view their own reason receipts" ON reason_receipts
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Service role can manage all reason receipts" ON reason_receipts
FOR ALL USING (auth.role() = 'service_role');

-- Revocations: users can view revocations for consents they have access to
CREATE POLICY "Users can view revocations for their consents" ON revocations
FOR SELECT USING (
  consent_id IN (
    SELECT id FROM consent_tokens 
    WHERE subject_user = auth.uid() OR issuer_user = auth.uid()
  )
);

CREATE POLICY "Service role can manage all revocations" ON revocations
FOR ALL USING (auth.role() = 'service_role');

-- XR Attestations: users can view their own
CREATE POLICY "Users can view their own XR attestations" ON xr_attestations
FOR SELECT USING (
  consent_id IN (
    SELECT id FROM consent_tokens 
    WHERE subject_user = auth.uid() OR issuer_user = auth.uid()
  )
);

CREATE POLICY "Service role can manage all XR attestations" ON xr_attestations
FOR ALL USING (auth.role() = 'service_role');

-- Indexes for performance
CREATE INDEX idx_personas_user_id ON personas(user_id);
CREATE INDEX idx_persona_sessions_user_id ON persona_sessions(user_id);
CREATE INDEX idx_persona_sessions_active ON persona_sessions(active) WHERE active = true;
CREATE INDEX idx_consent_tokens_subject ON consent_tokens(subject_user);
CREATE INDEX idx_consent_tokens_issuer ON consent_tokens(issuer_user);
CREATE INDEX idx_consent_tokens_status ON consent_tokens(status);
CREATE INDEX idx_reason_receipts_user_id ON reason_receipts(user_id);
CREATE INDEX idx_reason_receipts_persona_id ON reason_receipts(persona_id);
CREATE INDEX idx_reason_receipts_action_key ON reason_receipts(action_key);
CREATE INDEX idx_revocations_consent_id ON revocations(consent_id);

-- Helper function to get current user tenant (placeholder for multi-tenant support)
CREATE OR REPLACE FUNCTION get_current_user_tenant_id()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT tenant_id FROM profiles WHERE id = auth.uid() LIMIT 1;
$$;