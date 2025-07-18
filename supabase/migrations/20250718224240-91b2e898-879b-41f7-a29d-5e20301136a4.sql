
-- Update the current logged-in user's role to system_administrator
UPDATE public.profiles 
SET role = 'system_administrator' 
WHERE id = auth.uid();
