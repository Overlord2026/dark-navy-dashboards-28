-- Create proof_slips table for tracking assisted action logs
CREATE TABLE IF NOT EXISTS public.proof_slips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id TEXT NOT NULL,
  proof_type TEXT NOT NULL,
  summary TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.proof_slips ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own proof slips" ON public.proof_slips;
DROP POLICY IF EXISTS "Users can create their own proof slips" ON public.proof_slips;

-- Create RLS policies
CREATE POLICY "Users can view their own proof slips"
ON public.proof_slips
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own proof slips"
ON public.proof_slips  
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_proof_slips_job_id ON public.proof_slips(job_id);
CREATE INDEX IF NOT EXISTS idx_proof_slips_user_id ON public.proof_slips(user_id);