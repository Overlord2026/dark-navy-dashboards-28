-- Add created_at column to loan_requests if it doesn't exist
ALTER TABLE public.loan_requests ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now();