-- Create storage bucket for attorney documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('attorney-documents', 'attorney-documents', false);

-- Create attorney document classifications table
CREATE TABLE public.attorney_document_classifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classification_name TEXT NOT NULL UNIQUE,
  description TEXT,
  required_fields JSONB DEFAULT '[]'::jsonb,
  validation_rules JSONB DEFAULT '{}'::jsonb,
  retention_period_years INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default document classifications
INSERT INTO public.attorney_document_classifications (classification_name, description, required_fields, validation_rules, retention_period_years) VALUES
('contract', 'Legal contracts and agreements', '["parties", "effective_date", "contract_type"]', '{"max_size_mb": 50, "allowed_extensions": [".pdf", ".doc", ".docx"]}', 7),
('estate_planning', 'Wills, trusts, and estate documents', '["client_name", "document_type", "execution_date"]', '{"max_size_mb": 25, "allowed_extensions": [".pdf", ".doc", ".docx"]}', 99),
('compliance', 'Regulatory and compliance documents', '["regulation_type", "effective_date", "jurisdiction"]', '{"max_size_mb": 30, "allowed_extensions": [".pdf", ".doc", ".docx", ".xls", ".xlsx"]}', 10),
('litigation', 'Court filings and litigation documents', '["case_number", "court", "filing_date"]', '{"max_size_mb": 100, "allowed_extensions": [".pdf", ".doc", ".docx"]}', 15),
('corporate', 'Business formation and corporate documents', '["entity_name", "document_type", "state"]', '{"max_size_mb": 25, "allowed_extensions": [".pdf", ".doc", ".docx"]}', 7),
('real_estate', 'Property and real estate documents', '["property_address", "transaction_type", "closing_date"]', '{"max_size_mb": 50, "allowed_extensions": [".pdf", ".doc", ".docx"]}', 7),
('intellectual_property', 'Patents, trademarks, and IP documents', '["ip_type", "application_number", "filing_date"]', '{"max_size_mb": 30, "allowed_extensions": [".pdf", ".doc", ".docx"]}', 20),
('tax', 'Tax-related legal documents', '["tax_year", "entity_type", "jurisdiction"]', '{"max_size_mb": 25, "allowed_extensions": [".pdf", ".doc", ".docx", ".xls", ".xlsx"]}', 7);

-- Create attorney documents metadata table
CREATE TABLE public.attorney_documents_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_path TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  attorney_id UUID NOT NULL,
  client_id UUID,
  classification_id UUID NOT NULL REFERENCES public.attorney_document_classifications(id),
  document_title TEXT NOT NULL,
  document_description TEXT,
  metadata_fields JSONB DEFAULT '{}'::jsonb,
  tags TEXT[],
  security_level TEXT DEFAULT 'confidential' CHECK (security_level IN ('public', 'internal', 'confidential', 'restricted')),
  encryption_status TEXT DEFAULT 'encrypted' CHECK (encryption_status IN ('none', 'encrypted', 'client_encrypted')),
  version_number INTEGER DEFAULT 1,
  parent_document_id UUID REFERENCES public.attorney_documents_metadata(id),
  is_current_version BOOLEAN DEFAULT true,
  retention_date DATE,
  access_count INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMP WITH TIME ZONE,
  uploaded_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Ensure only one current version per document group
  CONSTRAINT unique_current_version EXCLUDE (parent_document_id WITH =) WHERE (is_current_version = true AND parent_document_id IS NOT NULL)
);

-- Create document access log for audit trail
CREATE TABLE public.attorney_document_access_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.attorney_documents_metadata(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  access_type TEXT NOT NULL CHECK (access_type IN ('view', 'download', 'preview', 'share')),
  ip_address INET,
  user_agent TEXT,
  access_granted BOOLEAN DEFAULT true,
  denial_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create document sharing table
CREATE TABLE public.attorney_document_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.attorney_documents_metadata(id) ON DELETE CASCADE,
  shared_by UUID NOT NULL,
  shared_with_email TEXT,
  shared_with_user_id UUID,
  permission_level TEXT DEFAULT 'view' CHECK (permission_level IN ('view', 'download', 'edit')),
  expires_at TIMESTAMP WITH TIME ZONE,
  access_token UUID DEFAULT gen_random_uuid(),
  access_count INTEGER DEFAULT 0,
  max_access_count INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_attorney_documents_attorney_id ON public.attorney_documents_metadata(attorney_id);
CREATE INDEX idx_attorney_documents_client_id ON public.attorney_documents_metadata(client_id);
CREATE INDEX idx_attorney_documents_classification ON public.attorney_documents_metadata(classification_id);
CREATE INDEX idx_attorney_documents_current_version ON public.attorney_documents_metadata(is_current_version) WHERE is_current_version = true;
CREATE INDEX idx_attorney_documents_parent ON public.attorney_documents_metadata(parent_document_id);
CREATE INDEX idx_attorney_document_access_log_user ON public.attorney_document_access_log(user_id);
CREATE INDEX idx_attorney_document_access_log_document ON public.attorney_document_access_log(document_id);
CREATE INDEX idx_attorney_document_shares_document ON public.attorney_document_shares(document_id);
CREATE INDEX idx_attorney_document_shares_token ON public.attorney_document_shares(access_token);

-- Enable RLS on all tables
ALTER TABLE public.attorney_document_classifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attorney_documents_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attorney_document_access_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attorney_document_shares ENABLE ROW LEVEL SECURITY;

-- RLS Policies for attorney_document_classifications
CREATE POLICY "Anyone can view document classifications" ON public.attorney_document_classifications
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage document classifications" ON public.attorney_document_classifications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'system_administrator', 'tenant_admin')
    )
  );

