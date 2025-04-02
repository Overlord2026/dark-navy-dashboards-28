
import React from "react";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Info, Bug } from "lucide-react";
import { LogEntry, LogLevel } from "@/types/diagnostics";

interface LogEntryItemProps {
  log: LogEntry;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const LogEntryItem: React.FC<LogEntryItemProps> = ({ 
  log, 
  isExpanded, 
  onToggleExpand 
}) => {
  // Get icon for log level
  const getLogLevelIcon = (level: LogLevel) => {
    switch (level) {
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
      case "debug":
        return <Bug className="h-4 w-4 text-gray-500" />;
      case "success":
        return <Info className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };
  
  // Get badge for log level
  const getLogLevelBadge = (level: LogLevel) => {
    switch (level) {
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      case "warning":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">Warning</Badge>;
      case "info":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500">Info</Badge>;
      case "debug":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-500">Debug</Badge>;
      case "success":
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500">Success</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div 
      className="p-3 rounded-md border hover:bg-muted/50 cursor-pointer"
      onClick={onToggleExpand}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">{getLogLevelIcon(log.level)}</div>
          <div>
            <div className="font-medium">{log.message}</div>
            <div className="text-sm text-muted-foreground">
              {new Date(log.timestamp).toLocaleString()} • Source: {log.source}
            </div>
          </div>
        </div>
        <div>
          {getLogLevelBadge(log.level)}
        </div>
      </div>
      
      {isExpanded && log.details && (
        <div className="mt-3 pt-3 border-t text-sm">
          <div className="font-medium mb-1">Details:</div>
          <div className="bg-muted p-2 rounded font-mono text-xs overflow-x-auto">
            {log.details}
          </div>
        </div>
      )}
    </div>
  );
};
