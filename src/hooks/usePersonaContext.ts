import { useState, useEffect } from 'react';

export type PersonaType = 
  | 'family' 
  | 'advisor' 
  | 'accountant' 
  | 'attorney' 
  | 'insurance' 
  | 'healthcare' 
  | 'influencer' 
  | 'realtor' 
  | 'coach' 
  | 'admin';

export interface PersonaContextData {
  id: PersonaType;
  title: string;
  description: string;
  ctaText: string;
  route: string;
  featured?: boolean;
}

/**
 * Hook to manage persona context throughout the application
 * Handles localStorage persistence and context sharing
 */
export const usePersonaContext = () => {
  const [selectedPersona, setSelectedPersona] = useState<PersonaType | null>(null);
  const [personaData, setPersonaData] = useState<PersonaContextData | null>(null);

  // Load persona context from localStorage on mount
  useEffect(() => {
    const storedPersona = localStorage.getItem('selectedPersona') as PersonaType;
    const storedPersonaData = localStorage.getItem('personaData');

    if (storedPersona) {
      setSelectedPersona(storedPersona);
    }

    if (storedPersonaData) {
      try {
        const parsedData = JSON.parse(storedPersonaData);
        setPersonaData(parsedData);
      } catch (error) {
        console.error('Error parsing stored persona data:', error);
      }
    }
  }, []);

  // Function to update persona context
  const updatePersonaContext = (persona: PersonaType, data: PersonaContextData) => {
    setSelectedPersona(persona);
    setPersonaData(data);
    
    // Persist to localStorage
    localStorage.setItem('selectedPersona', persona);
    localStorage.setItem('personaData', JSON.stringify(data));
  };

  // Function to clear persona context
  const clearPersonaContext = () => {
    setSelectedPersona(null);
    setPersonaData(null);
    
    // Clear from localStorage
    localStorage.removeItem('selectedPersona');
    localStorage.removeItem('personaData');
  };

  // Get appropriate onboarding route based on persona
  const getOnboardingRoute = (persona: PersonaType): string => {
    const routes: Record<PersonaType, string> = {
      family: '/onboarding',
      advisor: '/professional-onboarding/advisor',
      accountant: '/professional-onboarding/accountant',
      attorney: '/professional-onboarding/attorney',
      insurance: '/professional-onboarding/insurance',
      healthcare: '/professional-onboarding/healthcare',
      influencer: '/professional-onboarding/influencer',
      realtor: '/professional-onboarding/realtor',
      coach: '/professional-onboarding/coach',
      admin: '/professional-onboarding/admin'
    };

    return routes[persona] || '/onboarding';
  };

  // Get appropriate dashboard route based on persona
  const getDashboardRoute = (persona: PersonaType): string => {
    const routes: Record<PersonaType, string> = {
      family: '/client-portal',
      advisor: '/advisor',
      accountant: '/accountant',
      attorney: '/attorney',
      insurance: '/insurance',
      healthcare: '/healthcare',
      influencer: '/influencer',
      realtor: '/realtor',
      coach: '/coach',
      admin: '/admin'
    };

    return routes[persona] || '/dashboard';
  };

  // Check if user has completed persona selection
  const hasPersonaContext = (): boolean => {
    return selectedPersona !== null && personaData !== null;
  };

  return {
    selectedPersona,
    personaData,
    updatePersonaContext,
    clearPersonaContext,
    getOnboardingRoute,
    getDashboardRoute,
    hasPersonaContext
  };
};