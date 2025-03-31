
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";

export const DiagnosticsAccessButton = () => {
  const navigate = useNavigate();
  const { userProfile } = useUser();
  const userRole = userProfile?.role || "client";
  const isAdmin = userRole === "admin" || userRole === "system_administrator";

  const handleDiagnosticsAccess = () => {
    if (!isAdmin) {
      toast.error("You don't have permission to access system diagnostics");
      return;
    }
    
    toast.info("Opening full diagnostics panel");
    navigate("/system-diagnostics");
  };

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
