
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { QuickDiagnosticsDialog } from "./QuickDiagnosticsDialog";
import { toast } from "sonner";
import { auditLog } from "@/services/auditLog/auditLogService";

export const QuickDiagnosticsButton = () => {
  const [showDiagnosticsDialog, setShowDiagnosticsDialog] = useState(false);
  const { userProfile } = useUser();
  const userRole = userProfile?.role || "client";
  const isAdmin = userRole === "admin" || userRole === "system_administrator";
  const userId = userProfile?.id || "unknown";
  const userName = userProfile?.displayName || "Unknown User";

  const handleShowDiagnostics = () => {
    // Log quick diagnostics access
    auditLog.log(
      userId,
      "diagnostic_access",
      "success",
      {
        userName: userName,
        userRole: userRole,
        resourceType: "quickDiagnostics",
        details: { action: "View quick diagnostics dialog" }
      }
    );
    
    setShowDiagnosticsDialog(true);
    
    toast.success("Running quick diagnostics", {
      description: "System health check initiated"
    });
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <Button
        variant="secondary"
        size="lg"
        className="gap-2 transition-all"
        onClick={handleShowDiagnostics}
      >
        <Activity className="h-5 w-5" />
        Quick Check
      </Button>
      
      <QuickDiagnosticsDialog
        open={showDiagnosticsDialog}
        onOpenChange={setShowDiagnosticsDialog}
      />
    </>
  );
};
