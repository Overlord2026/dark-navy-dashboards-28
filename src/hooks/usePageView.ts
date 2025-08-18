import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '@/lib/analytics';
import { usePersonaContext } from '@/context/persona-context';

export const usePageView = (additionalProps?: Record<string, any>) => {
  const location = useLocation();
  const { personaRoot, familySegment, proSegment } = usePersonaContext();

  useEffect(() => {
    const pageViewProps = {
      path: location.pathname,
      persona_root: personaRoot,
      family_segment: familySegment,
      pro_segment: proSegment,
      timestamp: Date.now(),
      ...additionalProps
    };

    analytics.trackEvent('page_view', pageViewProps);
  }, [location.pathname, personaRoot, familySegment, proSegment, additionalProps]);
};