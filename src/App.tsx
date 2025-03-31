
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import Marketplace from '@/pages/Marketplace';
import FamilyOfficeDirectory from '@/pages/FamilyOfficeDirectory';
import DataImportPage from '@/pages/DataImportPage';
import CashManagement from '@/pages/CashManagement';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from 'sonner';
import { UserProvider } from '@/context/UserContext';
import { SubscriptionProvider } from '@/context/SubscriptionContext';
import { NetWorthProvider } from '@/context/NetWorthContext';
import Education from '@/pages/Education';

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <SubscriptionProvider>
          <NetWorthProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/family-office-directory" element={<FamilyOfficeDirectory />} />
                <Route path="/data-import" element={<DataImportPage />} />
                <Route path="/cash-management" element={<CashManagement />} />
                <Route path="/education" element={<Education />} />
                <Route path="/subscription" element={<Marketplace />} />
              </Routes>
            </BrowserRouter>
            <Toaster />
          </NetWorthProvider>
        </SubscriptionProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
