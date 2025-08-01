import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type ImportHistory as ImportHistoryType } from '@/hooks/usePlatformConnectors';
import { RefreshCw, RotateCcw } from 'lucide-react';

interface ImportHistoryProps {
  history: ImportHistoryType[];
  loading: boolean;
  onRefresh: () => void;
}

export function ImportHistory({ history, loading, onRefresh }: ImportHistoryProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'failed': return 'destructive';
      case 'processing': return 'secondary';
      case 'rolled_back': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Import/Export History</CardTitle>
            <CardDescription>Track all data import and export operations</CardDescription>
          </div>
          <Button variant="outline" onClick={onRefresh} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <p className="font-medium">{item.file_name || 'API Sync'}</p>
                  <Badge variant={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {item.records_processed} processed, {item.records_failed} failed
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(item.started_at).toLocaleString()}
                </p>
              </div>
              
              {item.status === 'completed' && (
                <Button variant="outline" size="sm">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Rollback
                </Button>
              )}
            </div>
          ))}
          
          {history.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No import/export history found
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}