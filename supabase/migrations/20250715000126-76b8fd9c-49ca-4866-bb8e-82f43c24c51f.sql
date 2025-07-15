-- Healthcare Database Schema
-- Complete schema for healthcare document management system

-- Healthcare documents table
CREATE TABLE IF NOT EXISTS public.healthcare_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'other',
  category TEXT NOT NULL DEFAULT 'medical',
  description TEXT,
  file_path TEXT,
  content_type TEXT,
  size BIGINT,
  tags TEXT[],
  is_private BOOLEAN DEFAULT true,
  shared BOOLEAN DEFAULT false,
  encrypted BOOLEAN DEFAULT false,
  is_folder BOOLEAN DEFAULT false,
  parent_folder_id UUID REFERENCES public.healthcare_documents(id),
  uploaded_by TEXT,
  modified TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Healthcare document permissions
CREATE TABLE IF NOT EXISTS public.healthcare_document_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.healthcare_documents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  granted_by_user_id UUID NOT NULL,
  access_level TEXT NOT NULL CHECK (access_level IN ('read', 'write', 'admin')),
  user_name TEXT,
  user_email TEXT,
  user_role TEXT,
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Health metrics table
CREATE TABLE IF NOT EXISTS public.health_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  value TEXT NOT NULL,
  unit TEXT,
  date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.healthcare_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.healthcare_document_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for healthcare_documents
CREATE POLICY "Users can view their own healthcare documents" ON public.healthcare_documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own healthcare documents" ON public.healthcare_documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own healthcare documents" ON public.healthcare_documents
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own healthcare documents" ON public.healthcare_documents
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for healthcare_document_permissions
CREATE POLICY "Users can view permissions for their documents" ON public.healthcare_document_permissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.healthcare_documents 
      WHERE id = document_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create permissions for their documents" ON public.healthcare_document_permissions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.healthcare_documents 
      WHERE id = document_id AND user_id = auth.uid()
    )
  );

-- RLS Policies for health_metrics
CREATE POLICY "Users can view their own health metrics" ON public.health_metrics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own health metrics" ON public.health_metrics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health metrics" ON public.health_metrics
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health metrics" ON public.health_metrics
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_healthcare_documents_user_id ON public.healthcare_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_healthcare_documents_type ON public.healthcare_documents(type);
CREATE INDEX IF NOT EXISTS idx_healthcare_documents_created_at ON public.healthcare_documents(created_at);
CREATE INDEX IF NOT EXISTS idx_health_metrics_user_id ON public.health_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_health_metrics_type ON public.health_metrics(type);
CREATE INDEX IF NOT EXISTS idx_health_metrics_date ON public.health_metrics(date);

-- Storage bucket for healthcare documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('healthcare-documents', 'healthcare-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload their own healthcare documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'healthcare-documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own healthcare documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'healthcare-documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own healthcare documents" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'healthcare-documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own healthcare documents" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'healthcare-documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );