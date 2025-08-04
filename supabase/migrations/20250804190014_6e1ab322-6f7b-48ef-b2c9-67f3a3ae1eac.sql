-- Create attorney CLE requirements table
CREATE TABLE public.attorney_cle_requirements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  state TEXT NOT NULL,
  cle_hours_required INTEGER NOT NULL DEFAULT 12,
  ethics_hours INTEGER DEFAULT 0,
  tech_hours INTEGER DEFAULT 0,
  reporting_deadline TEXT, -- e.g., "December 31", "Birthday month"
  cycle_months INTEGER NOT NULL DEFAULT 12,
  specialty_requirements JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create attorney CLE records table
CREATE TABLE public.attorney_cle_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  state TEXT NOT NULL,
  bar_number TEXT,
  course_name TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_id UUID,
  cle_hours NUMERIC NOT NULL DEFAULT 0,
  ethics_hours NUMERIC DEFAULT 0,
  tech_hours NUMERIC DEFAULT 0,
  date_completed DATE NOT NULL,
  certificate_url TEXT,
  certificate_number TEXT,
  status TEXT NOT NULL DEFAULT 'completed',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create attorney bar status table
CREATE TABLE public.attorney_bar_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  state TEXT NOT NULL,
  bar_number TEXT NOT NULL,
  admission_date DATE,
  expiration_date DATE NOT NULL,
  renewal_status TEXT NOT NULL DEFAULT 'active',
  good_standing BOOLEAN DEFAULT true,
  cle_hours_completed NUMERIC DEFAULT 0,
  ethics_hours_completed NUMERIC DEFAULT 0,
  tech_hours_completed NUMERIC DEFAULT 0,
  cle_hours_required NUMERIC DEFAULT 12,
  ethics_hours_required NUMERIC DEFAULT 0,
  tech_hours_required NUMERIC DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create attorney CLE providers table
CREATE TABLE public.attorney_cle_providers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_name TEXT NOT NULL,
  provider_code TEXT,
  approved_states TEXT[] DEFAULT '{}'::text[],
  url TEXT,
  specialty TEXT[],
  course_catalog_url TEXT,
  contact_info JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create attorney CLE alerts table
CREATE TABLE public.attorney_cle_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  alert_type TEXT NOT NULL,
  due_date DATE,
  priority TEXT DEFAULT 'medium',
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  bar_status_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.attorney_cle_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attorney_cle_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attorney_bar_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attorney_cle_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attorney_cle_alerts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for attorney_cle_requirements
CREATE POLICY "Anyone can view CLE requirements" 
ON public.attorney_cle_requirements 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage CLE requirements" 
ON public.attorney_cle_requirements 
FOR ALL 
USING (has_any_role(ARRAY['admin', 'system_administrator', 'compliance_officer']));

-- Create RLS policies for attorney_cle_records
CREATE POLICY "Users can view their own CLE records" 
ON public.attorney_cle_records 
FOR SELECT 
USING (user_id = auth.uid() OR has_any_role(ARRAY['admin', 'system_administrator', 'compliance_officer']));

CREATE POLICY "Users can create their own CLE records" 
ON public.attorney_cle_records 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own CLE records" 
ON public.attorney_cle_records 
FOR UPDATE 
USING (user_id = auth.uid() OR has_any_role(ARRAY['admin', 'system_administrator', 'compliance_officer']));

CREATE POLICY "Users can delete their own CLE records" 
ON public.attorney_cle_records 
FOR DELETE 
USING (user_id = auth.uid() OR has_any_role(ARRAY['admin', 'system_administrator', 'compliance_officer']));

-- Create RLS policies for attorney_bar_status
CREATE POLICY "Users can view their own bar status" 
ON public.attorney_bar_status 
FOR SELECT 
USING (user_id = auth.uid() OR has_any_role(ARRAY['admin', 'system_administrator', 'compliance_officer']));

