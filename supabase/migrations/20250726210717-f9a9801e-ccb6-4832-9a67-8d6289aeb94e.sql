-- Fix function search path security warning
CREATE OR REPLACE FUNCTION public.update_charity_annual_totals()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Update the charity's annual raised amount
  UPDATE public.charities 
  SET annual_raised = (
    SELECT COALESCE(SUM(amount), 0) 
    FROM public.user_donations 
    WHERE charity_id = COALESCE(NEW.charity_id, OLD.charity_id)
    AND EXTRACT(YEAR FROM donation_date) = EXTRACT(YEAR FROM CURRENT_DATE)
  )
  WHERE id = COALESCE(NEW.charity_id, OLD.charity_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;