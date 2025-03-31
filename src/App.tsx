import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import Marketplace from '@/pages/Marketplace';
import FamilyOfficeDirectory from '@/pages/FamilyOfficeDirectory';
import DataImportPage from '@/pages/DataImportPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/family-office-directory" element={<FamilyOfficeDirectory />} />
        <Route path="/data-import" element={<DataImportPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
