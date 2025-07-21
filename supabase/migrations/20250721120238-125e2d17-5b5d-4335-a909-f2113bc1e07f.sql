-- Cross-Platform Integration System
-- API Integration Framework
CREATE TABLE public.api_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  
  -- Integration details
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'rest', 'graphql', 'soap', 'webhook'
  provider TEXT NOT NULL, -- 'slack', 'microsoft', 'google', 'custom'
  status TEXT NOT NULL DEFAULT 'inactive', -- 'active', 'inactive', 'error', 'pending'
  
  -- API Configuration
  base_url TEXT NOT NULL,
  auth_type TEXT NOT NULL DEFAULT 'none', -- 'none', 'api_key', 'oauth2', 'bearer', 'basic'
  auth_config JSONB NOT NULL DEFAULT '{}',
  headers JSONB NOT NULL DEFAULT '{}',
  rate_limit_per_minute INTEGER DEFAULT 60,
  timeout_seconds INTEGER DEFAULT 30,
  
  -- Data mapping and transformation
  data_mapping JSONB NOT NULL DEFAULT '{}',
  field_mappings JSONB NOT NULL DEFAULT '[]',
  transformation_rules JSONB NOT NULL DEFAULT '[]',
  
  -- Sync configuration
  sync_enabled BOOLEAN NOT NULL DEFAULT false,
  sync_frequency TEXT DEFAULT 'manual', -- 'manual', 'realtime', 'hourly', 'daily', 'weekly'
  last_sync_at TIMESTAMP WITH TIME ZONE,
  next_sync_at TIMESTAMP WITH TIME ZONE,
  sync_direction TEXT DEFAULT 'bidirectional', -- 'inbound', 'outbound', 'bidirectional'
  
  -- Health monitoring
  health_status TEXT DEFAULT 'unknown', -- 'healthy', 'degraded', 'unhealthy', 'unknown'
  last_health_check TIMESTAMP WITH TIME ZONE,
  error_count INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  last_error_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Webhook Management System
CREATE TABLE public.webhooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  integration_id UUID REFERENCES public.api_integrations(id) ON DELETE CASCADE,
  
  -- Webhook details
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  secret TEXT,
  method TEXT NOT NULL DEFAULT 'POST',
  
  -- Event configuration
  events TEXT[] NOT NULL DEFAULT '{}', -- events to listen for
  filters JSONB NOT NULL DEFAULT '{}', -- conditions for webhook firing
  
  -- Delivery configuration
  headers JSONB NOT NULL DEFAULT '{}',
  timeout_seconds INTEGER DEFAULT 30,
  retry_attempts INTEGER DEFAULT 3,
  retry_backoff TEXT DEFAULT 'exponential', -- 'linear', 'exponential'
  
  -- Status and health
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'inactive', 'error'
  last_triggered_at TIMESTAMP WITH TIME ZONE,
  success_count INTEGER NOT NULL DEFAULT 0,
  failure_count INTEGER NOT NULL DEFAULT 0,
  
  -- Security
  verify_ssl BOOLEAN NOT NULL DEFAULT true,
  ip_whitelist TEXT[],
  
  -- Metadata
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Webhook Delivery Logs
CREATE TABLE public.webhook_deliveries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  webhook_id UUID NOT NULL REFERENCES public.webhooks(id) ON DELETE CASCADE,
  
  -- Delivery details
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  
  -- Request details
  url TEXT NOT NULL,
  method TEXT NOT NULL,
  headers JSONB NOT NULL DEFAULT '{}',
  
  -- Response details
  status_code INTEGER,
  response_body TEXT,
  response_headers JSONB,
  
  -- Timing and attempts
  attempted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_ms INTEGER,
  attempt_number INTEGER NOT NULL DEFAULT 1,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'success', 'failed', 'retrying'
  error_message TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- External Tool Connectors
