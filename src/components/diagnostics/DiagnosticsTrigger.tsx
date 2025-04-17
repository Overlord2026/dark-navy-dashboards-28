
import React from 'react';
import { useDiagnosticsContext } from '@/contexts/DiagnosticsContext';
import { useUser } from "@/contexts/UserContext";

export function DiagnosticsTrigger() {
  const { isDiagnosticsModeEnabled } = useDiagnosticsContext();
  const { userProfile } = useUser();
  
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
