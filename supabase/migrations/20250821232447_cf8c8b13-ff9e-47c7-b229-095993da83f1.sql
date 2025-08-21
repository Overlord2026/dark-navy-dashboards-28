-- NIL Core Tables

-- NIL Personas and Entities
CREATE TABLE public.nil_personas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  persona_type TEXT NOT NULL CHECK (persona_type IN ('family', 'advisor', 'cpa', 'attorney', 'brand', 'athlete')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  jurisdiction TEXT DEFAULT 'US',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NIL Education & Disclosure Management
CREATE TABLE public.nil_education_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  persona_id UUID REFERENCES public.nil_personas(id) ON DELETE CASCADE,
  education_type TEXT NOT NULL,
  completion_date TIMESTAMP WITH TIME ZONE NOT NULL,
  expiry_date TIMESTAMP WITH TIME ZONE,
  channel TEXT NOT NULL,
  jurisdiction TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  receipt_id UUID,
  anchor_ref JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NIL Disclosure Packs
CREATE TABLE public.nil_disclosure_packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel TEXT NOT NULL,
  jurisdiction TEXT NOT NULL,
  disclosure_version TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  effective_date DATE NOT NULL,
  expiry_date DATE,
  pack_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NIL Offers and Exclusivity
CREATE TABLE public.nil_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES public.nil_personas(id),
  athlete_id UUID REFERENCES public.nil_personas(id),
  offer_type TEXT NOT NULL CHECK (offer_type IN ('exclusive', 'non_exclusive', 'first_right_refusal')),
  offer_amount DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  exclusivity_period_days INTEGER,
  offer_lock_until TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'offered', 'accepted', 'declined', 'expired', 'cancelled')),
  offer_terms JSONB DEFAULT '{}',
  receipt_id UUID,
  anchor_ref JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NIL Contracts
CREATE TABLE public.nil_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id UUID REFERENCES public.nil_offers(id),
  contract_type TEXT NOT NULL,
  parties JSONB NOT NULL, -- Array of persona IDs and roles
  terms JSONB NOT NULL,
  execution_date TIMESTAMP WITH TIME ZONE,
  effective_date DATE,
  expiry_date DATE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending_signatures', 'executed', 'terminated', 'disputed')),
  signature_requirements JSONB DEFAULT '[]',
  signatures JSONB DEFAULT '[]',
  content_hash TEXT,
  receipt_id UUID,
  anchor_ref JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NIL Payments and Escrow
CREATE TABLE public.nil_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES public.nil_contracts(id),
  payment_type TEXT NOT NULL CHECK (payment_type IN ('escrow', 'release', 'refund', 'penalty')),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  from_party UUID REFERENCES public.nil_personas(id),
  to_party UUID REFERENCES public.nil_personas(id),
  payment_method TEXT,
  escrow_status TEXT DEFAULT 'pending' CHECK (escrow_status IN ('pending', 'escrowed', 'released', 'refunded', 'disputed')),
  transaction_ref TEXT,
  receipt_id UUID,
  anchor_ref JSONB DEFAULT '{}',
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NIL Policy Gates
CREATE TABLE public.nil_policy_gates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gate_type TEXT NOT NULL CHECK (gate_type IN ('education_freshness', 'disclosure_pack', 'exclusivity_lock', 'budget_policy', 'co_sign_required')),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  policy_config JSONB NOT NULL,
  gate_status TEXT DEFAULT 'active' CHECK (gate_status IN ('active', 'bypassed', 'failed', 'expired')),
  last_evaluation TIMESTAMP WITH TIME ZONE,
  evaluation_result JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NIL Receipts (RDS)
CREATE TABLE public.nil_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_type TEXT NOT NULL CHECK (receipt_type IN ('Decision-RDS', 'Consent-RDS', 'Settlement-RDS', 'Delta-RDS')),
  event_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  policy_hash TEXT NOT NULL,
  inputs_hash TEXT NOT NULL,
  decision_outcome TEXT NOT NULL,
  reason_codes JSONB DEFAULT '[]',
  explanation TEXT,
  merkle_leaf TEXT NOT NULL,
  merkle_root TEXT,
  anchor_ref JSONB DEFAULT '{}',
  privacy_level TEXT DEFAULT 'high' CHECK (privacy_level IN ('low', 'medium', 'high', 'maximum')),
  retention_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NIL Disputes
CREATE TABLE public.nil_disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_type TEXT NOT NULL CHECK (dispute_type IN ('contract_breach', 'payment_dispute', 'content_takedown', 'exclusivity_violation')),
  disputing_party UUID REFERENCES public.nil_personas(id),
  disputed_entity_type TEXT NOT NULL,
  disputed_entity_id UUID NOT NULL,
  dispute_details JSONB NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'mediation', 'resolved', 'escalated')),
  resolution JSONB,
  receipt_id UUID,
  anchor_ref JSONB DEFAULT '{}',
  filed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on all tables
