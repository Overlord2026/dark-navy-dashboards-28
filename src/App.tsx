
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import Dashboard from './pages/Index';
import Documents from './pages/Documents';
import Accounts from './pages/Accounts';
import Sharing from './pages/Sharing';
import Education from './pages/Education';
import CustomerProfile from './pages/CustomerProfile';
import AdvisorProfile from './pages/AdvisorProfile';
import NotFound from './pages/NotFound';
import { Toaster } from './components/ui/toaster';
import FinancialPlans from './pages/FinancialPlans';
import Investments from './pages/Investments';
import Insurance from './pages/Insurance';
import Lending from './pages/Lending';
import CashManagement from './pages/CashManagement';
import Transfers from './pages/Transfers';
import TaxBudgets from './pages/TaxBudgets';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<CustomerProfile />} />
          
          <Route path="/documents" element={<Documents />}>
            <Route path=":sectionId" element={<Documents />} />
          </Route>
          
          <Route path="/accounts" element={<Accounts />}>
            <Route path=":sectionId" element={<Accounts />} />
          </Route>
          
          <Route path="/sharing" element={<Sharing />}>
            <Route path=":sectionId" element={<Sharing />} />
          </Route>
          
          <Route path="/education" element={<Education />}>
            <Route path=":sectionId" element={<Education />} />
          </Route>

          <Route path="/financial-plans" element={<FinancialPlans />} />
          <Route path="/investments" element={<Investments />} />
          <Route path="/insurance" element={<Insurance />} />
          <Route path="/lending" element={<Lending />} />
          <Route path="/cash-management" element={<CashManagement />} />
          <Route path="/transfers" element={<Transfers />} />
          <Route path="/tax-budgets" element={<TaxBudgets />} />
          <Route path="/advisor" element={<AdvisorProfile />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
