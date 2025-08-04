-- Plan Import and Migration Tracking Tables

-- Store imported plan data before processing
CREATE TABLE public.plan_imports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  advisor_id UUID NOT NULL REFERENCES auth.users(id),
  import_type TEXT NOT NULL CHECK (import_type IN ('csv', 'xlsx', 'pdf')),
  original_filename TEXT NOT NULL,
  file_path TEXT,
  raw_data JSONB,
  parsed_data JSONB,
  field_mapping JSONB,
  import_status TEXT NOT NULL DEFAULT 'pending' CHECK (import_status IN ('pending', 'parsing', 'review', 'approved', 'imported', 'failed')),
  client_count INTEGER DEFAULT 0,
  error_log TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Track migration progress for each advisor
CREATE TABLE public.advisor_migration_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  advisor_id UUID NOT NULL REFERENCES auth.users(id) UNIQUE,
  total_clients_to_migrate INTEGER DEFAULT 0,
  clients_migrated INTEGER DEFAULT 0,
  migration_started_at TIMESTAMP WITH TIME ZONE,
  migration_completed_at TIMESTAMP WITH TIME ZONE,
  previous_platform TEXT,
  migration_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Store individual client migration records
CREATE TABLE public.client_migration_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  advisor_id UUID NOT NULL REFERENCES auth.users(id),
  import_id UUID REFERENCES public.plan_imports(id),
  client_name TEXT NOT NULL,
  client_email TEXT,
  original_plan_data JSONB,
  migrated_plan_data JSONB,
  migration_status TEXT NOT NULL DEFAULT 'pending' CHECK (migration_status IN ('pending', 'review', 'migrated', 'failed')),
  migration_notes TEXT,
  migrated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Audit log for compliance tracking
CREATE TABLE public.plan_import_audit (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  advisor_id UUID NOT NULL REFERENCES auth.users(id),
  import_id UUID REFERENCES public.plan_imports(id),
  action_type TEXT NOT NULL,
  action_details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.plan_imports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisor_migration_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_migration_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_import_audit ENABLE ROW LEVEL SECURITY;

-- RLS Policies for plan_imports
CREATE POLICY "Advisors can manage their own imports" 
ON public.plan_imports 
FOR ALL 
USING (auth.uid() = advisor_id);

-- RLS Policies for advisor_migration_status
CREATE POLICY "Advisors can view their own migration status" 
ON public.advisor_migration_status 
FOR ALL 
USING (auth.uid() = advisor_id);

-- RLS Policies for client_migration_records
CREATE POLICY "Advisors can manage their own client migrations" 
ON public.client_migration_records 
FOR ALL 
USING (auth.uid() = advisor_id);

-- RLS Policies for plan_import_audit
CREATE POLICY "Advisors can view their own audit logs" 
ON public.plan_import_audit 
FOR SELECT 
USING (auth.uid() = advisor_id);

-- Create storage bucket for uploaded files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('plan-imports', 'plan-imports', false);

-- Storage policies for plan imports
CREATE POLICY "Advisors can upload their own plan files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'plan-imports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Advisors can view their own plan files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'plan-imports' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add triggers for updated_at
CREATE TRIGGER update_plan_imports_updated_at
  BEFORE UPDATE ON public.plan_imports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_advisor_migration_status_updated_at
  BEFORE UPDATE ON public.advisor_migration_status
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_migration_records_updated_at
  BEFORE UPDATE ON public.client_migration_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();