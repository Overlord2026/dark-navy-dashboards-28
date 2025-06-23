
-- Create table to store OTP codes
CREATE TABLE public.user_otp_codes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  otp_code text NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  is_used boolean NOT NULL DEFAULT false,
  attempts integer NOT NULL DEFAULT 0
);

-- Add Row Level Security
ALTER TABLE public.user_otp_codes ENABLE ROW LEVEL SECURITY;

-- Create policies for OTP codes
CREATE POLICY "Users can view their own OTP codes" 
  ON public.user_otp_codes 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own OTP codes" 
  ON public.user_otp_codes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own OTP codes" 
  ON public.user_otp_codes 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create function to clean up expired OTP codes
CREATE OR REPLACE FUNCTION public.cleanup_expired_otp_codes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.user_otp_codes 
  WHERE expires_at < now() OR is_used = true;
END;
$$;

-- Create function to validate OTP attempts
CREATE OR REPLACE FUNCTION public.validate_otp_code(
  p_user_id uuid,
  p_otp_code text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_record record;
BEGIN
  -- Get the latest unused OTP for this user
  SELECT * INTO v_record
  FROM public.user_otp_codes
  WHERE user_id = p_user_id
    AND is_used = false
    AND expires_at > now()
    AND attempts < 3
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- If no valid OTP found, return false
  IF v_record IS NULL THEN
    RETURN false;
  END IF;
  
  -- Increment attempt counter
  UPDATE public.user_otp_codes
  SET attempts = attempts + 1
  WHERE id = v_record.id;
  
  -- Check if OTP matches
  IF v_record.otp_code = p_otp_code THEN
    -- Mark as used
    UPDATE public.user_otp_codes
    SET is_used = true
    WHERE id = v_record.id;
    
    -- Clean up old codes for this user
    DELETE FROM public.user_otp_codes
    WHERE user_id = p_user_id AND id != v_record.id;
    
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;
