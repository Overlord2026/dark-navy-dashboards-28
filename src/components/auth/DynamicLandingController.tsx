import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";

/**
 * DynamicLandingController - Routes users to appropriate pages based on segment and profile
 * Uses segment, advisor_id, utm parameters, and user role to determine the best landing experience
 */
export const DynamicLandingController: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile, isAuthenticated, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && isAuthenticated && userProfile) {
      const params = new URLSearchParams(location.search);
      
      // Check if we're on a landing page that requires segment-specific routing
      const needsRouting = location.pathname === "/" || 
                           location.pathname === "/dashboard" || 
                           location.pathname === "/login" || 
                           location.pathname === "/onboarding";

      // Don't run routing logic if we're not on a landing page
      if (!needsRouting) {
        return;
      }

      // Extract routing parameters
      const segment = params.get("segment") || userProfile?.client_segment;
      const isNewLogin = params.get("newLogin") === "true";
      const utm_campaign = params.get("utm_campaign") || userProfile?.utm_campaign;
      const advisorId = params.get("advisor_id") || userProfile?.advisor_id;
      const role = userProfile?.role;
      
      // Track this visit
      trackUserVisit(userProfile.id, {
        segment,
        utm_campaign,
        advisor_id: advisorId,
        is_new_login: isNewLogin,
        path: location.pathname
      });

      // Route based on user role first
      if (role === "advisor" || role === "admin" || role === "system_administrator") {
        navigate("/advisor-dashboard", { replace: true });
        return;
      }

      // For first time login, go to onboarding
      if (isNewLogin) {
        navigate("/onboarding", { 
          replace: true,
          state: { 
            segment, 
            advisor_id: advisorId,
            utm_campaign 
          }
        });
        return;
      }

      // For existing users, route based on segment
      if (segment) {
        // Define segment-specific landing pages
        const segmentRoutes: Record<string, string> = {
          "physician": "/health-dashboard",
          "executive": "/compensation-dashboard",
          "entrepreneur": "/business-dashboard",
          "athlete": "/wealth-dashboard"
        };

        const targetRoute = segmentRoutes[segment] || "/dashboard";
        navigate(targetRoute, { replace: true });
        return;
      }

      // Default landing for authenticated users without specific routing needs
      navigate("/dashboard", { replace: true });
    }
  }, [isLoading, isAuthenticated, userProfile, location.pathname, navigate, location.search]);

  const trackUserVisit = async (userId: string, metadata: any) => {
    try {
      await supabase.from('user_events').insert({
        user_id: userId,
        event_type: 'page_visit',
        event_data: metadata
      });
    } catch (error) {
      console.error('Error tracking user visit:', error);
    }
  };

  return <>{children}</>;
};