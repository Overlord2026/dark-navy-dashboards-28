-- Critical Security Fix 1: Add RLS policies for advisor_profiles table
ALTER TABLE public.advisor_profiles ENABLE ROW LEVEL SECURITY;

-- Only allow authenticated users to view advisor profiles
CREATE POLICY "Users can view advisor profiles"
ON public.advisor_profiles FOR SELECT
TO authenticated
USING (true);

-- Only allow users to manage their own advisor profile
CREATE POLICY "Users can manage their own advisor profile"
ON public.advisor_profiles FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Critical Security Fix 2: Add RLS policies for reserved_profiles table  
ALTER TABLE public.reserved_profiles ENABLE ROW LEVEL SECURITY;

-- Only allow authenticated users to view their own reserved profiles or admins
CREATE POLICY "Users can view their reserved profiles"
ON public.reserved_profiles FOR SELECT
TO authenticated
USING (claimed_by = auth.uid() OR created_by = auth.uid());

-- Allow users to manage their own reserved profiles
CREATE POLICY "Users can manage their reserved profiles"
ON public.reserved_profiles FOR ALL
TO authenticated
USING (claimed_by = auth.uid() OR created_by = auth.uid())
WITH CHECK (claimed_by = auth.uid() OR created_by = auth.uid());

-- Critical Security Fix 3: Secure attorney_document_classifications table
ALTER TABLE public.attorney_document_classifications ENABLE ROW LEVEL SECURITY;

-- Only allow authenticated users to view document classifications
CREATE POLICY "Authenticated users can view document classifications"
ON public.attorney_document_classifications FOR SELECT
TO authenticated
USING (true);

-- Critical Security Fix 4: Secure goal_category_templates table
ALTER TABLE public.goal_category_templates ENABLE ROW LEVEL SECURITY;

-- Only allow authenticated users to view goal category templates
CREATE POLICY "Authenticated users can view goal category templates"
ON public.goal_category_templates FOR SELECT
TO authenticated
USING (true);

-- Critical Security Fix 5: Update database functions to use secure search path
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