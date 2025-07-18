-- Add comprehensive composite indexes for high-traffic tables (corrected)

-- Analytics Events: User + Tenant + Date composite index for user activity queries
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_tenant_date 
ON public.analytics_events(user_id, tenant_id, created_at);

-- Analytics Events: Event category + type for filtering
CREATE INDEX IF NOT EXISTS idx_analytics_events_category_type_date 
ON public.analytics_events(event_category, event_type, created_at);

-- Tracked Events: User + Event Type + Created (for user activity tracking)
CREATE INDEX IF NOT EXISTS idx_tracked_events_user_type_created 
ON public.tracked_events(user_id, event_type, created_at);

-- Webhook Deliveries: Status + Retry for failure handling
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_status_retry 
ON public.webhook_deliveries(status, retry_count, next_retry_at);

-- Webhook Deliveries: Config + Status for monitoring
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_config_status_date 
ON public.webhook_deliveries(webhook_config_id, status, created_at);

-- Professionals: Tenant + Type for filtered browsing
CREATE INDEX IF NOT EXISTS idx_professionals_tenant_type 
ON public.professionals(tenant_id, type);

-- Professionals: User + Tenant for user's professional listings
CREATE INDEX IF NOT EXISTS idx_professionals_user_tenant 
ON public.professionals(user_id, tenant_id);

-- Documents: User + Tenant + Category for document browsing
CREATE INDEX IF NOT EXISTS idx_documents_user_tenant_category 
ON public.documents(user_id, tenant_id, category);

-- Documents: Tenant + Type + Created for tenant document management
CREATE INDEX IF NOT EXISTS idx_documents_tenant_type_created 
ON public.documents(tenant_id, type, created_at);

-- Documents: Parent folder + Name for folder browsing
CREATE INDEX IF NOT EXISTS idx_documents_folder_name 
ON public.documents(parent_folder_id, name) WHERE parent_folder_id IS NOT NULL;

-- Investment Strategies: Tenant + Visibility + Risk for strategy filtering
CREATE INDEX IF NOT EXISTS idx_strategies_tenant_visible_risk 
ON public.investment_strategies(tenant_id, is_visible, risk_level);

-- Investment Strategies: Strategy type + Risk for category browsing
CREATE INDEX IF NOT EXISTS idx_strategies_type_risk_visible 
ON public.investment_strategies(strategy_type, risk_level, is_visible);

-- Educational Content: Tenant + Visibility + Type for content browsing
CREATE INDEX IF NOT EXISTS idx_educational_content_tenant_visible_type 
ON public.educational_content(tenant_id, is_visible, content_type);

-- Profiles: Tenant + Role for admin queries
CREATE INDEX IF NOT EXISTS idx_profiles_tenant_role 
ON public.profiles(tenant_id, role);

-- Daily Analytics: Tenant + Date for reporting
CREATE INDEX IF NOT EXISTS idx_daily_analytics_tenant_date 
ON public.daily_analytics(tenant_id, date);

-- Advisor Applications: Tenant + Status for application management (corrected column name)
CREATE INDEX IF NOT EXISTS idx_advisor_applications_tenant_status 
ON public.advisor_applications(tenant_id, status);