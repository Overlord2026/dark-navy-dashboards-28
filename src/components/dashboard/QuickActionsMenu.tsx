
import React from "react";
import { Button } from "@/components/ui/button";
import { Bug, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { QuickDiagnosticsButton } from "@/components/diagnostics/QuickDiagnosticsButton";
import { DiagnosticsAccessButton } from "@/components/diagnostics/DiagnosticsAccessButton";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";

export const QuickActionsMenu = () => {
  const { userProfile } = useUser();
  const userRole = userProfile?.role || "client";
  const isAdmin = userRole === "admin" || userRole === "system_administrator";

  const handleQuickAction = (label: string) => {
    toast.success(`Navigating to ${label}`);
  };

  return (
    <div className="flex items-center justify-center gap-4 w-full mb-3">
      {/* Diagnostic buttons - only visible to admin roles */}
      {isAdmin && (
        <>
          <QuickDiagnosticsButton />
          <DiagnosticsAccessButton />
        </>
      )}
    </div>
  );
};
