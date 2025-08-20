// Updated Goal Types for Goals & Aspirations Module

export type GoalKind = "financial" | "bucket";

export type Goal = {
  id: string;
  kind: GoalKind;
  persona: "aspiring" | "retiree";
  priority: number;
  title: string;           // "Greece 2026" | "Emergency Fund"
  imageUrl?: string;       // bucket-list cover
  targetAmount?: number;   // $ for financial
  savedAmount?: number;    // $ progress
  metricTarget?: number;   // e.g., 3 cities
  metricProgress?: number; // e.g., 1 city
  targetDate?: string;     // ISO 8601
  notes?: string;
  monthlyPlan?: { pre?: number; post?: { amount: number; day: number } };
  // Additional fields for compatibility
  user_id?: string;
  tenant_id?: string;
  status?: GoalStatus;
  created_at?: string;
  updated_at?: string;
};

// Legacy types for backward compatibility
export type GoalCategory = 
  | 'retirement'
  | 'healthcare_healthspan'
  | 'travel_bucket_list'
  | 'family_experience'
  | 'charitable_giving'
  | 'education'
  | 'real_estate'
  | 'wedding'
  | 'vehicle'
  | 'emergency_fund'
  | 'debt_paydown'
  | 'lifetime_gifting'
  | 'legacy_inheritance'
  | 'life_insurance'
  | 'other';

export type GoalStatus = 'active' | 'completed' | 'paused' | 'on_track' | 'at_risk' | 'achieved';

export type GoalPriority = 'low' | 'medium' | 'high' | 'top_aspiration';

export type FundingFrequency = 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'one_time';

export interface GoalMilestone {
  id: string;
  goal_id: string;
  user_id: string;
  title: string;
  description: string;
  target_amount: number;
  target_date: string;
  achieved: boolean;
  achieved_date: string | null;
  celebration_message: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface GoalTemplate {
  id: string;
  category: GoalCategory;
  display_name: string;
  description: string;
  icon_name: string;
  image_url: string | null;
  default_fields: Record<string, any>;
  required_fields: string[];
  suggested_amounts: number[];
  aspirational_prompt: string;
  success_story_example: string | null;
  created_at: string;
  updated_at: string;
}

export interface GoalAttachment {
  id: string;
  goal_id: string;
  user_id: string;
  filename: string;
  file_url: string;
  file_type: string;
  file_size: number;
  uploaded_at: string;
  description: string | null;
}

// Progress calculation helpers
export interface GoalProgress {
  percentage: number;
  amount_remaining: number;
  days_remaining: number;
  monthly_target: number;
  on_track: boolean;
  projected_completion: string | null;
}

// Family Office specific enhancements
export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  role: 'primary' | 'spouse' | 'child' | 'parent' | 'other';
}

export interface GoalStats {
  total_goals: number;
  active_goals: number;
  completed_goals: number;
  total_saved: number;
  total_target: number;
  average_progress: number;
  on_track_count: number;
  at_risk_count: number;
}