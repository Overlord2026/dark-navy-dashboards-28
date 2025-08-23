import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { shouldRedirectToPreview, getPreviewRoute } from '@/tools/routeAuditor';

interface RouteGuardProps {
  children: React.ReactNode;
}

/**
 * Route Guard that automatically redirects to preview pages for missing tool routes
 * Prevents 404s by showing marketing preview pages instead
 */
export function RouteGuard({ children }: RouteGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if current route should redirect to preview
    if (shouldRedirectToPreview(location.pathname)) {
      const previewRoute = getPreviewRoute(location.pathname);
      navigate(previewRoute, { replace: true });
    }
  }, [location.pathname, navigate]);

  return <>{children}</>;
}