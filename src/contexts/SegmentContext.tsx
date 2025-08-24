import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { PersonaSegment, detectPersonaSegment, PERSONA_SEGMENT_CONFIGS } from '@/types/personaSegments';
import { PersonaType } from '@/types/personas';
import { analytics } from '@/lib/analytics';

export type AllPersonaTypes = PersonaType | 'families' | 'pros';
export type SegmentValue = { persona: AllPersonaTypes; segment: PersonaSegment };

interface SegmentContextType {
  currentSegment: PersonaSegment;
  segmentConfig: any;
  setPersonaSegment: (persona: PersonaType, segment?: PersonaSegment) => void;
  trackSegmentEvent: (event: string, properties?: Record<string, any>) => void;
}

// Default no-op tracker to avoid undefined
const defaultTracker = {
  currentSegment: 'general' as PersonaSegment,
  segmentConfig: PERSONA_SEGMENT_CONFIGS.general,
  setPersonaSegment: () => {},
  trackSegmentEvent: () => {}
};

const SegmentContext = createContext<SegmentContextType | undefined>(undefined);

export const SegmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSegment, setCurrentSegment] = useState<PersonaSegment>('general');

  const segmentConfig = PERSONA_SEGMENT_CONFIGS[currentSegment];

  const setPersonaSegment = (persona: PersonaType, segment?: PersonaSegment) => {
    const detectedSegment = segment || detectPersonaSegment(persona);
    setCurrentSegment(detectedSegment);
    
    // Track segment selection
    analytics.track('onboarding.start', { persona, segment: detectedSegment });
  };

  const trackSegmentEvent = (event: string, properties: Record<string, any> = {}) => {
    analytics.track(event, {
      ...properties,
      segment: currentSegment,
      persona: segmentConfig.persona,
      timestamp: Date.now()
    });
  };

  const contextValue = useMemo(() => ({
    currentSegment,
    segmentConfig,
    setPersonaSegment,
    trackSegmentEvent
  }), [currentSegment, segmentConfig]);

  return (
    <SegmentContext.Provider value={contextValue}>
      {children}
    </SegmentContext.Provider>
  );
};

export const useSegment = () => {
  const context = useContext(SegmentContext);
  if (context === undefined) {
    console.warn('useSegment used outside SegmentProvider, using default tracker');
    return defaultTracker;
  }
  return context;
};