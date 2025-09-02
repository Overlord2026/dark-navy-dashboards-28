import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { applyRedirect } from '@/utils/redirects';

/**
 * Component that handles automatic redirects based on IA_V2 flag
 * Should be placed at the root of the app to catch all navigation
 */
export function RedirectHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Apply redirect if needed
    applyRedirect(location.pathname, navigate);
  }, [location.pathname, navigate]);

  // This component doesn't render anything
  return null;
}