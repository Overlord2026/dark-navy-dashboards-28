
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";

// Import components
import PublicRoutes from "./PublicRoutes";
import MainRoutes from "./MainRoutes";
import FinanceRoutes from "./FinanceRoutes";
import WealthRoutes from "./WealthRoutes";
import AdvisorRoutes from "./AdvisorRoutes";
import AdminRoutes from "./AdminRoutes";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import AdvisorDashboard from "../pages/AdvisorDashboard";

const AppRoutes: React.FC = () => {
  const { userProfile } = useUser();
  const { isAuthenticated } = useAuth();
  
  const isAdmin = userProfile?.role === "admin" || userProfile?.role === "system_administrator";
  const isDeveloper = isAdmin || userProfile?.role === "developer";
  
  return (
    <Routes>
      {/* Public routes that don't require auth */}
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <HomePage />} />
      <Route path="/home" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <HomePage />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/advisor/login" element={isAuthenticated ? <Navigate to="/advisor/dashboard" replace /> : <LoginPage isAdvisor={true} />} />
      <Route path="/advisor/dashboard" element={<AdvisorDashboard />} />

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

      {/* Direct routes */}
      <Route path="/dashboard" element={<MainRoutes />} />
      <Route path="/billpay" element={<MainRoutes />} />
      <Route path="/accounts" element={<MainRoutes />} />
      <Route path="/profile" element={<MainRoutes />} />
      <Route path="/advisor-profile" element={<MainRoutes />} />
      <Route path="/notifications" element={<MainRoutes />} />
      <Route path="/settings" element={<MainRoutes />} />
      <Route path="/help" element={<MainRoutes />} />
      <Route path="/education/*" element={<MainRoutes />} />
      <Route path="/investments/*" element={<MainRoutes />} />
      <Route path="/insurance" element={<MainRoutes />} />
      <Route path="/personal-insurance" element={<MainRoutes />} />
      <Route path="/properties" element={<MainRoutes />} />
      <Route path="/lending" element={<MainRoutes />} />
      
      {/* Nested routes */}
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

      {/* Catch all route - must be last */}
      <Route path="*" element={<MainRoutes />} />
    </Routes>
  );
};

export default AppRoutes;
