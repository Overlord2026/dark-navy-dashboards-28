-- Create the real_estate_properties table
CREATE TABLE public.real_estate_properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  property_type TEXT NOT NULL CHECK (property_type IN ('residence', 'rental', 'vacation', 'business', 'other')),
  current_market_value NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.real_estate_properties ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
CREATE POLICY "Users can view their own real estate properties" 
  ON public.real_estate_properties 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own real estate properties" 
  ON public.real_estate_properties 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own real estate properties" 
  ON public.real_estate_properties 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own real estate properties" 
  ON public.real_estate_properties 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add trigger for updating the updated_at column
CREATE TRIGGER update_real_estate_properties_updated_at
  BEFORE UPDATE ON public.real_estate_properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();