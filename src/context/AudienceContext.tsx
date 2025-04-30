
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
  
  // Get total net worth from context - note we need to use getTotalNetWorth() method
  const totalNetWorth = netWorthContext.getTotalNetWorth();

  // We'll leave the detection logic, but we won't auto-set the segment
  // This will only run if a user explicitly opts in or if we need to detect from profile
  useEffect(() => {
    const detectSegment = () => {
      if (!isSegmentDetected && totalNetWorth && userProfile?.investorType) {
        // Only set a segment when explicitly opted-in through the UI
        if (false) { // Disable auto-detection completely
          if (totalNetWorth >= 10000000) { // $10M+
            setCurrentSegment('uhnw');
          } else if (totalNetWorth >= 1000000 && userProfile?.investorType?.toLowerCase().includes('retiree')) { 
            setCurrentSegment('retiree');
          } else if (totalNetWorth >= 250000) {
            setCurrentSegment('aspiring');
          }
          setIsSegmentDetected(true);
        }
      }
    };

    // Only detect if user has opted in or we have enough profile data
    if (userProfile?.investorType && !isSegmentDetected) {
      detectSegment();
    }
  }, [totalNetWorth, userProfile, isSegmentDetected]);

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
