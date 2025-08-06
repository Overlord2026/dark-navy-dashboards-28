import { useState, useEffect, useCallback } from 'react';
import { usePersona } from '@/context/PersonaContext';
import { useEventTracking } from '@/hooks/useEventTracking';
import { AllPersonaTypes } from '@/types/personas';

interface OnboardingProgress {
  currentStep: number;
  totalSteps: number;
  completedSteps: string[];
  isCompleted: boolean;
  personaDetected: boolean;
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  required: boolean;
  completed: boolean;
  persona?: AllPersonaTypes[];
}

export const useOnboarding = () => {
  const { currentPersona, isNewUser } = usePersona();
  const { trackUserOnboarding } = useEventTracking();
  
  const [progress, setProgress] = useState<OnboardingProgress>({
    currentStep: 0,
    totalSteps: 0,
    completedSteps: [],
    isCompleted: false,
    personaDetected: false
  });

  const [showOnboarding, setShowOnboarding] = useState(false);

  // Define persona-specific onboarding steps
  const getStepsForPersona = useCallback((persona: AllPersonaTypes): OnboardingStep[] => {
    const commonSteps: OnboardingStep[] = [
      {
        id: 'persona_welcome',
        title: 'Welcome',
        description: 'Learn about your persona benefits',
        required: true,
        completed: false
      },
      {
        id: 'swag_intro',
        title: 'SWAG Lead Score™',
        description: 'Discover your AI-powered scoring system',
        required: true,
        completed: false
      },
      {
        id: 'profile_setup',
        title: 'Profile Setup',
        description: 'Complete your professional profile',
        required: true,
        completed: false
      },
      {
        id: 'viral_share',
        title: 'Share & Invite',
        description: 'Invite colleagues for rewards',
        required: false,
        completed: false
      }
    ];

    const personaSpecificSteps: Record<AllPersonaTypes, OnboardingStep[]> = {
      advisor: [
        ...commonSteps,
        {
          id: 'client_matching',
          title: 'Client Matching',
          description: 'Set up your client preferences',
          required: true,
          completed: false,
          persona: ['advisor']
        },
        {
          id: 'availability_setup',
          title: 'Availability',
          description: 'Configure your calendar',
          required: true,
          completed: false,
          persona: ['advisor']
        }
      ],
      attorney: [
        ...commonSteps,
        {
          id: 'document_vault',
          title: 'Document Vault',
          description: 'Set up secure document storage',
          required: true,
          completed: false,
          persona: ['attorney']
        },
        {
          id: 'compliance_setup',
          title: 'Compliance Setup',
          description: 'Configure legal compliance tools',
          required: true,
          completed: false,
          persona: ['attorney']
        }
      ],
      accountant: [
        ...commonSteps,
        {
          id: 'tax_workflows',
          title: 'Tax Workflows',
          description: 'Set up automated tax processes',
          required: true,
          completed: false,
          persona: ['accountant']
        },
        {
          id: 'ria_integration',
          title: 'RIA Integration',
          description: 'Connect with advisory partners',
          required: false,
          completed: false,
          persona: ['accountant']
        }
      ],
      cpa: [
        ...commonSteps,
        {
          id: 'tax_workflows',
          title: 'Tax Workflows',
          description: 'Set up automated tax processes',
          required: true,
          completed: false,
          persona: ['cpa']
        },
        {
          id: 'ce_tracking',
          title: 'CE Tracking',
          description: 'Set up continuing education tracking',
          required: true,
          completed: false,
          persona: ['cpa']
        }
      ],
      coach: [
        ...commonSteps,
        {
          id: 'workshop_setup',
          title: 'Workshop Creation',
          description: 'Create your first workshop',
          required: true,
          completed: false,
          persona: ['coach']
        },
        {
          id: 'branding_setup',
          title: 'Brand Profile',
          description: 'Customize your professional brand',
          required: false,
          completed: false,
          persona: ['coach']
        }
      ],
      consultant: [
        ...commonSteps,
        {
          id: 'expertise_showcase',
          title: 'Expertise Showcase',
          description: 'Highlight your specializations',
          required: true,
          completed: false,
          persona: ['consultant']
        }
      ],
      compliance: [
        ...commonSteps,
        {
          id: 'compliance_dashboard',
          title: 'Compliance Dashboard',
          description: 'Set up monitoring and tracking',
          required: true,
          completed: false,
          persona: ['compliance']
        },
        {
          id: 'audit_setup',
          title: 'Mock Audit Setup',
          description: 'Configure audit preparation tools',
          required: true,
          completed: false,
          persona: ['compliance']
        }
      ],
      imo_fmo: [
        ...commonSteps,
        {
          id: 'agent_network',
          title: 'Agent Network',
          description: 'Connect with your agents',
          required: true,
          completed: false,
          persona: ['imo_fmo']
        },
        {
          id: 'training_materials',
          title: 'Training Setup',
          description: 'Upload training content',
          required: false,
          completed: false,
          persona: ['imo_fmo']
        }
      ],
      agency: [
        ...commonSteps,
        {
          id: 'campaign_setup',
          title: 'Campaign Management',
          description: 'Set up lead generation campaigns',
          required: true,
          completed: false,
          persona: ['agency']
        },
        {
          id: 'analytics_setup',
          title: 'Analytics Dashboard',
          description: 'Configure performance tracking',
          required: true,
          completed: false,
          persona: ['agency']
        }
      ],
      organization: [
        ...commonSteps,
        {
          id: 'member_management',
          title: 'Member Management',
          description: 'Set up member networking tools',
          required: true,
          completed: false,
          persona: ['organization']
        },
        {
          id: 'webinar_setup',
          title: 'Webinar Platform',
          description: 'Configure educational hosting',
          required: false,
          completed: false,
          persona: ['organization']
        }
      ],
      hnw_client: [
        ...commonSteps.filter(step => step.id !== 'viral_share'),
        {
          id: 'wealth_questionnaire',
          title: 'Wealth Assessment',
          description: 'Complete your financial profile',
          required: true,
          completed: false,
          persona: ['hnw_client']
        },
        {
          id: 'advisor_matching',
          title: 'Find Advisors',
          description: 'Get matched with professionals',
          required: true,
          completed: false,
          persona: ['hnw_client']
        }
      ],
      pre_retiree: [
        ...commonSteps,
        {
          id: 'retirement_planning',
          title: 'Retirement Strategy',
          description: 'Set up your retirement plan',
          required: true,
          completed: false,
          persona: ['pre_retiree']
        }
      ],
      next_gen: [
        ...commonSteps,
        {
          id: 'wealth_building',
          title: 'Wealth Building Plan',
          description: 'Start your investment journey',
          required: true,
          completed: false,
          persona: ['next_gen']
        }
      ],
      family_office_admin: [
        ...commonSteps,
        {
          id: 'family_coordination',
          title: 'Family Coordination',
          description: 'Set up family office tools',
          required: true,
          completed: false,
          persona: ['family_office_admin']
        }
      ],
      client: [
        ...commonSteps.filter(step => step.id !== 'viral_share'),
        {
          id: 'wealth_questionnaire',
          title: 'Wealth Assessment',
          description: 'Complete your financial profile',
          required: true,
          completed: false,
          persona: ['client']
        },
        {
          id: 'advisor_matching',
          title: 'Find Advisors',
          description: 'Get matched with professionals',
          required: true,
          completed: false,
          persona: ['client']
        }
      ],
      enterprise_admin: [
        ...commonSteps,
        {
          id: 'enterprise_setup',
          title: 'Enterprise Configuration',
          description: 'Configure enterprise settings',
          required: true,
          completed: false,
          persona: ['enterprise_admin']
        }
      ],
      vip_reserved: [
        {
          id: 'vip_welcome',
          title: 'VIP Welcome',
          description: 'Exclusive founding member benefits',
          required: true,
          completed: false,
          persona: ['vip_reserved']
        },
        {
          id: 'profile_claim',
          title: 'Claim Profile',
          description: 'Activate your reserved profile',
          required: true,
          completed: false,
          persona: ['vip_reserved']
        },
        ...commonSteps.slice(1) // Skip regular welcome
      ],
      insurance_agent: [
        ...commonSteps,
        {
          id: 'quote_management',
          title: 'Quote System',
          description: 'Set up insurance quoting tools',
          required: true,
          completed: false,
          persona: ['insurance_agent']
        }
      ],
      healthcare_consultant: [
        ...commonSteps,
        {
          id: 'health_planning',
          title: 'Health Planning Tools',
          description: 'Configure wellness and health planning',
          required: true,
          completed: false,
          persona: ['healthcare_consultant']
        }
      ],
      realtor: [
        ...commonSteps,
        {
          id: 'property_showcase',
          title: 'Property Portfolio',
          description: 'Showcase your property listings',
          required: true,
          completed: false,
          persona: ['realtor']
        },
        {
          id: 'client_preferences',
          title: 'Client Preferences',
          description: 'Set up property matching criteria',
          required: true,
          completed: false,
          persona: ['realtor']
        }
      ],
      property_manager: [
        ...commonSteps,
        {
          id: 'property_management',
          title: 'Management Services',
          description: 'Configure property management offerings',
          required: true,
          completed: false,
          persona: ['property_manager']
        },
        {
          id: 'maintenance_network',
          title: 'Service Network',
          description: 'Set up your maintenance and service providers',
          required: true,
          completed: false,
          persona: ['property_manager']
        }
      ]
    };

    return personaSpecificSteps[persona] || commonSteps;
  }, []);

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem(`onboarding_progress_${currentPersona}`);
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      setProgress(parsed);
    } else {
      // Initialize with persona-specific steps
      const steps = getStepsForPersona(currentPersona);
      setProgress({
        currentStep: 0,
        totalSteps: steps.length,
        completedSteps: [],
        isCompleted: false,
        personaDetected: true
      });
    }
  }, [currentPersona, getStepsForPersona]);

  // Show onboarding for new users
  useEffect(() => {
    if (isNewUser && !progress.isCompleted) {
      setShowOnboarding(true);
    }
  }, [isNewUser, progress.isCompleted]);

  const completeStep = useCallback(async (stepId: string) => {
    const steps = getStepsForPersona(currentPersona);
    const step = steps.find(s => s.id === stepId);
    
    if (!step || progress.completedSteps.includes(stepId)) {
      return;
    }

    const newCompletedSteps = [...progress.completedSteps, stepId];
    const newCurrentStep = Math.min(progress.currentStep + 1, steps.length);
    const isCompleted = newCompletedSteps.length >= steps.filter(s => s.required).length;

    const newProgress = {
      ...progress,
      currentStep: newCurrentStep,
      completedSteps: newCompletedSteps,
      isCompleted
    };

    setProgress(newProgress);
    
    // Save to localStorage
    localStorage.setItem(`onboarding_progress_${currentPersona}`, JSON.stringify(newProgress));

    // Track completion
    await trackUserOnboarding(stepId, {
      persona: currentPersona,
      step_number: newCurrentStep,
      total_steps: steps.length,
      is_completed: isCompleted
    });

    if (isCompleted) {
      setShowOnboarding(false);
    }
  }, [currentPersona, progress, getStepsForPersona, trackUserOnboarding]);

  const resetOnboarding = useCallback(() => {
    localStorage.removeItem(`onboarding_progress_${currentPersona}`);
    const steps = getStepsForPersona(currentPersona);
    setProgress({
      currentStep: 0,
      totalSteps: steps.length,
      completedSteps: [],
      isCompleted: false,
      personaDetected: true
    });
    setShowOnboarding(true);
  }, [currentPersona, getStepsForPersona]);

  const skipOnboarding = useCallback(() => {
    setShowOnboarding(false);
    localStorage.setItem(`onboarding_skipped_${currentPersona}`, 'true');
  }, [currentPersona]);

  const getCurrentSteps = useCallback(() => {
    return getStepsForPersona(currentPersona).map(step => ({
      ...step,
      completed: progress.completedSteps.includes(step.id)
    }));
  }, [currentPersona, progress.completedSteps, getStepsForPersona]);

  return {
    progress,
    showOnboarding,
    setShowOnboarding,
    completeStep,
    resetOnboarding,
    skipOnboarding,
    getCurrentSteps,
    currentPersona
  };
};