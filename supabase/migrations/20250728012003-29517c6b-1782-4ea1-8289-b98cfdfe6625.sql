-- Add subscription and access control columns to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'basic';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_active BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Add-on access flags
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS lending_access BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tax_access BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS ai_features_access BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS premium_analytics_access BOOLEAN DEFAULT false;

-- Usage counters
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS lending_applications_used INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tax_analyses_used INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS ai_queries_used INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS document_uploads_used INTEGER DEFAULT 0;

-- Usage limits
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS lending_applications_limit INTEGER DEFAULT 3;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tax_analyses_limit INTEGER DEFAULT 5;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS ai_queries_limit INTEGER DEFAULT 20;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS document_uploads_limit INTEGER DEFAULT 10;

-- Create subscription analytics table
CREATE TABLE IF NOT EXISTS public.subscription_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'upgrade', 'downgrade', 'addon_purchase', 'usage_limit_reached', 'feature_accessed'
  feature_name TEXT,
  subscription_tier TEXT,
  add_on_type TEXT,
  usage_count INTEGER,
  revenue_impact NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);

-- Enable RLS on subscription analytics
ALTER TABLE public.subscription_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for subscription analytics
CREATE POLICY "Users can view their own subscription analytics" ON public.subscription_analytics
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Service role can manage subscription analytics" ON public.subscription_analytics
FOR ALL USING (auth.role() = 'service_role');

-- Create function to track subscription events
CREATE OR REPLACE FUNCTION public.track_subscription_event(
  p_user_id UUID,
  p_event_type TEXT,
  p_feature_name TEXT DEFAULT NULL,
  p_subscription_tier TEXT DEFAULT NULL,
  p_add_on_type TEXT DEFAULT NULL,
  p_usage_count INTEGER DEFAULT NULL,
  p_revenue_impact NUMERIC DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO public.subscription_analytics (
    user_id, event_type, feature_name, subscription_tier, 
    add_on_type, usage_count, revenue_impact, metadata
  ) VALUES (
    p_user_id, p_event_type, p_feature_name, p_subscription_tier,
    p_add_on_type, p_usage_count, p_revenue_impact, p_metadata
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$;