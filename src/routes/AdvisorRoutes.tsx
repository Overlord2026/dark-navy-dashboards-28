
import React from "react";
import { Route } from "react-router-dom";

// Import pages
import AdvisorDashboard from "../pages/AdvisorDashboard";
import AdvisorProfile from "../pages/AdvisorProfile";
import AdvisorOnboarding from "../pages/AdvisorOnboarding";
import AdvisorFeedback from "../pages/AdvisorFeedback";
import AdvisorModuleMarketplace from "../pages/AdvisorModuleMarketplace";

const AdvisorRoutes: React.FC = () => {
  return (
    <>
      <Route path="/advisor/dashboard" element={<AdvisorDashboard />} />
      <Route path="/advisor-profile" element={<AdvisorProfile />} />
      <Route path="/advisor-onboarding" element={<AdvisorOnboarding />} />
      <Route path="/advisor-feedback" element={<AdvisorFeedback />} />
      <Route path="/advisor-marketplace" element={<AdvisorModuleMarketplace />} />
    </>
  );
};

export default AdvisorRoutes;
