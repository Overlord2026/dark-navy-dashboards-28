-- Create decision_rds table for tracking decision receipts
CREATE TABLE IF NOT EXISTS public.decision_rds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  action TEXT NOT NULL,
  reasons JSONB DEFAULT '[]'::jsonb,
  receipt_hash TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  anchored_at TIMESTAMP WITH TIME ZONE,
  anchor_ref JSONB,
  user_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.decision_rds ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own decision receipts" 
ON public.decision_rds FOR SELECT 
USING (user_id = auth.uid() OR auth.uid() IN (SELECT user_id FROM public.admin_users));

CREATE POLICY "System can insert decision receipts" 
ON public.decision_rds FOR INSERT 
WITH CHECK (user_id = auth.uid() OR auth.role() = 'service_role');

-- Create view for the admin interface
CREATE OR REPLACE VIEW public.v_decision_receipts AS
SELECT 
  id,
  subject,
  action,
  reasons,
  receipt_hash,
  created_at,
  anchored_at,
  anchor_ref
FROM public.decision_rds
ORDER BY created_at DESC;