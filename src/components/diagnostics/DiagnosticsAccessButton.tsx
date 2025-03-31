
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import { useState, useEffect } from "react";
import { checkDiagnosticsAccess } from "@/services/diagnostics/permissionManagement";
import { auditLog } from "@/services/auditLog/auditLogService";

export const DiagnosticsAccessButton = () => {
  const navigate = useNavigate();
  const { userProfile } = useUser();
  const userRole = userProfile?.role || "client";
  const isAdmin = userRole === "admin" || userRole === "system_administrator";
  const isDeveloper = userRole === "developer" || userRole === "consultant";
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // Admins always have access
    if (isAdmin) {
      setHasAccess(true);
      return;
    }
    
    // Check if the developer has been granted access
    if (isDeveloper && userProfile?.id) {
      const checkAccess = async () => {
        try {
          const canAccess = await checkDiagnosticsAccess(userProfile.id, 'systemDiagnostics');
          setHasAccess(canAccess);
        } catch (error) {
          console.error("Failed to check system diagnostic access:", error);
          setHasAccess(false);
        }
      };
      
      checkAccess();
    } else {
      setHasAccess(false);
    }
  }, [isAdmin, isDeveloper, userProfile?.id]);

  const handleDiagnosticsAccess = () => {
    if (!hasAccess) {
      // Log unauthorized access attempt
      auditLog.log(
        userProfile?.id || "unknown",
        "document_access",
        "failure",
        {
          userName: userProfile?.name || "Unknown User",
          userRole: userRole,
          resourceType: "systemDiagnostics",
          details: { action: "Access system diagnostics page" },
          reason: "Insufficient permissions"
        }
      );
      
      toast.error("You don't have permission to access system diagnostics");
      return;
    }
    
    // Log successful access
    auditLog.log(
      userProfile?.id || "system",
      "document_access",
      "success",
      {
        userName: userProfile?.name || "Unknown User",
        userRole: userRole,
        resourceType: "systemDiagnostics",
        details: { action: "Access system diagnostics page" }
      }
    );
    
    toast.info("Opening full diagnostics panel");
    navigate("/system-diagnostics");
  };

  if (!hasAccess) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            onClick={handleDiagnosticsAccess}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Activity className="h-4 w-4" />
            <span>System Diagnostics</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Access detailed system diagnostics and troubleshooting</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
