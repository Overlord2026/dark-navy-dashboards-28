-- Create AI bookkeeping tables and functions
CREATE TABLE public.transaction_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  tenant_id UUID,
  category_name TEXT NOT NULL,
  parent_category TEXT,
  keywords TEXT[],
  vendor_patterns TEXT[],
  amount_ranges JSONB,
  confidence_score NUMERIC DEFAULT 0,
  is_system_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.transaction_classifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID,
  user_id UUID NOT NULL,
  tenant_id UUID,
  original_description TEXT NOT NULL,
  cleaned_description TEXT,
  suggested_category TEXT,
  final_category TEXT,
  confidence_score NUMERIC,
  vendor_name TEXT,
  is_recurring BOOLEAN DEFAULT false,
  is_anomaly BOOLEAN DEFAULT false,
  anomaly_reasons TEXT[],
  manual_override BOOLEAN DEFAULT false,
  ai_model_used TEXT,
  learning_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.vendor_learning (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  tenant_id UUID,
  vendor_name TEXT NOT NULL,
  vendor_aliases TEXT[],
  default_category TEXT,
  typical_amounts JSONB,
  frequency_pattern TEXT,
  last_seen_at TIMESTAMP WITH TIME ZONE,
  transaction_count INTEGER DEFAULT 1,
  confidence_level NUMERIC DEFAULT 0.5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, vendor_name)
);

CREATE TABLE public.bookkeeping_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  tenant_id UUID,
  report_period_start DATE NOT NULL,
  report_period_end DATE NOT NULL,
  report_type TEXT DEFAULT 'monthly',
  category_breakdown JSONB,
  anomalies_found INTEGER DEFAULT 0,
  total_transactions INTEGER DEFAULT 0,
  auto_classified_count INTEGER DEFAULT 0,
  manual_review_count INTEGER DEFAULT 0,
  report_data JSONB,
  status TEXT DEFAULT 'generated',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.transaction_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_classifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_learning ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookkeeping_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own transaction categories" ON public.transaction_categories
FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own transaction classifications" ON public.transaction_classifications
FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own vendor learning" ON public.vendor_learning
FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own bookkeeping reports" ON public.bookkeeping_reports
FOR ALL USING (user_id = auth.uid());

-- Triggers for updated_at
CREATE TRIGGER update_transaction_categories_updated_at
  BEFORE UPDATE ON public.transaction_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_transaction_classifications_updated_at
  BEFORE UPDATE ON public.transaction_classifications
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_vendor_learning_updated_at
  BEFORE UPDATE ON public.vendor_learning
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_bookkeeping_reports_updated_at
  BEFORE UPDATE ON public.bookkeeping_reports
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

-- Function to detect transaction anomalies
CREATE OR REPLACE FUNCTION public.detect_transaction_anomalies(
  p_user_id UUID,
  p_vendor_name TEXT,
  p_amount NUMERIC,
  p_description TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  vendor_history RECORD;
  anomalies TEXT[] := '{}';
  avg_amount NUMERIC;
  std_dev NUMERIC;
BEGIN
  -- Get vendor history
  SELECT 
    typical_amounts,
    transaction_count,
    confidence_level
  INTO vendor_history
  FROM public.vendor_learning
  WHERE user_id = p_user_id AND vendor_name = p_vendor_name;
  
  IF vendor_history IS NOT NULL THEN
    -- Check for amount anomalies
    avg_amount := (vendor_history.typical_amounts->>'avg')::NUMERIC;
    std_dev := (vendor_history.typical_amounts->>'std_dev')::NUMERIC;
    
    IF avg_amount IS NOT NULL AND std_dev IS NOT NULL THEN
      -- Flag if amount is more than 2 standard deviations from average
      IF ABS(p_amount - avg_amount) > (2 * std_dev) AND std_dev > 0 THEN
        anomalies := array_append(anomalies, 'unusual_amount');
      END IF;
    END IF;
    
    -- Check for duplicate transactions (same vendor, similar amount within 24 hours)
    IF EXISTS (
      SELECT 1 FROM public.transaction_classifications tc
      WHERE tc.user_id = p_user_id 
        AND tc.vendor_name = p_vendor_name
        AND ABS(EXTRACT(EPOCH FROM (now() - tc.created_at))) < 86400
        AND ABS((tc.learning_data->>'amount')::NUMERIC - p_amount) < 1.00
    ) THEN
      anomalies := array_append(anomalies, 'potential_duplicate');
    END IF;
  ELSE
    -- New vendor
    anomalies := array_append(anomalies, 'unknown_vendor');
  END IF;
  
  RETURN jsonb_build_object(
    'is_anomaly', array_length(anomalies, 1) > 0,
    'anomaly_reasons', anomalies,
    'confidence_score', COALESCE(vendor_history.confidence_level, 0.1)
  );
END;
$$;