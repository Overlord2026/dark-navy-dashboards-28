
import { useState, useEffect } from 'react';
import { useConfig } from '@/context/ConfigContext';
import { useFeatureFlagContext } from '@/context/FeatureFlagContext';

/**
 * Generic hook that selects an appropriate service implementation based on the current configuration and feature flags
 * 
 * @param localServiceFactory Factory function to create a local service implementation
 * @param apiServiceFactory Factory function to create an API service implementation
 * @param flagName Optional feature flag name to check (if provided, will use this flag to determine which service to use)
 * @returns The appropriate service implementation
 */
export function useServiceFactory<T>(
  localServiceFactory: () => T,
  apiServiceFactory: () => T,
  flagName?: string
): T {
  const { isLocalMode } = useConfig();
  const { isEnabled } = useFeatureFlagContext();
  const [service, setService] = useState<T | null>(null);
  
  useEffect(() => {
    // Determine which service to use
    let useLocal = isLocalMode;
    
    // If a specific feature flag is provided, use it to determine which service to use
    if (flagName && typeof flagName === 'string') {
      useLocal = !isEnabled(flagName as any);
    }
    
    // Create the appropriate service
    const selectedService = useLocal ? localServiceFactory() : apiServiceFactory();
    setService(selectedService);
  }, [isLocalMode, isEnabled, flagName, localServiceFactory, apiServiceFactory]);
  
  // Return the service or a fallback local service to prevent null issues
  return service || localServiceFactory();
}

/**
 * Example usage:
 * 
 * const userService = useServiceFactory(
 *   () => new LocalUserService(),
 *   () => new ApiUserService(),
 *   'ENABLE_API_INTEGRATION'
 * );
 */
