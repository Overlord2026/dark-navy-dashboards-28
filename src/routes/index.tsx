import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

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
      {/* Direct route to login page */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Keep advisor login */}
      <Route path="/advisor/login" element={<LoginPage isAdvisor={true} />} />
      
      {/* Make Client Portal directly accessible */}
      <Route path="/client-portal" element={<ClientPortal />} />
      
      {/* Public routes */}
      <Route path="/*" element={<PublicRoutes />} />
      
      {/* Feature routes - no authentication required for now */}
      <Route path="finance/*" element={<FinanceRoutes />} />
      <Route path="wealth/*" element={<WealthRoutes />} />
      <Route path="advisor/*" element={<AdvisorRoutes />} />
      <Route path="admin/*" element={<AdminRoutes />} />
      
      {/* Redirect root to client portal */}
      <Route path="/" element={<Navigate to="/client-portal" replace />} />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
