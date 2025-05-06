
import React from "react";
import { RouteObject } from "react-router-dom";
import TaxPlanning from "@/pages/TaxPlanning";
import EstatePlanning from "@/pages/EstatePlanning";
import Insurance from "@/pages/Insurance";
import Lending from "@/pages/Lending";
import FamilyVault from "@/pages/FamilyVault";
import LegacyVault from "@/pages/LegacyVault"; // Add import for LegacyVault
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/secure-login" />;
  }
  
  return <>{children}</>;
};

export const planningRoutes: RouteObject[] = [
  {
    path: "/tax-planning",
    element: <TaxPlanning />,
  },
  {
    path: "/estate-planning",
    element: <EstatePlanning />,
  },
  {
    path: "/insurance",
    element: <Insurance />,
  },
  {
    path: "/lending",
    element: <Lending />,
  },
  {
    path: "/family-vault",
    element: (
      <AuthGuard>
        <FamilyVault />
      </AuthGuard>
    ),
  },
  // Add route for legacy-vault
  {
    path: "/legacy-vault",
    element: (
      <AuthGuard>
        <LegacyVault />
      </AuthGuard>
    ),
  },
];
