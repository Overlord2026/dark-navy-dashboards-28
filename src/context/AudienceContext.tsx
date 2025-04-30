
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AudienceProfile, AudienceSegment, AudienceContext as AudienceContextType } from '@/types/audience';
import { useNetWorth } from '@/context/NetWorthContext';
import { useUser } from '@/context/UserContext';
import { audienceProfiles } from '@/data/audienceProfiles';

const AudienceContext = createContext<AudienceContextType | undefined>(undefined);

export const AudienceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSegment, setCurrentSegment] = useState<AudienceSegment | null>(null);
  const [isSegmentDetected, setIsSegmentDetected] = useState(false);
  const netWorthContext = useNetWorth();
  const { userProfile } = useUser();
  
  // Completely disable auto-detection of segments
  // Only set segment when explicitly chosen by user through UI

  const currentProfile = currentSegment ? audienceProfiles[currentSegment] : null;

  const contextValue: AudienceContextType = {
    currentSegment,
    setCurrentSegment,
    audienceProfiles,
    currentProfile,
    isSegmentDetected
  };

  return (
    <AudienceContext.Provider value={contextValue}>
      {children}
    </AudienceContext.Provider>
  );
};

export const useAudience = (): AudienceContextType => {
  const context = useContext(AudienceContext);
  if (context === undefined) {
    throw new Error('useAudience must be used within an AudienceProvider');
  }
  return context;
};
