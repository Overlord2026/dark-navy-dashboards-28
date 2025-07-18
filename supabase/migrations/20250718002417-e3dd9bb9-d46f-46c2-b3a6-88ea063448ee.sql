-- Create analytics events table to track user actions
CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id),
  user_id UUID,
  event_type TEXT NOT NULL,
  event_category TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  session_id TEXT,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create daily analytics aggregations table
CREATE TABLE public.daily_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id),
  date DATE NOT NULL,
  total_users INTEGER DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  avg_session_duration NUMERIC DEFAULT 0,
  page_views INTEGER DEFAULT 0,
  advisor_logins INTEGER DEFAULT 0,
  client_logins INTEGER DEFAULT 0,
  new_advisors INTEGER DEFAULT 0,
  new_clients INTEGER DEFAULT 0,
  advisor_onboarding_completed INTEGER DEFAULT 0,
  client_onboarding_completed INTEGER DEFAULT 0,
  conversion_rate NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, date)
);

-- Create user onboarding tracking table
CREATE TABLE public.user_onboarding_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tenant_id UUID REFERENCES public.tenants(id),
  user_type TEXT NOT NULL CHECK (user_type IN ('advisor', 'client')),
  step_name TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, step_name)
);

-- Enable RLS on analytics tables
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_onboarding_progress ENABLE ROW LEVEL SECURITY;

-- RLS policies for analytics_events
CREATE POLICY "Tenant users can view their events" ON public.analytics_events
  FOR SELECT USING (
    tenant_id = (SELECT tenant_id FROM profiles WHERE id = auth.uid())
    OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'system_administrator'
  );

CREATE POLICY "Service role can insert events" ON public.analytics_events
  FOR INSERT WITH CHECK (true);

-- RLS policies for daily_analytics  
CREATE POLICY "Tenant admins can view their analytics" ON public.daily_analytics
  FOR SELECT USING (
    tenant_id = (SELECT tenant_id FROM profiles WHERE id = auth.uid())
    OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'system_administrator'
  );

CREATE POLICY "Service role can manage analytics" ON public.daily_analytics
  FOR ALL WITH CHECK (true);

-- RLS policies for user_onboarding_progress
CREATE POLICY "Users can view their tenant onboarding data" ON public.user_onboarding_progress
  FOR SELECT USING (
    tenant_id = (SELECT tenant_id FROM profiles WHERE id = auth.uid())
    OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'system_administrator'
  );

CREATE POLICY "Users can create their own onboarding progress" ON public.user_onboarding_progress
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own onboarding progress" ON public.user_onboarding_progress
  FOR UPDATE USING (user_id = auth.uid());

-- Add updated_at triggers
CREATE TRIGGER update_daily_analytics_updated_at
  BEFORE UPDATE ON public.daily_analytics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_onboarding_progress_updated_at
  BEFORE UPDATE ON public.user_onboarding_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX idx_analytics_events_tenant_date ON public.analytics_events(tenant_id, created_at);
CREATE INDEX idx_analytics_events_event_type ON public.analytics_events(event_type);
CREATE INDEX idx_daily_analytics_tenant_date ON public.daily_analytics(tenant_id, date);
CREATE INDEX idx_user_onboarding_tenant_user ON public.user_onboarding_progress(tenant_id, user_id);