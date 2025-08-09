-- Operations Management + LMS Core Tables

-- Organizations table
CREATE TABLE public.organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  persona TEXT NOT NULL,
  logo_url TEXT,
  brand_colors JSONB DEFAULT '{}',
  retention_years INTEGER NOT NULL DEFAULT 7,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Employees table
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  employee_number TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'employee',
  job_title TEXT NOT NULL,
  department TEXT,
  manager_id UUID REFERENCES public.employees(id),
  start_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  profile_image_url TEXT,
  current_projects TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(organization_id, user_id)
);

-- Job ladders table
CREATE TABLE public.job_ladders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  persona TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  levels JSONB NOT NULL DEFAULT '[]',
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'planning',
  priority TEXT NOT NULL DEFAULT 'medium',
  owner_id UUID NOT NULL REFERENCES public.employees(id),
  team_members UUID[] DEFAULT '{}',
  start_date DATE NOT NULL,
  due_date DATE,
  completed_date DATE,
  budget NUMERIC(10,2),
  spent NUMERIC(10,2) DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  workflow_template_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Workflow templates table
CREATE TABLE public.workflow_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  persona TEXT NOT NULL,
  steps JSONB NOT NULL DEFAULT '[]',
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Annual reviews table
CREATE TABLE public.annual_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES public.employees(id),
  review_period_start DATE NOT NULL,
  review_period_end DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  performance_score INTEGER,
  strengths TEXT[] DEFAULT '{}',
  areas_for_improvement TEXT[] DEFAULT '{}',
  goals JSONB DEFAULT '[]',
  skill_gaps TEXT[] DEFAULT '{}',
  recommended_courses TEXT[] DEFAULT '{}',
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  course_type TEXT NOT NULL DEFAULT 'orientation',
  persona TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  thumbnail_url TEXT,
  estimated_duration_minutes INTEGER NOT NULL DEFAULT 60,
  ce_hours NUMERIC(4,2),
  required_approval BOOLEAN NOT NULL DEFAULT false,
  is_required BOOLEAN NOT NULL DEFAULT false,
  prerequisites TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  content JSONB NOT NULL DEFAULT '[]',
  quiz JSONB,
  certificate_template_id UUID,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Course enrollments table
CREATE TABLE public.course_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  enrolled_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  started_date DATE,
  completed_date DATE,
  status TEXT NOT NULL DEFAULT 'enrolled',
  progress_percentage INTEGER NOT NULL DEFAULT 0,
  score INTEGER,
  ce_hours_earned NUMERIC(4,2),
  certificate_url TEXT,
  assigned_by UUID REFERENCES public.employees(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(course_id, employee_id)
);

-- Training library table
CREATE TABLE public.training_library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'document',
  file_url TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  persona TEXT NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT false,
  uploaded_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Certificates table
CREATE TABLE public.certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  certificate_url TEXT NOT NULL,
  issued_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expiry_date DATE,
  ce_hours NUMERIC(4,2) NOT NULL,
  is_valid BOOLEAN NOT NULL DEFAULT true,
  verification_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Compliance records table
CREATE TABLE public.compliance_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id),
  completion_date DATE NOT NULL,
  expiry_date DATE,
  ce_hours NUMERIC(4,2) NOT NULL,
  certificate_url TEXT,
  audit_trail JSONB NOT NULL DEFAULT '[]',
  retention_until DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_ladders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.annual_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_records ENABLE ROW LEVEL SECURITY;

-- Create function to get user's organization
CREATE OR REPLACE FUNCTION public.get_user_organization_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT organization_id 
    FROM public.employees 
    WHERE user_id = auth.uid() 
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create function to check if user has role in organization
CREATE OR REPLACE FUNCTION public.has_org_role(required_roles TEXT[])
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.employees 
    WHERE user_id = auth.uid() 
    AND role = ANY(required_roles)
    AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- RLS Policies for Organizations
CREATE POLICY "Users can view their organization" ON public.organizations
  FOR SELECT USING (id = get_user_organization_id());

CREATE POLICY "Owners and managers can update organization" ON public.organizations
  FOR UPDATE USING (
    id = get_user_organization_id() AND 
    has_org_role(ARRAY['owner', 'manager'])
  );

-- RLS Policies for Employees
CREATE POLICY "Users can view employees in their organization" ON public.employees
  FOR SELECT USING (organization_id = get_user_organization_id());

CREATE POLICY "Managers can manage employees" ON public.employees
  FOR ALL USING (
    organization_id = get_user_organization_id() AND 
    has_org_role(ARRAY['owner', 'manager'])
  );

CREATE POLICY "Users can update their own profile" ON public.employees
  FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for Projects
CREATE POLICY "Users can view projects in their organization" ON public.projects
  FOR SELECT USING (organization_id = get_user_organization_id());

CREATE POLICY "Managers can manage all projects" ON public.projects
  FOR ALL USING (
    organization_id = get_user_organization_id() AND 
    has_org_role(ARRAY['owner', 'manager'])
  );

CREATE POLICY "Project owners can manage their projects" ON public.projects
  FOR ALL USING (
    organization_id = get_user_organization_id() AND 
    owner_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid())
  );

-- RLS Policies for Courses
CREATE POLICY "Users can view courses in their organization" ON public.courses
  FOR SELECT USING (organization_id = get_user_organization_id());

CREATE POLICY "Trainers and managers can manage courses" ON public.courses
  FOR ALL USING (
    organization_id = get_user_organization_id() AND 
    has_org_role(ARRAY['owner', 'manager', 'trainer'])
  );

-- RLS Policies for Course Enrollments
CREATE POLICY "Users can view enrollments in their organization" ON public.course_enrollments
  FOR SELECT USING (
    course_id IN (
      SELECT id FROM public.courses WHERE organization_id = get_user_organization_id()
    )
  );

CREATE POLICY "Managers can manage all enrollments" ON public.course_enrollments
  FOR ALL USING (
    has_org_role(ARRAY['owner', 'manager', 'trainer']) AND
    course_id IN (
      SELECT id FROM public.courses WHERE organization_id = get_user_organization_id()
    )
  );

CREATE POLICY "Users can update their own enrollments" ON public.course_enrollments
  FOR UPDATE USING (
    employee_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid())
  );

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON public.employees
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();