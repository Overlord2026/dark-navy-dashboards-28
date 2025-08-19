-- Create tools_results table for saving tool outputs
CREATE TABLE public.tools_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tool_key TEXT NOT NULL,
  inputs JSONB NOT NULL DEFAULT '{}',
  outputs JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tools_results ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Users can manage their own tool results"
ON public.tools_results
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);