-- Add RLS policies for education_resources table
ALTER TABLE public.education_resources ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view active education resources
CREATE POLICY "Anyone can view active education resources"
ON public.education_resources
FOR SELECT
USING (is_active = true);

-- Allow admins to manage education resources
CREATE POLICY "Admins can manage education resources"
ON public.education_resources
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = ANY(ARRAY['admin', 'superadmin'])
  )
);