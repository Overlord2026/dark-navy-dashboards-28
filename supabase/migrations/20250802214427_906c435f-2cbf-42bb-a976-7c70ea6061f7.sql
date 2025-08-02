-- Create CRM contacts table
CREATE TABLE public.crm_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  role TEXT,
  status TEXT NOT NULL DEFAULT 'lead' CHECK (status IN ('lead', 'prospect', 'client', 'inactive')),
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  last_contact TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create CRM pipeline items table
CREATE TABLE public.crm_pipeline_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id UUID,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  stage_id TEXT NOT NULL,
  value NUMERIC,
  probability INTEGER,
  expected_close DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create CRM activities table
CREATE TABLE public.crm_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id UUID,
  contact_name TEXT NOT NULL,
  contact_email TEXT,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('call', 'email', 'meeting', 'note', 'task', 'deal_update')),
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER,
  outcome TEXT,
  next_steps TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create CRM reminders table
CREATE TABLE public.crm_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id UUID,
  contact_name TEXT NOT NULL,
  contact_email TEXT,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('follow_up', 'renewal', 'birthday', 'anniversary', 'ce_credits', 'compliance', 'custom')),
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'snoozed')),
  auto_generated BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_pipeline_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_reminders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their own CRM contacts" ON public.crm_contacts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own pipeline items" ON public.crm_pipeline_items
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own activities" ON public.crm_activities
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own reminders" ON public.crm_reminders
  FOR ALL USING (auth.uid() = user_id);