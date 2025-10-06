// Updated Goal types for comprehensive goals management system

export type Persona = "aspiring" | "retiree" | "family" | "advisor";
export type GoalType = 'bucket_list' | 'retirement' | 'savings' | 'education' | 'wedding' | 'emergency' | 'down_payment' | 'debt' | 'custom';
export type GoalPriority = 'low' | 'medium' | 'high' | 'top_aspiration';

export interface Goal {
  id: string;
  type: GoalType;
  title: string;
  imageUrl?: string;
  targetAmount?: number;
  targetDate?: string; // ISO
  smartr?: {
    specific?: string;
    measurable?: string;
    achievable?: string;
    relevant?: string;
    timeBound?: string;
    rewards?: string;
  };
  assignedAccountIds: string[];
  monthlyContribution?: number;
  persona?: Persona;
  progress: {
    current: number;
    pct: number;
  };
  priority?: GoalPriority;
  createdAt: string;
  updatedAt: string;
}

// Account type for assignments
export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'investment' | 'retirement';
  balance: number;
  institution: string;
}

// Persona defaults configuration
export interface PersonaDefaults {
  persona: Persona;
  goals: Omit<Goal, 'id' | 'createdAt' | 'updatedAt' | 'assignedAccountIds'>[];
}

// API request/response types
export interface CreateGoalRequest {
  type: GoalType;
  title: string;
  imageUrl?: string;
  targetAmount?: number;
  targetDate?: string;
  smartr?: Goal['smartr'];
  monthlyContribution?: number;
  persona: Persona;
  priority?: number;
}

export interface UpdateGoalRequest extends Partial<CreateGoalRequest> {
  id: string;
}

export interface AssignAccountsRequest {
  goalId: string;
  accountIds: string[];
}

export interface SetContributionPlanRequest {
  goalId: string;
  monthlyContribution: number;
  targetDate?: string;
}

// Legacy types for backward compatibility
export type GoalStatus = 'active' | 'completed' | 'paused' | 'on_track' | 'at_risk' | 'achieved';

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