import { SubscriptionTier } from './familiesPricingTiers';

export type FamilySegment = 'Aspiring' | 'Retirees' | 'HNW' | 'UHNW';

export interface NILEntitlements {
  athleteEducation: {
    basic: { modules: number; resources: number };
    premium: { modules: number; resources: number; aiTutor: boolean };
    elite: { modules: number; resources: number; aiTutor: boolean; personalCoach: boolean };
  };
  agentTools: {
    basic: { clientLimit: number; complianceAlerts: boolean };
    premium: { clientLimit: number; complianceAlerts: boolean; advancedReporting: boolean };
    elite: { clientLimit: number; complianceAlerts: boolean; advancedReporting: boolean; whiteLabel: boolean };
  };
  disclosureManagement: {
    basic: { templatesLimit: number; automatedFiling: boolean };
    premium: { templatesLimit: number; automatedFiling: boolean; aiReview: boolean };
    elite: { templatesLimit: number; automatedFiling: boolean; aiReview: boolean; legalReview: boolean };
  };
}

export interface AgentFeature {
  id: string;
  name: string;
  description: string;
  category: 'compliance' | 'education' | 'management' | 'analytics';
  requiredTier: SubscriptionTier;
  quotas?: Record<SubscriptionTier, number>;
}

export interface AthleteSegment {
  id: string;
  name: string;
  description: string;
  educationFocus: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export const nilEntitlements: NILEntitlements = {
  athleteEducation: {
    basic: { modules: 5, resources: 20 },
    premium: { modules: 15, resources: 100, aiTutor: true },
    elite: { modules: 999, resources: 999, aiTutor: true, personalCoach: true }
  },
  agentTools: {
    basic: { clientLimit: 10, complianceAlerts: true },
    premium: { clientLimit: 50, complianceAlerts: true, advancedReporting: true },
    elite: { clientLimit: 999, complianceAlerts: true, advancedReporting: true, whiteLabel: true }
  },
  disclosureManagement: {
    basic: { templatesLimit: 5, automatedFiling: false },
    premium: { templatesLimit: 20, automatedFiling: true, aiReview: true },
    elite: { templatesLimit: 999, automatedFiling: true, aiReview: true, legalReview: true }
  }
};

export const agentFeatures: AgentFeature[] = [
  {
    id: 'client-management',
    name: 'Client Management',
    description: 'Track and manage athlete clients',
    category: 'management',
    requiredTier: 'basic',
    quotas: { basic: 10, premium: 50, elite: 999 }
  },
  {
    id: 'compliance-dashboard',
    name: 'Compliance Dashboard',
    description: 'Monitor NIL compliance requirements',
    category: 'compliance',
    requiredTier: 'basic'
  },
  {
    id: 'disclosure-templates',
    name: 'Disclosure Templates',
    description: 'Pre-built NIL disclosure templates',
    category: 'compliance',
    requiredTier: 'basic',
    quotas: { basic: 5, premium: 20, elite: 999 }
  },
  {
    id: 'ai-contract-review',
    name: 'AI Contract Review',
    description: 'AI-powered contract analysis',
    category: 'compliance',
    requiredTier: 'premium'
  },
  {
    id: 'advanced-analytics',
    name: 'Advanced Analytics',
    description: 'Detailed performance and compliance analytics',
    category: 'analytics',
    requiredTier: 'premium'
  },
  {
    id: 'white-label-portal',
    name: 'White-label Portal',
    description: 'Branded client portal',
    category: 'management',
    requiredTier: 'elite'
  }
];

export const athleteSegments: AthleteSegment[] = [
  {
    id: 'high-school',
    name: 'High School Athletes',
    description: 'Preparing for college recruitment',
    educationFocus: ['NIL Basics', 'Social Media Guidelines', 'Academic Balance'],
    riskLevel: 'medium'
  },
  {
    id: 'college-freshman',
    name: 'College Freshmen',
    description: 'New to NIL opportunities',
    educationFocus: ['NIL Rights', 'Contract Basics', 'Compliance Requirements'],
    riskLevel: 'high'
  },
  {
    id: 'college-veteran',
    name: 'College Veterans',
    description: 'Experienced college athletes',
    educationFocus: ['Advanced Contracts', 'Tax Implications', 'Professional Prep'],
    riskLevel: 'low'
  },
  {
    id: 'professional-bound',
    name: 'Professional Bound',
    description: 'Transitioning to professional sports',
    educationFocus: ['Professional Contracts', 'Financial Planning', 'Career Transition'],
    riskLevel: 'medium'
  }
];