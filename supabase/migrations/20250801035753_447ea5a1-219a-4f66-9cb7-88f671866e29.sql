-- Create enum for CPA staff roles
CREATE TYPE public.cpa_staff_role AS ENUM (
  'tax_only',
  'bookkeeping', 
  'planning',
  'admin',
  'advisor'
);

-- Create CPA staff table
CREATE TABLE public.cpa_staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  cpa_partner_id UUID NOT NULL REFERENCES public.cpa_partners(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role cpa_staff_role NOT NULL DEFAULT 'tax_only',
  permissions JSONB NOT NULL DEFAULT '{
    "can_view_clients": true,
    "can_edit_clients": false,
    "can_assign_clients": false,
    "can_view_documents": true,
    "can_upload_documents": false,
    "can_view_organizers": true,
    "can_edit_organizers": false,
    "can_send_communications": false,
    "can_manage_staff": false,
    "can_view_analytics": false,
    "can_manage_settings": false
  }'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  hired_date DATE DEFAULT CURRENT_DATE,
  hourly_rate NUMERIC(10,2),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create client assignments table
CREATE TABLE public.cpa_client_staff_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cpa_partner_id UUID NOT NULL REFERENCES public.cpa_partners(id) ON DELETE CASCADE,
  client_user_id UUID NOT NULL,
  staff_id UUID NOT NULL REFERENCES public.cpa_staff(id) ON DELETE CASCADE,
  assignment_type TEXT NOT NULL DEFAULT 'primary', -- primary, secondary, reviewer
  assigned_services TEXT[] DEFAULT ARRAY['tax_prep'],
  assigned_by UUID REFERENCES public.cpa_staff(id),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(client_user_id, staff_id, assignment_type)
);

-- Create workflow assignments table
CREATE TABLE public.cpa_workflow_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cpa_partner_id UUID NOT NULL REFERENCES public.cpa_partners(id) ON DELETE CASCADE,
  workflow_type TEXT NOT NULL, -- tax_return, organizer, document_request, etc.
  workflow_id UUID NOT NULL,
  assigned_to UUID NOT NULL REFERENCES public.cpa_staff(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES public.cpa_staff(id),
  status TEXT NOT NULL DEFAULT 'assigned', -- assigned, in_progress, completed, on_hold
  priority TEXT NOT NULL DEFAULT 'normal', -- low, normal, high, urgent
  due_date DATE,
  estimated_hours NUMERIC(5,2),
  actual_hours NUMERIC(5,2),
  notes TEXT,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create practice metrics table for dashboard
CREATE TABLE public.cpa_practice_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cpa_partner_id UUID NOT NULL REFERENCES public.cpa_partners(id) ON DELETE CASCADE,
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  outstanding_returns INTEGER NOT NULL DEFAULT 0,
  incomplete_organizers INTEGER NOT NULL DEFAULT 0,
  pending_esigns INTEGER NOT NULL DEFAULT 0,
  active_clients INTEGER NOT NULL DEFAULT 0,
  total_revenue NUMERIC(12,2) NOT NULL DEFAULT 0,
  hours_logged NUMERIC(8,2) NOT NULL DEFAULT 0,
  client_communications_sent INTEGER NOT NULL DEFAULT 0,
  documents_processed INTEGER NOT NULL DEFAULT 0,
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(cpa_partner_id, metric_date)
);

-- Enable RLS on all tables
ALTER TABLE public.cpa_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cpa_client_staff_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cpa_workflow_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cpa_practice_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cpa_staff
CREATE POLICY "CPA partners can manage their staff" ON public.cpa_staff
  FOR ALL USING (
    cpa_partner_id IN (
      SELECT id FROM public.cpa_partners WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Staff can view their own record" ON public.cpa_staff
  FOR SELECT USING (user_id = auth.uid());

-- RLS Policies for cpa_client_staff_assignments  
CREATE POLICY "CPA partners can manage client assignments" ON public.cpa_client_staff_assignments
  FOR ALL USING (
    cpa_partner_id IN (
      SELECT id FROM public.cpa_partners WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Staff can view their assignments" ON public.cpa_client_staff_assignments
  FOR SELECT USING (
    staff_id IN (
      SELECT id FROM public.cpa_staff WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for cpa_workflow_assignments
CREATE POLICY "CPA partners can manage workflow assignments" ON public.cpa_workflow_assignments
  FOR ALL USING (
    cpa_partner_id IN (
      SELECT id FROM public.cpa_partners WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Staff can view their workflow assignments" ON public.cpa_workflow_assignments
  FOR SELECT USING (
    assigned_to IN (
      SELECT id FROM public.cpa_staff WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for cpa_practice_metrics
CREATE POLICY "CPA partners can view their practice metrics" ON public.cpa_practice_metrics
  FOR ALL USING (
    cpa_partner_id IN (
      SELECT id FROM public.cpa_partners WHERE user_id = auth.uid()
    )
  );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_cpa_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_cpa_staff_updated_at 
  BEFORE UPDATE ON public.cpa_staff 
  FOR EACH ROW EXECUTE FUNCTION update_cpa_updated_at_column();

CREATE TRIGGER update_cpa_client_staff_assignments_updated_at 
  BEFORE UPDATE ON public.cpa_client_staff_assignments 
  FOR EACH ROW EXECUTE FUNCTION update_cpa_updated_at_column();

CREATE TRIGGER update_cpa_workflow_assignments_updated_at 
  BEFORE UPDATE ON public.cpa_workflow_assignments 
  FOR EACH ROW EXECUTE FUNCTION update_cpa_updated_at_column();

-- Function to get staff permissions
CREATE OR REPLACE FUNCTION public.get_cpa_staff_permissions(staff_user_id UUID)
RETURNS JSONB
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT permissions 
  FROM public.cpa_staff 
  WHERE user_id = staff_user_id AND is_active = true
  LIMIT 1;
$$;

-- Function to check staff permission
CREATE OR REPLACE FUNCTION public.has_cpa_permission(staff_user_id UUID, permission_name TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER  
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT (permissions->permission_name)::boolean 
     FROM public.cpa_staff 
     WHERE user_id = staff_user_id AND is_active = true
     LIMIT 1), 
    false
  );
$$;