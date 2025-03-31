
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bug } from "lucide-react";
import { QuickDiagnosticsDialog } from "./QuickDiagnosticsDialog";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useUser } from "@/context/UserContext";
import { checkDiagnosticsAccess } from "@/services/diagnostics/permissionManagement";
import { auditLog } from "@/services/auditLog/auditLogService";

export const QuickDiagnosticsButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const { userProfile } = useUser();
  const userRole = userProfile?.role || "client";
  const isAdmin = userRole === "admin" || userRole === "system_administrator";
  const isDeveloper = userRole === "developer" || userRole === "consultant";

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
          const canAccess = await checkDiagnosticsAccess(userProfile.id, 'diagnostics');
          setHasAccess(canAccess);
        } catch (error) {
          console.error("Failed to check diagnostic access:", error);
          setHasAccess(false);
        }
      };
      
      checkAccess();
    } else {
      setHasAccess(false);
    }
  }, [isAdmin, isDeveloper, userProfile?.id]);

  const handleOpenDiagnostics = () => {
    // Log successful access
    auditLog.log(
      userProfile?.id || "system",
      "document_access",
      "success",
      {
        userName: userProfile?.name || "Unknown User",
        userRole: userRole,
        resourceType: "quickDiagnostics",
        details: { action: "Run quick diagnostics" }
      }
    );
    
    setIsDialogOpen(true);
    toast.success("Diagnostics tool opened");
  };

  if (!hasAccess) return null;

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={handleOpenDiagnostics}
            >
              <Bug className="h-4 w-4" />
              <span>Run Diagnostics</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Run a quick check of your system</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <QuickDiagnosticsDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
};
