-- Create tools_results table to store tool calculation results
CREATE TABLE public.tools_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  tool_type text NOT NULL,
  inputs jsonb NOT NULL DEFAULT '{}',
  outputs jsonb NOT NULL DEFAULT '{}',
  score numeric,
  recommendations jsonb DEFAULT '[]',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tools_results ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own tool results" 
  ON public.tools_results 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tool results" 
  ON public.tools_results 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tool results" 
  ON public.tools_results 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tool results" 
  ON public.tools_results 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_tools_results_updated_at
  BEFORE UPDATE ON public.tools_results
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_touch_updated_at();

-- Create index for performance
CREATE INDEX idx_tools_results_user_tool ON public.tools_results(user_id, tool_type);
CREATE INDEX idx_tools_results_created_at ON public.tools_results(created_at DESC);