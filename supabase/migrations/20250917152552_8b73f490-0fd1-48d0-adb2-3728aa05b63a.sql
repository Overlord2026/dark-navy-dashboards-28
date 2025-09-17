-- Add payment responsibility column to prospect_invitations table
ALTER TABLE public.prospect_invitations 
ADD COLUMN IF NOT EXISTS payment_responsibility TEXT DEFAULT 'client_paid';