-- Legacy KPIs Dashboard Migration (Fixed)
-- Creates tables and views to support Legacy KPI analytics

-- Legacy households table for tracking family office data
CREATE TABLE IF NOT EXISTS public.legacy_households (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  household_name text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Legacy heirs table for tracking beneficiaries and roles
CREATE TABLE IF NOT EXISTS public.legacy_heirs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id uuid NOT NULL REFERENCES public.legacy_households(id) ON DELETE CASCADE,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'heir' CHECK (role IN ('heir', 'executor', 'trustee', 'poa', 'guardian')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Legacy documents table for tracking critical documents
CREATE TABLE IF NOT EXISTS public.legacy_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id uuid NOT NULL REFERENCES public.legacy_households(id) ON DELETE CASCADE,
  document_type text NOT NULL CHECK (document_type IN ('will', 'trust', 'poa', 'hipaa', 'deed', 'other')),
  document_name text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'uploaded', 'verified')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Legacy exports table for tracking bundle exports and receipts
CREATE TABLE IF NOT EXISTS public.legacy_exports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id uuid NOT NULL REFERENCES public.legacy_households(id) ON DELETE CASCADE,
  export_type text NOT NULL DEFAULT 'executor_bundle' CHECK (export_type IN ('executor_bundle', 'full_archive', 'summary')),
  receipt_hash text NOT NULL,
  exported_by uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now()
);

-- Legacy KPI summary view for dashboard
CREATE OR REPLACE VIEW public.legacy_kpi_summary AS
SELECT 
  COUNT(DISTINCT lh.id) as total_households,
  COUNT(DISTINCT lh.id) FILTER (WHERE lh.status = 'active') as active_households,
  COUNT(DISTINCT lhe.id) as total_heirs,
  COUNT(DISTINCT ld.id) as total_documents,
  COUNT(DISTINCT ld.id) FILTER (WHERE ld.status = 'verified') as verified_documents,
  COUNT(DISTINCT le.id) as total_exports,
  COALESCE(
    ROUND(
      (COUNT(DISTINCT ld.id) FILTER (WHERE ld.status = 'verified')::numeric / 
       NULLIF(COUNT(DISTINCT ld.id), 0) * 100), 2
    ), 0
  ) as document_completion_rate
FROM public.legacy_households lh
LEFT JOIN public.legacy_heirs lhe ON lh.id = lhe.household_id
LEFT JOIN public.legacy_documents ld ON lh.id = ld.household_id  
LEFT JOIN public.legacy_exports le ON lh.id = le.household_id;

-- Legacy KPI time series view for charts
CREATE OR REPLACE VIEW public.legacy_kpi_timeseries AS
SELECT 
  date_trunc('day', created_at) as date,
  COUNT(DISTINCT household_id) as households_created,
  COUNT(*) FILTER (WHERE document_type = 'will') as wills_uploaded,
  COUNT(*) FILTER (WHERE document_type = 'trust') as trusts_uploaded,
  COUNT(*) FILTER (WHERE status = 'verified') as documents_verified
FROM public.legacy_documents
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY date_trunc('day', created_at)
ORDER BY date;

-- Enable RLS on all tables
ALTER TABLE public.legacy_households ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legacy_heirs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legacy_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legacy_exports ENABLE ROW LEVEL SECURITY;

-- RLS policies for user data access
CREATE POLICY "Users can manage their own households" ON public.legacy_households
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage heirs for their households" ON public.legacy_heirs
  FOR ALL USING (household_id IN (
    SELECT id FROM public.legacy_households WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can manage documents for their households" ON public.legacy_documents
  FOR ALL USING (household_id IN (
    SELECT id FROM public.legacy_households WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can manage exports for their households" ON public.legacy_exports
  FOR ALL USING (household_id IN (
    SELECT id FROM public.legacy_households WHERE user_id = auth.uid()
  ));

-- Admin-only policies for KPI views (allow admins to see all data)
CREATE POLICY "Admins can view all legacy households" ON public.legacy_households
  FOR SELECT USING (
    ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) IN ('admin', 'system_administrator', 'tenant_admin')
  );

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_legacy_households_updated_at BEFORE UPDATE ON public.legacy_households 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_legacy_heirs_updated_at BEFORE UPDATE ON public.legacy_heirs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_legacy_documents_updated_at BEFORE UPDATE ON public.legacy_documents 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();