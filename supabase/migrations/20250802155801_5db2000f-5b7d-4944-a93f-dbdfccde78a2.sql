-- Add professional segments and extended professional data
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS segment TEXT;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS min_client_assets BIGINT;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS typical_engagement_fee TEXT;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS aum_minimums BIGINT;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS license_states TEXT[];
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS practice_areas TEXT[];
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS client_capacity INTEGER;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS accepts_referrals BOOLEAN DEFAULT true;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS referral_fee_structure TEXT;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS onboarding_process TEXT;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS compliance_status TEXT DEFAULT 'pending';
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS marketplace_tier TEXT DEFAULT 'standard';

-- Create professional onboarding table
CREATE TABLE IF NOT EXISTS professional_onboarding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  professional_type TEXT NOT NULL,
  segment TEXT NOT NULL,
  current_step TEXT DEFAULT 'profile_setup',
  form_data JSONB DEFAULT '{}',
  uploaded_documents TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'in_progress',
  submitted_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE professional_onboarding ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own onboarding" 
ON professional_onboarding 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all onboarding" 
ON professional_onboarding 
FOR SELECT 
USING (has_any_role(ARRAY['admin', 'system_administrator', 'tenant_admin']));

-- Create indexes
CREATE INDEX idx_professional_onboarding_user_id ON professional_onboarding(user_id);
CREATE INDEX idx_professional_onboarding_segment ON professional_onboarding(segment);
CREATE INDEX idx_professional_onboarding_status ON professional_onboarding(status);