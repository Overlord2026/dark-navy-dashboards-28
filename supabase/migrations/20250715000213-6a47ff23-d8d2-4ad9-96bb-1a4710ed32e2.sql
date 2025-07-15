-- Healthcare Database Schema
-- Complete schema for healthcare document management system

-- Healthcare documents table (if not exists)
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

-- Health metrics table (if not exists)
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_healthcare_documents_user_id ON public.healthcare_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_healthcare_documents_type ON public.healthcare_documents(type);
CREATE INDEX IF NOT EXISTS idx_healthcare_documents_created_at ON public.healthcare_documents(created_at);
CREATE INDEX IF NOT EXISTS idx_health_metrics_user_id ON public.health_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_health_metrics_type ON public.health_metrics(type);
CREATE INDEX IF NOT EXISTS idx_health_metrics_date ON public.health_metrics(date);