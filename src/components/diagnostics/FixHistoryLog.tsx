
import React from "react";
import { useEffect, useState } from "react";
import { Check, Clock } from "lucide-react";

interface FixEntry {
  id: string;
  name: string;
  timestamp: string;
  area: string;
}

export const FixHistoryLog = () => {
  // In a real app, this would come from a persistent store or API
  // Here we'll use localStorage for demonstration purposes
  const [fixHistory, setFixHistory] = useState<FixEntry[]>([]);
  
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
  
  if (fixHistory.length === 0) {
    return (
      <div className="text-xs text-muted-foreground italic border border-dashed rounded-md p-2">
        No fix history available yet
      </div>
    );
  }
  
  return (
    <div className="space-y-2 max-h-[150px] overflow-y-auto border rounded-md p-2">
      {fixHistory.map((entry) => (
        <div key={entry.id} className="flex items-start text-xs gap-2">
          <Check className="h-3 w-3 text-green-500 mt-0.5" />
          <div>
            <div className="font-medium">{entry.name}</div>
            <div className="text-muted-foreground flex items-center gap-1 mt-0.5">
              <Clock className="h-2.5 w-2.5" />
              <span>{new Date(entry.timestamp).toLocaleString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
