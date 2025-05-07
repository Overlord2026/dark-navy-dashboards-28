import React from "react";
import { Navigate } from "react-router-dom";
import { useRoleCheck } from "@/hooks/useRoleCheck";
import { useUser } from "@/context/UserContext";

interface RoleBasedAccessProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export const RoleBasedAccess: React.FC<RoleBasedAccessProps> = ({
  children,
  allowedRoles = [],
  redirectTo = "/unauthorized",
  fallback
}) => {
  const { userProfile, isAuthenticated } = useUser();
  const { hasRole, isLoading } = useRoleCheck();
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Show loading state while roles are being fetched
  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading permissions...</div>;
  }

  // If there are no allowed roles specified, render the children
  if (allowedRoles.length === 0) {
    return <>{children}</>;
  }

  // Check if the user has any of the allowed roles
  const hasAccess = allowedRoles.some(role => hasRole(role));
  
  // If the user has the required role, render the children
  if (hasAccess) {
    return <>{children}</>;
  }

  // If fallback is provided, render that instead
  if (fallback) {
    return <>{fallback}</>;
  }
  
  // Otherwise redirect to the unauthorized page
  return <Navigate to={redirectTo} replace />;
};
