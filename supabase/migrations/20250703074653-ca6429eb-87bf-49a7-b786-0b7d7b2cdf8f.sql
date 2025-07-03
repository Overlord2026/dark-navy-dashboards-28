-- Create the public_stocks table
CREATE TABLE public.public_stocks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  company_name TEXT NOT NULL,
  ticker_symbol TEXT NOT NULL,
  number_of_shares NUMERIC NOT NULL DEFAULT 0,
  price_per_share NUMERIC NOT NULL DEFAULT 0,
  total_value NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.public_stocks ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
CREATE POLICY "Users can view their own public stocks" 
  ON public.public_stocks 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own public stocks" 
  ON public.public_stocks 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own public stocks" 
  ON public.public_stocks 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own public stocks" 
  ON public.public_stocks 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add trigger for updating the updated_at column
CREATE TRIGGER update_public_stocks_updated_at
  BEFORE UPDATE ON public.public_stocks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();