CREATE POLICY "Users can create their own bar status" 
ON public.attorney_bar_status 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own bar status" 
ON public.attorney_bar_status 
FOR UPDATE 
USING (user_id = auth.uid() OR has_any_role(ARRAY['admin', 'system_administrator', 'compliance_officer']));

-- Create RLS policies for attorney_cle_providers
CREATE POLICY "Anyone can view active CLE providers" 
ON public.attorney_cle_providers 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage CLE providers" 
ON public.attorney_cle_providers 
FOR ALL 
USING (has_any_role(ARRAY['admin', 'system_administrator', 'compliance_officer']));

-- Create RLS policies for attorney_cle_alerts
CREATE POLICY "Users can view their own CLE alerts" 
ON public.attorney_cle_alerts 
FOR SELECT 
USING (user_id = auth.uid() OR has_any_role(ARRAY['admin', 'system_administrator', 'compliance_officer']));

CREATE POLICY "Users can create their own CLE alerts" 
ON public.attorney_cle_alerts 
FOR INSERT 
WITH CHECK (user_id = auth.uid() OR has_any_role(ARRAY['admin', 'system_administrator', 'compliance_officer']));

CREATE POLICY "Users can update their own CLE alerts" 
ON public.attorney_cle_alerts 
FOR UPDATE 
USING (user_id = auth.uid() OR has_any_role(ARRAY['admin', 'system_administrator', 'compliance_officer']));

-- Add foreign key constraints
ALTER TABLE public.attorney_cle_records 
ADD CONSTRAINT fk_attorney_cle_records_provider 
FOREIGN KEY (provider_id) REFERENCES public.attorney_cle_providers(id);

ALTER TABLE public.attorney_cle_alerts 
ADD CONSTRAINT fk_attorney_cle_alerts_bar_status 
FOREIGN KEY (bar_status_id) REFERENCES public.attorney_bar_status(id);

-- Create indexes for better performance
CREATE INDEX idx_attorney_cle_records_user_id ON public.attorney_cle_records(user_id);
CREATE INDEX idx_attorney_cle_records_state ON public.attorney_cle_records(state);
CREATE INDEX idx_attorney_bar_status_user_id ON public.attorney_bar_status(user_id);
CREATE INDEX idx_attorney_bar_status_state ON public.attorney_bar_status(state);
CREATE INDEX idx_attorney_cle_alerts_user_id ON public.attorney_cle_alerts(user_id);
CREATE INDEX idx_attorney_cle_alerts_due_date ON public.attorney_cle_alerts(due_date);

-- Insert sample CLE requirements for major states
INSERT INTO public.attorney_cle_requirements (state, cle_hours_required, ethics_hours, tech_hours, reporting_deadline, cycle_months, specialty_requirements, notes) VALUES
('CA', 25, 4, 1, 'January 31 (every 3 years)', 36, '[]'::jsonb, 'California requires 25 hours every 3 years including 4 ethics and 1 technology'),
('NY', 24, 4, 1, 'July 31 (biennial)', 24, '[]'::jsonb, 'New York requires 24 hours every 2 years including 4 ethics and 1 technology'),
('TX', 15, 0, 0, 'May 31 (annual)', 12, '[]'::jsonb, 'Texas requires 15 hours annually with no specific ethics requirement'),
('FL', 33, 5, 3, 'May 31 (every 3 years)', 36, '[]'::jsonb, 'Florida requires 33 hours every 3 years including 5 ethics and 3 technology'),
('IL', 20, 4, 0, 'June 30 (biennial)', 24, '[]'::jsonb, 'Illinois requires 20 hours every 2 years including 4 ethics'),
('PA', 12, 0, 0, 'April 30 (annual)', 12, '[]'::jsonb, 'Pennsylvania requires 12 hours annually'),
('OH', 24, 2.5, 1, 'January 31 (biennial)', 24, '[]'::jsonb, 'Ohio requires 24 hours every 2 years including 2.5 ethics and 1 technology'),
('GA', 12, 1, 1, 'December 31 (annual)', 12, '[]'::jsonb, 'Georgia requires 12 hours annually including 1 ethics and 1 technology'),
('NC', 12, 2, 1, 'February 28 (annual)', 12, '[]'::jsonb, 'North Carolina requires 12 hours annually including 2 ethics and 1 technology'),
('MI', 20, 1, 1, 'September 30 (every 3 years)', 36, '[]'::jsonb, 'Michigan requires 20 hours every 3 years including 1 ethics and 1 technology');

