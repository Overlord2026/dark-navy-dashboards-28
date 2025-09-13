-- Create org_members table for organizational access control
CREATE TABLE IF NOT EXISTS public.org_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('member', 'admin', 'auditor')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(org_id, user_id)
);

-- Enable RLS on org_members
ALTER TABLE public.org_members ENABLE ROW LEVEL SECURITY;

-- Create function to get user's org_id
CREATE OR REPLACE FUNCTION public.get_user_org_id(user_uuid UUID DEFAULT auth.uid())
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT org_id FROM public.org_members WHERE user_id = user_uuid LIMIT 1;
$$;

-- Create function to check if user has role
CREATE OR REPLACE FUNCTION public.user_has_role(required_role TEXT, user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.org_members 
    WHERE user_id = user_uuid 
    AND (role = required_role OR role = 'admin')
  );
$$;

-- Create AIES receipts table
CREATE TABLE public.aies_receipts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id TEXT NOT NULL,
  domain TEXT NOT NULL,
  use_case TEXT NOT NULL,
  close_cycle_id TEXT NOT NULL,
  as_of_date DATE NOT NULL,
  materiality_bucket TEXT NOT NULL,
  receipt_hash TEXT NOT NULL UNIQUE,
  canonical_receipt JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on aies_receipts
ALTER TABLE public.aies_receipts ENABLE ROW LEVEL SECURITY;

-- Create AIES receipt signatures table
CREATE TABLE public.aies_receipt_signatures (
  id BIGSERIAL PRIMARY KEY,
  receipt_id UUID NOT NULL REFERENCES public.aies_receipts(id) ON DELETE CASCADE,
  alg TEXT NOT NULL,
  key_ref TEXT NOT NULL,
  sig_b64 TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on aies_receipt_signatures
ALTER TABLE public.aies_receipt_signatures ENABLE ROW LEVEL SECURITY;

-- Create AIES anchors table
CREATE TABLE public.aies_anchors (
  id BIGSERIAL PRIMARY KEY,
  batch_id TEXT UNIQUE,
  merkle_root TEXT,
  anchor_ref TEXT,
  cross_chain_locator TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on aies_anchors
ALTER TABLE public.aies_anchors ENABLE ROW LEVEL SECURITY;

-- RLS Policies for org_members
CREATE POLICY "Users can view their own org membership" 
ON public.org_members 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage org members" 
ON public.org_members 
FOR ALL 
USING (user_has_role('admin'));

-- RLS Policies for aies_receipts
CREATE POLICY "Org members can view their org receipts" 
ON public.aies_receipts 
FOR SELECT 
USING (org_id = get_user_org_id());

CREATE POLICY "Org members can insert their org receipts" 
ON public.aies_receipts 
FOR INSERT 
WITH CHECK (org_id = get_user_org_id());

CREATE POLICY "Auditors can view all receipts" 
ON public.aies_receipts 
FOR SELECT 
USING (user_has_role('auditor'));

-- RLS Policies for aies_receipt_signatures
CREATE POLICY "Org members can view signatures for their org receipts" 
ON public.aies_receipt_signatures 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.aies_receipts r 
    WHERE r.id = receipt_id 
    AND r.org_id = get_user_org_id()
  )
);

CREATE POLICY "Org members can insert signatures for their org receipts" 
ON public.aies_receipt_signatures 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.aies_receipts r 
    WHERE r.id = receipt_id 
    AND r.org_id = get_user_org_id()
  )
);

CREATE POLICY "Auditors can view all signatures" 
ON public.aies_receipt_signatures 
FOR SELECT 
USING (user_has_role('auditor'));

-- RLS Policies for aies_anchors (public read, admin write)
CREATE POLICY "Anyone can view anchors" 
ON public.aies_anchors 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage anchors" 
ON public.aies_anchors 
FOR ALL 
USING (user_has_role('admin'));

-- Create aies-evidence storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('aies-evidence', 'aies-evidence', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for aies-evidence bucket
CREATE POLICY "Org members can upload evidence for their org" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'aies-evidence' 
  AND (storage.foldername(name))[1] = get_user_org_id()
);

CREATE POLICY "Org members can view evidence for their org" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'aies-evidence' 
  AND (storage.foldername(name))[1] = get_user_org_id()
);

CREATE POLICY "Auditors can view all evidence" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'aies-evidence' 
  AND user_has_role('auditor')
);

-- Performance indexes
CREATE INDEX idx_aies_receipts_org_id ON public.aies_receipts(org_id);
CREATE INDEX idx_aies_receipts_close_cycle ON public.aies_receipts(close_cycle_id);
CREATE INDEX idx_aies_receipts_as_of_date ON public.aies_receipts(as_of_date);
CREATE INDEX idx_aies_receipt_signatures_receipt_id ON public.aies_receipt_signatures(receipt_id);
CREATE INDEX idx_org_members_user_id ON public.org_members(user_id);
CREATE INDEX idx_org_members_org_id ON public.org_members(org_id);