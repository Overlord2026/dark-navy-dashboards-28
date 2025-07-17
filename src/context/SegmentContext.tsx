import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';
import { supabase } from '@/lib/supabase';
import { clientSegments } from '@/components/solutions/WhoWeServe';

// Define the context interface
interface SegmentContextType {
  activeSegment: string | null;
  setActiveSegment: (segment: string) => Promise<void>;
  segmentLoading: boolean;
  showSegmentSelector: boolean;
  setShowSegmentSelector: (show: boolean) => void;
  getSegmentName: (segmentId: string) => string;
}

// Create the context
const SegmentContext = createContext<SegmentContextType | undefined>(undefined);

// Provider component
export const SegmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userProfile, isAuthenticated } = useUser();
  const [activeSegment, setActiveSegmentState] = useState<string | null>(null);
  const [segmentLoading, setSegmentLoading] = useState(true);
  const [showSegmentSelector, setShowSegmentSelector] = useState(false);
  
  // Load user segment on component mount or when user profile changes
  useEffect(() => {
    const loadUserSegment = async () => {
      setSegmentLoading(true);
      
      if (isAuthenticated && userProfile) {
        if (userProfile.id && userProfile.client_segment) {
          setActiveSegmentState(userProfile.client_segment);
        } else {
          // If user is logged in but has no segment, prompt them to select one
          setShowSegmentSelector(true);
        }
      } else {
        // For non-authenticated users, don't show segment selector initially
        setActiveSegmentState(null);
      }
      
      setSegmentLoading(false);
    };
    
    loadUserSegment();
  }, [userProfile, isAuthenticated]);
  
  // Function to update user's segment
  const setActiveSegment = async (segment: string) => {
    if (!isAuthenticated || !userProfile?.id) return;
    
    setSegmentLoading(true);
    
    try {
      // Update in database
      const { error } = await supabase
        .from('profiles')
        .update({ client_segment: segment })
        .eq('id', userProfile.id);
        
      if (error) throw error;
      
      // Update local state
      setActiveSegmentState(segment);
      setShowSegmentSelector(false);
      
    } catch (error) {
      console.error('Error updating user segment:', error);
    } finally {
      setSegmentLoading(false);
    }
  };
  
  // Helper function to get segment name from id
  const getSegmentName = (segmentId: string): string => {
    const segment = clientSegments.find(s => s.id === segmentId);
    return segment ? segment.title : 'General';
  };
  
  return (
    <SegmentContext.Provider
      value={{
        activeSegment,
        setActiveSegment,
        segmentLoading,
        showSegmentSelector,
        setShowSegmentSelector,
        getSegmentName
      }}
    >
      {children}
    </SegmentContext.Provider>
  );
};

// Hook for using the segment context
export const useSegment = (): SegmentContextType => {
  const context = useContext(SegmentContext);
  if (context === undefined) {
    throw new Error('useSegment must be used within a SegmentProvider');
  }
  return context;
};