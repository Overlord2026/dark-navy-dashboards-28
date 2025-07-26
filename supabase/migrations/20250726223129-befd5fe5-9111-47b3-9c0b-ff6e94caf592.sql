-- Add external verification fields to professionals table
ALTER TABLE public.professionals 
ADD COLUMN external_verification_id TEXT,
ADD COLUMN external_review_score NUMERIC;

-- Add comments for the new columns
COMMENT ON COLUMN public.professionals.external_verification_id IS 'External verification identifier from services like CFP Board, CAIS, Martindale, etc.';
COMMENT ON COLUMN public.professionals.external_review_score IS 'Numeric review/rating score from external verification services (0-100 scale)';