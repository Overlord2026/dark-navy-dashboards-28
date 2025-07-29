-- Clean up test users, keeping only production superusers
DELETE FROM auth.users 
WHERE email NOT IN ('tonygomes88@gmail.com', 'votepedro1988@gmail.com');

-- Also clean up corresponding profiles
DELETE FROM public.profiles 
WHERE id NOT IN (
  SELECT id FROM auth.users 
  WHERE email IN ('tonygomes88@gmail.com', 'votepedro1988@gmail.com')
);