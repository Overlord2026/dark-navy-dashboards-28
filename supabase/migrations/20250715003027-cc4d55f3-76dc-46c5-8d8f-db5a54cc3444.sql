-- Create storage policies specifically for healthcare-documents bucket
-- (Skip documents bucket policies as they already exist)

-- Policy for users to view their own healthcare files
CREATE POLICY "Users can view their own healthcare files"
ON storage.objects FOR SELECT
USING (bucket_id = 'healthcare-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policy for users to upload their own healthcare files
CREATE POLICY "Users can upload their own healthcare files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'healthcare-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policy for users to update their own healthcare files
CREATE POLICY "Users can update their own healthcare files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'healthcare-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policy for users to delete their own healthcare files
CREATE POLICY "Users can delete their own healthcare files"
ON storage.objects FOR DELETE
USING (bucket_id = 'healthcare-documents' AND auth.uid()::text = (storage.foldername(name))[1]);