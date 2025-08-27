-- HNW Asset Registry Tables
CREATE TABLE IF NOT EXISTS public.assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  asset_type TEXT NOT NULL CHECK (asset_type IN (
    'home_high_value', 'exotic_auto', 'marine_boat', 'marine_yacht', 
    'rv', 'fine_art', 'jewelry', 'umbrella', 'flood', 'earthquake', 
    'landlord_property', 'entity_owned', 'cyber', 'kidnap_ransom'
  )),
  asset_name TEXT NOT NULL,
  acquisition_date DATE,
  current_value_band TEXT CHECK (current_value_band IN (
    'under_100k', '100k_500k', '500k_1m', '1m_5m', '5m_10m', 'over_10m'
  )),
  location_zip_first3 TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'disposed')),
  metadata JSONB DEFAULT '{}',
  last_appraisal_date DATE,
  next_appraisal_due DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.asset_docs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id UUID NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN (
    'declaration', 'appraisal', 'survey', 'title', 'registration', 
    'certificate', 'inspection', 'photos', 'other'
  )),
  document_name TEXT NOT NULL,
  vault_hash TEXT NOT NULL,
  file_size_bytes BIGINT,
  upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  expiry_date DATE,
  created_by UUID NOT NULL REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS public.asset_extracts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_doc_id UUID NOT NULL REFERENCES public.asset_docs(id) ON DELETE CASCADE,
  extraction_type TEXT NOT NULL CHECK (extraction_type IN (
    'ocr_text', 'coverage_bands', 'limits_bands', 'deductibles', 
    'policy_details', 'valuation_bands'
  )),
  extracted_data JSONB NOT NULL,
  confidence_score NUMERIC(3,2) CHECK (confidence_score BETWEEN 0 AND 1),
  processed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  processor_version TEXT DEFAULT 'v1.0'
);

CREATE TABLE IF NOT EXISTS public.asset_advice (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id UUID NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  advice_type TEXT NOT NULL CHECK (advice_type IN (
    'coverage_gap', 'underinsured', 'overinsured', 'missing_coverage',
    'appraisal_needed', 'policy_update', 'risk_mitigation'
  )),
  priority_level TEXT NOT NULL CHECK (priority_level IN ('low', 'medium', 'high', 'urgent')),
  advice_summary TEXT NOT NULL,
  detailed_analysis JSONB,
  recommended_actions JSONB,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'addressed', 'dismissed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.asset_reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id UUID NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN (
    'appraisal_due', 'registration_renewal', 'marine_layup', 
    'storm_alert', 'umbrella_check', 'policy_renewal'
  )),
  reminder_date DATE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  notification_methods JSONB DEFAULT '["email"]',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'acknowledged', 'dismissed')),
  sent_at TIMESTAMP WITH TIME ZONE,
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Extend agent profiles with specialties
ALTER TABLE public.advisor_profiles 
ADD COLUMN IF NOT EXISTS specialties JSONB DEFAULT '[]';

-- RLS Policies
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_extracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_advice ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_reminders ENABLE ROW LEVEL SECURITY;

-- Assets policies
CREATE POLICY "Users can manage their own assets" ON public.assets
  FOR ALL USING (user_id = auth.uid());

-- Asset docs policies
CREATE POLICY "Users can manage docs for their assets" ON public.asset_docs
  FOR ALL USING (
    asset_id IN (SELECT id FROM public.assets WHERE user_id = auth.uid())
  );

-- Asset extracts policies
CREATE POLICY "Users can view extracts for their asset docs" ON public.asset_extracts
  FOR SELECT USING (
    asset_doc_id IN (
      SELECT ad.id FROM public.asset_docs ad
      JOIN public.assets a ON ad.asset_id = a.id
      WHERE a.user_id = auth.uid()
    )
  );

-- Asset advice policies
CREATE POLICY "Users can view advice for their assets" ON public.asset_advice
  FOR ALL USING (
    asset_id IN (SELECT id FROM public.assets WHERE user_id = auth.uid())
  );

-- Asset reminders policies
CREATE POLICY "Users can manage reminders for their assets" ON public.asset_reminders
  FOR ALL USING (
    asset_id IN (SELECT id FROM public.assets WHERE user_id = auth.uid())
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_assets_user_type ON public.assets(user_id, asset_type);
CREATE INDEX IF NOT EXISTS idx_asset_docs_asset_id ON public.asset_docs(asset_id);
CREATE INDEX IF NOT EXISTS idx_asset_reminders_date ON public.asset_reminders(reminder_date) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_advisor_profiles_specialties ON public.advisor_profiles USING GIN(specialties);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_assets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_assets_updated_at
  BEFORE UPDATE ON public.assets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_assets_updated_at();