
import React from "react";
import { Route } from "react-router-dom";

// Import pages
import FinancialPlans from "../pages/FinancialPlans";
import EstatePlanning from "../pages/EstatePlanning";
import Properties from "../pages/Properties";
import SocialSecurity from "../pages/SocialSecurity";
import LegacyVault from "../pages/LegacyVault";
import Subscription from "../pages/Subscription";

const WealthRoutes: React.FC = () => {
  return (
    <>
      <Route path="/financial-plans" element={<FinancialPlans />} />
      <Route path="/estate-planning" element={<EstatePlanning />} />
      <Route path="/properties" element={<Properties />} />
      <Route path="/social-security" element={<SocialSecurity />} />
      <Route path="/legacy-vault" element={<LegacyVault />} />
      <Route path="/subscription" element={<Subscription />} />
    </>
  );
};

export default WealthRoutes;
