
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useIsMobile } from "../hooks/use-mobile";

// Import components
import PublicRoutes from "./PublicRoutes";
import MobileRoutes from "./MobileRoutes";
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
  
  // Use useIsMobile hook inside the component
  const isMobile = useIsMobile();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/advisor/login" element={<LoginPage isAdvisor={true} />} />
        <Route path="/*" element={<PublicRoutes />} />
      </Routes>
    );
  }

  // Use mobile routes when on a mobile device
  if (isMobile) {
    return <MobileRoutes />;
  }

  // Desktop routes
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
