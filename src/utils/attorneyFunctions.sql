
-- SQL functions for attorney onboarding (to be run in Supabase SQL editor)

-- Function to get attorney onboardings
CREATE OR REPLACE FUNCTION get_attorney_onboardings(attorney_id uuid)
RETURNS TABLE (
  id uuid,
  attorney_user_id uuid,
  client_user_id uuid,
  onboarding_stage text,
  engagement_letter_signed boolean,
  welcome_email_sent boolean,
  status text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  documents_required integer,
  documents_uploaded integer,
  progress_percentage integer,
  intake_form_completed boolean,
  client_preferences jsonb
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT 
    ao.id,
    ao.attorney_user_id,
    ao.client_user_id,
    ao.onboarding_stage,
    ao.engagement_letter_signed,
    ao.welcome_email_sent,
    ao.status,
    ao.created_at,
    ao.updated_at,
    ao.documents_required,
    ao.documents_uploaded,
    ao.progress_percentage,
    ao.intake_form_completed,
    ao.client_preferences
  FROM attorney_onboarding ao
  WHERE ao.attorney_user_id = attorney_id
  ORDER BY ao.created_at DESC;
$$;

-- Function to create attorney onboarding
CREATE OR REPLACE FUNCTION create_attorney_onboarding(
  attorney_id uuid,
  client_email text,
  client_name text,
  engagement_type text,
  documents_required integer
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  new_onboarding_id uuid;
  client_user_id uuid;
BEGIN
  -- Generate new ID
  new_onboarding_id := gen_random_uuid();
  
  -- For now, we'll create a placeholder client_user_id
  -- In a real implementation, you'd invite the client and get their user ID
  client_user_id := gen_random_uuid();
  
  INSERT INTO attorney_onboarding (
    id,
    attorney_user_id,
    client_user_id,
    onboarding_stage,
    engagement_letter_signed,
    welcome_email_sent,
    status,
    documents_required,
    documents_uploaded,
    progress_percentage,
    intake_form_completed,
    client_preferences
  ) VALUES (
    new_onboarding_id,
    attorney_id,
    client_user_id,
    'invited',
    false,
    true,
    'active',
    documents_required,
    0,
    0,
    false,
    jsonb_build_object('client_email', client_email, 'client_name', client_name, 'engagement_type', engagement_type)
  );
  
  RETURN new_onboarding_id;
END;
$$;

-- Function to get onboarding documents
CREATE OR REPLACE FUNCTION get_onboarding_documents(onboarding_id uuid)
RETURNS TABLE (
  id uuid,
  onboarding_id uuid,
  document_type text,
  file_name text,
  file_path text,
  file_size bigint,
  upload_status text,
  uploaded_at timestamp with time zone,
  uploaded_by uuid,
  is_required boolean,
  is_client_visible boolean,
  client_comments text,
  attorney_notes text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT 
    ad.id,
    ad.onboarding_id,
    ad.document_type,
    ad.file_name,
    ad.file_path,
    ad.file_size,
    ad.upload_status,
    ad.uploaded_at,
    ad.uploaded_by,
    ad.is_required,
    ad.is_client_visible,
    ad.client_comments,
    ad.attorney_notes
  FROM attorney_documents ad
  WHERE ad.onboarding_id = get_onboarding_documents.onboarding_id
  ORDER BY ad.uploaded_at DESC;
$$;

-- Function to update onboarding status
CREATE OR REPLACE FUNCTION update_onboarding_status(
  onboarding_id uuid,
  new_status text,
  notes text DEFAULT ''
)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  UPDATE attorney_onboarding
  SET 
    status = new_status,
    updated_at = now()
  WHERE id = onboarding_id;
$$;

-- Function to send onboarding reminder (placeholder)
CREATE OR REPLACE FUNCTION send_onboarding_reminder(
  onboarding_id uuid,
  reminder_type text
)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  -- Placeholder function - would integrate with email service
  UPDATE attorney_onboarding
  SET updated_at = now()
  WHERE id = onboarding_id;
$$;

-- Function to create attorney document
CREATE OR REPLACE FUNCTION create_attorney_document(
  onboarding_id uuid,
  document_type text,
  file_name text,
  file_path text,
  file_size bigint,
  is_required boolean DEFAULT false,
  is_client_visible boolean DEFAULT true
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  new_document_id uuid;
BEGIN
  new_document_id := gen_random_uuid();
  
  INSERT INTO attorney_documents (
    id,
    onboarding_id,
    document_type,
    file_name,
    file_path,
    file_size,
    upload_status,
    uploaded_at,
    uploaded_by,
    is_required,
    is_client_visible
  ) VALUES (
    new_document_id,
    onboarding_id,
    document_type,
    file_name,
    file_path,
    file_size,
    'completed',
    now(),
    auth.uid(),
    is_required,
    is_client_visible
  );
  
  -- Update documents uploaded count
  UPDATE attorney_onboarding
  SET 
    documents_uploaded = documents_uploaded + 1,
    updated_at = now()
  WHERE id = onboarding_id;
  
  RETURN new_document_id;
END;
$$;

-- Function to delete attorney document
CREATE OR REPLACE FUNCTION delete_attorney_document(document_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  DELETE FROM attorney_documents
  WHERE id = document_id;
$$;

-- Function to complete attorney onboarding
CREATE OR REPLACE FUNCTION complete_attorney_onboarding(onboarding_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  UPDATE attorney_onboarding
  SET 
    status = 'completed',
    onboarding_stage = 'completed',
    progress_percentage = 100,
    updated_at = now()
  WHERE id = onboarding_id;
$$;
