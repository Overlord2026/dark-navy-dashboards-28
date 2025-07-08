-- Enable real-time updates for bank_accounts table
ALTER TABLE public.bank_accounts REPLICA IDENTITY FULL;

-- Add the bank_accounts table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.bank_accounts;