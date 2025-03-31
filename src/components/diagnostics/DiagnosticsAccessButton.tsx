
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bug } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";
import { auditLog } from "@/services/auditLog/auditLogService";

export const DiagnosticsAccessButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { userProfile } = useUser();
  const userRole = userProfile?.role || "client";
  const isAdmin = userRole === "admin" || userRole === "system_administrator";
  const userId = userProfile?.id || "unknown";
  const userName = userProfile?.displayName || "Unknown User";

  const handleDiagnosticsAccess = () => {
    setIsLoading(true);
    
    try {
      // Log diagnostic tools access
      auditLog.log(
        userId,
        "diagnostic_access",
        "success",
        {
          userName: userName,
          userRole: userRole,
          resourceType: "diagnosticTools",
          details: { action: "Access full diagnostic tools page" }
        }
      );
      
      // Trigger success toast
      toast.success("Accessing system diagnostics", {
        description: "Opening full diagnostics interface"
      });
      
      // In a real app, we might do additional checks here
      setIsLoading(false);
    } catch (error) {
      // Log failure
      auditLog.log(
        userId,
        "diagnostic_access",
        "failure",
        {
          userName: userName,
          userRole: userRole,
          resourceType: "diagnosticTools",
          details: { action: "Access full diagnostic tools page" },
          reason: error instanceof Error ? error.message : "Unknown error"
        }
      );
      
      toast.error("Could not access diagnostics", {
        description: "Please try again or contact support"
      });
      
      setIsLoading(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Button
      variant="secondary"
      size="lg"
      className="gap-2 transition-all"
      asChild
      onClick={handleDiagnosticsAccess}
      disabled={isLoading}
    >
      <Link to="/system-diagnostics">
        <Bug className="h-5 w-5" />
        Diagnostics
      </Link>
    </Button>
  );
};
