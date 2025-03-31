
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import CustomerProfile from '@/pages/CustomerProfile';
import Marketplace from '@/pages/Marketplace';
import FamilyOfficeDirectory from '@/pages/FamilyOfficeDirectory';
import DataImportPage from '@/pages/DataImportPage';
import CashManagement from '@/pages/CashManagement';
import { ThemeProvider } from '@/context/ThemeContext';
import { UserProvider } from '@/context/UserContext';
import { Toaster } from 'sonner';
import Education from '@/pages/Education';
import Index from '@/pages/Index';
import { NetWorthProvider } from '@/context/NetWorthContext';
import { SubscriptionProvider } from '@/context/SubscriptionContext';
import { BillsProvider } from '@/hooks/useBills';
import Subscription from '@/pages/Subscription';
import BillsManagement from '@/pages/BillsManagement';

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <SubscriptionProvider>
          <NetWorthProvider>
            <BillsProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/landing" element={<HomePage />} />
                  <Route path="/login" element={<Navigate to="/" />} />
                  <Route path="/dashboard" element={<Index />} />
                  <Route path="/home" element={<Index />} />
                  <Route path="/profile" element={<CustomerProfile />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/family-office-directory" element={<FamilyOfficeDirectory />} />
                  <Route path="/data-import" element={<DataImportPage />} />
                  <Route path="/cash-management" element={<CashManagement />} />
                  <Route path="/education" element={<Education />} />
                  <Route path="/subscription" element={<Subscription />} />
                  <Route path="/bills-management" element={<BillsManagement />} />
                </Routes>
              </BrowserRouter>
              <Toaster />
            </BillsProvider>
          </NetWorthProvider>
        </SubscriptionProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
