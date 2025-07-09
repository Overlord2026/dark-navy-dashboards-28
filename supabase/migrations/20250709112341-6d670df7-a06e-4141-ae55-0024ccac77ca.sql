-- Add two_factor_enabled column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN two_factor_enabled boolean DEFAULT false;

-- Update the handle_new_user function to include the new column
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, display_name, email, two_factor_enabled)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    COALESCE(
      NEW.raw_user_meta_data->>'display_name',
      (NEW.raw_user_meta_data->>'first_name') || ' ' || (NEW.raw_user_meta_data->>'last_name')
    ),
    NEW.email,
    false
  );
  RETURN NEW;
END;
$$;