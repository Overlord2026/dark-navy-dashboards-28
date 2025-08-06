-- Fix security definer functions and add proper search paths
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.calculate_next_due_date(
  current_due_date DATE,
  bill_frequency bill_frequency
) RETURNS DATE AS $$
BEGIN
  CASE bill_frequency
    WHEN 'weekly' THEN
      RETURN current_due_date + INTERVAL '1 week';
    WHEN 'monthly' THEN
      RETURN current_due_date + INTERVAL '1 month';
    WHEN 'quarterly' THEN
      RETURN current_due_date + INTERVAL '3 months';
    WHEN 'annual' THEN
      RETURN current_due_date + INTERVAL '1 year';
    ELSE
      RETURN NULL; -- one_time bills don't have next due date
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.update_bill_status()
RETURNS void AS $$
BEGIN
  -- Mark bills as overdue if past due date and not paid
  UPDATE public.bills 
  SET status = 'overdue'
  WHERE due_date < CURRENT_DATE 
    AND status IN ('unpaid', 'scheduled');
    
  -- Update next_due_date for recurring bills when marked as paid
  UPDATE public.bills 
  SET 
    next_due_date = public.calculate_next_due_date(due_date, frequency),
    due_date = public.calculate_next_due_date(due_date, frequency)
  WHERE status = 'paid' 
    AND frequency != 'one_time'
    AND next_due_date IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create a security definer function to safely check user roles without RLS recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT COALESCE(role, 'user') FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Update the vendor policies to use the security definer function
DROP POLICY IF EXISTS "Admins can manage vendors" ON public.vendors;

CREATE POLICY "Admins can manage vendors" ON public.vendors
  FOR ALL USING (
    public.get_current_user_role() IN ('admin', 'system_administrator')
  );