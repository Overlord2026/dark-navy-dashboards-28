
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
import { ThemeProvider } from "./components/theme-provider";
import { UserProvider } from "@/context/UserContext";

// Import the ProfessionalsProvider
import { ProfessionalsProvider } from "./hooks/useProfessionals";
import Professionals from "./pages/Professionals";

function App() {
  return (
    <ThemeProvider defaultTheme="system" attribute="class">
      <UserProvider>
        <ProfessionalsProvider>
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ProfessionalsProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
