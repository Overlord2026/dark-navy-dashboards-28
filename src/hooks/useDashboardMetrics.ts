import { useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { abTesting } from '@/lib/abTesting';

export const useDashboardMetrics = () => {
  const { user } = useAuth();
  const startTimeRef = useRef<number>(Date.now());
  const hasTrackedSession = useRef<boolean>(false);

  useEffect(() => {
    // Reset start time when component mounts
    startTimeRef.current = Date.now();
    hasTrackedSession.current = false;

    // Track time on dashboard when component unmounts or user leaves
    const handleBeforeUnload = () => {
      if (!hasTrackedSession.current && user?.id) {
        const timeSpent = Date.now() - startTimeRef.current;
        abTesting.trackTimeOnDashboard(user.id, timeSpent);
        hasTrackedSession.current = true;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !hasTrackedSession.current && user?.id) {
        const timeSpent = Date.now() - startTimeRef.current;
        abTesting.trackTimeOnDashboard(user.id, timeSpent);
        hasTrackedSession.current = true;
      }
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup function
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      // Final tracking on unmount
      if (!hasTrackedSession.current && user?.id) {
        const timeSpent = Date.now() - startTimeRef.current;
        abTesting.trackTimeOnDashboard(user.id, timeSpent);
      }
    };
  }, [user?.id]);

  const trackNPS = (score: number) => {
    if (user?.id) {
      abTesting.trackNPS(user.id, score);
    }
  };

  const trackOnboardingCompletion = () => {
    if (user?.id) {
      abTesting.trackOnboardingCompletion(user.id);
    }
  };

  const trackInteraction = (interactionType: string) => {
    if (user?.id) {
      abTesting.trackDashboardMetrics(user.id, { interactionType });
    }
  };

  return {
    trackNPS,
    trackOnboardingCompletion,
    trackInteraction
  };
};