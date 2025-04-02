
import React from "react";
import { useEffect, useState } from "react";
import { Check, Clock, AlertTriangle, Zap, CheckCircle, Info, FilterX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface FixEntry {
  id: string;
  name: string;
  timestamp: string;
  area: string;
  severity?: string;
  details?: string;
}

export const FixHistoryLog = () => {
  // In a real app, this would come from a persistent store or API
  // Here we'll use localStorage for demonstration purposes
  const [fixHistory, setFixHistory] = useState<FixEntry[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);
  const [filteredHistory, setFilteredHistory] = useState<FixEntry[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  useEffect(() => {
    // Load fix history from localStorage
    const storedHistory = localStorage.getItem('diagnostics-fix-history');
    if (storedHistory) {
      try {
        const parsedHistory = JSON.parse(storedHistory);
        setFixHistory(parsedHistory);
        setFilteredHistory(parsedHistory);
      } catch (error) {
        console.error('Error parsing fix history:', error);
        setFixHistory([]);
        setFilteredHistory([]);
      }
    }
  }, []);
  
  // Filter history when active filter changes
  useEffect(() => {
    if (!activeFilter) {
      setFilteredHistory(fixHistory);
      return;
    }
    
    setFilteredHistory(fixHistory.filter(entry => {
      if (activeFilter === 'high' || activeFilter === 'medium' || activeFilter === 'low') {
        return entry.severity === activeFilter;
      }
      return entry.area === activeFilter;
    }));
  }, [activeFilter, fixHistory]);
  
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
  
  // Toggle detailed view for a specific entry
  const toggleEntryDetails = (id: string) => {
    if (expandedEntryId === id) {
      setExpandedEntryId(null);
    } else {
      setExpandedEntryId(id);
    }
  };
  
  // Clear active filter
  const clearFilter = () => {
    setActiveFilter(null);
  };
  
  // Get unique areas for filter dropdown
  const getUniqueAreas = () => {
    const areas = new Set<string>();
    fixHistory.forEach(entry => areas.add(entry.area));
    return Array.from(areas);
  };
  
  if (fixHistory.length === 0) {
    return (
      <div className="text-xs text-muted-foreground italic border border-dashed rounded-md p-4 flex flex-col items-center justify-center">
        <Info className="h-4 w-4 mb-2" />
        <span>No fix history available yet</span>
      </div>
    );
  }
  
  // Show more or less entries based on expanded state
  const displayedHistory = expanded ? filteredHistory : filteredHistory.slice(0, 3);
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-medium">Fix History</h3>
        
        <div className="flex items-center gap-1">
          {activeFilter && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={clearFilter}
              className="h-6 w-6"
            >
              <FilterX className="h-3.5 w-3.5" />
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 text-xs px-2">
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter by severity</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setActiveFilter('high')}>
                <AlertTriangle className="h-3.5 w-3.5 text-red-500 mr-2" />
                High
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter('medium')}>
                <Zap className="h-3.5 w-3.5 text-yellow-500 mr-2" />
                Medium
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter('low')}>
                <CheckCircle className="h-3.5 w-3.5 text-blue-500 mr-2" />
                Low
              </DropdownMenuItem>
              
              <DropdownMenuLabel>Filter by area</DropdownMenuLabel>
              {getUniqueAreas().map(area => (
                <DropdownMenuItem key={area} onClick={() => setActiveFilter(area)}>
                  {area}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {activeFilter && (
        <div className="flex items-center gap-2 text-xs bg-muted px-2 py-1 rounded">
          <span>Filtering by: </span>
          <Badge variant="outline" className="px-1.5 py-0">
            {activeFilter}
          </Badge>
          <Button variant="ghost" size="sm" onClick={clearFilter} className="h-5 ml-auto">
            Clear
          </Button>
        </div>
      )}
      
      <div className="max-h-[300px] overflow-y-auto border rounded-md p-2">
        {displayedHistory.length > 0 ? (
          displayedHistory.map((entry) => (
            <div key={entry.id} className="mb-2 last:mb-0">
              <div 
                className="flex items-start gap-2 p-2 hover:bg-muted/30 rounded-md transition-colors cursor-pointer"
                onClick={() => toggleEntryDetails(entry.id)}
              >
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
              
              {expandedEntryId === entry.id && (
                <div className="ml-5 pl-3 border-l text-xs mt-1 mb-2">
                  <div className="bg-muted p-2 rounded">
                    <h4 className="font-medium mb-1">Details:</h4>
                    <p className="text-muted-foreground">
                      {entry.details || `Fixed issue: ${entry.name} in ${entry.area} area with ${entry.severity || 'normal'} severity.`}
                    </p>
                    
                    <div className="mt-2 pt-2 border-t border-border">
                      <span className="text-muted-foreground">Fixed at: {new Date(entry.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-xs text-muted-foreground italic p-2 text-center">
            No matching fix history found
          </div>
        )}
      </div>
      
      {filteredHistory.length > 3 && (
        <Button 
          onClick={() => setExpanded(!expanded)} 
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:text-primary transition-colors w-full"
        >
          {expanded ? 'Show less' : `Show ${filteredHistory.length - 3} more entries`}
        </Button>
      )}
    </div>
  );
};
