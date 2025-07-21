-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'active', 'completed', 'on_hold', 'cancelled')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  vertical TEXT NOT NULL DEFAULT 'other' CHECK (vertical IN ('estate_planning', 'tax_strategy', 'investment_management', 'healthcare_planning', 'property_management', 'philanthropy', 'family_governance', 'risk_management', 'education_planning', 'business_succession', 'lifestyle_management', 'other')),
  progress NUMERIC DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  start_date DATE,
  due_date DATE,
  completed_date DATE,
  
  -- Team assignments
  project_lead_id UUID,
  
  -- Financial tracking
  budget NUMERIC DEFAULT 0,
  estimated_hours NUMERIC DEFAULT 0,
  actual_hours NUMERIC DEFAULT 0,
  
  -- Context
  family_id UUID,
  client_id UUID NOT NULL,
  tenant_id UUID NOT NULL DEFAULT get_current_user_tenant_id(),
  created_by UUID NOT NULL,
  
  -- Metadata
  tags TEXT[] DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create project milestones table
CREATE TABLE public.project_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_date DATE,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  
  -- Deliverables and dependencies
  deliverables TEXT[] DEFAULT '{}',
  dependencies UUID[] DEFAULT '{}', -- Other milestone IDs
  
  -- Team assignment
  assigned_team UUID[] DEFAULT '{}', -- Professional IDs
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create project tasks table
CREATE TABLE public.project_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  milestone_id UUID REFERENCES public.project_milestones(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'blocked', 'completed')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  
  -- Assignment and timing
  assigned_to UUID, -- Professional ID
  due_date DATE,
  estimated_hours NUMERIC DEFAULT 0,
  actual_hours NUMERIC DEFAULT 0,
  
  -- Metadata
  tags TEXT[] DEFAULT '{}',
  
  -- Context
  created_by UUID NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create project communications table
CREATE TABLE public.project_communications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'message' CHECK (type IN ('message', 'meeting', 'email', 'note', 'update', 'announcement')),
  subject TEXT,
  content TEXT NOT NULL,
  
  -- Participants and visibility
  participants UUID[] DEFAULT '{}', -- User IDs
  mentions UUID[] DEFAULT '{}', -- User IDs mentioned in content
  
  -- Threading
  parent_id UUID REFERENCES public.project_communications(id) ON DELETE SET NULL,
  thread_count INTEGER DEFAULT 0,
  
  -- Attachments and metadata
  attachments UUID[] DEFAULT '{}', -- Document IDs
  tags TEXT[] DEFAULT '{}',
  is_pinned BOOLEAN DEFAULT false,
  
  -- Context
  created_by UUID NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create project documents table
CREATE TABLE public.project_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  
  -- Access control
  is_confidential BOOLEAN DEFAULT false,
  access_level TEXT NOT NULL DEFAULT 'team' CHECK (access_level IN ('public', 'team', 'leads_only', 'confidential')),
  
  -- Organization
  folder_path TEXT DEFAULT '/',
  tags TEXT[] DEFAULT '{}',
  version INTEGER DEFAULT 1,
  
  -- Context
  uploaded_by UUID NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create project team assignments table
CREATE TABLE public.project_team_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL, -- References professionals table
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('lead', 'member', 'consultant', 'observer')),
  permissions TEXT[] DEFAULT '{"read"}',
  
  -- Assignment context
  assigned_by UUID NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(project_id, professional_id)
);

-- Create project activity log table for audit trail
CREATE TABLE public.project_activity_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  description TEXT NOT NULL,
  entity_type TEXT, -- 'task', 'milestone', 'document', etc.
  entity_id UUID,
  
  -- Changes tracking
  old_values JSONB,
  new_values JSONB,
  
  -- Context
  created_by UUID NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_team_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects
CREATE POLICY "Users can view projects in their tenant" ON public.projects
  FOR SELECT USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can create projects in their tenant" ON public.projects
  FOR INSERT WITH CHECK (tenant_id = get_current_user_tenant_id() AND client_id = auth.uid());

CREATE POLICY "Users can update their own projects" ON public.projects
  FOR UPDATE USING (tenant_id = get_current_user_tenant_id() AND (client_id = auth.uid() OR created_by = auth.uid()));

CREATE POLICY "Users can delete their own projects" ON public.projects
  FOR DELETE USING (tenant_id = get_current_user_tenant_id() AND (client_id = auth.uid() OR created_by = auth.uid()));