ALTER TABLE public.nil_personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nil_education_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nil_disclosure_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nil_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nil_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nil_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nil_policy_gates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nil_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nil_disputes ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Demo-friendly (allow authenticated users to see demo data)
CREATE POLICY "Demo users can view NIL personas" ON public.nil_personas FOR SELECT USING (TRUE);
CREATE POLICY "Demo users can manage their NIL data" ON public.nil_personas FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Demo users can view education records" ON public.nil_education_records FOR SELECT USING (TRUE);
CREATE POLICY "Demo users can manage education records" ON public.nil_education_records FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Demo users can view disclosure packs" ON public.nil_disclosure_packs FOR SELECT USING (TRUE);
CREATE POLICY "Demo users can manage disclosure packs" ON public.nil_disclosure_packs FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Demo users can view offers" ON public.nil_offers FOR SELECT USING (TRUE);
CREATE POLICY "Demo users can manage offers" ON public.nil_offers FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Demo users can view contracts" ON public.nil_contracts FOR SELECT USING (TRUE);
CREATE POLICY "Demo users can manage contracts" ON public.nil_contracts FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Demo users can view payments" ON public.nil_payments FOR SELECT USING (TRUE);
CREATE POLICY "Demo users can manage payments" ON public.nil_payments FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Demo users can view policy gates" ON public.nil_policy_gates FOR SELECT USING (TRUE);
CREATE POLICY "Demo users can manage policy gates" ON public.nil_policy_gates FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Demo users can view receipts" ON public.nil_receipts FOR SELECT USING (TRUE);
CREATE POLICY "Demo users can create receipts" ON public.nil_receipts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Demo users can view disputes" ON public.nil_disputes FOR SELECT USING (TRUE);
CREATE POLICY "Demo users can manage disputes" ON public.nil_disputes FOR ALL USING (auth.uid() IS NOT NULL);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_nil_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_nil_personas_updated_at BEFORE UPDATE ON public.nil_personas FOR EACH ROW EXECUTE FUNCTION public.update_nil_updated_at();
CREATE TRIGGER update_nil_offers_updated_at BEFORE UPDATE ON public.nil_offers FOR EACH ROW EXECUTE FUNCTION public.update_nil_updated_at();
CREATE TRIGGER update_nil_contracts_updated_at BEFORE UPDATE ON public.nil_contracts FOR EACH ROW EXECUTE FUNCTION public.update_nil_updated_at();
CREATE TRIGGER update_nil_policy_gates_updated_at BEFORE UPDATE ON public.nil_policy_gates FOR EACH ROW EXECUTE FUNCTION public.update_nil_updated_at();

-- Seed demo personas
INSERT INTO public.nil_personas (persona_type, name, email, jurisdiction, metadata) VALUES
-- Family
('family', 'Ava & James Thompson', 'ava.james@demo.nil', 'US', '{"household_type": "retiree", "children": 2, "demo_persona": true}'),

-- Professionals
('advisor', 'Taylor R. Financial', 'taylor.r@advisors.demo', 'US', '{"specialty": "sports_finance", "license": "CFP", "demo_persona": true}'),
('cpa', 'Morgan C. Accounting', 'morgan.c@cpa.demo', 'US', '{"specialty": "athlete_tax", "license": "CPA", "demo_persona": true}'),
('attorney', 'Reese L. Legal', 'reese.l@law.demo', 'US', '{"specialty": "sports_law", "bar_admission": "NY", "demo_persona": true}'),

-- Brand
('brand', 'Aurora Athletics', 'partnerships@aurora.demo', 'US', '{"industry": "sports_apparel", "target_sports": ["basketball", "soccer"], "demo_persona": true}'),

-- Athlete
('athlete', 'Jordan K.', 'jordan.k@athlete.demo', 'US', '{"sport": "basketball", "year": "junior", "school": "State University", "demo_persona": true}');

-- Seed disclosure packs
INSERT INTO public.nil_disclosure_packs (channel, jurisdiction, disclosure_version, content_hash, effective_date, pack_data) VALUES
('social_media', 'US', '2024.1', 'sha256:sm_us_2024_1_hash', '2024-01-01', '{"disclosures": ["FTC_guidelines", "tax_implications", "eligibility_rules"], "demo_data": true}'),
('endorsement', 'US', '2024.1', 'sha256:end_us_2024_1_hash', '2024-01-01', '{"disclosures": ["compensation_disclosure", "relationship_disclosure", "performance_claims"], "demo_data": true}'),
('appearance', 'US', '2024.1', 'sha256:app_us_2024_1_hash', '2024-01-01', '{"disclosures": ["event_terms", "image_usage", "cancellation_policy"], "demo_data": true}');