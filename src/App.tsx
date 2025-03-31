
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

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
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
          </Routes>
        </BrowserRouter>
        <Toaster />
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
