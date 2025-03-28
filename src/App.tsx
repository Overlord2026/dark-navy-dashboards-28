
import React from 'react';
import './App.css';
import Dashboard from "./pages/Index";
import CustomerProfile from "./pages/CustomerProfile";
import FinancialPlans from "./pages/FinancialPlans";
import Education from "./pages/Education";
import Investments from "./pages/Investments";
import Insurance from "./pages/Insurance";
import CashManagement from "./pages/CashManagement";
import Transfers from "./pages/Transfers";
import TaxBudgets from "./pages/TaxBudgets";
import Sharing from "./pages/Sharing";
import NotFound from "./pages/NotFound";
import Accounts from "./pages/Accounts";
import LegacyVault from "./pages/LegacyVault";
import Lending from "./pages/Lending";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "sonner";

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <Router>
          <div className="w-full h-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<CustomerProfile />} />
              <Route path="/financial-plans" element={<FinancialPlans />} />
              <Route path="/education/*" element={<Education />} />
              <Route path="/investments" element={<Investments />} />
              <Route path="/insurance" element={<Insurance />} />
              <Route path="/cash-management" element={<CashManagement />} />
              <Route path="/transfers" element={<Transfers />} />
              <Route path="/tax-budgets" element={<TaxBudgets />} />
              <Route path="/sharing/*" element={<Sharing />} />
              <Route path="/accounts/*" element={<Accounts />} />
              <Route path="/vault/*" element={<LegacyVault />} />
              <Route path="/lending" element={<Lending />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Toaster position="top-right" />
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
