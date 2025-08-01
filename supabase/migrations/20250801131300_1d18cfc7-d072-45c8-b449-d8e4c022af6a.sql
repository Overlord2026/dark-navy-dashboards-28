-- Fix the storage policies - drop and recreate
DROP POLICY IF EXISTS "Users can upload their onboarding documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all attorney documents" ON storage.objects;

-- Create storage policies for attorney documents
CREATE POLICY "Attorney users can upload their onboarding documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'attorney-documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Attorney users can view their own documents" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'attorney-documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all attorney onboarding documents" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'attorney-documents' AND 
  has_any_role(ARRAY['admin', 'system_administrator', 'tenant_admin'])
);