-- RLS Policies for attorney_documents_metadata
CREATE POLICY "Attorneys can manage their own documents" ON public.attorney_documents_metadata
  FOR ALL USING (attorney_id = auth.uid());

CREATE POLICY "Clients can view their documents" ON public.attorney_documents_metadata
  FOR SELECT USING (client_id = auth.uid());

CREATE POLICY "Admins can view all attorney documents" ON public.attorney_documents_metadata
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'system_administrator', 'tenant_admin')
    )
  );

-- RLS Policies for attorney_document_access_log
CREATE POLICY "Users can view their own access logs" ON public.attorney_document_access_log
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can insert access logs" ON public.attorney_document_access_log
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Attorneys can view access logs for their documents" ON public.attorney_document_access_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.attorney_documents_metadata 
      WHERE id = attorney_document_access_log.document_id 
      AND attorney_id = auth.uid()
    )
  );

-- RLS Policies for attorney_document_shares
CREATE POLICY "Users can manage shares they created" ON public.attorney_document_shares
  FOR ALL USING (shared_by = auth.uid());

CREATE POLICY "Users can view shares for their documents" ON public.attorney_document_shares
  FOR SELECT USING (
    shared_with_user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.attorney_documents_metadata 
      WHERE id = attorney_document_shares.document_id 
      AND attorney_id = auth.uid()
    )
  );

-- Storage policies for attorney-documents bucket
CREATE POLICY "Attorneys can upload documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'attorney-documents' AND
    auth.uid()::text = (storage.foldername(name))[1] AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('attorney', 'admin', 'system_administrator')
    )
  );

CREATE POLICY "Attorneys can view their own documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'attorney-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Document owners can update their files" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'attorney-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Document owners can delete their files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'attorney-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Function to track document access
CREATE OR REPLACE FUNCTION public.log_attorney_document_access(
  p_document_id UUID,
  p_access_type TEXT,
  p_user_id UUID DEFAULT auth.uid()
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  log_id UUID;
BEGIN
  -- Insert access log
  INSERT INTO public.attorney_document_access_log (
    document_id,
    user_id,
    access_type,
    ip_address,
    user_agent
  ) VALUES (
    p_document_id,
    p_user_id,
    p_access_type,
    inet_client_addr(),
    current_setting('request.headers', true)::json->>'user-agent'
  ) RETURNING id INTO log_id;
  
  -- Update access count and last accessed
  UPDATE public.attorney_documents_metadata 
  SET 
    access_count = access_count + 1,
    last_accessed_at = now()
  WHERE id = p_document_id;
  
  RETURN log_id;
END;
$$;

-- Function to create new document version
CREATE OR REPLACE FUNCTION public.create_attorney_document_version(
  p_parent_document_id UUID,
  p_file_path TEXT,
  p_original_filename TEXT,
  p_file_size BIGINT,
  p_mime_type TEXT,
  p_document_title TEXT,
  p_document_description TEXT DEFAULT NULL,
  p_metadata_fields JSONB DEFAULT '{}'::jsonb
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_document_id UUID;
  v_next_version INTEGER;
  v_parent_data RECORD;
BEGIN
  -- Get parent document data
  SELECT attorney_id, client_id, classification_id, security_level
  INTO v_parent_data
  FROM public.attorney_documents_metadata
  WHERE id = p_parent_document_id;
  
  IF v_parent_data IS NULL THEN
    RAISE EXCEPTION 'Parent document not found';
  END IF;
  
  -- Get next version number
  SELECT COALESCE(MAX(version_number), 0) + 1
  INTO v_next_version
  FROM public.attorney_documents_metadata
  WHERE parent_document_id = p_parent_document_id OR id = p_parent_document_id;
  
  -- Mark all previous versions as not current
  UPDATE public.attorney_documents_metadata
  SET is_current_version = false
  WHERE (parent_document_id = p_parent_document_id OR id = p_parent_document_id);
  
  -- Create new version
  INSERT INTO public.attorney_documents_metadata (
    file_path,
    original_filename,
    file_size,
    mime_type,
    attorney_id,
    client_id,
    classification_id,
    document_title,
    document_description,
    metadata_fields,
    security_level,
    version_number,
    parent_document_id,
    is_current_version,
    uploaded_by
  ) VALUES (
    p_file_path,
    p_original_filename,
    p_file_size,
    p_mime_type,
    v_parent_data.attorney_id,
    v_parent_data.client_id,
    v_parent_data.classification_id,
    p_document_title,
    p_document_description,
    p_metadata_fields,
    v_parent_data.security_level,
    v_next_version,
    p_parent_document_id,
    true,
    auth.uid()
  ) RETURNING id INTO v_document_id;
  
  RETURN v_document_id;
END;
$$;