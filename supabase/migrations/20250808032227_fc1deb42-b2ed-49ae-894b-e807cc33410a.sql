-- 1. Tenants (white-label firms)
CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL, -- e.g., "bfo", "acme-wealth"
  name TEXT NOT NULL,
  logo_url TEXT,
  brand_primary TEXT,   -- hex
  brand_secondary TEXT, -- hex
  brand_accent TEXT,    -- hex
  email_from_name TEXT DEFAULT 'Boutique Family Office',
  email_from_address TEXT DEFAULT 'noreply@bfocfo.com',
  legal_footer TEXT,    -- custom disclaimer / ADV
  powered_by_bfo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tenant membership / roles
CREATE TABLE IF NOT EXISTS public.tenant_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT CHECK (role IN ('owner','admin','staff','viewer')) NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Fee models (per tenant)
CREATE TABLE IF NOT EXISTS public.fee_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  -- JSON: array of {breakpoint:number, advisory_bps:number, platform_bps:number, fund_bps:number, trading_flat:number}
  tiers JSONB NOT NULL DEFAULT '[]'::jsonb,
  default_model BOOLEAN DEFAULT false,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Fee scenarios (saved by users for households)
CREATE TABLE IF NOT EXISTS public.fee_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  household_id UUID, -- optional link to households table if exists
  title TEXT NOT NULL,
  current_fee_model_id UUID REFERENCES public.fee_models(id) ON DELETE SET NULL,
  proposed_fee_model_id UUID REFERENCES public.fee_models(id) ON DELETE SET NULL,
  -- JSON: {accounts:[{name, asset_class, value, tax_deferred:boolean}]}
  accounts JSONB NOT NULL DEFAULT '{"accounts":[]}'::jsonb,
  assumptions JSONB NOT NULL DEFAULT '{}'::jsonb, -- growth, turnover, horizon_years, etc.
  result_summary JSONB, -- cached result for quick load
  is_premium_only BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Public demo presets (read‑only for unauth landing/demo)
CREATE TABLE IF NOT EXISTS public.fee_demo_presets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL, -- "balanced-1m" etc
  title TEXT NOT NULL,
  accounts JSONB NOT NULL,
  demo_fee_model_current JSONB NOT NULL,
  demo_fee_model_proposed JSONB NOT NULL,
  assumptions JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Analytics events for QA tracking