-- RLS Policies for project milestones
CREATE POLICY "Users can view milestones for their projects" ON public.project_milestones
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = project_milestones.project_id 
    AND projects.tenant_id = get_current_user_tenant_id()
  ));

CREATE POLICY "Users can manage milestones for their projects" ON public.project_milestones
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = project_milestones.project_id 
    AND projects.tenant_id = get_current_user_tenant_id()
    AND (projects.client_id = auth.uid() OR projects.created_by = auth.uid())
  ));

-- RLS Policies for project tasks
CREATE POLICY "Users can view tasks for their projects" ON public.project_tasks
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = project_tasks.project_id 
    AND projects.tenant_id = get_current_user_tenant_id()
  ));

CREATE POLICY "Users can manage tasks for their projects" ON public.project_tasks
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = project_tasks.project_id 
    AND projects.tenant_id = get_current_user_tenant_id()
    AND (projects.client_id = auth.uid() OR projects.created_by = auth.uid())
  ));

-- RLS Policies for project communications
CREATE POLICY "Users can view communications for their projects" ON public.project_communications
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = project_communications.project_id 
    AND projects.tenant_id = get_current_user_tenant_id()
  ));

CREATE POLICY "Users can create communications for their projects" ON public.project_communications
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = project_communications.project_id 
    AND projects.tenant_id = get_current_user_tenant_id()
  ) AND created_by = auth.uid());

CREATE POLICY "Users can update their own communications" ON public.project_communications
  FOR UPDATE USING (created_by = auth.uid());

-- RLS Policies for project documents
CREATE POLICY "Users can view documents for their projects" ON public.project_documents
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = project_documents.project_id 
    AND projects.tenant_id = get_current_user_tenant_id()
  ));

CREATE POLICY "Users can manage documents for their projects" ON public.project_documents
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = project_documents.project_id 
    AND projects.tenant_id = get_current_user_tenant_id()
  ));

-- RLS Policies for project team assignments
CREATE POLICY "Users can view team assignments for their projects" ON public.project_team_assignments
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = project_team_assignments.project_id 
    AND projects.tenant_id = get_current_user_tenant_id()
  ));

CREATE POLICY "Users can manage team assignments for their projects" ON public.project_team_assignments
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = project_team_assignments.project_id 
    AND projects.tenant_id = get_current_user_tenant_id()
    AND (projects.client_id = auth.uid() OR projects.created_by = auth.uid())
  ));

-- RLS Policies for project activity log
CREATE POLICY "Users can view activity for their projects" ON public.project_activity_log
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = project_activity_log.project_id 
    AND projects.tenant_id = get_current_user_tenant_id()
  ));

CREATE POLICY "Users can create activity logs" ON public.project_activity_log
  FOR INSERT WITH CHECK (created_by = auth.uid());

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_milestones_updated_at
  BEFORE UPDATE ON public.project_milestones
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_tasks_updated_at
  BEFORE UPDATE ON public.project_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_communications_updated_at
  BEFORE UPDATE ON public.project_communications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_documents_updated_at
  BEFORE UPDATE ON public.project_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_team_assignments_updated_at
  BEFORE UPDATE ON public.project_team_assignments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for real-time collaboration
ALTER TABLE public.projects REPLICA IDENTITY FULL;
ALTER TABLE public.project_milestones REPLICA IDENTITY FULL;
ALTER TABLE public.project_tasks REPLICA IDENTITY FULL;
ALTER TABLE public.project_communications REPLICA IDENTITY FULL;
ALTER TABLE public.project_documents REPLICA IDENTITY FULL;
ALTER TABLE public.project_team_assignments REPLICA IDENTITY FULL;
ALTER TABLE public.project_activity_log REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_milestones;
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_communications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_documents;  
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_team_assignments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_activity_log;

-- Create storage bucket for project documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-documents', 'project-documents', false);

-- Storage policies for project documents
CREATE POLICY "Users can view project documents in their tenant" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'project-documents' AND
    EXISTS (
      SELECT 1 FROM public.project_documents pd
      JOIN public.projects p ON pd.project_id = p.id
      WHERE pd.file_url = storage.objects.name
      AND p.tenant_id = get_current_user_tenant_id()
    )
  );

CREATE POLICY "Users can upload project documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'project-documents' AND
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can update their project documents" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'project-documents' AND
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can delete their project documents" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'project-documents' AND
    auth.uid() IS NOT NULL
  );