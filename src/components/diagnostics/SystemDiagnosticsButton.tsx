
import React from "react";
import { Button } from "@/components/ui/button";
import { Activity, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { runQuickSystemCheck } from "@/services/diagnosticsService";

type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "interested" | "advisor" | "marketplace";
type ButtonSize = "default" | "sm" | "lg" | "icon" | "xl";

interface SystemDiagnosticsButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const SystemDiagnosticsButton = ({ 
  variant = "default", 
  size = "default" 
}: SystemDiagnosticsButtonProps) => {
  const navigate = useNavigate();
  
  const handleRunDiagnostics = async () => {
    toast.info("Running quick system check...");
    
    try {
      const quickCheck = await runQuickSystemCheck();
      
      if (quickCheck.success) {
        toast.success(`System check completed: ${quickCheck.status}`, {
          description: "Navigating to detailed diagnostics report"
        });
        navigate("/system-diagnostics");
      } else {
        toast.error("System check failed", {
          description: "Please try again or contact support"
        });
      }
    } catch (error) {
      toast.error("Error running diagnostics", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    }
  };

  return (
    <Button 
      variant={variant}
      size={size}
      className="flex items-center gap-2"
      onClick={handleRunDiagnostics}
    >
      <Activity className="h-4 w-4" />
      <span>Run Diagnostics</span>
    </Button>
  );
};
