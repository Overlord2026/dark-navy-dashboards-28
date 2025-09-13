-- Create AIES tables and policies

-- AIES Receipts table
CREATE TABLE public.aies_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL,
  domain TEXT NOT NULL,
  use_case TEXT NOT NULL,
  close_cycle_id TEXT NOT NULL,
  as_of_date DATE NOT NULL,
  materiality_bucket TEXT NOT NULL,
  receipt_hash TEXT NOT NULL UNIQUE,
  canonical_receipt JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- AIES Receipt Signatures table
CREATE TABLE public.aies_receipt_signatures (
  id BIGSERIAL PRIMARY KEY,
  receipt_id UUID REFERENCES public.aies_receipts(id) ON DELETE CASCADE,
  alg TEXT NOT NULL,
  key_ref TEXT NOT NULL,
  sig_b64 TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- AIES Receipt Bindings table
CREATE TABLE public.aies_receipt_bindings (
  id BIGSERIAL PRIMARY KEY,
  receipt_id UUID REFERENCES public.aies_receipts(id) ON DELETE CASCADE,
  upstream_receipt_hash TEXT NOT NULL,
  role TEXT NOT NULL
);

-- AIES Anchors table
CREATE TABLE public.aies_anchors (
  id BIGSERIAL PRIMARY KEY,
  batch_id TEXT UNIQUE,
  merkle_root TEXT NOT NULL,
  anchor_ref TEXT,
  cross_chain_locator TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.aies_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aies_receipt_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aies_receipt_bindings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aies_anchors ENABLE ROW LEVEL SECURITY;

-- Create org_members helper view (assuming it doesn't exist)
CREATE OR REPLACE VIEW public.org_members AS
SELECT DISTINCT 
  ut.tenant_id as org_id,
  ut.user_id,
  COALESCE(p.role, 'member') as role
FROM public.user_tenants ut
LEFT JOIN public.profiles p ON p.id = ut.user_id;

-- RLS Policies for AIES Receipts
CREATE POLICY "org_members_can_insert_receipts" ON public.aies_receipts
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.org_members om 
      WHERE om.org_id = aies_receipts.org_id 
      AND om.user_id = auth.uid()
    )
  );

CREATE POLICY "org_members_can_select_receipts" ON public.aies_receipts
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.org_members om 
      WHERE om.org_id = aies_receipts.org_id 
      AND om.user_id = auth.uid()
    )
  );

-- RLS Policies for Signatures
CREATE POLICY "org_members_can_insert_signatures" ON public.aies_receipt_signatures
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.aies_receipts ar
      JOIN public.org_members om ON om.org_id = ar.org_id
      WHERE ar.id = aies_receipt_signatures.receipt_id
      AND om.user_id = auth.uid()
    )
  );

CREATE POLICY "org_members_can_select_signatures" ON public.aies_receipt_signatures
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.aies_receipts ar
      JOIN public.org_members om ON om.org_id = ar.org_id
      WHERE ar.id = aies_receipt_signatures.receipt_id
      AND om.user_id = auth.uid()
    )
  );

-- RLS Policies for Bindings
CREATE POLICY "org_members_can_insert_bindings" ON public.aies_receipt_bindings
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.aies_receipts ar
      JOIN public.org_members om ON om.org_id = ar.org_id
      WHERE ar.id = aies_receipt_bindings.receipt_id
      AND om.user_id = auth.uid()
    )
  );

CREATE POLICY "org_members_can_select_bindings" ON public.aies_receipt_bindings
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.aies_receipts ar
      JOIN public.org_members om ON om.org_id = ar.org_id
      WHERE ar.id = aies_receipt_bindings.receipt_id
      AND om.user_id = auth.uid()
    )
  );

-- RLS Policies for Anchors (org-agnostic but auth required)
CREATE POLICY "authenticated_users_can_select_anchors" ON public.aies_anchors
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "service_role_can_manage_anchors" ON public.aies_anchors
  FOR ALL
  USING (auth.role() = 'service_role');

-- Create AIES Evidence storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('aies_evidence', 'aies_evidence', false);

-- Storage policies for AIES Evidence
CREATE POLICY "org_members_can_upload_evidence" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'aies_evidence' AND
    EXISTS (
      SELECT 1 FROM public.org_members om
      WHERE om.user_id = auth.uid()
      AND (storage.foldername(name))[1] = om.org_id
    )
  );

CREATE POLICY "org_members_can_read_evidence" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'aies_evidence' AND
    EXISTS (
      SELECT 1 FROM public.org_members om
      WHERE om.user_id = auth.uid()
      AND (storage.foldername(name))[1] = om.org_id
    )
  );

CREATE POLICY "org_members_can_update_evidence" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'aies_evidence' AND
    EXISTS (
      SELECT 1 FROM public.org_members om
      WHERE om.user_id = auth.uid()
      AND (storage.foldername(name))[1] = om.org_id
    )
  );