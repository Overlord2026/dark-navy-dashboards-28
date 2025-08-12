-- P5 Multi-Persona OS Backbone Core Schema
-- Personas & sessions
CREATE TABLE IF NOT EXISTS personas(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('client','advisor','agent','guardian','coach','sponsor','admin')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS persona_sessions(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  persona_id uuid NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
  active boolean DEFAULT true,
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz
);

-- Consent tokens (VC-like)
CREATE TABLE IF NOT EXISTS consent_tokens(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_user uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  issuer_user uuid REFERENCES auth.users(id),
  scopes jsonb NOT NULL,         -- {jurisdiction, productOrMedia, likeness, time, audience}
  conditions jsonb,              -- {training, disclosures, conflicts}
  valid_from timestamptz,
  valid_to timestamptz,
  vc_jwt text,                   -- optional signed VC
  status text DEFAULT 'active' CHECK (status IN ('active','revoked','expired')),
  created_at timestamptz DEFAULT now()
);

-- Reason-coded receipts + anchors
CREATE TABLE IF NOT EXISTS reason_receipts(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  persona_id uuid NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
  action_key text NOT NULL,        -- e.g. 'create_proposal','publish_ad'
  reason_code text NOT NULL,       -- e.g. 'OK','BLOCK_CONFLICT','REQUIRE_DISCLOSURE','CE_OVERDUE'
  explanation text,
  policy_version text,
  content_fingerprint text,
  sha256 text,
  anchor_txid text,
  created_at timestamptz DEFAULT now()
);

-- Revocations (trigger takedown)
CREATE TABLE IF NOT EXISTS revocations(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consent_id uuid NOT NULL REFERENCES consent_tokens(id) ON DELETE CASCADE,
  reason text,
  propagated boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- XR / Metaverse attestations (feature-flagged)
CREATE TABLE IF NOT EXISTS xr_attestations(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consent_id uuid REFERENCES consent_tokens(id) ON DELETE SET NULL,
  event jsonb,                    -- {venue, time, device, presence, likeness}
  receipt_id uuid REFERENCES reason_receipts(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Minimal RLS (tighten later)
ALTER TABLE personas ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_read_own_personas ON personas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY p_ins_own_personas ON personas FOR INSERT WITH CHECK (auth.uid() = user_id);

ALTER TABLE persona_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_ps_select ON persona_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY p_ps_insert ON persona_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY p_ps_update ON persona_sessions FOR UPDATE USING (auth.uid() = user_id);

ALTER TABLE consent_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_ct_select ON consent_tokens FOR SELECT USING (subject_user = auth.uid() OR issuer_user = auth.uid());
CREATE POLICY p_ct_insert ON consent_tokens FOR INSERT WITH CHECK (issuer_user = auth.uid());
CREATE POLICY p_ct_update ON consent_tokens FOR UPDATE USING (issuer_user = auth.uid());

ALTER TABLE reason_receipts ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_rr_select ON reason_receipts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY p_rr_insert ON reason_receipts FOR INSERT WITH CHECK (auth.uid() = user_id);

ALTER TABLE revocations ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_rev_select ON revocations FOR SELECT USING (true);
CREATE POLICY p_rev_insert ON revocations FOR INSERT WITH CHECK (true);

-- helpful indexes
CREATE INDEX IF NOT EXISTS idx_ct_subject ON consent_tokens(subject_user);
CREATE INDEX IF NOT EXISTS idx_rr_user_created ON reason_receipts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rev_consent ON revocations(consent_id);