
import React from "react";
import { Button } from "@/components/ui/button";
import { Bug } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";
import { auditLog } from "@/services/auditLog/auditLogService";

export const DiagnosticsAccessButton = () => {
  const { userProfile } = useUser();
  const userRole = userProfile?.role || "client";
  const isAdmin = userRole === "admin" || userRole === "system_administrator";
  const userId = userProfile?.id || "unknown";
  const userName = userProfile?.displayName || "Unknown User";

  const handleNavigateToDiagnostics = () => {
    // Log diagnostics access
    auditLog.log(
      userId,
      "diagnostics_access" as any, // Using as any to bypass type check temporarily
      "success",
      {
        userName: userName,
        userRole: userRole,
        resourceType: "systemDiagnostics",
        details: { action: "Navigate to diagnostics page" }
      }
    );
    
    toast.success("Accessing system diagnostics");
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Button 
      variant="ghost" 
      size="lg"
      className="gap-2 border border-gray-600"
      asChild
      onClick={handleNavigateToDiagnostics}
    >
      <Link to="/system-diagnostics">
        <Bug className="h-5 w-5" />
        System Diagnostics
      </Link>
    </Button>
  );
};
