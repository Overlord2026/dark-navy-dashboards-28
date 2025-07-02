
-- Create the private_equity_accounts table
CREATE TABLE public.private_equity_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  entity_name TEXT NOT NULL,
  valuation NUMERIC NOT NULL DEFAULT 0,
  ownership_percentage NUMERIC,
  entity_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.private_equity_accounts ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
CREATE POLICY "Users can view their own private equity accounts" 
  ON public.private_equity_accounts 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own private equity accounts" 
  ON public.private_equity_accounts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own private equity accounts" 
  ON public.private_equity_accounts 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own private equity accounts" 
  ON public.private_equity_accounts 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add trigger for updating the updated_at column
CREATE TRIGGER update_private_equity_accounts_updated_at
  BEFORE UPDATE ON public.private_equity_accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
