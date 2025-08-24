import { useEffect, useState } from 'react';
import { startJobs, stopJobs, getJobStatus } from '@/jobs/runner';
import { getFlag } from '@/jobs/flags';

/**
 * Hook to manage job system lifecycle
 */
export function useJobSystem() {
  const [status, setStatus] = useState(getJobStatus());

  useEffect(() => {
    // Initialize job system if user is admin and background jobs are enabled
    const initializeJobs = async () => {
      try {
        // Import sample jobs to register them
        await import('@/jobs/sample-jobs');
        
        // Start jobs if enabled
        if (getFlag('BACKGROUND_JOBS_ENABLED')) {
          await startJobs();
          setStatus(getJobStatus());
        }
      } catch (error) {
        console.error('[JobSystem] Failed to initialize:', error);
      }
    };

    initializeJobs();

    // Cleanup on unmount
    return () => {
      stopJobs();
    };
  }, []);

  // Update status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(getJobStatus());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return {
    status,
    startJobs: async () => {
      await startJobs();
      setStatus(getJobStatus());
    },
    stopJobs: () => {
      stopJobs();
      setStatus(getJobStatus());
    },
  };
}