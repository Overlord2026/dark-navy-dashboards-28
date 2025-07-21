export interface FamilyGoal {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  category: 'emergency' | 'travel' | 'education' | 'gifting' | 'health' | 'experience' | 'legacy' | 'charitable';
  imageUrl?: string;
  owner: string;
  priority: 'high' | 'medium' | 'low';
  status: 'on_track' | 'at_risk' | 'achieved' | 'paused';
}

export interface IncomeStream {
  id: string;
  name: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'annually';
  type: 'employment' | 'business' | 'investment' | 'rental' | 'pension' | 'social_security';
  reliability: 'guaranteed' | 'stable' | 'variable';
}

export interface ExperienceMemory {
  id: string;
  title: string;
  description: string;
  date: Date;
  imageUrl?: string;
  category: 'travel' | 'family' | 'milestone' | 'charitable';
  cost?: number;
  participants: string[];
}

export interface GiftingGoal {
  id: string;
  recipient: string;
  purpose: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
  type: 'education' | 'charitable' | 'family' | 'emergency';
  taxStrategy?: string;
  recurring: boolean;
}

export interface HealthMetrics {
  hsaBalance: number;
  annualHealthBudget: number;
  healthBudgetFunded: number;
  lastPhysical?: Date;
  longevityInsurance: boolean;
  wellnessGoals: {
    target: string;
    progress: number;
    unit: string;
  }[];
}

export interface FamilyOfficeData {
  personalInfo: {
    name: string;
    profileImage?: string;
    familyImage?: string;
    retirementAge: number;
    currentAge: number;
  };
  goals: FamilyGoal[];
  incomeStreams: IncomeStream[];
  experiences: ExperienceMemory[];
  gifting: GiftingGoal[];
  health: HealthMetrics;
  retirementReadiness: {
    score: number;
    onTrack: boolean;
    yearsToGoal: number;
  };
}