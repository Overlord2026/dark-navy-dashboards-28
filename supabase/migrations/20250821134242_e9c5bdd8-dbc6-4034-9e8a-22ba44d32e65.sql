-- Create table for Health-RDS receipts
CREATE TABLE IF NOT EXISTS public.health_rds_receipts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  receipt_id UUID REFERENCES public.receipts(receipt_id),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL CHECK (action IN ('authorize', 'order', 'share', 'publish', 'pay', 'takedown')),
  inputs_hash TEXT NOT NULL,
  policy_version TEXT NOT NULL,
  reasons TEXT[] NOT NULL DEFAULT '{}',
  result TEXT NOT NULL CHECK (result IN ('approve', 'deny', 'pending')),
  disclosures TEXT[] NOT NULL DEFAULT '{}',
  financial_data JSONB,
  anchor_ref JSONB,
  receipt_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.health_rds_receipts ENABLE ROW LEVEL SECURITY;

-- Create policies for health_rds_receipts
CREATE POLICY "Users can view their own health receipts" 
ON public.health_rds_receipts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own health receipts" 
ON public.health_rds_receipts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_health_rds_receipts_user_id ON public.health_rds_receipts(user_id);
CREATE INDEX idx_health_rds_receipts_action ON public.health_rds_receipts(action);
CREATE INDEX idx_health_rds_receipts_result ON public.health_rds_receipts(result);
CREATE INDEX idx_health_rds_receipts_timestamp ON public.health_rds_receipts(receipt_timestamp);
CREATE INDEX idx_health_rds_receipts_policy_version ON public.health_rds_receipts(policy_version);

-- Create trigger for updated_at
CREATE TRIGGER update_health_rds_receipts_updated_at
  BEFORE UPDATE ON public.health_rds_receipts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Create table for consent receipts (Consent-RDS)
CREATE TABLE IF NOT EXISTS public.consent_rds_receipts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  receipt_id UUID REFERENCES public.receipts(receipt_id),
  user_id UUID REFERENCES auth.users(id),
  hipaa_scope TEXT[] NOT NULL DEFAULT '{}',
  purpose_of_use TEXT NOT NULL,
  consent_time TIMESTAMP WITH TIME ZONE NOT NULL,
  expiry TIMESTAMP WITH TIME ZONE,
  freshness_score NUMERIC(3,2) NOT NULL CHECK (freshness_score >= 0 AND freshness_score <= 1),
  proof_hash TEXT NOT NULL,
  inputs_hash TEXT NOT NULL,
  policy_version TEXT NOT NULL,
  anchor_ref JSONB,
  receipt_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.consent_rds_receipts ENABLE ROW LEVEL SECURITY;

-- Create policies for consent_rds_receipts
CREATE POLICY "Users can view their own consent receipts" 
ON public.consent_rds_receipts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own consent receipts" 
ON public.consent_rds_receipts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create indexes for consent receipts
CREATE INDEX idx_consent_rds_receipts_user_id ON public.consent_rds_receipts(user_id);
CREATE INDEX idx_consent_rds_receipts_purpose ON public.consent_rds_receipts(purpose_of_use);
CREATE INDEX idx_consent_rds_receipts_expiry ON public.consent_rds_receipts(expiry);
CREATE INDEX idx_consent_rds_receipts_timestamp ON public.consent_rds_receipts(receipt_timestamp);

-- Create trigger for updated_at
CREATE TRIGGER update_consent_rds_receipts_updated_at
  BEFORE UPDATE ON public.consent_rds_receipts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Create function to query health receipts with privacy protection
CREATE OR REPLACE FUNCTION public.get_health_receipts(
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0,
  p_action TEXT DEFAULT NULL,
  p_result TEXT DEFAULT NULL,
  p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS TABLE(
  id UUID,
  action TEXT,
  result TEXT,
  reasons TEXT[],
  disclosures TEXT[],
  has_financial BOOLEAN,
  has_anchor BOOLEAN,
  policy_version TEXT,
  receipt_timestamp TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    h.id,
    h.action,
    h.result,
    h.reasons,
    h.disclosures,
    (h.financial_data IS NOT NULL AND h.financial_data != '{}') AS has_financial,
    (h.anchor_ref IS NOT NULL AND h.anchor_ref != '{}') AS has_anchor,
    h.policy_version,
    h.receipt_timestamp,
    h.created_at
  FROM public.health_rds_receipts h
  WHERE h.user_id = auth.uid()
    AND (p_action IS NULL OR h.action = p_action)
    AND (p_result IS NULL OR h.result = p_result)
    AND (p_start_date IS NULL OR h.receipt_timestamp >= p_start_date)
    AND (p_end_date IS NULL OR h.receipt_timestamp <= p_end_date)
  ORDER BY h.receipt_timestamp DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;