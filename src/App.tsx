
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
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
