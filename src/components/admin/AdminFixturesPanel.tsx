import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Database, Trash2, RefreshCw } from 'lucide-react';
import { loadFixtures, clearFixtures } from '@/fixtures/fixtures';
import { getReceiptsCount, getReceiptsByType } from '@/features/receipts/record';
import { toast } from 'sonner';

export default function AdminFixturesPanel() {
  const [isLoading, setIsLoading] = React.useState(false);
  
  const receiptsCount = getReceiptsCount();
  const decisionCount = getReceiptsByType('Decision-RDS').length;
  const consentCount = getReceiptsByType('Consent-RDS').length;
  const settlementCount = getReceiptsByType('Settlement-RDS').length;
  const deltaCount = getReceiptsByType('Delta-RDS').length;

  const handleLoadFixtures = async (profile: 'coach' | 'mom') => {
    setIsLoading(true);
    try {
      const result = await loadFixtures({ profile });
      toast.success(`Loaded ${profile} fixtures`, {
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

  const handleClearAll = () => {
    clearFixtures();
    toast.success('All fixtures cleared');
  };

  const handleLoadBoth = async () => {
    setIsLoading(true);
    try {
      const coachResult = await loadFixtures({ profile: 'coach' });
      const momResult = await loadFixtures({ profile: 'mom' });
      
      const totalReceipts = coachResult.receiptIds.length + momResult.receiptIds.length;
      
      toast.success('Loaded all fixtures', {
        description: `${totalReceipts} receipts created (Coach + Mom profiles)`
      });
    } catch (error) {
      toast.error('Failed to load fixtures', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Test Fixtures (Development)
        </CardTitle>
        <CardDescription>
          Manage demo data for NIL compliance testing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current State */}
        <div className="grid grid-cols-5 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold">{receiptsCount}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{decisionCount}</div>
            <div className="text-sm text-muted-foreground">Decision</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{consentCount}</div>
            <div className="text-sm text-muted-foreground">Consent</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{settlementCount}</div>
            <div className="text-sm text-muted-foreground">Settlement</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{deltaCount}</div>
            <div className="text-sm text-muted-foreground">Delta</div>
          </div>
        </div>

        <Separator />

        {/* Load Individual Profiles */}
        <div className="space-y-3">
          <h3 className="font-medium">Load Demo Profiles</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => handleLoadFixtures('coach')}
              disabled={isLoading}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start"
            >
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">Coach</Badge>
              </div>
              <div className="text-sm text-muted-foreground text-left">
                Youth sports coach scenario with parent consent flows
              </div>
            </Button>
            
            <Button
              onClick={() => handleLoadFixtures('mom')}
              disabled={isLoading}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start"
            >
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">Mom/Guardian</Badge>
              </div>
              <div className="text-sm text-muted-foreground text-left">
                Parent/guardian scenario with multiple student-athletes
              </div>
            </Button>
          </div>
        </div>

        <Separator />

        {/* Bulk Actions */}
        <div className="space-y-3">
          <h3 className="font-medium">Bulk Actions</h3>
          <div className="flex gap-3">
            <Button
              onClick={handleLoadBoth}
              disabled={isLoading}
              className="flex-1"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {isLoading ? 'Loading...' : 'Load All Profiles'}
            </Button>
            
            <Button
              onClick={handleClearAll}
              disabled={isLoading}
              variant="outline"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Warning */}
        <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <div className="flex items-start gap-2">
            <div className="text-yellow-600 mt-0.5">⚠️</div>
            <div className="text-sm">
              <div className="font-medium text-yellow-800 dark:text-yellow-200">Development Only</div>
              <div className="text-yellow-700 dark:text-yellow-300">
                This panel is only available in development mode. 
                All fixtures are stored in memory and will be lost on page refresh.
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}