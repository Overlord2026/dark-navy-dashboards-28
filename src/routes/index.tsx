
import React from "react";
import { Routes, Route } from "react-router-dom";

// Import components
import PublicRoutes from "./PublicRoutes";
import MainRoutes from "./MainRoutes";
import FinanceRoutes from "./FinanceRoutes";
import WealthRoutes from "./WealthRoutes";
import AdvisorRoutes from "./AdvisorRoutes";
import AdminRoutes from "./AdminRoutes";
import LoginPage from "../pages/LoginPage";
import ClientPortal from "../pages/ClientPortal";
import NotFound from "../pages/NotFound";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Make Client Portal directly accessible without any redirects */}
      <Route path="/client-portal" element={<ClientPortal />} />
      
      {/* Advisor login route */}
      <Route path="/advisor/login" element={<LoginPage isAdvisor={true} />} />
      
      {/* Public routes */}
      <Route path="/*" element={<PublicRoutes />} />
      
      {/* Feature routes - no authentication required for now */}
      <Route path="finance/*" element={<FinanceRoutes />} />
      <Route path="wealth/*" element={<WealthRoutes />} />
      <Route path="advisor/*" element={<AdvisorRoutes />} />
      <Route path="admin/*" element={<AdminRoutes />} />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