-- Insert sample CLE providers
INSERT INTO public.attorney_cle_providers (provider_name, provider_code, approved_states, url, specialty, course_catalog_url, is_active) VALUES
('American Bar Association (ABA)', 'ABA', '{CA,NY,TX,FL,IL,PA,OH,GA,NC,MI,WA,MA,NJ,VA,MD,WI,MN,CO,AZ,TN,IN,MO,SC,AL,LA,KY,OR,IA,KS,AR,MS,UT,NV,NM,WV,NE,ID,NH,HI,ME,MT,RI,DE,SD,ND,AK,VT,WY,DC}', 'https://www.americanbar.org/cle/', '{Ethics,Technology,Trial Practice,Corporate Law,Real Estate,Family Law,Criminal Law,Immigration,Tax Law,Employment Law}', 'https://www.americanbar.org/cle/programs/', true),
('Practising Law Institute (PLI)', 'PLI', '{CA,NY,TX,FL,IL,PA,OH,GA,NC,MI,WA,MA,NJ,VA,MD,WI,MN,CO,AZ,TN}', 'https://www.pli.edu/', '{Corporate Law,Securities,M&A,Real Estate,Tax Law,Employment Law,Litigation,Intellectual Property}', 'https://www.pli.edu/programs', true),
('Lawline', 'LAWLINE', '{CA,NY,TX,FL,IL,PA,OH,GA,NC,MI,WA,MA,NJ,VA,MD,WI,MN,CO,AZ,TN,IN,MO,SC,AL,LA,KY,OR}', 'https://www.lawline.com/', '{Ethics,Technology,Trial Practice,Corporate Law,Real Estate,Family Law,Criminal Law,Immigration,Personal Injury}', 'https://www.lawline.com/cle-courses', true),
('CLE International', 'CLEI', '{CA,NY,TX,FL,IL,PA,OH,GA,NC,MI,WA,MA,NJ,VA,MD}', 'https://www.cleinternational.com/', '{Ethics,Technology,Trial Practice,Corporate Law,International Law,Tax Law}', 'https://www.cleinternational.com/courses', true),
('National Business Institute (NBI)', 'NBI', '{CA,NY,TX,FL,IL,PA,OH,GA,NC,MI,WA,MA,NJ,VA,MD,WI,MN,CO,AZ,TN,IN,MO,SC,AL,LA,KY,OR,IA,KS,AR,MS,UT,NV,NM,WV,NE,ID,NH,HI,ME,MT,RI,DE,SD,ND,AK,VT,WY}', 'https://www.nbi-sems.com/', '{Real Estate,Estate Planning,Family Law,Personal Injury,Employment Law,Ethics,Technology}', 'https://www.nbi-sems.com/seminars', true),
('Strafford', 'STRAFFORD', '{CA,NY,TX,FL,IL,PA,OH,GA,NC,MI,WA,MA,NJ,VA,MD,WI,MN,CO,AZ,TN}', 'https://www.straffordpub.com/', '{Securities,Corporate Law,Employment Law,Real Estate,Tax Law,Environmental Law,Healthcare Law}', 'https://www.straffordpub.com/cle', true),
('West LegalEdcenter', 'WEST', '{CA,NY,TX,FL,IL,PA,OH,GA,NC,MI,WA,MA,NJ,VA,MD,WI,MN,CO,AZ,TN,IN,MO,SC,AL,LA,KY,OR}', 'https://www.westlegaledcenter.com/', '{Ethics,Technology,Trial Practice,Corporate Law,Real Estate,Family Law,Criminal Law,Immigration,Tax Law}', 'https://www.westlegaledcenter.com/programs', true);