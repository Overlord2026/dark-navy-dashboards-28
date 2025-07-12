-- Add Stripe ACH fields to transfers table
ALTER TABLE transfers ADD COLUMN IF NOT EXISTS stripe_debit_payment_intent_id TEXT;
ALTER TABLE transfers ADD COLUMN IF NOT EXISTS stripe_credit_payment_intent_id TEXT;
ALTER TABLE transfers ADD COLUMN IF NOT EXISTS ach_debit_status TEXT;
ALTER TABLE transfers ADD COLUMN IF NOT EXISTS ach_credit_status TEXT;
ALTER TABLE transfers ADD COLUMN IF NOT EXISTS funds_held_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE transfers ADD COLUMN IF NOT EXISTS estimated_completion_date DATE;
ALTER TABLE transfers ADD COLUMN IF NOT EXISTS ach_return_code TEXT;
ALTER TABLE transfers ADD COLUMN IF NOT EXISTS failure_reason TEXT;
ALTER TABLE transfers ADD COLUMN IF NOT EXISTS transfer_type TEXT DEFAULT 'internal';

-- Create ACH events log table
CREATE TABLE IF NOT EXISTS ach_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transfer_id UUID REFERENCES transfers(id) ON DELETE CASCADE,
  stripe_event_id TEXT UNIQUE,
  event_type TEXT NOT NULL,
  event_data JSONB,
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on ach_events table
ALTER TABLE ach_events ENABLE ROW LEVEL SECURITY;

-- Create policies for ach_events
CREATE POLICY "Users can view ACH events for their transfers" ON ach_events
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM transfers 
    WHERE transfers.id = ach_events.transfer_id 
    AND transfers.user_id = auth.uid()
  )
);

-- Add bank account fields for ACH
ALTER TABLE bank_accounts ADD COLUMN IF NOT EXISTS stripe_account_id TEXT;
ALTER TABLE bank_accounts ADD COLUMN IF NOT EXISTS ach_enabled BOOLEAN DEFAULT false;
ALTER TABLE bank_accounts ADD COLUMN IF NOT EXISTS routing_number TEXT;
ALTER TABLE bank_accounts ADD COLUMN IF NOT EXISTS account_number_last4 TEXT;