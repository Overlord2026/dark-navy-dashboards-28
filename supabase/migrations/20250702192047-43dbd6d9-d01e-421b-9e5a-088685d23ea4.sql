
-- Create a table for user liabilities
CREATE TABLE public.user_liabilities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Auto', 'Mortgage', 'Student', 'Consumer', 'Credit Line', 'Other')),
  current_balance NUMERIC NOT NULL DEFAULT 0,
  original_loan_amount NUMERIC,
  start_date DATE,
  end_date DATE,
  monthly_payment NUMERIC,
  interest_rate NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own liabilities
ALTER TABLE public.user_liabilities ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own liabilities
CREATE POLICY "Users can view their own liabilities" 
  ON public.user_liabilities 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own liabilities
CREATE POLICY "Users can create their own liabilities" 
  ON public.user_liabilities 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own liabilities
CREATE POLICY "Users can update their own liabilities" 
  ON public.user_liabilities 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own liabilities
CREATE POLICY "Users can delete their own liabilities" 
  ON public.user_liabilities 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER update_user_liabilities_updated_at
  BEFORE UPDATE ON public.user_liabilities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
