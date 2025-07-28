-- Create loan_status_updates table
CREATE TABLE public.loan_status_updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  loan_id UUID NOT NULL,
  status TEXT NOT NULL,
  message TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);

-- Create loan_messages table for secure messaging
CREATE TABLE public.loan_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  loan_id UUID NOT NULL,
  sender_id UUID NOT NULL,
  recipient_id UUID,
  message_type TEXT NOT NULL DEFAULT 'text',
  content TEXT NOT NULL,
  attachments TEXT[],
  is_read BOOLEAN DEFAULT false,
  thread_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add missing columns to loan_requests table
ALTER TABLE public.loan_requests ADD COLUMN IF NOT EXISTS partner_id UUID;
ALTER TABLE public.loan_requests ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now();
ALTER TABLE public.loan_requests ADD COLUMN IF NOT EXISTS application_data JSONB DEFAULT '{}';
ALTER TABLE public.loan_requests ADD COLUMN IF NOT EXISTS eligibility_result JSONB;
ALTER TABLE public.loan_requests ADD COLUMN IF NOT EXISTS compliance_status TEXT DEFAULT 'pending';

-- Enable RLS on new tables
ALTER TABLE public.loan_status_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for loan_status_updates
CREATE POLICY "Users can view status updates for their loans" 
ON public.loan_status_updates 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM loan_requests lr 
    WHERE lr.id = loan_status_updates.loan_id 
    AND lr.user_id = auth.uid()
  )
);

CREATE POLICY "Advisors can view status updates for assigned loans" 
ON public.loan_status_updates 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM loan_requests lr
    JOIN advisor_assignments aa ON lr.user_id = aa.client_id
    WHERE lr.id = loan_status_updates.loan_id 
    AND aa.advisor_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all status updates" 
ON public.loan_status_updates 
FOR ALL 
USING (has_any_role(ARRAY['admin', 'tenant_admin', 'system_administrator']));

-- RLS Policies for loan_messages
CREATE POLICY "Users can view messages for their loans" 
ON public.loan_messages 
FOR SELECT 
USING (
  sender_id = auth.uid() OR recipient_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM loan_requests lr 
    WHERE lr.id = loan_messages.loan_id 
    AND lr.user_id = auth.uid()
  )
);

CREATE POLICY "Users can send messages for their loans" 
ON public.loan_messages 
FOR INSERT 
WITH CHECK (
  sender_id = auth.uid() AND (
    EXISTS (
      SELECT 1 FROM loan_requests lr 
      WHERE lr.id = loan_messages.loan_id 
      AND lr.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM loan_requests lr
      JOIN advisor_assignments aa ON lr.user_id = aa.client_id
      WHERE lr.id = loan_messages.loan_id 
      AND aa.advisor_id = auth.uid()
    )
  )
);

CREATE POLICY "Users can update their own messages" 
ON public.loan_messages 
FOR UPDATE 
USING (sender_id = auth.uid());

-- Create indexes for performance
CREATE INDEX idx_loan_status_updates_loan_id ON public.loan_status_updates(loan_id);
CREATE INDEX idx_loan_status_updates_created_at ON public.loan_status_updates(created_at);
CREATE INDEX idx_loan_messages_loan_id ON public.loan_messages(loan_id);
CREATE INDEX idx_loan_messages_sender_id ON public.loan_messages(sender_id);
CREATE INDEX idx_loan_messages_recipient_id ON public.loan_messages(recipient_id);

-- Add update triggers
CREATE TRIGGER update_loan_messages_updated_at
  BEFORE UPDATE ON public.loan_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add audit logging triggers
CREATE TRIGGER audit_loan_status_updates
  AFTER INSERT OR UPDATE OR DELETE ON public.loan_status_updates
  FOR EACH ROW
  EXECUTE FUNCTION public.log_product_changes();

CREATE TRIGGER audit_loan_messages
  AFTER INSERT OR UPDATE OR DELETE ON public.loan_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.log_product_changes();

-- Enable realtime for status updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.loan_status_updates;
ALTER PUBLICATION supabase_realtime ADD TABLE public.loan_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.loan_requests;

-- Set replica identity for realtime
ALTER TABLE public.loan_status_updates REPLICA IDENTITY FULL;
ALTER TABLE public.loan_messages REPLICA IDENTITY FULL;
ALTER TABLE public.loan_requests REPLICA IDENTITY FULL;