-- Create the retirement_plans table
CREATE TABLE public.retirement_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('401k', '403b', '457b')),
  provider TEXT NOT NULL,
  balance NUMERIC NOT NULL DEFAULT 0,
  source TEXT NOT NULL CHECK (source IN ('pre_tax', 'roth', 'match')),
  contribution_amount NUMERIC DEFAULT NULL,
  vesting_schedule TEXT DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.retirement_plans ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
CREATE POLICY "Users can view their own retirement plans" 
  ON public.retirement_plans 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own retirement plans" 
  ON public.retirement_plans 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own retirement plans" 
  ON public.retirement_plans 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own retirement plans" 
  ON public.retirement_plans 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add trigger for updating the updated_at column
CREATE TRIGGER update_retirement_plans_updated_at
  BEFORE UPDATE ON public.retirement_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();