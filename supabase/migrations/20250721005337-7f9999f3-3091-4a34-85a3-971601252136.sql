-- Create comprehensive goals system for boutique family office experience

-- Goal categories enum
CREATE TYPE public.goal_category AS ENUM (
  'retirement',
  'healthcare_healthspan',
  'travel_bucket_list', 
  'family_experience',
  'charitable_giving',
  'education',
  'real_estate',
  'wedding',
  'vehicle',
  'emergency_fund',
  'debt_paydown',
  'lifetime_gifting',
  'legacy_inheritance',
  'life_insurance',
  'other'
);

-- Goal priority enum
CREATE TYPE public.goal_priority AS ENUM ('low', 'medium', 'high', 'top_aspiration');

-- Goal status enum
CREATE TYPE public.goal_status AS ENUM ('active', 'completed', 'paused', 'archived');

-- Funding frequency enum
CREATE TYPE public.funding_frequency AS ENUM ('monthly', 'quarterly', 'annually', 'one_time');

-- Create the main goals table
CREATE TABLE public.user_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tenant_id UUID NOT NULL DEFAULT get_current_user_tenant_id(),
  
  -- Basic goal information
  name TEXT NOT NULL,
  category public.goal_category NOT NULL,
  description TEXT,
  aspirational_description TEXT, -- "What's your dream/vision?"
  
  -- Financial details
  target_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
  current_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
  target_date DATE,
  monthly_contribution NUMERIC(15,2) DEFAULT 0,
  funding_frequency public.funding_frequency DEFAULT 'monthly',
  
  -- Personalization
  image_url TEXT, -- For uploaded photos
  priority public.goal_priority DEFAULT 'medium',
  status public.goal_status DEFAULT 'active',
  
  -- Family & Experience
  family_member_ids UUID[], -- References to family members
  experience_story TEXT, -- Experience Return/Legacy story
  why_important TEXT, -- Personal motivation
  
  -- Account linking
  linked_account_ids UUID[], -- References to financial accounts
  
  -- Goal-specific fields
  goal_metadata JSONB DEFAULT '{}', -- Flexible storage for category-specific data
  
  -- Tracking
  sort_order INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create goal attachments table for documents/photos
CREATE TABLE public.goal_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id UUID NOT NULL REFERENCES public.user_goals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  
  -- File details
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT,
  
  -- Metadata
  attachment_type TEXT DEFAULT 'document', -- 'document', 'photo', 'inspiration'
  description TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create goal milestones table for tracking progress
