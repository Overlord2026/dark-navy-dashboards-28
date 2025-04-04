
import React from "react";
import { Route } from "react-router-dom";

// Import pages
import Index from "../pages/Index";
import Dashboard from "../pages/Dashboard";
import Documents from "../pages/Documents";
import NotFound from "../pages/NotFound";
import CustomerProfile from "../pages/CustomerProfile";
import Education from "../pages/Education";
import Professionals from "../pages/Professionals";
import ProfessionalSignup from "../pages/ProfessionalSignup";
import Sharing from "../pages/Sharing";

const MainRoutes: React.FC = () => {
  return (
    <>
      <Route path="/" element={<Index />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/documents" element={<Documents />} />
      <Route path="/documents/:sectionId" element={<Documents />} />
      <Route path="/profile" element={<CustomerProfile />} />
      <Route path="/education" element={<Education />} />
      <Route path="/education/:sectionId" element={<Education />} />
      <Route path="/professionals" element={<Professionals />} />
      <Route path="/professionals/signup" element={<ProfessionalSignup />} />
      <Route path="/sharing" element={<Sharing />} />
      <Route path="/sharing/:sectionId" element={<Sharing />} />
      <Route path="*" element={<NotFound />} />
    </>
  );
};

export default MainRoutes;
