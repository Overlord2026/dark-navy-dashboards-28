
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

// Import components
import PublicRoutes from "./PublicRoutes";
import MainRoutes from "./MainRoutes";
import FinanceRoutes from "./FinanceRoutes";
import WealthRoutes from "./WealthRoutes";
import AdvisorRoutes from "./AdvisorRoutes";
import AdminRoutes from "./AdminRoutes";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";

const AppRoutes: React.FC = () => {
  const { isAuthenticated, userProfile } = useUser();
  const isAdmin = userProfile?.role === "admin" || userProfile?.role === "system_administrator";
  const isDeveloper = isAdmin || userProfile?.role === "developer";
  
  return (
    <Routes>
      {/* Public routes that don't require auth */}
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/advisor/login" element={<LoginPage isAdvisor={true} />} />

      {/* Public content routes */}
      <Route path="/services/*" element={<PublicRoutes />} />
      <Route path="/about/*" element={<PublicRoutes />} />
      <Route path="/team/*" element={<PublicRoutes />} />
      <Route path="/contact/*" element={<PublicRoutes />} />
      <Route path="/careers/*" element={<PublicRoutes />} />
      <Route path="/privacy-policy/*" element={<PublicRoutes />} />
      <Route path="/terms-of-service/*" element={<PublicRoutes />} />
      <Route path="/disclosures/*" element={<PublicRoutes />} />
      <Route path="/accessibility/*" element={<PublicRoutes />} />

      {/* Client portal routes */}
      <Route path="/dashboard/*" element={<MainRoutes />} />
      <Route path="/finance/*" element={<FinanceRoutes />} />
      <Route path="/wealth/*" element={<WealthRoutes />} />
      <Route path="/advisor/*" element={<AdvisorRoutes />} />
      
      {/* Admin routes */}
      {isAdmin && <Route path="/admin/*" element={<AdminRoutes />} />}
      
      {isDeveloper ? (
        <Route path="/dev/diagnostics" element={<Navigate to="/admin/navigation-diagnostics" replace />} />
      ) : (
        <Route path="/dev/*" element={<Navigate to="/" replace />} />
      )}

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
