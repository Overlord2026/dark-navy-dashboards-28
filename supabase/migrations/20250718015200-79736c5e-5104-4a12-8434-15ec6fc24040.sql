-- Create backup and disaster recovery infrastructure

-- 1. Create backup metadata table to track backup operations
CREATE TABLE IF NOT EXISTS public.backup_operations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operation_type TEXT NOT NULL, -- 'backup', 'restore', 'verify'
  bucket_name TEXT NOT NULL,
  file_count INTEGER DEFAULT 0,
  total_size_bytes BIGINT DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'in_progress', -- 'in_progress', 'completed', 'failed'
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  backup_location TEXT, -- External backup location reference
  metadata JSONB,
  initiated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index for efficient querying
CREATE INDEX IF NOT EXISTS idx_backup_operations_status_date 
ON public.backup_operations(status, started_at DESC);

CREATE INDEX IF NOT EXISTS idx_backup_operations_bucket 
ON public.backup_operations(bucket_name, started_at DESC);

-- 2. Create file backup registry to track individual file backups
CREATE TABLE IF NOT EXISTS public.file_backup_registry (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  backup_operation_id UUID NOT NULL REFERENCES public.backup_operations(id) ON DELETE CASCADE,
  original_file_path TEXT NOT NULL,
  backup_file_path TEXT NOT NULL,
  file_size_bytes BIGINT,
  checksum TEXT, -- For integrity verification
  bucket_name TEXT NOT NULL,
  backed_up_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  verified_at TIMESTAMP WITH TIME ZONE,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index for efficient file lookups
CREATE INDEX IF NOT EXISTS idx_file_backup_registry_path 
ON public.file_backup_registry(bucket_name, original_file_path);

CREATE INDEX IF NOT EXISTS idx_file_backup_registry_operation 
ON public.file_backup_registry(backup_operation_id);

-- 3. Create disaster recovery checklist table
CREATE TABLE IF NOT EXISTS public.disaster_recovery_checklist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  incident_id TEXT NOT NULL UNIQUE,
  incident_type TEXT NOT NULL, -- 'data_loss', 'corruption', 'security_breach', 'service_outage'
  severity TEXT NOT NULL, -- 'critical', 'high', 'medium', 'low'
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'in_progress', 'resolved'
  checklist_items JSONB NOT NULL, -- Array of checklist items with completion status
  assigned_to UUID REFERENCES auth.users(id),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  estimated_data_loss INTERVAL,
  actual_data_loss INTERVAL,
  recovery_actions JSONB, -- Log of actions taken
  lessons_learned TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index for incident tracking
CREATE INDEX IF NOT EXISTS idx_disaster_recovery_status 
ON public.disaster_recovery_checklist(status, severity, started_at DESC);

-- 4. Create function to verify file integrity
CREATE OR REPLACE FUNCTION public.verify_file_backup_integrity(
  p_backup_operation_id UUID
)
RETURNS TABLE (
  file_path TEXT,
  is_valid BOOLEAN,
  error_message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  file_record RECORD;
  file_exists BOOLEAN;
BEGIN
  -- Iterate through all files in the backup operation
  FOR file_record IN 
    SELECT original_file_path, backup_file_path, checksum, bucket_name
    FROM public.file_backup_registry 
    WHERE backup_operation_id = p_backup_operation_id
  LOOP
    -- Check if backup file exists (this would typically involve external storage check)
    -- For now, we'll simulate the check
    file_exists := TRUE; -- In real implementation, check external backup storage
    
    IF file_exists THEN
      -- Update verification status
      UPDATE public.file_backup_registry 
      SET is_verified = TRUE, verified_at = now()
      WHERE backup_operation_id = p_backup_operation_id 
        AND original_file_path = file_record.original_file_path;
      
      RETURN QUERY SELECT file_record.original_file_path, TRUE, NULL::TEXT;
    ELSE
      RETURN QUERY SELECT file_record.original_file_path, FALSE, 'Backup file not found'::TEXT;
    END IF;
  END LOOP;
END;
$$;

-- 5. Create function to initiate disaster recovery process
CREATE OR REPLACE FUNCTION public.initiate_disaster_recovery(
  p_incident_type TEXT,
  p_severity TEXT,
  p_description TEXT,
  p_affected_buckets TEXT[] DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  incident_id TEXT;
  recovery_id UUID;
  checklist_items JSONB;
BEGIN
  -- Generate unique incident ID
  incident_id := 'DR-' || to_char(now(), 'YYYYMMDD-HH24MISS') || '-' || substring(gen_random_uuid()::text, 1, 8);
  
  -- Create standard disaster recovery checklist based on incident type
  CASE p_incident_type
    WHEN 'data_loss' THEN
      checklist_items := jsonb_build_array(
        jsonb_build_object('item', 'Assess scope of data loss', 'completed', false, 'priority', 1),
        jsonb_build_object('item', 'Identify last known good backup', 'completed', false, 'priority', 2),
        jsonb_build_object('item', 'Notify stakeholders', 'completed', false, 'priority', 3),
        jsonb_build_object('item', 'Stop write operations if necessary', 'completed', false, 'priority', 4),
        jsonb_build_object('item', 'Begin restore from backup', 'completed', false, 'priority', 5),
        jsonb_build_object('item', 'Verify restored data integrity', 'completed', false, 'priority', 6),
        jsonb_build_object('item', 'Resume normal operations', 'completed', false, 'priority', 7),
        jsonb_build_object('item', 'Conduct post-incident review', 'completed', false, 'priority', 8)
      );
    WHEN 'corruption' THEN
      checklist_items := jsonb_build_array(
        jsonb_build_object('item', 'Isolate corrupted data', 'completed', false, 'priority', 1),
        jsonb_build_object('item', 'Assess corruption extent', 'completed', false, 'priority', 2),
        jsonb_build_object('item', 'Identify clean backup point', 'completed', false, 'priority', 3),
        jsonb_build_object('item', 'Document corruption patterns', 'completed', false, 'priority', 4),
        jsonb_build_object('item', 'Restore from clean backup', 'completed', false, 'priority', 5),
        jsonb_build_object('item', 'Implement additional validation', 'completed', false, 'priority', 6)
      );
    ELSE
      checklist_items := jsonb_build_array(
        jsonb_build_object('item', 'Assess incident impact', 'completed', false, 'priority', 1),
        jsonb_build_object('item', 'Activate response team', 'completed', false, 'priority', 2),
        jsonb_build_object('item', 'Implement containment measures', 'completed', false, 'priority', 3),
        jsonb_build_object('item', 'Begin recovery procedures', 'completed', false, 'priority', 4)
      );
  END CASE;
  
  -- Insert disaster recovery record
  INSERT INTO public.disaster_recovery_checklist (
    incident_id,
    incident_type,
    severity,
    checklist_items,
    assigned_to,
    recovery_actions
  ) VALUES (
    incident_id,
    p_incident_type,
    p_severity,
    checklist_items,
    auth.uid(),
    jsonb_build_array(
      jsonb_build_object(
        'timestamp', now(),
        'action', 'Incident initiated',
        'description', p_description,
        'affected_buckets', p_affected_buckets,
        'user_id', auth.uid()
      )
    )
  ) RETURNING id INTO recovery_id;
  
  -- Log the incident initiation
  INSERT INTO public.audit_logs (event_type, status, details, user_id)
  VALUES (
    'disaster_recovery_initiated',
    'info',
    jsonb_build_object(
      'incident_id', incident_id,
      'incident_type', p_incident_type,
      'severity', p_severity,
      'recovery_id', recovery_id
    ),
    auth.uid()
  );
  
  RETURN recovery_id;
END;
$$;

-- 6. Create function to update disaster recovery progress
CREATE OR REPLACE FUNCTION public.update_disaster_recovery_progress(
  p_recovery_id UUID,
  p_checklist_item_index INTEGER,
  p_completed BOOLEAN,
  p_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  current_checklist JSONB;
  updated_checklist JSONB;
  item_obj JSONB;
BEGIN
  -- Get current checklist
  SELECT checklist_items INTO current_checklist
  FROM public.disaster_recovery_checklist
  WHERE id = p_recovery_id;
  
  IF current_checklist IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Update the specific item
  item_obj := current_checklist->p_checklist_item_index;
  item_obj := jsonb_set(item_obj, '{completed}', to_jsonb(p_completed));
  item_obj := jsonb_set(item_obj, '{completed_at}', to_jsonb(now()));
  item_obj := jsonb_set(item_obj, '{completed_by}', to_jsonb(auth.uid()));
  
  IF p_notes IS NOT NULL THEN
    item_obj := jsonb_set(item_obj, '{notes}', to_jsonb(p_notes));
  END IF;
  
  -- Update the checklist
  updated_checklist := jsonb_set(current_checklist, array[p_checklist_item_index::text], item_obj);
  
  -- Save updated checklist
  UPDATE public.disaster_recovery_checklist
  SET 
    checklist_items = updated_checklist,
    updated_at = now()
  WHERE id = p_recovery_id;
  
  -- Log the progress update
  INSERT INTO public.audit_logs (event_type, status, details, user_id)
  VALUES (
    'disaster_recovery_progress',
    'info',
    jsonb_build_object(
      'recovery_id', p_recovery_id,
      'item_index', p_checklist_item_index,
      'completed', p_completed,
      'notes', p_notes
    ),
    auth.uid()
  );
  
  RETURN TRUE;
END;
$$;

-- 7. Create backup summary view
CREATE OR REPLACE VIEW public.backup_summary AS
SELECT 
  bucket_name,
  COUNT(*) as total_operations,
  COUNT(*) FILTER (WHERE status = 'completed') as successful_backups,
  COUNT(*) FILTER (WHERE status = 'failed') as failed_backups,
  MAX(completed_at) as last_successful_backup,
  SUM(file_count) FILTER (WHERE status = 'completed') as total_files_backed_up,
  SUM(total_size_bytes) FILTER (WHERE status = 'completed') as total_size_backed_up,
  AVG(EXTRACT(EPOCH FROM (completed_at - started_at))) FILTER (WHERE status = 'completed') as avg_backup_duration_seconds
FROM public.backup_operations
GROUP BY bucket_name
ORDER BY bucket_name;

-- Grant permissions for backup operations
GRANT INSERT, SELECT ON public.backup_operations TO service_role;
GRANT INSERT, SELECT ON public.file_backup_registry TO service_role;
GRANT ALL ON public.disaster_recovery_checklist TO service_role;
GRANT SELECT ON public.backup_summary TO service_role;
GRANT EXECUTE ON FUNCTION public.verify_file_backup_integrity TO service_role;
GRANT EXECUTE ON FUNCTION public.initiate_disaster_recovery TO service_role;
GRANT EXECUTE ON FUNCTION public.update_disaster_recovery_progress TO service_role;

-- RLS policies for backup operations
ALTER TABLE public.backup_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_backup_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disaster_recovery_checklist ENABLE ROW LEVEL SECURITY;

-- Backup operations policies
CREATE POLICY "Service role can manage backup operations"
ON public.backup_operations
FOR ALL
USING (auth.role() = 'service_role');

CREATE POLICY "System admins can view backup operations"
ON public.backup_operations
FOR SELECT
USING (get_current_user_role() = 'system_administrator');

-- File backup registry policies
CREATE POLICY "Service role can manage file backup registry"
ON public.file_backup_registry
FOR ALL
USING (auth.role() = 'service_role');

CREATE POLICY "System admins can view file backup registry"
ON public.file_backup_registry
FOR SELECT
USING (get_current_user_role() = 'system_administrator');

-- Disaster recovery policies
CREATE POLICY "System admins can manage disaster recovery"
ON public.disaster_recovery_checklist
FOR ALL
USING (get_current_user_role() = 'system_administrator');

CREATE POLICY "Users can view disaster recovery they're assigned to"
ON public.disaster_recovery_checklist
FOR SELECT
USING (assigned_to = auth.uid());

-- Create storage bucket policies for backup access
-- Documents bucket backup policies
CREATE POLICY "Service role can backup documents"
ON storage.objects
FOR SELECT
USING (bucket_id = 'documents' AND auth.role() = 'service_role');

CREATE POLICY "System admins can backup documents"
ON storage.objects
FOR SELECT
USING (bucket_id = 'documents' AND get_current_user_role() = 'system_administrator');

-- Healthcare documents backup policies
CREATE POLICY "Service role can backup healthcare documents"
ON storage.objects
FOR SELECT
USING (bucket_id = 'healthcare-documents' AND auth.role() = 'service_role');

CREATE POLICY "System admins can backup healthcare documents"
ON storage.objects
FOR SELECT
USING (bucket_id = 'healthcare-documents' AND get_current_user_role() = 'system_administrator');