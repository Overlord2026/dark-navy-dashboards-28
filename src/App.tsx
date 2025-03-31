
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Index from '@/pages/Index';
import Marketplace from '@/pages/Marketplace';
import FamilyOfficeDirectory from '@/pages/FamilyOfficeDirectory';
import DataImportPage from '@/pages/DataImportPage';
import CashManagement from '@/pages/CashManagement';
import PrivateInvestmentsPage from '@/pages/PrivateInvestmentsPage';
import { ThemeProvider } from '@/context/ThemeContext';
import { UserProvider } from '@/context/UserContext';
import { NetWorthProvider } from '@/context/NetWorthContext';
import { Toaster } from 'sonner';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <NetWorthProvider>
          <BrowserRouter>
            <Routes>
              {/* Redirect from root to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Index />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/family-office-directory" element={<FamilyOfficeDirectory />} />
              <Route path="/data-import" element={<DataImportPage />} />
              <Route path="/cash-management" element={<CashManagement />} />
              <Route path="/private-investments" element={<PrivateInvestmentsPage />} />
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </NetWorthProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
