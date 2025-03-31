
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Code, FileText, HelpCircle, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function QuickActionsMenu() {
  const navigate = useNavigate();

  const handleViewArchitecture = () => {
    window.open('/docs/ARCHITECTURE.md', '_blank');
    toast.success("Architecture documentation opened");
  };

  const handleViewApiIntegration = () => {
    window.open('/docs/API_INTEGRATION.md', '_blank');
    toast.success("API integration documentation opened");
  };

  const handleRunDiagnostics = () => {
    navigate("/system-diagnostics");
  };

  const handleViewLogs = () => {
    navigate("/system-diagnostics?tab=logs");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-1">
          Quick Actions <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Administration</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleViewArchitecture}>
          <FileText className="mr-2 h-4 w-4" />
          <span>View Architecture Docs</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleViewApiIntegration}>
          <Code className="mr-2 h-4 w-4" />
          <span>API Integration Guide</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleRunDiagnostics}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          <span>Run System Diagnostics</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleViewLogs}>
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>View System Logs</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
