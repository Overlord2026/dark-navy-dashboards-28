
import React from "react";
import { LogEntry } from "@/types/diagnostics";
import { LogEntryItem } from "./LogEntryItem";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "lucide-react";

interface LogsListProps {
  logs: LogEntry[];
  isLoading: boolean;
  filter: string;
  expandedLog: string | null;
  setExpandedLog: (id: string | null) => void;
  setFilter: (filter: string) => void;
}

export const LogsList: React.FC<LogsListProps> = ({
  logs,
  isLoading,
  filter,
  expandedLog,
  setExpandedLog,
  setFilter
}) => {
  // Toggle log details
  const toggleLogDetails = (logId: string) => {
    if (expandedLog === logId) {
      setExpandedLog(null);
    } else {
      setExpandedLog(logId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-center font-medium">Running Comprehensive System Diagnostics</p>
        <p className="text-sm text-muted-foreground mt-2">This may take a moment as we test all system components...</p>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12">
        {filter ? (
          <>
            <p>No logs matching "{filter}"</p>
            <Button variant="link" onClick={() => setFilter("")}>Clear filter</Button>
          </>
        ) : (
          <p>No logs available. Run a system-wide diagnostic to generate logs.</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <LogEntryItem
          key={log.id}
          log={log}
          isExpanded={expandedLog === log.id}
          onToggleExpand={() => toggleLogDetails(log.id)}
        />
      ))}
    </div>
  );
};
