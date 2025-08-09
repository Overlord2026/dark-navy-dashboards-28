-- Create analytics_events table for tracking user interactions
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event TEXT NOT NULL,
  path TEXT,
  ts TIMESTAMPTZ NOT NULL DEFAULT now(),
  props JSONB NOT NULL DEFAULT '{}'::jsonb,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_event ON public.analytics_events(event);
CREATE INDEX IF NOT EXISTS idx_analytics_events_ts ON public.analytics_events(ts DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_path ON public.analytics_events(path);

-- Enable RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to read analytics
CREATE POLICY "read_analytics_admins"
  ON public.analytics_events FOR SELECT
  USING (
    auth.role() = 'service_role' OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('system_administrator', 'admin', 'tenant_admin')
    )
  );

-- Create policy for service role to insert (for edge function)
CREATE POLICY "insert_analytics_service"
  ON public.analytics_events FOR INSERT
  WITH CHECK (auth.role() = 'service_role');