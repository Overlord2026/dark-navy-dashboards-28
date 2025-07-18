-- Create webhook configurations table
CREATE TABLE public.webhook_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  secret_key TEXT,
  is_active BOOLEAN DEFAULT true,
  events TEXT[] NOT NULL DEFAULT '{}',
  headers JSONB DEFAULT '{}',
  retry_attempts INTEGER DEFAULT 3,
  timeout_seconds INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- Create webhook delivery logs table
CREATE TABLE public.webhook_deliveries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  webhook_config_id UUID REFERENCES public.webhook_configs(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.analytics_events(id),
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  response_status INTEGER,
  response_body TEXT,
  error_message TEXT,
  attempt_number INTEGER DEFAULT 1,
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create CRM integration settings table
CREATE TABLE public.crm_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id),
  integration_type TEXT NOT NULL CHECK (integration_type IN ('gohighlevel', 'hubspot', 'salesforce', 'pipedrive', 'custom')),
  is_active BOOLEAN DEFAULT true,
  api_endpoint TEXT,
  api_key_encrypted TEXT,
  settings JSONB DEFAULT '{}',
  field_mappings JSONB DEFAULT '{}',
  sync_frequency TEXT DEFAULT 'realtime' CHECK (sync_frequency IN ('realtime', 'hourly', 'daily')),
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, integration_type)
);

-- Create event tracking table for key actions
CREATE TABLE public.tracked_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id),
  user_id UUID,
  event_type TEXT NOT NULL,
  event_name TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  source TEXT DEFAULT 'app',
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.webhook_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracked_events ENABLE ROW LEVEL SECURITY;

-- RLS policies for webhook_configs
CREATE POLICY "Tenant admins can manage webhook configs" ON public.webhook_configs
  FOR ALL USING (
    tenant_id = (SELECT tenant_id FROM profiles WHERE id = auth.uid())
    AND (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'tenant_admin')
  );

CREATE POLICY "Super admins can manage all webhook configs" ON public.webhook_configs
  FOR ALL USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'system_administrator'
  );

-- RLS policies for webhook_deliveries
CREATE POLICY "Tenant admins can view webhook deliveries" ON public.webhook_deliveries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM webhook_configs 
      WHERE webhook_configs.id = webhook_deliveries.webhook_config_id 
      AND webhook_configs.tenant_id = (SELECT tenant_id FROM profiles WHERE id = auth.uid())
    )
    AND (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'tenant_admin')
  );

CREATE POLICY "Super admins can view all webhook deliveries" ON public.webhook_deliveries
  FOR SELECT USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'system_administrator'
  );

-- RLS policies for crm_integrations
CREATE POLICY "Tenant admins can manage CRM integrations" ON public.crm_integrations
  FOR ALL USING (
    tenant_id = (SELECT tenant_id FROM profiles WHERE id = auth.uid())
    AND (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'tenant_admin')
  );

CREATE POLICY "Super admins can manage all CRM integrations" ON public.crm_integrations
  FOR ALL USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'system_administrator'
  );

-- RLS policies for tracked_events
CREATE POLICY "Users can view their tenant events" ON public.tracked_events
  FOR SELECT USING (
    tenant_id = (SELECT tenant_id FROM profiles WHERE id = auth.uid())
    OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'system_administrator'
  );

CREATE POLICY "Service role can insert events" ON public.tracked_events
  FOR INSERT WITH CHECK (true);

-- Add updated_at triggers
CREATE TRIGGER update_webhook_configs_updated_at
  BEFORE UPDATE ON public.webhook_configs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crm_integrations_updated_at
  BEFORE UPDATE ON public.crm_integrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_webhook_configs_tenant ON public.webhook_configs(tenant_id);
CREATE INDEX idx_webhook_configs_events ON public.webhook_configs USING GIN(events);
CREATE INDEX idx_webhook_deliveries_config ON public.webhook_deliveries(webhook_config_id);
CREATE INDEX idx_webhook_deliveries_event ON public.webhook_deliveries(event_type, created_at);
CREATE INDEX idx_crm_integrations_tenant ON public.crm_integrations(tenant_id);
CREATE INDEX idx_tracked_events_tenant_type ON public.tracked_events(tenant_id, event_type);
CREATE INDEX idx_tracked_events_created ON public.tracked_events(created_at);

-- Insert some default event types
INSERT INTO public.tracked_events (tenant_id, user_id, event_type, event_name, event_data) VALUES
  (NULL, NULL, 'system', 'webhook_system_initialized', '{"version": "1.0", "features": ["webhooks", "crm_sync", "event_tracking"]}')
ON CONFLICT DO NOTHING;