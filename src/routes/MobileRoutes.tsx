
import React from "react";
import { Routes, Route } from "react-router-dom";

// Import mobile pages
import MobileHome from "../pages/mobile/MobileHome";
import MobileAccounts from "../pages/mobile/MobileAccounts";
import MobileTransfers from "../pages/mobile/MobileTransfers";
import MobileDocuments from "../pages/mobile/MobileDocuments";
import MobileMore from "../pages/mobile/MobileMore";
import MobileTaxPlanning from "../pages/mobile/MobileTaxPlanning";
import MobileEducation from "../pages/mobile/MobileEducation";
import CustomerProfile from "../pages/CustomerProfile";
import AdvisorProfile from "../pages/AdvisorProfile";
import AllAssets from "../pages/AllAssets";

const MobileRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MobileHome />} />
      <Route path="/home" element={<MobileHome />} />
      <Route path="/accounts" element={<MobileAccounts />} />
      <Route path="/transfers" element={<MobileTransfers />} />
      <Route path="/documents" element={<MobileDocuments />} />
      <Route path="/documents/:categoryId" element={<MobileDocuments />} />
      <Route path="/tax-planning" element={<MobileTaxPlanning />} />
      <Route path="/education" element={<MobileEducation />} />
      <Route path="/more" element={<MobileMore />} />
      <Route path="/profile" element={<CustomerProfile />} />
      <Route path="/advisor-profile" element={<AdvisorProfile />} />
      <Route path="/security-settings" element={<CustomerProfile />} />
      <Route path="/all-assets" element={<AllAssets />} />
      
      {/* Fallback for any other routes */}
      <Route path="*" element={<MobileHome />} />
    </Routes>
  );
};

export default MobileRoutes;
