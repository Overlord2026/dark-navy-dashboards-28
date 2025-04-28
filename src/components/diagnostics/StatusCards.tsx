
import React from "react";
import { DiagnosticTestStatus } from "@/types/diagnostics";
import { getOverallStatusColor } from "./StatusIcon";
import { RefreshCw, Wrench, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { FixHistoryLog } from "./FixHistoryLog";

interface StatusCardsProps {
  status: DiagnosticTestStatus;
  timestamp: string | null;
  isLoading: boolean;
  rerunning: boolean;
  isWizardOpen: boolean;
  setIsWizardOpen: (open: boolean) => void;
  showFixHistory: boolean;
  setShowFixHistory: (show: boolean) => void;
  handleRerunDiagnostics: () => Promise<void>;
}

export const StatusCards = ({
  status,
  timestamp,
  isLoading,
  rerunning,
  isWizardOpen,
  setIsWizardOpen,
  showFixHistory,
  setShowFixHistory,
  handleRerunDiagnostics
}: StatusCardsProps) => {
  // Get health percentage based on status
  const getHealthPercentage = () => {
    switch (status) {
      case 'success':
        return 100;
      case 'warning':
        return 70;
      case 'error':
        return 30;
      default:
        return 50;
    }
  };

  return (
    <div className="col-span-1 flex flex-col">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xl font-semibold">System Status</h2>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getOverallStatusColor(status)}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      </div>
      <p className="text-muted-foreground text-sm mb-4">
        {timestamp ? `Last check: ${new Date(timestamp).toLocaleString()}` : 'No diagnostics run yet'}
      </p>
      
      <div className="mt-1 mb-4 flex gap-2">
        <Button 
          onClick={handleRerunDiagnostics} 
          disabled={rerunning || isLoading}
          className="flex-1 gap-2"
          variant="outline"
        >
          <RefreshCw className={`h-4 w-4 ${rerunning ? 'animate-spin' : ''}`} />
          {rerunning ? 'Re-checking...' : 'Re-run Diagnostics'}
        </Button>
        
        <Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="default"
              className="gap-2"
              disabled={isLoading || rerunning}
            >
              <Wrench className="h-4 w-4" />
              Repair Wizard
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>
      
      <div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-3 gap-1 text-xs text-muted-foreground"
          onClick={() => setShowFixHistory(!showFixHistory)}
        >
          <History className="h-3.5 w-3.5" />
          {showFixHistory ? 'Hide Fix History' : 'Show Fix History'}
        </Button>
        
        {showFixHistory && <FixHistoryLog />}
      </div>
      
      <div className="mt-auto">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-medium">Health</span>
          <span className="text-sm font-medium">{getHealthPercentage()}%</span>
        </div>
        <Progress 
          value={getHealthPercentage()} 
          className="h-2.5" 
          indicatorClassName={
            status === "success" ? "bg-green-500" : 
            status === "warning" ? "bg-yellow-500" : 
            "bg-red-500"
          }
        />
      </div>
    </div>
  );
};
