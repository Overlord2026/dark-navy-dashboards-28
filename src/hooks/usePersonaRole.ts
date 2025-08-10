import { useAuth } from '@/context/AuthContext';

// Map user roles to CE-relevant personas
const ROLE_TO_PERSONA_MAP: Record<string, string> = {
  'advisor': 'financial_advisor',
  'financial_advisor': 'financial_advisor',
  'attorney': 'attorney',
  'cpa': 'cpa_accountant',
  'accountant': 'cpa_accountant',
  'cpa_accountant': 'cpa_accountant',
  'insurance_agent': 'insurance_agent',
  'realtor': 'realtor',
  'property_manager': 'realtor',
  'physician': 'physician',
  'dentist': 'dentist',
  'healthcare_consultant': 'healthcare_longevity_expert',
  'sports_agent': 'sports_agent',
  'athlete_nil': 'athlete_nil',
  'coach': 'coach_consultant',
  'consultant': 'coach_consultant'
};

export const usePersonaRole = () => {
  const { userProfile } = useAuth();

  const getPersonaForCE = (): string | null => {
    if (!userProfile?.role) return null;
    return ROLE_TO_PERSONA_MAP[userProfile.role] || null;
  };

  const isEligibleForCE = (): boolean => {
    const persona = getPersonaForCE();
    return persona !== null;
  };

  return {
    persona: getPersonaForCE(),
    isEligibleForCE: isEligibleForCE()
  };
};