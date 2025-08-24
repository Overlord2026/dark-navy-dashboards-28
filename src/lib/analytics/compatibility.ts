// Analytics compatibility layer to fix import issues
import { track } from './track';

// Create analytics object with compatibility methods
export const analytics = {
  track,
  trackEvent: track
};

// Default export for import analytics from pattern
export default analytics;