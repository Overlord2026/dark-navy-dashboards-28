
import React from 'react';
import { LogEntry } from '@/types/diagnostics/logs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';

interface LogEntryItemProps {
  log: LogEntry;
}

export const LogEntryItem: React.FC<LogEntryItemProps> = ({ log }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(log, null, 2));
    toast.success('Log entry copied to clipboard');
  };
  
  const getLevelBadge = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error':
        return <Badge variant="destructive">{level.toUpperCase()}</Badge>;
      case 'warning':
        return <Badge variant="warning">{level.toUpperCase()}</Badge>;
      case 'info':
        return <Badge variant="secondary">{level.toUpperCase()}</Badge>;
      case 'debug':
        return <Badge variant="outline">{level.toUpperCase()}</Badge>;
      case 'success':
        return <Badge variant="success">{level.toUpperCase()}</Badge>;
      default:
        return <Badge>{level.toUpperCase()}</Badge>;
    }
  };
  
  // Render details based on type
  const renderDetails = () => {
    if (!log.details) return null;
    
    if (typeof log.details === 'string') {
      return <p className="text-sm text-muted-foreground">{log.details}</p>;
    }
    
    return (
      <pre className="p-2 bg-muted rounded-md overflow-auto text-xs mt-2">
        {JSON.stringify(log.details, null, 2)}
      </pre>
    );
  };
  
  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <div className="border rounded-lg p-3 mb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {getLevelBadge(log.level)}
              <span className="font-medium">{log.message}</span>
            </div>
            <div className="flex gap-3 text-xs text-muted-foreground">
              <span>{new Date(log.timestamp).toLocaleString()}</span>
              <span>|</span>
              <span>{log.source}</span>
            </div>
          </div>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
            </Button>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon">
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>
        <CollapsibleContent>
          <div className="mt-3 pt-3 border-t">
            {renderDetails()}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};
