import { NILPersonaType, OnboardingFlow, OnboardingStep } from '@/types/nil';

// Define onboarding steps for each persona
export const ONBOARDING_STEPS: Record<NILPersonaType, OnboardingStep[]> = {
  athlete: [
    {
      id: 'personal-info',
      title: 'Personal Information',
      description: 'Set up your profile with basic information',
      required: true,
      completed: false,
      personaTypes: ['athlete'],
      component: 'PersonalInfoStep'
    },
    {
      id: 'sport-details',
      title: 'Sport & School Details',
      description: 'Tell us about your sport and school',
      required: true,
      completed: false,
      personaTypes: ['athlete'],
      component: 'SportDetailsStep'
    },
    {
      id: 'banking-connection',
      title: 'Connect Banking',
      description: 'Link your bank account for payments',
      required: true,
      completed: false,
      personaTypes: ['athlete'],
      component: 'PlaidConnectionStep'
    },
    {
      id: 'document-upload',
      title: 'Upload Documents',
      description: 'Upload required compliance documents',
      required: true,
      completed: false,
      personaTypes: ['athlete'],
      component: 'DocumentUploadStep'
    },
    {
      id: 'invite-team',
      title: 'Invite Your Team',
      description: 'Invite family members or advisors (optional)',
      required: false,
      completed: false,
      personaTypes: ['athlete'],
      component: 'InviteTeamStep'
    },
    {
      id: 'dashboard-tour',
      title: 'Dashboard Tour',
      description: 'Get familiar with your NIL dashboard',
      required: true,
      completed: false,
      personaTypes: ['athlete'],
      component: 'DashboardTourStep'
    }
  ],
  family: [
    {
      id: 'accept-invite',
      title: 'Accept Invitation',
      description: 'Confirm your relationship to the athlete',
      required: true,
      completed: false,
      personaTypes: ['family'],
      component: 'AcceptInviteStep'
    },
    {
      id: 'family-profile',
      title: 'Family Profile Setup',
      description: 'Set up your profile and permissions',
      required: true,
      completed: false,
      personaTypes: ['family'],
      component: 'FamilyProfileStep'
    },
    {
      id: 'family-dashboard-tour',
      title: 'Family Dashboard Tour',
      description: 'Learn about your family tools and access',
      required: true,
      completed: false,
      personaTypes: ['family'],
      component: 'FamilyDashboardTourStep'
    }
  ],
  advisor: [
    {
      id: 'advisor-profile',
      title: 'Professional Profile',
      description: 'Set up your professional information',
      required: true,
      completed: false,
      personaTypes: ['advisor', 'coach'],
      component: 'AdvisorProfileStep'
    },
    {
      id: 'credentials-upload',
      title: 'Upload Credentials',
      description: 'Upload licensing and compliance documents',
      required: true,
      completed: false,
      personaTypes: ['advisor', 'coach'],
      component: 'CredentialsUploadStep'
    },
    {
      id: 'advisor-permissions',
      title: 'Set Permissions',
      description: 'Configure your access to athlete accounts',
      required: true,
      completed: false,
      personaTypes: ['advisor', 'coach'],
      component: 'AdvisorPermissionsStep'
    },
    {
      id: 'advisor-dashboard-tour',
      title: 'Advisor Dashboard Tour',
      description: 'Learn about advisor tools and reporting',
      required: true,
      completed: false,
      personaTypes: ['advisor', 'coach'],
      component: 'AdvisorDashboardTourStep'
    }
  ],
  coach: [
    {
      id: 'advisor-profile',
      title: 'Professional Profile',
      description: 'Set up your professional information',
      required: true,
      completed: false,
      personaTypes: ['advisor', 'coach'],
      component: 'AdvisorProfileStep'
    },
    {
      id: 'credentials-upload',
      title: 'Upload Credentials',
      description: 'Upload licensing and compliance documents',
      required: true,
      completed: false,
      personaTypes: ['advisor', 'coach'],
      component: 'CredentialsUploadStep'
    },
    {
      id: 'advisor-permissions',
      title: 'Set Permissions',
      description: 'Configure your access to athlete accounts',
      required: true,
      completed: false,
      personaTypes: ['advisor', 'coach'],
      component: 'AdvisorPermissionsStep'
    },
    {
      id: 'advisor-dashboard-tour',
      title: 'Advisor Dashboard Tour',
      description: 'Learn about advisor tools and reporting',
      required: true,
      completed: false,
      personaTypes: ['advisor', 'coach'],
      component: 'AdvisorDashboardTourStep'
    }
  ],
  admin: [
    {
      id: 'admin-access',
      title: 'Admin Access Setup',
      description: 'Configure admin permissions and access',
      required: true,
      completed: false,
      personaTypes: ['admin'],
      component: 'AdminAccessStep'
    },
    {
      id: 'compliance-overview',
      title: 'Compliance Overview',
      description: 'Review compliance workflows and requirements',
      required: true,
      completed: false,
      personaTypes: ['admin'],
      component: 'ComplianceOverviewStep'
    },
    {
      id: 'admin-dashboard-tour',
      title: 'Admin Dashboard Tour',
      description: 'Learn about admin tools and management features',
      required: true,
      completed: false,
      personaTypes: ['admin'],
      component: 'AdminDashboardTourStep'
    }
  ],
  brand: [
    {
      id: 'brand-profile',
      title: 'Brand Profile Setup',
      description: 'Set up your brand information',
      required: true,
      completed: false,
      personaTypes: ['brand'],
      component: 'BrandProfileStep'
    },
    {
      id: 'brand-verification',
      title: 'Brand Verification',
      description: 'Verify your brand credentials',
      required: true,
      completed: false,
      personaTypes: ['brand'],
      component: 'BrandVerificationStep'
    },
    {
      id: 'brand-dashboard-tour',
      title: 'Brand Dashboard Tour',
      description: 'Learn about brand tools and athlete marketplace',
      required: true,
      completed: false,
      personaTypes: ['brand'],
      component: 'BrandDashboardTourStep'
    }
  ]
};

