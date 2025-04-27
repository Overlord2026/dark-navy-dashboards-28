import React, { createContext, useContext, useState, useEffect } from 'react';
import { AudienceProfile, AudienceSegment, AudienceContext as AudienceContextType } from '@/types/audience';
import { useNetWorth } from '@/context/NetWorthContext';
import { useUser } from '@/context/UserContext';
import { audienceProfiles } from '@/data/audienceProfiles';

const AudienceContext = createContext<AudienceContextType | undefined>(undefined);

export const AudienceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSegment, setCurrentSegment] = useState<AudienceSegment>('aspiring');
  const [isSegmentDetected, setIsSegmentDetected] = useState(false);
  const { totalNetWorth } = useNetWorth();
  const { userProfile } = useUser();

  // Detect audience segment based on net worth or user profile data
  useEffect(() => {
    const detectSegment = () => {
      if (!isSegmentDetected) {
        // Use net worth as primary determinant if available
        if (totalNetWorth) {
          if (totalNetWorth >= 10000000) { // $10M+
            setCurrentSegment('uhnw');
          } else if (totalNetWorth >= 1000000 && userProfile?.age && userProfile.age >= 55) { // $1M+ and 55+
            setCurrentSegment('retiree');
          } else {
            setCurrentSegment('aspiring');
          }
          setIsSegmentDetected(true);
        }
        // Otherwise, keep the default 'aspiring' segment until we have more data
      }
    };

    detectSegment();
  }, [totalNetWorth, userProfile, isSegmentDetected]);

  const currentProfile = audienceProfiles[currentSegment];

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
