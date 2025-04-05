
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
import ClientPortal from "../pages/ClientPortal";
import NotFound from "../pages/NotFound";

const AppRoutes: React.FC = () => {
  const { isAuthenticated, userProfile } = useUser();
  const auth = useAuth();
  const isAdmin = userProfile?.role === "admin" || userProfile?.role === "system_administrator";
  const isDeveloper = isAdmin || userProfile?.role === "developer";
  
  // Always show routes regardless of authentication
  return (
    <Routes>
      {/* Make Client Portal directly accessible */}
      <Route path="/client-portal" element={<ClientPortal />} />
      
      {/* Public routes */}
      <Route path="/login" element={<Navigate to="/client-portal" replace />} />
      <Route path="/advisor/login" element={<LoginPage isAdvisor={true} />} />
      <Route path="/*" element={<PublicRoutes />} />
      
      {/* Dashboard routes - these would normally require authentication */}
      <Route path="finance/*" element={<FinanceRoutes />} />
      <Route path="wealth/*" element={<WealthRoutes />} />
      <Route path="advisor/*" element={<AdvisorRoutes />} />
      {isAdmin && <Route path="admin/*" element={<AdminRoutes />} />}
      
      {isDeveloper ? (
        <Route path="dev/diagnostics" element={<Navigate to="admin/navigation-diagnostics" />} />
      ) : (
        <Route path="dev/*" element={<Navigate to="/" replace />} />
      )}
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
