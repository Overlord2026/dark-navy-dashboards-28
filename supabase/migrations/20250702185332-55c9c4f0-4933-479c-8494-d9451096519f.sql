
-- Create a table for digital assets
CREATE TABLE public.digital_assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  asset_type TEXT NOT NULL,
  custom_asset_type TEXT,
  quantity NUMERIC NOT NULL,
  price_per_unit NUMERIC NOT NULL,
  total_value NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own digital assets
ALTER TABLE public.digital_assets ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own digital assets
CREATE POLICY "Users can view their own digital assets" 
  ON public.digital_assets 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own digital assets
CREATE POLICY "Users can create their own digital assets" 
  ON public.digital_assets 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own digital assets
CREATE POLICY "Users can update their own digital assets" 
  ON public.digital_assets 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own digital assets
CREATE POLICY "Users can delete their own digital assets" 
  ON public.digital_assets 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create trigger to update the updated_at column
CREATE TRIGGER update_digital_assets_updated_at
  BEFORE UPDATE ON public.digital_assets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
