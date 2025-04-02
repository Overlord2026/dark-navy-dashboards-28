
import React from "react";
import { useEffect, useState } from "react";
import { Check, Clock, AlertTriangle, Zap, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FixEntry {
  id: string;
  name: string;
  timestamp: string;
  area: string;
  severity?: string;
}

export const FixHistoryLog = () => {
  // In a real app, this would come from a persistent store or API
  // Here we'll use localStorage for demonstration purposes
  const [fixHistory, setFixHistory] = useState<FixEntry[]>([]);
  const [expanded, setExpanded] = useState(false);
  
  useEffect(() => {
    // Load fix history from localStorage
    const storedHistory = localStorage.getItem('diagnostics-fix-history');
    if (storedHistory) {
      try {
        setFixHistory(JSON.parse(storedHistory));
      } catch (error) {
        console.error('Error parsing fix history:', error);
        setFixHistory([]);
      }
    }
  }, []);
  
  // Get severity icon
  const getSeverityIcon = (severity?: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-3 w-3 text-red-500 mr-1" />;
      case 'medium':
        return <Zap className="h-3 w-3 text-yellow-500 mr-1" />;
      case 'low':
        return <CheckCircle className="h-3 w-3 text-blue-500 mr-1" />;
      default:
        return <CheckCircle className="h-3 w-3 text-green-500 mr-1" />;
    }
  };
  
  // Get severity badge color
  const getSeverityBadgeClass = (severity?: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      default:
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    }
  };
  
  if (fixHistory.length === 0) {
    return (
      <div className="text-xs text-muted-foreground italic border border-dashed rounded-md p-2">
        No fix history available yet
      </div>
    );
  }
  
  // Show more or less entries based on expanded state
  const displayedHistory = expanded ? fixHistory : fixHistory.slice(0, 3);
  
  return (
    <div className="space-y-2">
      <div className="max-h-[200px] overflow-y-auto border rounded-md p-2">
        {displayedHistory.map((entry) => (
          <div key={entry.id} className="flex items-start gap-2 p-2 hover:bg-muted/30 rounded-md transition-colors">
            <Check className="h-3 w-3 text-green-500 mt-0.5" />
            <div className="flex-1">
              <div className="font-medium text-xs">{entry.name}</div>
              <div className="flex items-center justify-between mt-0.5">
                <div className="text-muted-foreground flex items-center gap-1 text-xs">
                  <Clock className="h-2.5 w-2.5" />
                  <span>{new Date(entry.timestamp).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className={`text-[10px] px-1 py-0 ${getSeverityBadgeClass(entry.severity)}`}>
                    <span className="flex items-center">
                      {getSeverityIcon(entry.severity)}
                      {entry.severity || 'normal'}
                    </span>
                  </Badge>
                  <Badge variant="outline" className="text-[10px] px-1 py-0 bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300">
                    {entry.area}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {fixHistory.length > 3 && (
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="text-xs text-muted-foreground hover:text-primary transition-colors w-full text-center"
        >
          {expanded ? 'Show less' : `Show ${fixHistory.length - 3} more entries`}
        </button>
      )}
    </div>
  );
};
