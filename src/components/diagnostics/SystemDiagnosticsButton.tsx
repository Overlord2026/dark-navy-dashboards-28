
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
  targetSystem?: "all" | "marketplace" | "financial" | "document";
}

export const SystemDiagnosticsButton = ({ 
  variant = "default", 
  size = "default",
  targetSystem = "all"
}: SystemDiagnosticsButtonProps) => {
  const navigate = useNavigate();
  
  const handleRunDiagnostics = async () => {
    const systemLabel = targetSystem === "all" ? "system" : targetSystem;
    toast.info(`Running quick ${systemLabel} check...`);
    
    try {
      const quickCheck = await runQuickSystemCheck(targetSystem);
      
      if (quickCheck.success) {
        toast.success(`${systemLabel.charAt(0).toUpperCase() + systemLabel.slice(1)} check completed: ${quickCheck.status}`, {
          description: "Navigating to detailed diagnostics report"
        });
        navigate(`/system-diagnostics${targetSystem !== "all" ? `?focus=${targetSystem}` : ""}`);
      } else {
        toast.error(`${systemLabel.charAt(0).toUpperCase() + systemLabel.slice(1)} check failed`, {
          description: "Please try again or contact support"
        });
      }
    } catch (error) {
      toast.error(`Error running ${systemLabel} diagnostics`, {
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
      <span>
        {targetSystem === "all" ? "Run Diagnostics" : 
         targetSystem === "marketplace" ? "Check Marketplace" :
         targetSystem === "financial" ? "Check Financials" :
         targetSystem === "document" ? "Check Documents" : 
         "Run Diagnostics"}
      </span>
    </Button>
  );
};
