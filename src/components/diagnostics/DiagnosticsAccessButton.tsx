
import React from "react";
import { Button } from "@/components/ui/button";
import { Activity, Navigation } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { QuickNavigationCheck } from "./QuickNavigationCheck";
import { toast } from "sonner";

export const DiagnosticsAccessButton = () => {
  const navigate = useNavigate();
  const { userProfile } = useUser();
  const userRole = userProfile?.role || "client";
  const isAdmin = userRole === "admin" || userRole === "system_administrator";

  const handleOpenDiagnostics = () => {
    if (isAdmin) {
      navigate("/admin/system-diagnostics");
    } else {
      toast.error("You don't have permission to access diagnostics");
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <QuickNavigationCheck buttonText="Check Navigation" />
      
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={handleOpenDiagnostics}
      >
        <Activity className="h-4 w-4" />
        Full Diagnostics
      </Button>
    </div>
  );
};
