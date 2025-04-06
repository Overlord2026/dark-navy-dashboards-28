
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

const AppRoutes: React.FC = () => {
  const { isAuthenticated, userProfile } = useUser();
  const isAdmin = userProfile?.role === "admin" || userProfile?.role === "system_administrator";
  const isDeveloper = isAdmin || userProfile?.role === "developer";
  
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/advisor/login" element={<LoginPage isAdvisor={true} />} />
        <Route path="/*" element={<PublicRoutes />} />
      </Routes>
    );
  }

  // Desktop routes only
  return (
    <Routes>
      <Route path="/*" element={<MainRoutes />} />
      <Route path="/finance/*" element={<FinanceRoutes />} />
      <Route path="/wealth/*" element={<WealthRoutes />} />
      <Route path="/advisor/*" element={<AdvisorRoutes />} />
      {isAdmin && <Route path="/admin/*" element={<AdminRoutes />} />}
      
      {isDeveloper ? (
        <Route path="/dev/diagnostics" element={<Navigate to="/admin/navigation-diagnostics" />} />
      ) : (
        <Route path="/dev/*" element={<Navigate to="/" replace />} />
      )}
      
      <Route path="/*" element={<PublicRoutes />} />
    </Routes>
  );
};

export default AppRoutes;
