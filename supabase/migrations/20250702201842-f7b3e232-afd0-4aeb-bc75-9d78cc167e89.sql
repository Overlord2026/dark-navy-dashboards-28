
-- Create the other_assets table
CREATE TABLE public.other_assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  owner TEXT NOT NULL DEFAULT 'Self',
  value NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.other_assets ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
CREATE POLICY "Users can view their own other assets" 
  ON public.other_assets 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own other assets" 
  ON public.other_assets 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own other assets" 
  ON public.other_assets 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own other assets" 
  ON public.other_assets 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add trigger for updating the updated_at column
CREATE TRIGGER update_other_assets_updated_at
  BEFORE UPDATE ON public.other_assets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
