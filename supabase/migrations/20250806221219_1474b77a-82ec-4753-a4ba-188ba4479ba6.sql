-- Create enums for bill categories and frequency
CREATE TYPE bill_category AS ENUM (
  'utilities',
  'mortgage', 
  'insurance',
  'tuition',
  'loans',
  'subscriptions',
  'transportation',
  'healthcare',
  'entertainment',
  'other'
);

CREATE TYPE bill_frequency AS ENUM (
  'one_time',
  'weekly', 
  'monthly',
  'quarterly',
  'annual'
);

CREATE TYPE bill_status AS ENUM (
  'unpaid',
  'paid', 
  'overdue',
  'scheduled'
);

CREATE TYPE vendor_type AS ENUM (
  'utility',
  'lender',
  'school',
  'insurance_provider',
  'subscription_service',
  'government',
  'healthcare_provider',
  'other'
);

-- Create vendors table
CREATE TABLE public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type vendor_type NOT NULL DEFAULT 'other',
  contact_info JSONB DEFAULT '{}',
  logo_url TEXT,
  website_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create bills table
CREATE TABLE public.bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  household_id UUID, -- For future family sharing functionality
  vendor_id UUID REFERENCES public.vendors(id),
  biller_name TEXT NOT NULL,
  category bill_category NOT NULL DEFAULT 'other',
  amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  due_date DATE NOT NULL,
  frequency bill_frequency NOT NULL DEFAULT 'monthly',
  status bill_status NOT NULL DEFAULT 'unpaid',
  payment_method TEXT,
  is_auto_pay BOOLEAN DEFAULT false,
  next_due_date DATE, -- For recurring bills
  notes TEXT,
  reminder_days INTEGER DEFAULT 3, -- Days before due date to remind
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create bill transactions table for payment history
CREATE TABLE public.bill_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id UUID NOT NULL REFERENCES public.bills(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method TEXT,
  transaction_status TEXT DEFAULT 'completed' CHECK (transaction_status IN ('completed', 'pending', 'failed')),
  confirmation_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bill_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vendors (public read, admin manage)
CREATE POLICY "Anyone can view active vendors" ON public.vendors
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage vendors" ON public.vendors
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'system_administrator')
    )
  );

-- RLS Policies for bills (user-specific)
CREATE POLICY "Users can view their own bills" ON public.bills
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own bills" ON public.bills
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own bills" ON public.bills
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own bills" ON public.bills
  FOR DELETE USING (user_id = auth.uid());

-- RLS Policies for bill transactions (user-specific)
CREATE POLICY "Users can view their own bill transactions" ON public.bill_transactions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own bill transactions" ON public.bill_transactions
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Create function to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON public.vendors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bills_updated_at BEFORE UPDATE ON public.bills
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to calculate next due date for recurring bills
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
$$ LANGUAGE plpgsql;

-- Create function to update bill status based on due date
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
$$ LANGUAGE plpgsql;

-- Insert some default vendors
INSERT INTO public.vendors (name, type, contact_info) VALUES
  ('Electric Company', 'utility', '{"phone": "1-800-ELECTRIC", "website": "electric.com"}'),
  ('Gas Utility', 'utility', '{"phone": "1-800-GAS-UTIL", "website": "gasutil.com"}'),
  ('Internet Provider', 'utility', '{"phone": "1-800-INTERNET", "website": "isp.com"}'),
  ('Insurance Co.', 'insurance_provider', '{"phone": "1-800-INSURE", "website": "insurance.com"}'),
  ('Credit Card Bank', 'lender', '{"phone": "1-800-CREDIT", "website": "creditbank.com"}');