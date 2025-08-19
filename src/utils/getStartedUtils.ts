import { runtimeFlags } from '@/config/runtimeFlags';

/**
 * Get the appropriate "Get Started" route based on prelaunch mode
 * @param defaultRoute - Default route when not in prelaunch mode
 * @returns The appropriate route string
 */
export const getStartedRoute = (defaultRoute?: string): string => {
  if (runtimeFlags.prelaunchMode) {
    return '/waitlist';
  }
  
  return defaultRoute || '/onboarding?persona=family&segment=retirees';
};

/**
 * Handle Get Started navigation with prelaunch logic
 * @param navigate - React Router navigate function
 * @param defaultRoute - Default route when not in prelaunch mode
 */
export const handleGetStarted = (navigate: (path: string) => void, defaultRoute?: string): void => {
  navigate(getStartedRoute(defaultRoute));
};