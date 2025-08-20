// SMART Goals System - Comprehensive Goal Types

export type Persona = "aspiring" | "retiree";
export type GoalKind = "financial" | "bucket";

export type FundingSplit = {
  prePaycheck?: { amount: number; cadence: "weekly" | "biweekly" | "monthly" };
  postPaycheck?: { amount: number; day: number };
  autoIncreasePct?: number; // e.g., 3
};

export type Goal = {
  id: string;
  persona: Persona;
  kind: GoalKind;
  priority: number;
  name: string;
  cover?: string; // url or vault id
  specific?: { destination?: string; experiences?: string[]; description?: string };
  measurable: { unit: "usd" | "trips" | "items"; target: number; current: number };
  relevant?: { why?: string; invitedProId?: string };
  timeBound?: { deadline?: string; window?: { month?: number; year?: number } };
  funding?: FundingSplit;
  createdAt: string;
  // Additional fields for system compatibility
  user_id?: string;
  tenant_id?: string;
  status?: GoalStatus;
  updated_at?: string;
};

// Legacy types for backward compatibility
export type GoalStatus = 'active' | 'completed' | 'paused' | 'on_track' | 'at_risk' | 'achieved';
export type GoalPriority = 'low' | 'medium' | 'high' | 'top_aspiration';

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

// Backward compatibility helpers for legacy goal structure
export const adaptLegacyGoal = (legacyGoal: any): Goal => {
  return {
    id: legacyGoal.id,
    persona: 'aspiring' as Persona,
    kind: 'financial' as GoalKind,
    priority: legacyGoal.priority === 'top_aspiration' ? 1 : 
              legacyGoal.priority === 'high' ? 2 :
              legacyGoal.priority === 'medium' ? 3 : 4,
    name: legacyGoal.name || legacyGoal.title || '',
    cover: legacyGoal.image_url || legacyGoal.imageUrl,
    specific: {
      description: legacyGoal.description || legacyGoal.aspirational_description
    },
    measurable: {
      unit: 'usd',
      target: legacyGoal.target_amount || legacyGoal.targetAmount || 0,
      current: legacyGoal.current_amount || legacyGoal.savedAmount || 0
    },
    relevant: {
      why: legacyGoal.why_important || legacyGoal.experience_story
    },
    timeBound: legacyGoal.target_date || legacyGoal.targetDate ? {
      deadline: legacyGoal.target_date || legacyGoal.targetDate
    } : undefined,
    funding: legacyGoal.monthly_contribution || legacyGoal.monthlyPlan ? {
      prePaycheck: {
        amount: legacyGoal.monthly_contribution || legacyGoal.monthlyPlan?.pre || 0,
        cadence: 'monthly'
      }
    } : undefined,
    createdAt: legacyGoal.created_at || new Date().toISOString(),
    user_id: legacyGoal.user_id,
    tenant_id: legacyGoal.tenant_id,
    status: legacyGoal.status,
    updated_at: legacyGoal.updated_at
  };
};