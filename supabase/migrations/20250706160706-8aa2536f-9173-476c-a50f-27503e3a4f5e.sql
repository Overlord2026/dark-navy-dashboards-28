-- Add Plaid-specific columns to bank_accounts table
ALTER TABLE public.bank_accounts 
ADD COLUMN plaid_account_id TEXT,
ADD COLUMN plaid_item_id TEXT,
ADD COLUMN plaid_institution_id TEXT,
ADD COLUMN institution_name TEXT,
ADD COLUMN is_plaid_linked BOOLEAN DEFAULT FALSE,
ADD COLUMN last_plaid_sync TIMESTAMP WITH TIME ZONE;

-- Create index for better performance
CREATE INDEX idx_bank_accounts_plaid_item_id ON public.bank_accounts(plaid_item_id);
CREATE INDEX idx_bank_accounts_plaid_account_id ON public.bank_accounts(plaid_account_id);