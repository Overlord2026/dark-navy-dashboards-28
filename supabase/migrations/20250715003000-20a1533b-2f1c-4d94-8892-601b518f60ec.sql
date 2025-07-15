-- Create comprehensive storage policies for healthcare-documents bucket

-- Policy for users to view their own files
CREATE POLICY "Users can view their own healthcare files"
ON storage.objects FOR SELECT
USING (bucket_id = 'healthcare-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policy for users to upload their own files
CREATE POLICY "Users can upload their own healthcare files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'healthcare-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policy for users to update their own files
CREATE POLICY "Users can update their own healthcare files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'healthcare-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policy for users to delete their own files
CREATE POLICY "Users can delete their own healthcare files"
ON storage.objects FOR DELETE
USING (bucket_id = 'healthcare-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create similar policies for the documents bucket
CREATE POLICY "Users can view their own documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own documents"
ON storage.objects FOR UPDATE
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own documents"
ON storage.objects FOR DELETE
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);