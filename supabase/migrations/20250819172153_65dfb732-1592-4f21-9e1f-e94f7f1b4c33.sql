-- Create tools_results table for saving tool outputs
CREATE TABLE IF NOT EXISTS public.tools_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_key TEXT NOT NULL,
  inputs JSONB NOT NULL DEFAULT '{}',
  outputs JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tools_results ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own tool results"
ON public.tools_results
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create index for performance
CREATE INDEX idx_tools_results_user_tool ON public.tools_results(user_id, tool_key);
CREATE INDEX idx_tools_results_created_at ON public.tools_results(created_at);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tools_results_updated_at
  BEFORE UPDATE ON public.tools_results
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();