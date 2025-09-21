-- Create bidirectional professional request system for families and professionals

-- First, create professional collaboration requests table
CREATE TABLE public.professional_collaboration_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  family_user_id uuid NOT NULL,
  professional_user_id uuid,
  professional_type text NOT NULL CHECK (professional_type IN ('advisor', 'attorney', 'accountant', 'insurance_agent')),
  request_type text NOT NULL CHECK (request_type IN ('estate_review', 'swag_analysis_review', 'tax_planning', 'insurance_review')),
  tool_data jsonb,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'declined')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  message text,
  due_date timestamp with time zone,
  professional_notes text,
  family_feedback text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.professional_collaboration_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for the collaboration requests table
CREATE POLICY "Families can create collaboration requests"
  ON public.professional_collaboration_requests
  FOR INSERT
  WITH CHECK (family_user_id = auth.uid());

CREATE POLICY "Families can view their own requests"
  ON public.professional_collaboration_requests
  FOR SELECT
  USING (family_user_id = auth.uid());

CREATE POLICY "Families can update their own requests"
  ON public.professional_collaboration_requests
  FOR UPDATE
  USING (family_user_id = auth.uid());

CREATE POLICY "Professionals can view requests assigned to them"
  ON public.professional_collaboration_requests
  FOR SELECT
  USING (professional_user_id = auth.uid());

CREATE POLICY "Professionals can update requests assigned to them"
  ON public.professional_collaboration_requests
  FOR UPDATE
  USING (professional_user_id = auth.uid());

-- Create workflow automation tracking table
CREATE TABLE public.workflow_automations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trigger_type text NOT NULL CHECK (trigger_type IN ('family_tool_completion', 'professional_task_completion', 'document_update', 'milestone_reached')),
  trigger_data jsonb NOT NULL,
  target_user_id uuid NOT NULL,
  target_professional_type text CHECK (target_professional_type IN ('advisor', 'attorney', 'accountant', 'insurance_agent')),
  action_type text NOT NULL CHECK (action_type IN ('create_task', 'send_notification', 'request_review', 'schedule_meeting')),
  action_data jsonb,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  processed_at timestamp with time zone,
  error_message text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS  
ALTER TABLE public.workflow_automations ENABLE ROW LEVEL SECURITY;

-- Create policies for workflow automations
CREATE POLICY "Users can view automations targeting them"
  ON public.workflow_automations
  FOR SELECT
  USING (target_user_id = auth.uid());

CREATE POLICY "System can manage workflow automations"
  ON public.workflow_automations
  FOR ALL
  USING (auth.role() = 'service_role');

-- Create function to trigger collaboration request
CREATE OR REPLACE FUNCTION public.request_professional_collaboration(
  p_professional_type text,
  p_request_type text,
  p_tool_data jsonb DEFAULT NULL,
  p_message text DEFAULT NULL,
  p_due_date timestamp with time zone DEFAULT NULL,
  p_professional_user_id uuid DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  request_id uuid;
BEGIN
  -- Verify user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Insert collaboration request
  INSERT INTO public.professional_collaboration_requests (
    family_user_id,
    professional_user_id,
    professional_type,
    request_type,
    tool_data,
    message,
    due_date
  ) VALUES (
    auth.uid(),
    p_professional_user_id,
    p_professional_type,
    p_request_type,
    p_tool_data,
    p_message,
    p_due_date
  ) RETURNING id INTO request_id;

  -- Create workflow automation for notification
  INSERT INTO public.workflow_automations (
    trigger_type,
    trigger_data,
    target_user_id,
    target_professional_type,
    action_type,
    action_data
  ) VALUES (
    'family_tool_completion',
    jsonb_build_object(
      'request_id', request_id,
      'family_user_id', auth.uid(),
      'request_type', p_request_type
    ),
    COALESCE(p_professional_user_id, auth.uid()),
    p_professional_type,
    'send_notification',
    jsonb_build_object(
      'message', 'New collaboration request from family',
      'request_id', request_id
    )
  );

  RETURN request_id;
END;
$$;

-- Create function to accept/decline professional requests
CREATE OR REPLACE FUNCTION public.respond_to_collaboration_request(
  p_request_id uuid,
  p_status text,
  p_professional_notes text DEFAULT NULL
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Update request status
  UPDATE public.professional_collaboration_requests
  SET 
    status = p_status,
    professional_notes = p_professional_notes,
    professional_user_id = CASE 
      WHEN professional_user_id IS NULL THEN auth.uid()
      ELSE professional_user_id
    END,
    updated_at = now()
  WHERE id = p_request_id
    AND (professional_user_id = auth.uid() OR professional_user_id IS NULL);

  -- Create workflow automation for status update
  INSERT INTO public.workflow_automations (
    trigger_type,
    trigger_data,
    target_user_id,
    action_type,
    action_data
  ) SELECT
    'professional_task_completion',
    jsonb_build_object(
      'request_id', p_request_id,
      'status', p_status,
      'professional_id', auth.uid()
    ),
    family_user_id,
    'send_notification',
    jsonb_build_object(
      'message', 'Professional has responded to your collaboration request',
      'status', p_status,
      'request_id', p_request_id
    )
  FROM public.professional_collaboration_requests
  WHERE id = p_request_id;

  RETURN TRUE;
END;
$$;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_collaboration_requests_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_collaboration_requests_updated_at
  BEFORE UPDATE ON public.professional_collaboration_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_collaboration_requests_updated_at();