export function createOnboardingFlow(personaType: NILPersonaType): OnboardingFlow {
  const steps = ONBOARDING_STEPS[personaType].map(step => ({ ...step }));
  
  return {
    id: `${personaType}-${Date.now()}`,
    personaType,
    steps,
    currentStep: 0,
    completionPercentage: 0,
    estimatedTimeMinutes: getEstimatedTime(personaType)
  };
}

export function getEstimatedTime(personaType: NILPersonaType): number {
  const timeMap: Record<NILPersonaType, number> = {
    athlete: 15,
    family: 8,
    advisor: 12,
    coach: 12,
    admin: 10,
    brand: 10
  };
  
  return timeMap[personaType];
}

export function updateStepCompletion(flow: OnboardingFlow, stepId: string, completed: boolean): OnboardingFlow {
  const updatedSteps = flow.steps.map(step => 
    step.id === stepId ? { ...step, completed } : step
  );
  
  const completedCount = updatedSteps.filter(step => step.completed).length;
  const completionPercentage = Math.round((completedCount / updatedSteps.length) * 100);
  
  // Update current step to next incomplete step
  let currentStep = flow.currentStep;
  if (completed) {
    const nextIncompleteIndex = updatedSteps.findIndex((step, index) => 
      index > currentStep && !step.completed
    );
    if (nextIncompleteIndex >= 0) {
      currentStep = nextIncompleteIndex;
    } else if (completionPercentage === 100) {
      currentStep = updatedSteps.length; // All complete
    }
  }
  
  return {
    ...flow,
    steps: updatedSteps,
    currentStep,
    completionPercentage
  };
}

export function getNextSteps(personaType: NILPersonaType, completedSteps: string[]): string[] {
  const allSteps = ONBOARDING_STEPS[personaType];
  const incomplete = allSteps
    .filter(step => !completedSteps.includes(step.id))
    .slice(0, 3) // Next 3 steps
    .map(step => step.title);
  
  return incomplete;
}

export function isOnboardingComplete(flow: OnboardingFlow): boolean {
  const requiredSteps = flow.steps.filter(step => step.required);
  return requiredSteps.every(step => step.completed);
}