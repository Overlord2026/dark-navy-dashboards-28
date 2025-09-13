-- Create AIES voice calls table
CREATE TABLE public.aies_voice_calls (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id text NOT NULL,
    call_id text UNIQUE NOT NULL,
    matter_type text,
    as_of_ts timestamptz,
    consent_required boolean,
    consent_obtained boolean,
    geo jsonb,
    audio_hash text,
    transcript_hash text,
    qualified boolean,
    conflict_passed boolean,
    scheduling jsonb,
    created_at timestamptz DEFAULT now()
);

-- Create AIES voice receipts table
CREATE TABLE public.aies_voice_receipts (
    receipt_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id text NOT NULL,
    call_id text NOT NULL REFERENCES public.aies_voice_calls(call_id) ON DELETE CASCADE,
    receipt_hash text UNIQUE NOT NULL,
    canonical_receipt jsonb NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Create AIES voice signatures table
CREATE TABLE public.aies_voice_signatures (
    id bigserial PRIMARY KEY,
    receipt_id uuid NOT NULL REFERENCES public.aies_voice_receipts(receipt_id) ON DELETE CASCADE,
    alg text,
    key_ref text,
    sig_b64 text,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.aies_voice_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aies_voice_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aies_voice_signatures ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get user's org - using tenant_id from profiles
CREATE OR REPLACE FUNCTION public.get_user_org_id()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT tenant_id::text FROM public.profiles WHERE id = auth.uid();
$$;

-- Create security definer function to check if user is auditor
CREATE OR REPLACE FUNCTION public.is_auditor()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'auditor'
  );
$$;

-- RLS policies for aies_voice_calls
CREATE POLICY "Org members can manage their voice calls"
ON public.aies_voice_calls
FOR ALL
TO authenticated
USING (org_id = public.get_user_org_id())
WITH CHECK (org_id = public.get_user_org_id());

CREATE POLICY "Auditors can read all voice calls"
ON public.aies_voice_calls
FOR SELECT
TO authenticated
USING (public.is_auditor());

-- RLS policies for aies_voice_receipts
CREATE POLICY "Org members can manage their voice receipts"
ON public.aies_voice_receipts
FOR ALL
TO authenticated
USING (org_id = public.get_user_org_id())
WITH CHECK (org_id = public.get_user_org_id());

CREATE POLICY "Auditors can read all voice receipts"
ON public.aies_voice_receipts
FOR SELECT
TO authenticated
USING (public.is_auditor());

-- RLS policies for aies_voice_signatures
CREATE POLICY "Org members can manage signatures for their receipts"
ON public.aies_voice_signatures
FOR ALL
TO authenticated
USING (
  receipt_id IN (
    SELECT receipt_id FROM public.aies_voice_receipts 
    WHERE org_id = public.get_user_org_id()
  )
)
WITH CHECK (
  receipt_id IN (
    SELECT receipt_id FROM public.aies_voice_receipts 
    WHERE org_id = public.get_user_org_id()
  )
);

CREATE POLICY "Auditors can read all voice signatures"
ON public.aies_voice_signatures
FOR SELECT
TO authenticated
USING (public.is_auditor());

-- Create indexes for performance
CREATE INDEX idx_aies_voice_calls_org_id ON public.aies_voice_calls(org_id);
CREATE INDEX idx_aies_voice_calls_call_id ON public.aies_voice_calls(call_id);
CREATE INDEX idx_aies_voice_receipts_org_id ON public.aies_voice_receipts(org_id);
CREATE INDEX idx_aies_voice_receipts_call_id ON public.aies_voice_receipts(call_id);
CREATE INDEX idx_aies_voice_signatures_receipt_id ON public.aies_voice_signatures(receipt_id);