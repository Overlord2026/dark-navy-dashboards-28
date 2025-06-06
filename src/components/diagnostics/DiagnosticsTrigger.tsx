
import React from 'react';
import { useDiagnostics } from '@/context/DiagnosticsContext';
import { useAuth } from "@/context/AuthContext";

export function DiagnosticsTrigger() {
  const { isRunning } = useDiagnostics();
  const { userProfile } = useAuth();
  
  // Only enable diagnostics for administrators
  const userRole = userProfile?.role || "client";
  const isAdmin = userRole === "admin" || userRole === "system_administrator";
  
  // If user is not admin, this component doesn't do anything
  if (!isAdmin) {
    return null;
  }
  
  // For admins, the component will render nothing but still be functional
  // for keyboard shortcuts and other diagnostics functionality
  return null;
}
