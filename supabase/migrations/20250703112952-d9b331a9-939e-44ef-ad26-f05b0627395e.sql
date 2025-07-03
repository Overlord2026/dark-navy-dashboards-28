-- Create the investment_accounts table
CREATE TABLE public.investment_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  account_type TEXT NOT NULL CHECK (account_type IN ('brokerage', 'ira', 'roth_ira', '529', 'mutual_fund', 'other')),
  balance NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.investment_accounts ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
CREATE POLICY "Users can view their own investment accounts" 
  ON public.investment_accounts 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own investment accounts" 
  ON public.investment_accounts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own investment accounts" 
  ON public.investment_accounts 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own investment accounts" 
  ON public.investment_accounts 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add trigger for updating the updated_at column
CREATE TRIGGER update_investment_accounts_updated_at
  BEFORE UPDATE ON public.investment_accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();