CREATE TABLE IF NOT EXISTS public.fee_analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tenant_memberships_tenant ON public.tenant_memberships(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_memberships_user ON public.tenant_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_fee_models_tenant ON public.fee_models(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fee_scenarios_tenant ON public.fee_scenarios(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fee_scenarios_user ON public.fee_scenarios(user_id);
CREATE INDEX IF NOT EXISTS idx_fee_analytics_events_tenant ON public.fee_analytics_events(tenant_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON public.tenants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fee_models_updated_at BEFORE UPDATE ON public.fee_models
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fee_scenarios_updated_at BEFORE UPDATE ON public.fee_scenarios
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_demo_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_analytics_events ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "tenants readable by members" ON public.tenants
  FOR SELECT USING (EXISTS(SELECT 1 FROM public.tenant_memberships m WHERE m.tenant_id = tenants.id AND m.user_id = auth.uid()));

CREATE POLICY "tenants manageable by owners/admins" ON public.tenants
  FOR ALL USING (EXISTS(
    SELECT 1 FROM public.tenant_memberships m 
    WHERE m.tenant_id = tenants.id AND m.user_id = auth.uid() AND m.role IN ('owner','admin')
  ));

CREATE POLICY "tenants readable by public for branding" ON public.tenants
  FOR SELECT USING (true);

CREATE POLICY "memberships by user" ON public.tenant_memberships
  FOR SELECT USING (user_id = auth.uid() OR EXISTS(
    SELECT 1 FROM public.tenant_memberships m 
    WHERE m.tenant_id = tenant_memberships.tenant_id AND m.user_id = auth.uid() AND m.role IN ('owner','admin')
  ));

CREATE POLICY "memberships manageable by admins" ON public.tenant_memberships
  FOR ALL USING (EXISTS(
    SELECT 1 FROM public.tenant_memberships m 
    WHERE m.tenant_id = tenant_memberships.tenant_id AND m.user_id = auth.uid() AND m.role IN ('owner','admin')
  ));

CREATE POLICY "fee_models read by tenant members" ON public.fee_models
  FOR SELECT USING (EXISTS(SELECT 1 FROM public.tenant_memberships m WHERE m.tenant_id = fee_models.tenant_id AND m.user_id = auth.uid()));

CREATE POLICY "fee_models write by admins" ON public.fee_models
  FOR ALL USING (EXISTS(SELECT 1 FROM public.tenant_memberships m WHERE m.tenant_id = fee_models.tenant_id AND m.user_id = auth.uid() AND m.role IN ('owner','admin')));

CREATE POLICY "fee_scenarios read/write by owner or tenant admin" ON public.fee_scenarios
  FOR ALL USING (
    user_id = auth.uid() 
    OR EXISTS(SELECT 1 FROM public.tenant_memberships m WHERE m.tenant_id = fee_scenarios.tenant_id AND m.user_id = auth.uid() AND m.role IN ('owner','admin'))
  );

-- Demo presets are public read
CREATE POLICY "fee_demo_presets readable by all" ON public.fee_demo_presets
  FOR SELECT USING (true);

-- Analytics events
CREATE POLICY "fee_analytics_events by tenant" ON public.fee_analytics_events
  FOR ALL USING (
    user_id = auth.uid() 
    OR EXISTS(SELECT 1 FROM public.tenant_memberships m WHERE m.tenant_id = fee_analytics_events.tenant_id AND m.user_id = auth.uid() AND m.role IN ('owner','admin'))
  );

CREATE POLICY "fee_analytics_events insert public" ON public.fee_analytics_events
  FOR INSERT WITH CHECK (true);

-- Helper function: get_current_tenant_by_host (maps subdomain to tenant)
CREATE OR REPLACE FUNCTION public.get_current_tenant_by_host(host TEXT)
RETURNS UUID LANGUAGE sql STABLE AS $$
  SELECT id FROM public.tenants 
  WHERE slug = split_part(host, '.', 1) -- subdomain
  LIMIT 1
$$;

-- Function to log fee analytics events
CREATE OR REPLACE FUNCTION public.log_fee_event(
  p_event_type TEXT,
  p_payload JSONB DEFAULT '{}'::jsonb,
  p_tenant_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO public.fee_analytics_events (user_id, tenant_id, event_type, payload)
  VALUES (auth.uid(), p_tenant_id, p_event_type, p_payload)
  RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$;

-- Insert BFO default tenant
INSERT INTO public.tenants (slug, name, brand_primary, brand_secondary, brand_accent, powered_by_bfo)
VALUES ('bfo','Boutique Family Office','#0b1a33','#d4af37','#0ea5a5', true)
ON CONFLICT (slug) DO NOTHING;

-- Insert demo preset
INSERT INTO public.fee_demo_presets (slug, title, accounts, demo_fee_model_current, demo_fee_model_proposed, assumptions)
VALUES (
  'balanced-1m',
  'Balanced Household — $1,000,000 AUM',
  '{"accounts":[{"name":"Taxable Brokerage","value":600000},{"name":"IRA","value":300000},{"name":"Cash","value":100000}]}',
  '{"name":"Legacy Advisor","tiers":[{"breakpoint":0,"advisory_bps":120,"platform_bps":10,"fund_bps":35,"trading_flat":150}]}',
  '{"name":"BFO Proposal","tiers":[{"breakpoint":0,"advisory_bps":70,"platform_bps":0,"fund_bps":15,"trading_flat":0}]}',
  '{"growth_pct":5,"horizon_years":10,"turnover_pct":10}'
) ON CONFLICT (slug) DO NOTHING;

-- Make BFO a default fee model
INSERT INTO public.fee_models (tenant_id, name, description, tiers, default_model)
SELECT id, 'BFO Standard', 'Transparent, low-cost tiered pricing', '[{"breakpoint":0,"advisory_bps":70,"platform_bps":0,"fund_bps":15,"trading_flat":0}]'::jsonb, true
FROM public.tenants WHERE slug='bfo'
ON CONFLICT DO NOTHING;

-- Storage bucket for tenant branding
INSERT INTO storage.buckets (id, name, public) VALUES ('tenant-branding', 'tenant-branding', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Tenant branding files are publicly accessible" 
ON storage.objects FOR SELECT USING (bucket_id = 'tenant-branding');

CREATE POLICY "Tenant admins can upload branding files" 
ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'tenant-branding' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Tenant admins can update their branding files" 
ON storage.objects FOR UPDATE USING (
  bucket_id = 'tenant-branding' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Tenant admins can delete their branding files" 
ON storage.objects FOR DELETE USING (
  bucket_id = 'tenant-branding' 
  AND auth.uid() IS NOT NULL
);