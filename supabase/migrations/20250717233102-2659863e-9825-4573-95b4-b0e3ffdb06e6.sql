-- Check if tenant_id column exists in profiles table, if not add it
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'profiles' 
                   AND column_name = 'tenant_id') THEN
        ALTER TABLE public.profiles ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
    END IF;
END $$;

-- Check if tenant_id column exists in professionals table, if not add it
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'professionals' 
                   AND column_name = 'tenant_id') THEN
        ALTER TABLE public.professionals ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
    END IF;
END $$;

-- Update existing professionals to belong to default tenant if they don't have one
UPDATE public.professionals 
SET tenant_id = (SELECT id FROM public.tenants ORDER BY created_at LIMIT 1) 
WHERE tenant_id IS NULL;

-- Update existing profiles to belong to default tenant if they don't have one
UPDATE public.profiles 
SET tenant_id = (SELECT id FROM public.tenants ORDER BY created_at LIMIT 1) 
WHERE tenant_id IS NULL;

-- Update RLS policies to be tenant-aware for professionals
DROP POLICY IF EXISTS "Users can view their own professionals" ON public.professionals;
DROP POLICY IF EXISTS "Users can view professionals in their tenant" ON public.professionals;
CREATE POLICY "Users can view professionals in their tenant" ON public.professionals
FOR SELECT USING (
  auth.uid() = user_id OR 
  tenant_id = (SELECT profiles.tenant_id FROM public.profiles WHERE profiles.id = auth.uid())
);

DROP POLICY IF EXISTS "Users can create their own professionals" ON public.professionals;
DROP POLICY IF EXISTS "Users can create professionals in their tenant" ON public.professionals;
CREATE POLICY "Users can create professionals in their tenant" ON public.professionals
FOR INSERT WITH CHECK (
  auth.uid() = user_id AND 
  tenant_id = (SELECT profiles.tenant_id FROM public.profiles WHERE profiles.id = auth.uid())
);

DROP POLICY IF EXISTS "Users can update their own professionals" ON public.professionals;
DROP POLICY IF EXISTS "Users can update professionals in their tenant" ON public.professionals;
CREATE POLICY "Users can update professionals in their tenant" ON public.professionals
FOR UPDATE USING (
  auth.uid() = user_id AND 
  tenant_id = (SELECT profiles.tenant_id FROM public.profiles WHERE profiles.id = auth.uid())
);

DROP POLICY IF EXISTS "Users can delete their own professionals" ON public.professionals;
DROP POLICY IF EXISTS "Users can delete professionals in their tenant" ON public.professionals;
CREATE POLICY "Users can delete professionals in their tenant" ON public.professionals
FOR DELETE USING (
  auth.uid() = user_id AND 
  tenant_id = (SELECT profiles.tenant_id FROM public.profiles WHERE profiles.id = auth.uid())
);

-- Update investment strategies RLS to be tenant-aware
DROP POLICY IF EXISTS "Users can view strategies in their tenant" ON public.investment_strategies;
CREATE POLICY "Users can view strategies in their tenant" ON public.investment_strategies
FOR SELECT USING (
  tenant_id IS NULL OR 
  tenant_id = (SELECT profiles.tenant_id FROM public.profiles WHERE profiles.id = auth.uid())
);

-- Update educational content RLS to be tenant-aware
DROP POLICY IF EXISTS "Educational content is viewable by everyone" ON public.educational_content;
DROP POLICY IF EXISTS "Users can view content in their tenant" ON public.educational_content;
CREATE POLICY "Users can view content in their tenant" ON public.educational_content
FOR SELECT USING (
  tenant_id IS NULL OR 
  tenant_id = (SELECT profiles.tenant_id FROM public.profiles WHERE profiles.id = auth.uid())
);

-- Update advisor applications RLS to be tenant-aware
DROP POLICY IF EXISTS "Advisor applications are viewable by admins" ON public.advisor_applications;
DROP POLICY IF EXISTS "Admins can view applications in their tenant" ON public.advisor_applications;
CREATE POLICY "Admins can view applications in their tenant" ON public.advisor_applications
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'system_administrator', 'tenant_administrator')
    AND (profiles.tenant_id = advisor_applications.tenant_id OR profiles.role = 'system_administrator')
  )
);

DROP POLICY IF EXISTS "Admins can create applications in their tenant" ON public.advisor_applications;
CREATE POLICY "Admins can create applications in their tenant" ON public.advisor_applications
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'system_administrator', 'tenant_administrator')
    AND (profiles.tenant_id = advisor_applications.tenant_id OR profiles.role = 'system_administrator')
  )
);