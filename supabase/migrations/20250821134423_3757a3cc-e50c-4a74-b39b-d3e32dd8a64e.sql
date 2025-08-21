-- Fix security definer function by changing to SECURITY INVOKER
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
SECURITY INVOKER  -- Changed from SECURITY DEFINER
SET search_path = ''  -- Set empty search path for security
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