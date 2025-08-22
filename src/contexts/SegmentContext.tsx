import React, { createContext, useContext, useEffect, useState } from 'react';
import { PersonaSegment, detectPersonaSegment, PERSONA_SEGMENT_CONFIGS } from '@/types/personaSegments';
import { PersonaType } from '@/types/personas';
import { analytics } from '@/lib/analytics';

interface SegmentContextType {
  currentSegment: PersonaSegment;
  segmentConfig: any;
  setPersonaSegment: (persona: PersonaType, segment?: PersonaSegment) => void;
  trackSegmentEvent: (event: string, properties?: Record<string, any>) => void;
}

const SegmentContext = createContext<SegmentContextType | undefined>(undefined);

export const SegmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSegment, setCurrentSegment] = useState<PersonaSegment>('general');

  const segmentConfig = PERSONA_SEGMENT_CONFIGS[currentSegment];

  const setPersonaSegment = (persona: PersonaType, segment?: PersonaSegment) => {
    const detectedSegment = segment || detectPersonaSegment(persona);
    setCurrentSegment(detectedSegment);
    
    // Track segment selection
    analytics.trackOnboardingStart(persona, { segment: detectedSegment });
  };

  const trackSegmentEvent = (event: string, properties: Record<string, any> = {}) => {
    analytics.track(event, {
      ...properties,
      segment: currentSegment,
      persona: segmentConfig.persona,
      timestamp: Date.now()
    });
  };

  return (
    <SegmentContext.Provider value={{
      currentSegment,
      segmentConfig,
      setPersonaSegment,
      trackSegmentEvent
    }}>
      {children}
    </SegmentContext.Provider>
  );
};

export const useSegment = () => {
  const context = useContext(SegmentContext);
  if (context === undefined) {
    throw new Error('useSegment must be used within a SegmentProvider');
  }
  return context;
};