import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { PersonaType, getPersonaFromRole } from '@/types/personas';
import { useUser } from '@/context/UserContext';
import { analytics } from '@/lib/analytics';

interface PersonaContextType {
  currentPersona: PersonaType;
  hasSeenWelcomeModal: boolean;
  hasSeenWelcomeBanner: boolean;
  markWelcomeModalSeen: () => void;
  markWelcomeBannerSeen: () => void;
  isNewUser: boolean;
  daysSinceRegistration: number;
}

const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

interface PersonaProviderProps {
  children: ReactNode;
}

export const PersonaProvider: React.FC<PersonaProviderProps> = ({ children }) => {
  const { userProfile } = useUser();
  const [currentPersona, setCurrentPersona] = useState<PersonaType>('client');
  const [hasSeenWelcomeModal, setHasSeenWelcomeModal] = useState(true);
  const [hasSeenWelcomeBanner, setHasSeenWelcomeBanner] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const [daysSinceRegistration, setDaysSinceRegistration] = useState(0);

  useEffect(() => {
    if (userProfile) {
      // Determine persona from user role
      const persona = getPersonaFromRole(userProfile.role || 'client');
      setCurrentPersona(persona);

      // Track persona claim for analytics
      analytics.trackPersonaClaim(persona, userProfile.id);

      // Check localStorage for welcome states
      const modalKey = `fom_welcome_modal_seen_${userProfile.id}`;
      const bannerKey = `fom_welcome_banner_seen_${userProfile.id}`;
      
      const modalSeen = localStorage.getItem(modalKey) === 'true';
      const bannerSeen = localStorage.getItem(bannerKey) === 'true';
      
      setHasSeenWelcomeModal(modalSeen);
      setHasSeenWelcomeBanner(bannerSeen);

      // Calculate days since registration for new user experience
      const createdAt = new Date(userProfile.last_login_at || Date.now());
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - createdAt.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      setDaysSinceRegistration(diffDays);
      setIsNewUser(diffDays <= 7); // Consider new for 7 days
    }
  }, [userProfile]);

  const markWelcomeModalSeen = () => {
    if (userProfile) {
      const modalKey = `fom_welcome_modal_seen_${userProfile.id}`;
      localStorage.setItem(modalKey, 'true');
      setHasSeenWelcomeModal(true);
      
      // Track onboarding completion
      analytics.trackOnboardingStep('welcome_modal_completed', currentPersona, userProfile.id, true);
    }
  };

  const markWelcomeBannerSeen = () => {
    if (userProfile) {
      const bannerKey = `fom_welcome_banner_seen_${userProfile.id}`;
      localStorage.setItem(bannerKey, 'true');
      setHasSeenWelcomeBanner(true);
    }
  };

  const value: PersonaContextType = {
    currentPersona,
    hasSeenWelcomeModal,
    hasSeenWelcomeBanner,
    markWelcomeModalSeen,
    markWelcomeBannerSeen,
    isNewUser,
    daysSinceRegistration
  };

  return (
    <PersonaContext.Provider value={value}>
      {children}
    </PersonaContext.Provider>
  );
};

export const usePersona = (): PersonaContextType => {
  const context = useContext(PersonaContext);
  if (context === undefined) {
    throw new Error('usePersona must be used within a PersonaProvider');
  }
  return context;
};