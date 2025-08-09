-- Add RLS policies and security functions for Operations Management + LMS

-- Create security definer functions for organization access
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
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = '';

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
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = '';

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

CREATE POLICY "Users can insert employee record" ON public.employees
  FOR INSERT WITH CHECK (
    organization_id = get_user_organization_id() OR 
    has_org_role(ARRAY['owner', 'manager'])
  );

-- RLS Policies for Job Ladders
CREATE POLICY "Users can view job ladders in their organization" ON public.job_ladders
  FOR SELECT USING (organization_id = get_user_organization_id());

CREATE POLICY "Managers can manage job ladders" ON public.job_ladders
  FOR ALL USING (
    organization_id = get_user_organization_id() AND 
    has_org_role(ARRAY['owner', 'manager'])
  );

-- RLS Policies for Workflow Templates
CREATE POLICY "Users can view workflow templates in their organization" ON public.workflow_templates
  FOR SELECT USING (organization_id = get_user_organization_id());

CREATE POLICY "Managers can manage workflow templates" ON public.workflow_templates
  FOR ALL USING (
    organization_id = get_user_organization_id() AND 
    has_org_role(ARRAY['owner', 'manager'])
  );

-- RLS Policies for Annual Reviews
CREATE POLICY "Users can view annual reviews in their organization" ON public.annual_reviews
  FOR SELECT USING (organization_id = get_user_organization_id());

CREATE POLICY "Managers can manage annual reviews" ON public.annual_reviews
  FOR ALL USING (
    organization_id = get_user_organization_id() AND 
    has_org_role(ARRAY['owner', 'manager'])
  );

CREATE POLICY "Employees can view their own reviews" ON public.annual_reviews
  FOR SELECT USING (
    employee_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid())
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

-- RLS Policies for Training Library
CREATE POLICY "Users can view training library in their organization" ON public.training_library
  FOR SELECT USING (organization_id = get_user_organization_id());

CREATE POLICY "Trainers can manage training library" ON public.training_library
  FOR ALL USING (
    organization_id = get_user_organization_id() AND 
    has_org_role(ARRAY['owner', 'manager', 'trainer'])
  );

-- RLS Policies for Certificates
CREATE POLICY "Users can view certificates in their organization" ON public.certificates
  FOR SELECT USING (
    course_id IN (
      SELECT id FROM public.courses WHERE organization_id = get_user_organization_id()
    )
  );

CREATE POLICY "System can create certificates" ON public.certificates
  FOR INSERT WITH CHECK (
    course_id IN (
      SELECT id FROM public.courses WHERE organization_id = get_user_organization_id()
    )
  );

-- RLS Policies for Compliance Records
CREATE POLICY "Users can view compliance records in their organization" ON public.compliance_records
  FOR SELECT USING (organization_id = get_user_organization_id());

CREATE POLICY "Compliance officers can manage records" ON public.compliance_records
  FOR ALL USING (
    organization_id = get_user_organization_id() AND 
    has_org_role(ARRAY['owner', 'manager', 'compliance_officer'])
  );

-- Create triggers for updated_at
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON public.employees
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_ladders_updated_at BEFORE UPDATE ON public.job_ladders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workflow_templates_updated_at BEFORE UPDATE ON public.workflow_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_annual_reviews_updated_at BEFORE UPDATE ON public.annual_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_enrollments_updated_at BEFORE UPDATE ON public.course_enrollments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_training_library_updated_at BEFORE UPDATE ON public.training_library
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();