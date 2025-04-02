
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowDownUp, RefreshCw, Bug, FileText } from "lucide-react";

interface LogsToolbarProps {
  filter: string;
  setFilter: (filter: string) => void;
  sortDesc: boolean;
  setSortDesc: (sortDesc: boolean) => void;
  handleRefresh: () => void;
  exportLogs: () => void;
  runFullSystemDiagnostic: () => void;
  isRunningFullTest: boolean;
  logsCount: number;
}

export const LogsToolbar: React.FC<LogsToolbarProps> = ({
  filter,
  setFilter,
  sortDesc,
  setSortDesc,
  handleRefresh,
  exportLogs,
  runFullSystemDiagnostic,
  isRunningFullTest,
  logsCount
}) => {
  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Filter logs..."
            className="pl-8"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSortDesc(!sortDesc)}
          title={sortDesc ? "Newest first" : "Oldest first"}
        >
          <ArrowDownUp className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          title="Refresh logs"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button 
          onClick={runFullSystemDiagnostic} 
          disabled={isRunningFullTest}
          className="gap-2"
        >
          {isRunningFullTest ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Running Full Diagnostic...
            </>
          ) : (
            <>
              <Bug className="h-4 w-4" />
              Run System-Wide Diagnostic
            </>
          )}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={exportLogs}
          className="gap-2"
          disabled={logsCount === 0 || isRunningFullTest}
        >
          <FileText className="h-4 w-4" />
          Export For Developers
        </Button>
      </div>
    </div>
  );
};
