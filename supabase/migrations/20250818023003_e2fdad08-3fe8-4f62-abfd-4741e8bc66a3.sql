-- Create NIL athletes table
CREATE TABLE public.nil_athletes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  athlete_name TEXT NOT NULL,
  sport TEXT NOT NULL,
  school TEXT NOT NULL,
  bio TEXT,
  hourly_rate NUMERIC NOT NULL DEFAULT 0,
  profile_image_url TEXT,
  compliance_status TEXT NOT NULL DEFAULT 'pending' CHECK (compliance_status IN ('pending', 'approved', 'rejected')),
  is_available BOOLEAN NOT NULL DEFAULT true,
  session_types TEXT[] DEFAULT ARRAY['mentoring', 'training', 'qa'],
  social_links JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create NIL booking requests table
CREATE TABLE public.nil_booking_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  athlete_id UUID NOT NULL REFERENCES public.nil_athletes(id) ON DELETE CASCADE,
  client_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL,
  requested_duration INTEGER NOT NULL DEFAULT 60, -- minutes
  preferred_date DATE NOT NULL,
  preferred_time TIME NOT NULL,
  message TEXT,
  client_age INTEGER,
  parent_consent BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed', 'cancelled')),
  total_cost NUMERIC,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.nil_athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nil_booking_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for nil_athletes
CREATE POLICY "Anyone can view approved athletes" ON public.nil_athletes
  FOR SELECT USING (compliance_status = 'approved' AND is_available = true);

CREATE POLICY "Athletes can manage their own profile" ON public.nil_athletes
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for booking requests
CREATE POLICY "Users can view their own booking requests" ON public.nil_booking_requests
  FOR SELECT USING (auth.uid() = client_user_id);

CREATE POLICY "Users can create booking requests" ON public.nil_booking_requests
  FOR INSERT WITH CHECK (auth.uid() = client_user_id);

CREATE POLICY "Athletes can view bookings for their profile" ON public.nil_booking_requests
  FOR SELECT USING (athlete_id IN (
    SELECT id FROM public.nil_athletes WHERE user_id = auth.uid()
  ));

CREATE POLICY "Athletes can update booking status" ON public.nil_booking_requests
  FOR UPDATE USING (athlete_id IN (
    SELECT id FROM public.nil_athletes WHERE user_id = auth.uid()
  ));

-- Update triggers
CREATE TRIGGER update_nil_athletes_updated_at
  BEFORE UPDATE ON public.nil_athletes
  FOR EACH ROW EXECUTE FUNCTION public.update_nil_updated_at();

CREATE TRIGGER update_nil_booking_requests_updated_at
  BEFORE UPDATE ON public.nil_booking_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_nil_updated_at();