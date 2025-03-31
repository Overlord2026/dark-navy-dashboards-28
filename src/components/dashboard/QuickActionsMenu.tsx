
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
import { ChevronDown, Code, FileText, HelpCircle, RefreshCcw, Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function QuickActionsMenu() {
  const navigate = useNavigate();

  const handleViewArchitecture = () => {
    window.open('/docs/ARCHITECTURE.md', '_blank');
    toast.success("Architecture documentation opened", {
      description: "Press Ctrl+P or Cmd+P to print the document once it's open"
    });
  };

  const handleViewApiIntegration = () => {
    window.open('/docs/API_INTEGRATION.md', '_blank');
    toast.success("API integration documentation opened", {
      description: "Press Ctrl+P or Cmd+P to print the document once it's open"
    });
  };

  const handlePrintArchitecture = () => {
    const printWindow = window.open('/docs/ARCHITECTURE.md', '_blank');
    printWindow?.addEventListener('load', () => {
      printWindow.print();
    });
    toast.success("Printing Architecture documentation");
  };

  const handlePrintApiIntegration = () => {
    const printWindow = window.open('/docs/API_INTEGRATION.md', '_blank');
    printWindow?.addEventListener('load', () => {
      printWindow.print();
    });
    toast.success("Printing API Integration documentation");
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
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Documentation</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleViewArchitecture}>
          <FileText className="mr-2 h-4 w-4" />
          <span>View Architecture Docs</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handlePrintArchitecture}>
          <Printer className="mr-2 h-4 w-4" />
          <span>Print Architecture Docs</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleViewApiIntegration}>
          <Code className="mr-2 h-4 w-4" />
          <span>API Integration Guide</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handlePrintApiIntegration}>
          <Printer className="mr-2 h-4 w-4" />
          <span>Print API Integration Guide</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>System</DropdownMenuLabel>
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
