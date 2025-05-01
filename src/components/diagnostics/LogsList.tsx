
import React from "react";
import { LogEntry } from "@/types/diagnostics";
import { LogEntryItem } from "./LogEntryItem";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, AlertTriangle, Clock, FileCode, Wrench } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
      <ScrollArea className="max-h-[650px] pr-3">
        <Accordion type="single" collapsible className="w-full">
          {logs.map((log) => (
            <AccordionItem key={log.id} value={log.id} className={`mb-3 rounded-md border ${
              log.level === "error" ? "border-red-200 dark:border-red-800" :
              log.level === "warning" ? "border-yellow-200 dark:border-yellow-800" : 
              log.level === "success" ? "border-green-200 dark:border-green-800" : 
              "border-gray-200 dark:border-gray-800"
            } overflow-hidden`}>
              <LogEntryItem
                log={log}
                isExpanded={expandedLog === log.id}
                onToggleExpand={() => toggleLogDetails(log.id)}
              />
              
              <AccordionContent className="px-4 pb-4 pt-1">
                {log.details && (
                  <div className="space-y-4">
                    <div className="mt-2">
                      <h4 className="text-sm font-semibold flex items-center gap-1.5 mb-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        Diagnostic Timeline
                      </h4>
                      <div className="bg-muted/50 p-3 rounded-md text-xs font-mono">
                        <p>[{new Date(log.timestamp).toISOString()}] {log.level.toUpperCase()}: {log.message}</p>
                        <p>[{new Date(log.timestamp).toISOString()}] Source: {log.source}</p>
                        <p>[{new Date(log.timestamp).toISOString()}] Details: checking system components...</p>
                        <p>[{new Date(log.timestamp).toISOString()}] Complete: diagnostic information collected</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold flex items-center gap-1.5 mb-2">
                        <FileCode className="h-4 w-4 text-muted-foreground" />
                        Technical Details
                      </h4>
                      <div className="bg-muted p-3 rounded-md font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                        {log.details}
                      </div>
                    </div>
                    
                    {(log.level === "error" || log.level === "warning") && (
                      <div>
                        <h4 className="text-sm font-semibold flex items-center gap-1.5 mb-2">
                          <Wrench className="h-4 w-4 text-muted-foreground" />
                          Recommended Steps
                        </h4>
                        <div className="space-y-2">
                          <ul className="list-disc list-inside text-sm space-y-1.5 ml-1">
                            {log.source.includes("API") && (
                              <>
                                <li>Verify API credentials are correctly configured</li>
                                <li>Check network connectivity to the API endpoint</li>
                                <li>Review API access permissions for your account</li>
                              </>
                            )}
                            {log.source.includes("Security") && (
                              <>
                                <li>Update security configurations in system settings</li>
                                <li>Verify user permissions are correctly assigned</li>
                                <li>Check for any firewall or network security blocks</li>
                              </>
                            )}
                            {log.source.includes("Database") && (
                              <>
                                <li>Check database connection settings</li>
                                <li>Verify schema migrations have completed successfully</li>
                                <li>Review query performance and optimizations</li>
                              </>
                            )}
                            {!log.source.includes("API") && 
                             !log.source.includes("Security") && 
                             !log.source.includes("Database") && (
                              <>
                                <li>Review system configuration for {log.source}</li>
                                <li>Check system logs for additional error context</li>
                                <li>Verify component dependencies are satisfied</li>
                              </>
                            )}
                            {log.level === "error" && (
                              <li className="text-red-600 dark:text-red-400 font-medium mt-1">
                                Contact system administrator if issues persist
                              </li>
                            )}
                          </ul>
                          
                          <div className="flex justify-end mt-4">
                            <Button 
                              size="sm" 
                              variant={log.level === "error" ? "destructive" : "default"}
                              className="gap-1.5"
                            >
                              <Wrench className="h-3.5 w-3.5" />
                              Apply Fix
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {log.level === "success" && (
                      <div>
                        <h4 className="text-sm font-semibold flex items-center gap-1.5 mb-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          Status Information
                        </h4>
                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md text-sm">
                          <p className="text-green-800 dark:text-green-400">
                            This component is functioning correctly. No action needed.
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {log.level === "info" && (
                      <div>
                        <h4 className="text-sm font-semibold flex items-center gap-1.5 mb-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          Additional Information
                        </h4>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md text-sm">
                          <p className="text-blue-800 dark:text-blue-400">
                            This is informational only. No action required at this time.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    </div>
  );
};
