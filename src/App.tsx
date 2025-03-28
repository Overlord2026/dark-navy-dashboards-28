
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
import Documents from "./pages/Documents";
import Sharing from "./pages/Sharing";
import NotFound from "./pages/NotFound";
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
          <div>
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
              <Route path="/documents/*" element={<Documents />} />
              <Route path="/sharing/*" element={<Sharing />} />
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
