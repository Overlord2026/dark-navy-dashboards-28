-- Critical Security Fix: Drop and recreate functions with secure search path
DROP FUNCTION IF EXISTS public.has_any_role(text[]);
DROP FUNCTION IF EXISTS public.has_role(text);
DROP FUNCTION IF EXISTS public.get_current_user_role();

-- Create secure database functions
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = '';

CREATE OR REPLACE FUNCTION public.has_any_role(roles text[])
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = ANY(roles)
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = '';

CREATE OR REPLACE FUNCTION public.has_role(role_name text)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = role_name
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = '';

-- Add RLS policies for tables with exposed data
ALTER TABLE public.advisor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reserved_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attorney_document_classifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_category_templates ENABLE ROW LEVEL SECURITY;

-- Advisor profiles policies
CREATE POLICY "Users can view advisor profiles"
ON public.advisor_profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can manage their own advisor profile"
ON public.advisor_profiles FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Reserved profiles policies
CREATE POLICY "Users can view their reserved profiles"
ON public.reserved_profiles FOR SELECT
TO authenticated
USING (claimed_by = auth.uid() OR created_by = auth.uid());

CREATE POLICY "Users can manage their reserved profiles"
ON public.reserved_profiles FOR ALL
TO authenticated
USING (claimed_by = auth.uid() OR created_by = auth.uid())
WITH CHECK (claimed_by = auth.uid() OR created_by = auth.uid());

-- Document classifications policies (read-only for authenticated users)
CREATE POLICY "Authenticated users can view document classifications"
ON public.attorney_document_classifications FOR SELECT
TO authenticated
USING (true);

-- Goal category templates policies (read-only for authenticated users)
CREATE POLICY "Authenticated users can view goal category templates"
ON public.goal_category_templates FOR SELECT
TO authenticated
USING (true);