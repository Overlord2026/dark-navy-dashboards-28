
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CustomerProfile from "./pages/CustomerProfile";
import SocialSecurity from "./pages/SocialSecurity";
import LegacyVault from "./pages/LegacyVault";
import Accounts from "./pages/Accounts";
import Properties from "./pages/Properties";
import Documents from "./pages/Documents";
import TaxBudgets from "./pages/TaxBudgets";
import Education from "./pages/Education";
import FinancialPlans from "./pages/FinancialPlans";
import Investments from "./pages/Investments";
import AlternativeAssetCategory from "./pages/AlternativeAssetCategory";
import AdvisorProfile from "./pages/AdvisorProfile";
import Lending from "./pages/Lending";
import CashManagement from "./pages/CashManagement";
import Insurance from "./pages/Insurance";
import Sharing from "./pages/Sharing";
import Transfers from "./pages/Transfers";
import NotFound from "./pages/NotFound";
import Subscription from "./pages/Subscription";
import AdminSubscription from "./pages/AdminSubscription";
import AdvisorOnboarding from "./pages/AdvisorOnboarding";
import AdvisorModuleMarketplace from "./pages/AdvisorModuleMarketplace";
import { ThemeProvider as CustomThemeProvider } from "./context/ThemeContext";
import { UserProvider } from "@/context/UserContext";
import { NetWorthProvider } from "@/context/NetWorthContext";
import { ProfessionalsProvider } from "./hooks/useProfessionals";
import { BillsProvider } from "./hooks/useBills";
import { SubscriptionProvider } from "./context/SubscriptionContext";
import Professionals from "./pages/Professionals";
import BillsManagement from "./pages/BillsManagement";
import AdvisorFeedback from "./pages/AdvisorFeedback";
import SystemDiagnostics from "./pages/SystemDiagnostics";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <CustomThemeProvider>
      <UserProvider>
        <NetWorthProvider>
          <ProfessionalsProvider>
            <BillsProvider>
              <SubscriptionProvider>
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/customer-profile" element={<CustomerProfile />} />
                    <Route path="/social-security" element={<SocialSecurity />} />
                    <Route path="/legacy-vault" element={<LegacyVault />} />
                    <Route path="/accounts" element={<Accounts />} />
                    <Route path="/properties" element={<Properties />} />
                    <Route path="/documents" element={<Documents />} />
                    <Route path="/tax-budgets" element={<TaxBudgets />} />
                    <Route path="/education" element={<Education />} />
                    <Route path="/education/course/:courseId" element={<Education />} />
                    <Route path="/education/category/:categoryId" element={<Education />} />
                    <Route path="/financial-plans" element={<FinancialPlans />} />
                    <Route path="/investments" element={<Investments />} />
                    <Route path="/investment/:categoryId" element={<AlternativeAssetCategory />} />
                    <Route path="/advisor-profile" element={<AdvisorProfile />} />
                    <Route path="/lending" element={<Lending />} />
                    <Route path="/cash-management" element={<CashManagement />} />
                    <Route path="/insurance" element={<Insurance />} />
                    <Route path="/sharing" element={<Sharing />} />
                    <Route path="/sharing/:sectionId" element={<Sharing />} />
                    <Route path="/transfers" element={<Transfers />} />
                    <Route path="/professionals" element={<Professionals />} />
                    <Route path="/bills-management" element={<BillsManagement />} />
                    <Route path="/subscription" element={<Subscription />} />
                    <Route path="/admin/subscription" element={<AdminSubscription />} />
                    <Route path="/advisor/onboarding" element={<AdvisorOnboarding />} />
                    <Route path="/advisor/modules" element={<AdvisorModuleMarketplace />} />
                    <Route path="/advisor-feedback" element={<AdvisorFeedback />} />
                    <Route path="/system-diagnostics" element={<SystemDiagnostics />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <Toaster />
                </BrowserRouter>
              </SubscriptionProvider>
            </BillsProvider>
          </ProfessionalsProvider>
        </NetWorthProvider>
      </UserProvider>
    </CustomThemeProvider>
  );
}

export default App;
