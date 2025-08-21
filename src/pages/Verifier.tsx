import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  Upload, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  FileText,
  Clock,
  Hash,
  PlayCircle,
  Database,
  Search
} from 'lucide-react';
import { replay, type VerificationResult } from '@/features/receipts/verify';
import { receiptStore, type StoredReceipt } from '@/features/receipts/store';
import { toast } from 'sonner';

export default function Verifier() {
  const [receiptInput, setReceiptInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [storedReceipts, setStoredReceipts] = useState<StoredReceipt[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<StoredReceipt | null>(null);
  const [storeStats, setStoreStats] = useState<any>(null);

  React.useEffect(() => {
    loadStoredReceipts();
    loadStoreStats();
  }, []);

  const loadStoredReceipts = async () => {
    try {
      const receipts = await receiptStore.list({ limit: 20 });
      setStoredReceipts(receipts);
    } catch (error) {
      console.error('Failed to load stored receipts:', error);
    }
  };

  const loadStoreStats = async () => {
    try {
      const stats = await receiptStore.getStats();
      setStoreStats(stats);
    } catch (error) {
      console.error('Failed to load store stats:', error);
    }
  };

  const verifyReceipt = async (receiptData: any) => {
    setIsVerifying(true);
    setVerificationResult(null);

    try {
      console.info('verifier.start', { 
        type: receiptData.type,
        policy: receiptData.policy_version 
      });

      const result = await replay(receiptData);
      setVerificationResult(result);

      // Store verification result
      if (selectedReceipt) {
        await receiptStore.updateVerificationStatus(
          selectedReceipt.id,
          result.ok ? 'verified' : 'failed',
          result
        );
        await loadStoredReceipts();
      }

      toast.success(`Verification complete: ${result.ok ? 'Valid' : 'Invalid'} receipt`);
    } catch (error) {
      console.error('Verification failed:', error);
      toast.error('Verification failed: ' + String(error));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleTextInput = async () => {
    try {
      const receiptData = JSON.parse(receiptInput);
      
      // Store the receipt for future reference
      const receiptId = await receiptStore.put(receiptData);
      await loadStoredReceipts();
      
      await verifyReceipt(receiptData);
    } catch (error) {
      toast.error('Invalid JSON format');
    }
  };

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const receiptData = JSON.parse(content);
        
        // Store the receipt
        const receiptId = await receiptStore.put(receiptData);
        await loadStoredReceipts();
        
        setReceiptInput(JSON.stringify(receiptData, null, 2));
        await verifyReceipt(receiptData);
      } catch (error) {
        toast.error('Failed to parse uploaded file');
      }
    };
    reader.readAsText(file);
  }, []);

  const verifyStoredReceipt = async (storedReceipt: StoredReceipt) => {
    setSelectedReceipt(storedReceipt);
    setReceiptInput(JSON.stringify(storedReceipt.receipt_data, null, 2));
    await verifyReceipt(storedReceipt.receipt_data);
  };

  const getVerificationIcon = (result: VerificationResult) => {
    if (result.ok) return <CheckCircle className="h-5 w-5 text-success" />;
    if (result.reasonsMatch) return <AlertTriangle className="h-5 w-5 text-warning" />;
    return <XCircle className="h-5 w-5 text-destructive" />;
  };

  const getVerificationStatus = (result: VerificationResult): string => {
    if (result.ok) return 'Valid';
    if (result.reasonsMatch) return 'Partial';
    return 'Invalid';
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Receipt Verifier</h1>
          <p className="text-muted-foreground">Verify receipt authenticity without exposing PHI</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Receipt Input
              </CardTitle>
              <CardDescription>
                Upload a receipt file or paste JSON content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="file"
                  accept=".json,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="receipt-upload"
                />
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById('receipt-upload')?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload File
                </Button>
                
                <Button 
                  onClick={handleTextInput}
                  disabled={!receiptInput.trim() || isVerifying}
                  className="flex items-center gap-2"
                >
                  <PlayCircle className="h-4 w-4" />
                  {isVerifying ? 'Verifying...' : 'Verify Receipt'}
                </Button>
              </div>

              <Textarea
                placeholder="Paste receipt JSON here..."
                value={receiptInput}
                onChange={(e) => setReceiptInput(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
            </CardContent>
          </Card>

          {/* Verification Result */}
          {verificationResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getVerificationIcon(verificationResult)}
                  Verification Result: {getVerificationStatus(verificationResult)}
                </CardTitle>
                <CardDescription>
                  Completed in {verificationResult.verification_time}ms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {verificationResult.ok ? (
                        <CheckCircle className="h-6 w-6 text-success mx-auto" />
                      ) : (
                        <XCircle className="h-6 w-6 text-destructive mx-auto" />
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">Overall</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {verificationResult.reasonsMatch ? (
                        <CheckCircle className="h-6 w-6 text-success mx-auto" />
                      ) : (
                        <XCircle className="h-6 w-6 text-destructive mx-auto" />
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">Reasons</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {verificationResult.policy_supported ? (
                        <CheckCircle className="h-6 w-6 text-success mx-auto" />
                      ) : (
                        <XCircle className="h-6 w-6 text-destructive mx-auto" />
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">Policy</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {verificationResult.inputs_hash_valid ? (
                        <CheckCircle className="h-6 w-6 text-success mx-auto" />
                      ) : (
                        <XCircle className="h-6 w-6 text-destructive mx-auto" />
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">Hash</div>
                  </div>
                </div>

                <Separator />

                {/* Reason Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="font-medium text-sm mb-2">Original Reasons</div>
                    <div className="space-y-1">
                      {verificationResult.original_reasons.map((reason, index) => (
                        <div key={index} className="text-sm p-2 bg-muted/50 rounded">
                          {reason}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-medium text-sm mb-2">Replayed Reasons</div>
                    <div className="space-y-1">
                      {verificationResult.replayed_reasons.map((reason, index) => (
                        <div key={index} className="text-sm p-2 bg-muted/50 rounded">
                          {reason}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Discrepancies */}
                {verificationResult.discrepancies && verificationResult.discrepancies.length > 0 && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="font-medium mb-1">Discrepancies Found:</div>
                      <ul className="list-disc list-inside space-y-1">
                        {verificationResult.discrepancies.map((discrepancy, index) => (
                          <li key={index} className="text-sm">{discrepancy}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Replay Result */}
                {verificationResult.replay_result && (
                  <div>
                    <div className="font-medium text-sm mb-2">Replay Details</div>
                    <div className="p-3 bg-muted/50 rounded font-mono text-xs">
                      {JSON.stringify(verificationResult.replay_result, null, 2)}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Stored Receipts Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Receipt Store
              </CardTitle>
              <CardDescription>
                Previously stored receipts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {storeStats && (
                <div className="p-3 bg-muted/50 rounded text-sm">
                  <div className="font-medium mb-1">Store Statistics</div>
                  <div>Total: {storeStats.total} receipts</div>
                  <div>Storage: {storeStats.storage}</div>
                </div>
              )}

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {storedReceipts.map((receipt) => (
                  <div
                    key={receipt.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedReceipt?.id === receipt.id 
                        ? 'border-primary bg-muted/50' 
                        : 'hover:bg-muted/20'
                    }`}
                    onClick={() => verifyStoredReceipt(receipt)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {receipt.type}
                          </Badge>
                          {receipt.verification_status && (
                            <Badge 
                              variant={receipt.verification_status === 'verified' ? 'default' : 'destructive'} 
                              className="text-xs"
                            >
                              {receipt.verification_status}
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          Policy: {receipt.policy_version}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatTimestamp(receipt.stored_at)}
                        </div>
                      </div>
                      <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  </div>
                ))}

                {storedReceipts.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No stored receipts</p>
                  </div>
                )}
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadStoredReceipts}
                className="w-full"
              >
                <Search className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </CardContent>
          </Card>

          {/* Help Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <div className="font-medium">1. Upload Receipt</div>
                <div className="text-muted-foreground">
                  Paste or upload any Health-RDS, PA-RDS, Consent-RDS, or Vault-RDS receipt
                </div>
              </div>
              
              <div>
                <div className="font-medium">2. Policy Replay</div>
                <div className="text-muted-foreground">
                  System replays the decision using current rules for that policy version
                </div>
              </div>
              
              <div>
                <div className="font-medium">3. Verification</div>
                <div className="text-muted-foreground">
                  Compares original vs replayed reasons without exposing PHI
                </div>
              </div>
              
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  No PHI is required or displayed during verification. Only policy logic and receipt structure are validated.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}