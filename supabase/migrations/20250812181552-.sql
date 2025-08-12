-- Create education_resources table for managing learning materials
CREATE TABLE public.education_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('pdf', 'docx', 'flipbook', 'external_link')),
  file_path TEXT, -- For uploaded files
  file_url TEXT, -- For external resources or flipbook embeds
  file_size BIGINT, -- Size in bytes for uploaded files
  mime_type TEXT, -- MIME type for uploaded files
  category TEXT DEFAULT 'general',
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.education_resources ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active education resources" 
ON public.education_resources 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage education resources" 
ON public.education_resources 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'superadmin', 'tenant_admin')
  )
);

-- Create storage bucket for education files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'education-files', 
  'education-files', 
  true,
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']
);

-- Create storage policies for education files
CREATE POLICY "Anyone can view education files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'education-files');

CREATE POLICY "Admins can upload education files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'education-files' 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'superadmin', 'tenant_admin')
  )
);

CREATE POLICY "Admins can update education files" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'education-files' 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'superadmin', 'tenant_admin')
  )
);

CREATE POLICY "Admins can delete education files" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'education-files' 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'superadmin', 'tenant_admin')
  )
);

-- Create indexes for better performance
CREATE INDEX idx_education_resources_type ON public.education_resources(resource_type);
CREATE INDEX idx_education_resources_category ON public.education_resources(category);
CREATE INDEX idx_education_resources_created_at ON public.education_resources(created_at DESC);
CREATE INDEX idx_education_resources_active ON public.education_resources(is_active) WHERE is_active = true;

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_education_resources_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_education_resources_updated_at
  BEFORE UPDATE ON public.education_resources
  FOR EACH ROW
  EXECUTE FUNCTION update_education_resources_updated_at();