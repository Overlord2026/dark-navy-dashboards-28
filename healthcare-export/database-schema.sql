-- Healthcare Module Database Schema
-- Run this in your Supabase SQL editor

-- Health Metrics Table
CREATE TABLE IF NOT EXISTS public.health_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  value TEXT NOT NULL,
  unit TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Healthcare Documents Table
CREATE TABLE IF NOT EXISTS public.healthcare_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  file_path TEXT,
  content_type TEXT,
  size BIGINT,
  is_private BOOLEAN DEFAULT true,
  shared BOOLEAN DEFAULT false,
  tags TEXT[],
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Healthcare Providers Table
CREATE TABLE IF NOT EXISTS public.healthcare_providers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  specialty TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Health Goals Table
CREATE TABLE IF NOT EXISTS public.health_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  target_value TEXT,
  current_value TEXT,
  target_date DATE,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Health Alerts Table
CREATE TABLE IF NOT EXISTS public.health_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('appointment', 'medication', 'test', 'general')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'dismissed', 'resolved')),
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.healthcare_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.healthcare_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for health_metrics
CREATE POLICY "Users can manage their own health metrics" ON public.health_metrics
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for healthcare_documents
CREATE POLICY "Users can manage their own healthcare documents" ON public.healthcare_documents
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for healthcare_providers
CREATE POLICY "Users can manage their own healthcare providers" ON public.healthcare_providers
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for health_goals
CREATE POLICY "Users can manage their own health goals" ON public.health_goals
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for health_alerts
CREATE POLICY "Users can manage their own health alerts" ON public.health_alerts
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_health_metrics_user_date ON public.health_metrics(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_health_metrics_type ON public.health_metrics(type);
CREATE INDEX IF NOT EXISTS idx_healthcare_documents_user_category ON public.healthcare_documents(user_id, category);
CREATE INDEX IF NOT EXISTS idx_healthcare_providers_user_specialty ON public.healthcare_providers(user_id, specialty);
CREATE INDEX IF NOT EXISTS idx_health_goals_user_status ON public.health_goals(user_id, status);
CREATE INDEX IF NOT EXISTS idx_health_alerts_user_status ON public.health_alerts(user_id, status);

-- Storage setup
INSERT INTO storage.buckets (id, name, public) 
VALUES ('healthcare-documents', 'healthcare-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload their healthcare files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'healthcare-documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their healthcare files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'healthcare-documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their healthcare files" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'healthcare-documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their healthcare files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'healthcare-documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
DROP TRIGGER IF EXISTS update_health_metrics_updated_at ON public.health_metrics;
CREATE TRIGGER update_health_metrics_updated_at
  BEFORE UPDATE ON public.health_metrics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_healthcare_documents_updated_at ON public.healthcare_documents;
CREATE TRIGGER update_healthcare_documents_updated_at
  BEFORE UPDATE ON public.healthcare_documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_healthcare_providers_updated_at ON public.healthcare_providers;
CREATE TRIGGER update_healthcare_providers_updated_at
  BEFORE UPDATE ON public.healthcare_providers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_health_goals_updated_at ON public.health_goals;
CREATE TRIGGER update_health_goals_updated_at
  BEFORE UPDATE ON public.health_goals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE public.health_metrics IS 'Stores user health metrics and measurements';
COMMENT ON TABLE public.healthcare_documents IS 'Stores healthcare document metadata and file references';
COMMENT ON TABLE public.healthcare_providers IS 'Stores user healthcare provider information';
COMMENT ON TABLE public.health_goals IS 'Stores user health goals and targets';
COMMENT ON TABLE public.health_alerts IS 'Stores health-related alerts and notifications';

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;