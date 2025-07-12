-- Create transfers table for tracking money transfers between accounts
CREATE TABLE public.transfers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  from_account_id UUID NOT NULL,
  to_account_id UUID NOT NULL,
  amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
  transfer_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  description TEXT,
  reference_number TEXT UNIQUE NOT NULL DEFAULT CONCAT('TXN-', UPPER(REPLACE(gen_random_uuid()::TEXT, '-', '')::TEXT)),
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT fk_transfers_from_account FOREIGN KEY (from_account_id) REFERENCES public.bank_accounts(id) ON DELETE RESTRICT,
  CONSTRAINT fk_transfers_to_account FOREIGN KEY (to_account_id) REFERENCES public.bank_accounts(id) ON DELETE RESTRICT,
  CONSTRAINT different_accounts CHECK (from_account_id != to_account_id)
);

-- Enable Row Level Security
ALTER TABLE public.transfers ENABLE ROW LEVEL SECURITY;

-- Create policies for transfers
CREATE POLICY "Users can view their own transfers" 
ON public.transfers 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transfers" 
ON public.transfers 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transfers" 
ON public.transfers 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE TRIGGER update_transfers_updated_at
BEFORE UPDATE ON public.transfers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_transfers_user_id ON public.transfers(user_id);
CREATE INDEX idx_transfers_from_account ON public.transfers(from_account_id);
CREATE INDEX idx_transfers_to_account ON public.transfers(to_account_id);
CREATE INDEX idx_transfers_status ON public.transfers(status);
CREATE INDEX idx_transfers_created_at ON public.transfers(created_at DESC);

-- Enable realtime for transfers table
ALTER TABLE public.transfers REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.transfers;