CREATE TABLE public.goal_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id UUID NOT NULL REFERENCES public.user_goals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  
  -- Milestone details
  title TEXT NOT NULL,
  description TEXT,
  target_amount NUMERIC(15,2) NOT NULL,
  target_date DATE,
  
  -- Status
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create goal categories reference table with metadata
CREATE TABLE public.goal_category_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category public.goal_category NOT NULL UNIQUE,
  
  -- Display information
  display_name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT, -- Lucide icon name
  image_url TEXT, -- Default inspiration image
  
  -- Template fields
  default_fields JSONB DEFAULT '{}', -- Default form fields for this category
  required_fields TEXT[] DEFAULT '{}', -- Required metadata fields
  suggested_amounts NUMERIC[] DEFAULT '{}', -- Common target amounts
  
  -- Boutique family office copy
  aspirational_prompt TEXT, -- "What's your vision?" prompt
  success_story_example TEXT, -- Example success story
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default goal category templates
INSERT INTO public.goal_category_templates (category, display_name, description, icon_name, aspirational_prompt, suggested_amounts) VALUES
('retirement', 'Retirement Planning', 'Build wealth for your golden years with confidence and purpose', 'Palmtree', 'What does your ideal retirement look like? Freedom to travel, time with family, pursuing passions?', ARRAY[500000, 1000000, 2000000, 5000000]),
('healthcare_healthspan', 'Healthcare & Healthspan', 'Invest in your longevity, preventive care, and optimal wellness', 'Heart', 'How do you envision staying healthy and vibrant? Preventive care, cutting-edge treatments, wellness optimization?', ARRAY[10000, 25000, 50000, 100000]),
('travel_bucket_list', 'Private Travel & Bucket List', 'Create unforgettable experiences and adventures around the world', 'Plane', 'What destinations have you always dreamed of? African safari, Antarctica expedition, culinary tours of Europe?', ARRAY[25000, 50000, 100000, 250000]),
('family_experience', 'Family Experiences', 'Build lasting memories with multi-generational gatherings and milestone celebrations', 'Users', 'What family moments do you want to create? Multi-gen reunions, taking grandkids to Italy, 50th anniversary celebration?', ARRAY[15000, 30000, 75000, 150000]),
('charitable_giving', 'Charitable Giving & Philanthropy', 'Make a meaningful impact through strategic charitable giving and family foundations', 'Heart', 'What causes matter most to you? Annual giving, scholarship funds, supporting your alma mater, community impact?', ARRAY[5000, 25000, 100000, 500000]),
('education', 'Education & Learning', 'Invest in lifelong learning and next-generation education through 529 plans and beyond', 'GraduationCap', 'What educational dreams do you want to fund? Grandchildren''s college, executive education, family learning experiences?', ARRAY[50000, 100000, 250000, 500000]),
('real_estate', 'Real Estate & Second Homes', 'Acquire properties that serve as family gathering places and legacy assets', 'Home', 'What''s your vision for the perfect family retreat? Mountain ski lodge, beach house, European pied-à-terre?', ARRAY[250000, 500000, 1000000, 2500000]),
('wedding', 'Weddings & Celebrations', 'Fund milestone celebrations and once-in-a-lifetime events', 'Heart', 'What celebrations are you dreaming of? Your child''s wedding, vow renewal, milestone anniversary?', ARRAY[25000, 50000, 100000, 200000]),
('vehicle', 'Vehicles & Lifestyle', 'Acquire vehicles, boats, or aircraft that enhance your lifestyle and adventures', 'Car', 'What would enhance your lifestyle? Classic car collection, family boat, private aircraft for convenience?', ARRAY[50000, 100000, 250000, 1000000]),
('emergency_fund', 'Emergency Fund & Cash Reserve', 'Maintain liquidity for peace of mind and unexpected opportunities', 'Shield', 'How much liquidity gives you confidence? Emergency fund, opportunity fund for investments, family security?', ARRAY[25000, 50000, 100000, 250000]),
('debt_paydown', 'Debt Management', 'Strategically eliminate debt to optimize your financial position', 'CreditCard', 'What debt would you like to eliminate? Mortgage optimization, business debt, family loans?', ARRAY[10000, 50000, 100000, 500000]),
('lifetime_gifting', 'Lifetime Gifting', 'Strategic gifting to family and loved ones during your lifetime', 'Gift', 'Who would you like to help during your lifetime? Children, grandchildren, family members in need?', ARRAY[15000, 50000, 100000, 500000]),
('legacy_inheritance', 'Legacy & Inheritance Planning', 'Structure your legacy to benefit future generations and causes you care about', 'Landmark', 'What legacy do you want to leave? Family trust, charitable endowment, business succession?', ARRAY[100000, 500000, 1000000, 5000000]),
('life_insurance', 'Life Insurance Planning', 'Protect your family and optimize your estate through strategic life insurance', 'Shield', 'How much protection does your family need? Income replacement, estate planning, business protection?', ARRAY[500000, 1000000, 2500000, 10000000]),
('other', 'Custom Goal', 'Create a personalized goal that reflects your unique aspirations', 'Target', 'What unique aspiration would you like to pursue? Personal passion project, family business, creative endeavor?', ARRAY[10000, 25000, 50000, 100000]);

-- Enable RLS on all tables
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_category_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_goals
CREATE POLICY "Users can create their own goals"
  ON public.user_goals FOR INSERT
  WITH CHECK (auth.uid() = user_id AND tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can view their own goals"
  ON public.user_goals FOR SELECT
  USING (auth.uid() = user_id AND tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can update their own goals"
  ON public.user_goals FOR UPDATE
  USING (auth.uid() = user_id AND tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can delete their own goals"
  ON public.user_goals FOR DELETE
  USING (auth.uid() = user_id AND tenant_id = get_current_user_tenant_id());

-- RLS Policies for goal_attachments
CREATE POLICY "Users can manage attachments for their goals"
  ON public.goal_attachments FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for goal_milestones
CREATE POLICY "Users can manage milestones for their goals"
  ON public.goal_milestones FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for goal_category_templates (read-only for all users)
CREATE POLICY "Goal category templates are viewable by everyone"
  ON public.goal_category_templates FOR SELECT
  USING (true);

-- Create indexes for performance
CREATE INDEX idx_user_goals_user_id ON public.user_goals(user_id);
CREATE INDEX idx_user_goals_category ON public.user_goals(category);
CREATE INDEX idx_user_goals_status ON public.user_goals(status);
CREATE INDEX idx_user_goals_priority ON public.user_goals(priority);
CREATE INDEX idx_goal_attachments_goal_id ON public.goal_attachments(goal_id);
CREATE INDEX idx_goal_milestones_goal_id ON public.goal_milestones(goal_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_goals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_user_goals_updated_at
  BEFORE UPDATE ON public.user_goals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_goals_updated_at();

-- Create function to calculate goal progress percentage
CREATE OR REPLACE FUNCTION public.calculate_goal_progress(goal_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  goal_record public.user_goals%ROWTYPE;
  progress_percentage NUMERIC;
BEGIN
  SELECT * INTO goal_record FROM public.user_goals WHERE id = goal_id;
  
  IF goal_record.target_amount = 0 THEN
    RETURN 0;
  END IF;
  
  progress_percentage := (goal_record.current_amount / goal_record.target_amount) * 100;
  
  -- Cap at 100%
  IF progress_percentage > 100 THEN
    progress_percentage := 100;
  END IF;
  
  RETURN ROUND(progress_percentage, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;