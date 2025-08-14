import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  PersonaRoot, 
  FamilySegment, 
  ProSegment, 
  MenuConfig,
  personaMenus,
  servicesMenu,
  solutionsMenu,
  familySegments,
  proSegments,
  ctas
} from '@/lib/persona';

interface PersonaContextType {
  // Current persona state
  personaRoot: PersonaRoot;
  familySegment: FamilySegment | null;
  proSegment: ProSegment | null;
  
  // Persona switching
  setPersonaRoot: (root: PersonaRoot) => void;
  setFamilySegment: (segment: FamilySegment | null) => void;
  setProSegment: (segment: ProSegment | null) => void;
  
  // Menu configs based on current persona
  currentMenu: MenuConfig;
  availableSegments: Array<{ label: string; href: string; description?: string }>;
  
  // Quick access to common data
  servicesMenu: MenuConfig;
  solutionsMenu: MenuConfig;
  ctas: typeof ctas;
}

const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

interface PersonaProviderProps {
  children: ReactNode;
}

export const PersonaProvider: React.FC<PersonaProviderProps> = ({ children }) => {
  const [personaRoot, setPersonaRootState] = useState<PersonaRoot>(() => {
    if (typeof window === 'undefined') return 'families';
    return (localStorage.getItem('persona_group') === 'pro' ? 'professionals' : 'families') as PersonaRoot;
  });
  
  const [familySegment, setFamilySegmentState] = useState<FamilySegment | null>(() => {
    if (typeof window === 'undefined') return null;
    return (localStorage.getItem('family_segment') as FamilySegment) || null;
  });
  
  const [proSegment, setProSegmentState] = useState<ProSegment | null>(() => {
    if (typeof window === 'undefined') return null;
    return (localStorage.getItem('pro_segment') as ProSegment) || null;
  });

  // Sync with localStorage and dispatch events
  const setPersonaRoot = (root: PersonaRoot) => {
    setPersonaRootState(root);
    const groupValue = root === 'professionals' ? 'pro' : 'family';
    localStorage.setItem('persona_group', groupValue);
    document.cookie = `persona_group=${groupValue};path=/;SameSite=Lax`;
    window.dispatchEvent(new CustomEvent('persona-switched', { 
      detail: { group: groupValue, root } 
    }));
  };

  const setFamilySegment = (segment: FamilySegment | null) => {
    setFamilySegmentState(segment);
    if (segment) {
      localStorage.setItem('family_segment', segment);
    } else {
      localStorage.removeItem('family_segment');
    }
    window.dispatchEvent(new CustomEvent('family-segment-changed', { 
      detail: { segment } 
    }));
  };

  const setProSegment = (segment: ProSegment | null) => {
    setProSegmentState(segment);
    if (segment) {
      localStorage.setItem('pro_segment', segment);
    } else {
      localStorage.removeItem('pro_segment');
    }
    window.dispatchEvent(new CustomEvent('pro-segment-changed', { 
      detail: { segment } 
    }));
  };

  // Listen for external persona changes (like from MastheadPersonaToggle)
  useEffect(() => {
    const handlePersonaSwitch = (e: CustomEvent) => {
      const { group } = e.detail;
      const root = group === 'pro' ? 'professionals' : 'families';
      if (root !== personaRoot) {
        setPersonaRootState(root);
      }
    };

    window.addEventListener('persona-switched', handlePersonaSwitch as EventListener);
    return () => window.removeEventListener('persona-switched', handlePersonaSwitch as EventListener);
  }, [personaRoot]);

  // Computed values based on current persona
  const currentMenu = personaMenus[personaRoot];
  const availableSegments = personaRoot === 'families' ? familySegments : proSegments;

  const value: PersonaContextType = {
    personaRoot,
    familySegment,
    proSegment,
    setPersonaRoot,
    setFamilySegment,
    setProSegment,
    currentMenu,
    availableSegments,
    servicesMenu,
    solutionsMenu,
    ctas
  };

  return (
    <PersonaContext.Provider value={value}>
      {children}
    </PersonaContext.Provider>
  );
};

export const usePersonaContext = (): PersonaContextType => {
  const context = useContext(PersonaContext);
  if (context === undefined) {
    throw new Error('usePersonaContext must be used within a PersonaProvider');
  }
  return context;
};

// Convenience hooks for specific persona data
export const useCurrentPersonaMenu = () => {
  const { currentMenu } = usePersonaContext();
  return currentMenu;
};

export const useAvailableSegments = () => {
  const { availableSegments } = usePersonaContext();
  return availableSegments;
};

export const usePersonaRoot = () => {
  const { personaRoot, setPersonaRoot } = usePersonaContext();
  return [personaRoot, setPersonaRoot] as const;
};