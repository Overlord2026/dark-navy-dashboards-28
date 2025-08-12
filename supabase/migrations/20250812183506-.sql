-- Extend education_resources table with missing fields for legacy compatibility
ALTER TABLE public.education_resources 
ADD COLUMN IF NOT EXISTS author text,
ADD COLUMN IF NOT EXISTS cover_image text,
ADD COLUMN IF NOT EXISTS level text CHECK (level IN ('beginner', 'intermediate', 'advanced')),
ADD COLUMN IF NOT EXISTS is_paid boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS ghl_url text,
ADD COLUMN IF NOT EXISTS duration text,
ADD COLUMN IF NOT EXISTS tags text[],
ADD COLUMN IF NOT EXISTS rating numeric CHECK (rating >= 0 AND rating <= 5),
ADD COLUMN IF NOT EXISTS difficulty text,
ADD COLUMN IF NOT EXISTS persona text,
ADD COLUMN IF NOT EXISTS image text;