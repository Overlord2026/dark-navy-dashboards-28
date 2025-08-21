import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Search, 
  Receipt, 
  FileText, 
  Shield, 
  Eye, 
  Database,
  AlertTriangle,
  RefreshCw 
} from 'lucide-react';
import { ReceiptRow } from './ReceiptRow';
import { VerifyModal } from './VerifyModal';
import { SkeletonList } from '@/components/ui/skeleton-loader';
import { ErrorBoundary, InlineErrorFallback } from '@/components/ui/error-boundary';
import { useRetryFetch } from '@/hooks/useRetryFetch';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { receiptStore } from '@/features/receipts/store';
import { safeLog, createSanitizedReceipt } from '@/lib/privacy-utils';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

export function ReceiptsExplorer() {
  const { toast } = useToast();
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  // Keyboard navigation
  useKeyboardNavigation({
    enableArrowKeys: true,
    enableEscapeKey: true,
    containerRef
  });

  const [filteredReceipts, setFilteredReceipts] = React.useState<any[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedTab, setSelectedTab] = React.useState('all');
  const [selectedReceipt, setSelectedReceipt] = React.useState<any>(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = React.useState(false);
  const [stats, setStats] = React.useState({
    total: 0,
    byType: {} as Record<string, number>,
    byPolicy: {} as Record<string, number>,
    storage: 'memory' as 'indexeddb' | 'memory'
  });

  // Fetch receipts with retry logic
  const {
    data: receipts,
    loading: receiptsLoading,
    error: receiptsError,
    retry: retryReceipts
  } = useRetryFetch(async () => {
    const allReceipts = await receiptStore.list({ limit: 1000 });
    
    // Add mock receipts for demo if none exist
    if (allReceipts.length === 0) {
      const mockReceipts = [
        {
          id: 'receipt_demo_onboard_1',
          type: 'onboard_rds',
          step: 'persona',
          persona: 'aspiring',
          ts: new Date().toISOString(),
          session_id: 'session_demo_1',
          policy_version: 'v1.0'
        },
        {
          id: 'receipt_demo_decision_1',
          type: 'decision_rds',
          action: 'create_goal',
          persona: 'aspiring',
          tier: 'foundational',
          goal_key: 'emergency_fund',
          ts: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          session_id: 'session_demo_1',
          policy_version: 'v1.0'
        },
        {
          id: 'receipt_demo_vault_1',
          type: 'vault_rds',
          action: 'ingest',
          source: 'plaid',
          hash: 'sha256_demo_hash_123',
          ts: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          session_id: 'session_demo_1',
          policy_version: 'v1.0'
        },
        {
          id: 'receipt_demo_consent_1',
          type: 'consent_rds',
          scope: ['advisor_access', 'document_sharing'],
          purpose_of_use: 'Financial planning consultation',
          ttl_days: 30,
          result: 'approve',
          ts: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          session_id: 'session_demo_1',
          policy_version: 'v1.0'
        }
      ];

      // Store mock receipts with privacy sanitization
      for (const receipt of mockReceipts) {
        const sanitizedReceipt = createSanitizedReceipt(receipt);
        await receiptStore.put(sanitizedReceipt);
        safeLog.info('Demo receipt created', { id: receipt.id, type: receipt.type });
      }
      
      return mockReceipts;
    } else {
      // Map stored receipts to display format
      const displayReceipts = allReceipts.map(stored => stored.receipt_data);
      safeLog.info('Loaded receipts from storage', { count: displayReceipts.length });
      return displayReceipts;
    }
  }, {
    maxRetries: 3,
    initialDelay: 1000
  });

  // Fetch stats with retry logic
  const {
    data: statsData,
    loading: statsLoading,
    error: statsError,
    retry: retryStats
  } = useRetryFetch(async () => {
    return await receiptStore.getStats();
  }, {
    maxRetries: 2,
    initialDelay: 500
  });

  // Update stats when data loads
  React.useEffect(() => {
    if (statsData) {
      setStats(statsData);
    }
  }, [statsData]);

  // Filter receipts based on search and tab
  React.useEffect(() => {
    if (!receipts) return;
    
    let filtered = receipts;

    // Filter by tab
    if (selectedTab !== 'all') {
      filtered = filtered.filter(receipt => {
        switch (selectedTab) {
          case 'onboarding':
            return receipt.type === 'onboard_rds';
          case 'decisions':
            return receipt.type === 'decision_rds';
          case 'consent':
            return receipt.type === 'consent_rds';
          case 'vault':
            return receipt.type === 'vault_rds';
          default:
            return true;
        }
      });
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(receipt =>
        receipt.id.toLowerCase().includes(term) ||
        receipt.type.toLowerCase().includes(term) ||
        receipt.step?.toLowerCase().includes(term) ||
        receipt.action?.toLowerCase().includes(term) ||
        receipt.persona?.toLowerCase().includes(term) ||
        receipt.session_id?.toLowerCase().includes(term)
      );
    }

    setFilteredReceipts(filtered);
  }, [receipts, selectedTab, searchTerm]);

  const handleViewJSON = (receipt: any) => {
    const sanitizedReceipt = createSanitizedReceipt(receipt);
    const jsonString = JSON.stringify(sanitizedReceipt, null, 2);
    
    navigator.clipboard.writeText(jsonString).then(() => {
      toast({
        title: "JSON copied",
        description: "Sanitized receipt JSON has been copied to clipboard",
      });
      safeLog.info('Receipt JSON copied', { receiptId: receipt.id });
    }).catch(() => {
      toast({
        title: "Copy failed",
        description: "Could not copy JSON to clipboard",
        variant: "destructive",
      });
    });
  };

  const handleVerify = (receipt: any) => {
    setSelectedReceipt(receipt);
    setIsVerifyModalOpen(true);
    safeLog.info('Receipt verification initiated', { receiptId: receipt.id });
  };

  const getTabCounts = () => {
    if (!receipts) return { all: 0, onboarding: 0, decisions: 0, consent: 0, vault: 0 };
    
    return {
      all: receipts.length,
      onboarding: receipts.filter(r => r.type === 'onboard_rds').length,
      decisions: receipts.filter(r => r.type === 'decision_rds').length,
      consent: receipts.filter(r => r.type === 'consent_rds').length,
      vault: receipts.filter(r => r.type === 'vault_rds').length,
    };
  };

  const tabCounts = getTabCounts();

  return (
    <ErrorBoundary>
      <div className="space-y-6" ref={containerRef}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Receipt className="h-6 w-6" aria-hidden="true" />
              Receipts Explorer
            </h1>
            <p className="text-muted-foreground">
              View and verify all transaction receipts and audit trails
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Error states and retry buttons */}
            {(receiptsError || statsError) && (
              <Alert className="max-w-sm">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>Some data failed to load</span>
                  <div className="flex gap-1">
                    {receiptsError && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={retryReceipts}
                        aria-label="Retry loading receipts"
                      >
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    )}
                    {statsError && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={retryStats}
                        aria-label="Retry loading statistics"
                      >
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            <Badge variant="outline" className="flex items-center gap-2">
              <Database className="h-3 w-3" aria-hidden="true" />
              Storage: {stats.storage}
            </Badge>
            <Badge variant="secondary">
              Total: {statsLoading ? '...' : stats.total}
            </Badge>
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <Input
                placeholder="Search receipts by ID, type, action, persona..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                aria-label="Search receipts"
                disabled={receiptsLoading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all" className="flex items-center gap-2">
              All <Badge variant="secondary" className="text-xs">{tabCounts.all}</Badge>
            </TabsTrigger>
            <TabsTrigger value="onboarding" className="flex items-center gap-2">
              <FileText className="h-3 w-3" aria-hidden="true" />
              Onboarding <Badge variant="secondary" className="text-xs">{tabCounts.onboarding}</Badge>
            </TabsTrigger>
            <TabsTrigger value="decisions" className="flex items-center gap-2">
              Decisions <Badge variant="secondary" className="text-xs">{tabCounts.decisions}</Badge>
            </TabsTrigger>
            <TabsTrigger value="consent" className="flex items-center gap-2">
              <Eye className="h-3 w-3" aria-hidden="true" />
              Consent <Badge variant="secondary" className="text-xs">{tabCounts.consent}</Badge>
            </TabsTrigger>
            <TabsTrigger value="vault" className="flex items-center gap-2">
              <Shield className="h-3 w-3" aria-hidden="true" />
              Vault <Badge variant="secondary" className="text-xs">{tabCounts.vault}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="space-y-4">
            {receiptsLoading ? (
              <SkeletonList count={5} />
            ) : receiptsError ? (
              <InlineErrorFallback 
                error={new Error(receiptsError)} 
                retry={retryReceipts} 
              />
            ) : filteredReceipts.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" aria-hidden="true" />
                  <h3 className="text-lg font-medium mb-2">No receipts yet</h3>
                  <p className="text-muted-foreground">
                    {searchTerm 
                      ? 'Try adjusting your search criteria'
                      : 'Complete one action and they\'ll appear here.'
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3" role="list" aria-label="Receipt list">
                {filteredReceipts.map((receipt) => (
                  <div key={receipt.id} role="listitem">
                    <ReceiptRow
                      receipt={receipt}
                      onViewJSON={() => handleViewJSON(receipt)}
                      onVerify={() => handleVerify(receipt)}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Verify Modal */}
        <VerifyModal
          receipt={selectedReceipt}
          isOpen={isVerifyModalOpen}
          onClose={() => {
            setIsVerifyModalOpen(false);
            setSelectedReceipt(null);
          }}
        />
      </div>
    </ErrorBoundary>
  );
}