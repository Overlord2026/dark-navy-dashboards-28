import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { loadFixtures, dehydrateState, hydrateState, clearFixtures } from '@/fixtures/fixtures';
import { getReceiptsCount, getReceiptsByType } from '@/features/receipts/record';
import { toast } from 'sonner';
import { FileDown, FileUp, Trash2, Database, Bug } from 'lucide-react';

type Profile = 'coach' | 'mom';

export function DevPanelDev() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile>('coach');
  const [snapshotData, setSnapshotData] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [info, setInfo] = useState<any>(null);

  const receiptsCount = getReceiptsCount();
  const decisionCount = getReceiptsByType('Decision-RDS').length;
  const consentCount = getReceiptsByType('Consent-RDS').length;
  const settlementCount = getReceiptsByType('Settlement-RDS').length;
  const deltaCount = getReceiptsByType('Delta-RDS').length;

  useEffect(() => {
    (async () => {
      try {
        const m = await import('@/integrations/supabase/client').catch(() => null);
        setInfo(m ? 'supabase:ready' : 'supabase:shim');
      } catch { setInfo('noop'); }
    })();
  }, []);

  if (import.meta.env.MODE === 'production') return null;

  const handleLoadFixtures = async () => {
    setIsLoading(true);
    try {
      const result = await loadFixtures({ profile: selectedProfile });
      toast.success(`Loaded ${selectedProfile} fixtures`, {
        description: `${result.receiptIds.length} receipts created`
      });
    } catch (error) {
      toast.error('Failed to load fixtures', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDehydrate = () => {
    try {
      const snapshot = dehydrateState();
      setSnapshotData(snapshot);
      navigator.clipboard.writeText(snapshot);
      toast.success('State dehydrated to clipboard');
    } catch (error) {
      toast.error('Failed to dehydrate state');
    }
  };

  const handleHydrate = () => {
    try {
      if (!snapshotData.trim()) {
        toast.error('No snapshot data to hydrate');
        return;
      }
      hydrateState(snapshotData);
      toast.success('State hydrated from snapshot');
    } catch (error) {
      toast.error('Failed to hydrate state', {
        description: 'Invalid JSON format'
      });
    }
  };

  const handleClear = () => {
    clearFixtures();
    setSnapshotData('');
    toast.success('All fixtures cleared');
  };

  const handleClearBoth = () => {
    clearFixtures();
    setSnapshotData('');
    toast.success('NIL & Health fixtures cleared');
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsExpanded(true)}
          variant="outline"
          size="sm"
          className="shadow-lg bg-background border-border"
        >
          <Bug className="h-4 w-4 mr-2" />
          Dev Panel
          {receiptsCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {receiptsCount}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="shadow-lg border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bug className="h-4 w-4" />
              <CardTitle className="text-sm">Dev Panel</CardTitle>
              {receiptsCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  D:{decisionCount} C:{consentCount} S:{settlementCount} Δ:{deltaCount}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          </div>
          <CardDescription className="text-xs">
            NIL Demo Fixtures & State Management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Load Fixtures */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span className="text-sm font-medium">Load Demo Data</span>
            </div>
            <Select value={selectedProfile} onValueChange={(value: Profile) => setSelectedProfile(value)}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="coach">Coach Profile</SelectItem>
                <SelectItem value="mom">Mom/Guardian Profile</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleLoadFixtures}
              disabled={isLoading}
              className="w-full h-8 text-xs"
              size="sm"
            >
              {isLoading ? 'Loading...' : 'Load Fixtures'}
            </Button>
          </div>

          <Separator />

          {/* State Management */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileDown className="h-4 w-4" />
              <span className="text-sm font-medium">State Snapshot</span>
            </div>
            <div className="flex gap-1">
              <Button
                onClick={handleDehydrate}
                variant="outline"
                size="sm"
                className="flex-1 h-8 text-xs"
              >
                Save
              </Button>
              <Button
                onClick={handleHydrate}
                variant="outline"
                size="sm"
                className="flex-1 h-8 text-xs"
                disabled={!snapshotData.trim()}
              >
                Load
              </Button>
              <Button
                onClick={handleClearBoth}
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                title="Clear Both NIL & Health"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            {snapshotData && (
              <Textarea
                value={snapshotData}
                onChange={(e) => setSnapshotData(e.target.value)}
                placeholder="Paste snapshot JSON here..."
                className="h-20 text-xs font-mono"
                rows={3}
              />
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            Development only - hidden in production (info: {String(info)})
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default DevPanelDev;