CREATE TABLE public.tool_connectors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  
  -- Tool details
  tool_name TEXT NOT NULL, -- 'jira', 'asana', 'trello', 'github', 'gitlab', 'slack', 'teams'
  tool_type TEXT NOT NULL, -- 'project_management', 'communication', 'development', 'crm', 'analytics'
  connector_version TEXT NOT NULL DEFAULT '1.0',
  
  -- Connection details
  connection_status TEXT NOT NULL DEFAULT 'disconnected', -- 'connected', 'disconnected', 'error', 'pending'
  connection_config JSONB NOT NULL DEFAULT '{}',
  credentials_encrypted TEXT, -- encrypted credentials
  
  -- Sync configuration
  sync_projects BOOLEAN NOT NULL DEFAULT false,
  sync_tasks BOOLEAN NOT NULL DEFAULT false,
  sync_users BOOLEAN NOT NULL DEFAULT false,
  sync_comments BOOLEAN NOT NULL DEFAULT false,
  sync_files BOOLEAN NOT NULL DEFAULT false,
  
  -- Field mapping
  project_field_map JSONB NOT NULL DEFAULT '{}',
  task_field_map JSONB NOT NULL DEFAULT '{}',
  user_field_map JSONB NOT NULL DEFAULT '{}',
  
  -- Sync status
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_in_progress BOOLEAN NOT NULL DEFAULT false,
  sync_errors JSONB,
  
  -- Metadata
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Data Sync Engine
CREATE TABLE public.sync_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  integration_id UUID REFERENCES public.api_integrations(id) ON DELETE CASCADE,
  
  -- Job details
  job_type TEXT NOT NULL, -- 'full_sync', 'incremental_sync', 'webhook_triggered'
  entity_type TEXT NOT NULL, -- 'projects', 'tasks', 'users', 'comments', 'files'
  direction TEXT NOT NULL, -- 'inbound', 'outbound', 'bidirectional'
  
  -- Job configuration
  batch_size INTEGER DEFAULT 100,
  filters JSONB NOT NULL DEFAULT '{}',
  
  -- Job status
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed', 'cancelled'
  progress_percentage INTEGER DEFAULT 0,
  records_processed INTEGER DEFAULT 0,
  records_total INTEGER,
  records_success INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  
  -- Timing
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_ms INTEGER,
  
  -- Results
  result_summary JSONB,
  error_details JSONB,
  conflicts_resolved JSONB,
  
  -- Metadata
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Data Conflict Resolution
CREATE TABLE public.sync_conflicts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sync_job_id UUID NOT NULL REFERENCES public.sync_jobs(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL,
  
  -- Conflict details
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  external_entity_id TEXT,
  
  -- Conflict data
  local_data JSONB NOT NULL,
  external_data JSONB NOT NULL,
  conflicting_fields TEXT[] NOT NULL,
  
  -- Resolution
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'resolved_local', 'resolved_external', 'resolved_manual'
  resolution_strategy TEXT, -- 'latest_wins', 'manual', 'local_priority', 'external_priority'
  resolved_data JSONB,
  resolved_by UUID,
  resolved_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Integration Marketplace
CREATE TABLE public.integration_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Template details
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'project_management', 'communication', 'crm', 'analytics', 'development'
  provider TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT '1.0',
  
  -- Template configuration
  template_config JSONB NOT NULL,
  default_mappings JSONB NOT NULL DEFAULT '{}',
  required_credentials TEXT[] NOT NULL DEFAULT '{}',
  supported_features TEXT[] NOT NULL DEFAULT '{}',
  
  -- Marketplace info
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  rating NUMERIC(3,2) DEFAULT 0,
  install_count INTEGER DEFAULT 0,
  
  -- Documentation
  setup_instructions TEXT,
  documentation_url TEXT,
  support_url TEXT,
  
  -- Metadata
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Integration Usage Analytics
CREATE TABLE public.integration_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  integration_id UUID NOT NULL REFERENCES public.api_integrations(id) ON DELETE CASCADE,
  
  -- Usage metrics
  date DATE NOT NULL,
  api_calls_count INTEGER NOT NULL DEFAULT 0,
  data_synced_kb INTEGER NOT NULL DEFAULT 0,
  webhooks_received INTEGER NOT NULL DEFAULT 0,
  sync_jobs_run INTEGER NOT NULL DEFAULT 0,
  
  -- Performance metrics
  avg_response_time_ms INTEGER,
  error_rate_percentage NUMERIC(5,2) DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(tenant_id, integration_id, date)
);

