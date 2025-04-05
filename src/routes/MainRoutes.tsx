import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Notifications from "../pages/Notifications";
import Settings from "../pages/Settings";
import Help from "../pages/Help";
import CustomerProfile from "../pages/CustomerProfile";
import AdvisorProfile from "../pages/AdvisorProfile";
import Education from "../pages/Education";
import AllAssets from "../pages/AllAssets";
import Investments from "../pages/Investments";
import PersonalInsurance from "../pages/PersonalInsurance";
import Insurance from "../pages/Insurance";
import NotFound from "../pages/NotFound";
import LendingPage from "../pages/Lending"; // Ensure import for Lending
import CashManagement from "../pages/CashManagement";
import Transfers from "../pages/Transfers";
import FundingAccounts from "../pages/FundingAccounts";
import EstatePlanning from "../pages/EstatePlanning";
import LegacyVault from "../pages/LegacyVault";
import SocialSecurity from "../pages/SocialSecurity";
import TaxBudgets from "../pages/TaxBudgets";
import BillPay from "../pages/BillPay";
import Documents from "../pages/Documents";
import Sharing from "../pages/Sharing";
import Professionals from "../pages/Professionals";
import FinancialPlans from "../pages/FinancialPlans";
import TaxPlanning from "../pages/TaxPlanning";
import Marketplace from "../pages/Marketplace";
import Properties from "../pages/Properties";

const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/help" element={<Help />} />
      <Route path="/profile" element={<CustomerProfile />} />
      <Route path="/advisor-profile" element={<AdvisorProfile />} />

      {/* Financial Management */}
      <Route path="/bill-pay" element={<BillPay />} />
      
      {/* Education & Solutions section */}
      <Route path="/education" element={<Education />} />
      <Route path="/education/:categoryId" element={<Education />} />
      <Route path="/education/tax-planning" element={<TaxPlanning />} />
      <Route path="/investments" element={<Investments />} /> 
      <Route path="/investments/alternative/:category" element={<Investments />} />
      <Route path="/investments/alternative/all" element={<Investments />} />
      <Route path="/insurance" element={<Insurance />} /> 
      <Route path="/lending" element={<LendingPage />} />
      <Route path="/estate-planning" element={<EstatePlanning />} />
      <Route path="/marketplace" element={<Marketplace />} />
      
      {/* Family Wealth section */}
      <Route path="/financial-plans" element={<FinancialPlans />} />
      <Route path="/all-assets" element={<AllAssets />} />
      <Route path="/accounts" element={<FundingAccounts />} />
      <Route path="/personal-insurance" element={<PersonalInsurance />} />
      <Route path="/cash-management" element={<CashManagement />} />
      <Route path="/tax-budgets" element={<TaxBudgets />} />
      <Route path="/transfers" element={<Transfers />} />
      <Route path="/legacy-vault" element={<LegacyVault />} />
      <Route path="/social-security" element={<SocialSecurity />} />
      <Route path="/properties" element={<Properties />} />
      
      {/* Collaboration & Sharing section */}
      <Route path="/documents" element={<Documents />} />
      <Route path="/professionals" element={<Professionals />} />
      <Route path="/sharing" element={<Sharing />} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default MainRoutes;