-- Create indexes for performance
CREATE INDEX idx_api_integrations_tenant_id ON public.api_integrations(tenant_id);
CREATE INDEX idx_api_integrations_status ON public.api_integrations(status);
CREATE INDEX idx_api_integrations_next_sync ON public.api_integrations(next_sync_at) WHERE sync_enabled = true;

CREATE INDEX idx_webhooks_tenant_id ON public.webhooks(tenant_id);
CREATE INDEX idx_webhooks_integration_id ON public.webhooks(integration_id);
CREATE INDEX idx_webhooks_status ON public.webhooks(status);

CREATE INDEX idx_webhook_deliveries_webhook_id ON public.webhook_deliveries(webhook_id);
CREATE INDEX idx_webhook_deliveries_status ON public.webhook_deliveries(status);
CREATE INDEX idx_webhook_deliveries_attempted_at ON public.webhook_deliveries(attempted_at);

CREATE INDEX idx_tool_connectors_tenant_id ON public.tool_connectors(tenant_id);
CREATE INDEX idx_tool_connectors_tool_name ON public.tool_connectors(tool_name);
CREATE INDEX idx_tool_connectors_status ON public.tool_connectors(connection_status);

CREATE INDEX idx_sync_jobs_tenant_id ON public.sync_jobs(tenant_id);
CREATE INDEX idx_sync_jobs_integration_id ON public.sync_jobs(integration_id);
CREATE INDEX idx_sync_jobs_status ON public.sync_jobs(status);
CREATE INDEX idx_sync_jobs_created_at ON public.sync_jobs(created_at);

CREATE INDEX idx_sync_conflicts_sync_job_id ON public.sync_conflicts(sync_job_id);
CREATE INDEX idx_sync_conflicts_status ON public.sync_conflicts(status);

CREATE INDEX idx_integration_templates_category ON public.integration_templates(category);
CREATE INDEX idx_integration_templates_featured ON public.integration_templates(is_featured);

CREATE INDEX idx_integration_usage_tenant_id ON public.integration_usage(tenant_id);
CREATE INDEX idx_integration_usage_date ON public.integration_usage(date);

-- RLS Policies
ALTER TABLE public.api_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_connectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_conflicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_usage ENABLE ROW LEVEL SECURITY;

-- API Integrations Policies
CREATE POLICY "Users can manage integrations in their tenant"
  ON public.api_integrations FOR ALL
  USING (tenant_id = get_current_user_tenant_id());

-- Webhooks Policies
CREATE POLICY "Users can manage webhooks in their tenant"
  ON public.webhooks FOR ALL
  USING (tenant_id = get_current_user_tenant_id());

-- Webhook Deliveries Policies
CREATE POLICY "Users can view webhook deliveries for their webhooks"
  ON public.webhook_deliveries FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.webhooks 
    WHERE webhooks.id = webhook_deliveries.webhook_id 
    AND webhooks.tenant_id = get_current_user_tenant_id()
  ));

-- Tool Connectors Policies
CREATE POLICY "Users can manage tool connectors in their tenant"
  ON public.tool_connectors FOR ALL
  USING (tenant_id = get_current_user_tenant_id());

-- Sync Jobs Policies
CREATE POLICY "Users can view sync jobs in their tenant"
  ON public.sync_jobs FOR SELECT
  USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "System can manage sync jobs"
  ON public.sync_jobs FOR ALL
  USING (tenant_id = get_current_user_tenant_id());

-- Sync Conflicts Policies
CREATE POLICY "Users can manage sync conflicts in their tenant"
  ON public.sync_conflicts FOR ALL
  USING (tenant_id = get_current_user_tenant_id());

-- Integration Templates Policies (public read)
CREATE POLICY "Anyone can view integration templates"
  ON public.integration_templates FOR SELECT
  USING (true);

-- Integration Usage Policies
CREATE POLICY "Users can view integration usage for their tenant"
  ON public.integration_usage FOR SELECT
  USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "System can manage integration usage"
  ON public.integration_usage FOR ALL
  USING (tenant_id = get_current_user_tenant_id());

-- Enable realtime for key tables
ALTER TABLE public.api_integrations REPLICA IDENTITY FULL;
ALTER TABLE public.webhooks REPLICA IDENTITY FULL;
ALTER TABLE public.sync_jobs REPLICA IDENTITY FULL;
ALTER TABLE public.sync_conflicts REPLICA IDENTITY FULL;