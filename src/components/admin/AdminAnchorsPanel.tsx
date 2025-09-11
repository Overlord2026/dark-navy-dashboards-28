import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { listReceipts } from '@/features/receipts/record';
import { buildMerkle } from '@/lib/merkle';
import * as Canonical from '@/lib/canonical';
import { AnyRDS } from '@/features/receipts/types';
import { toast } from 'sonner';

interface VerificationResult {
  receipt: AnyRDS;
  status: 'verified' | 'failed' | 'no-anchor';
  localRoot?: string;
  receiptRoot?: string;
  error?: string;
}

export default function AdminAnchorsPanel() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [results, setResults] = useState<VerificationResult[]>([]);
  const [summary, setSummary] = useState<{
    total: number;
    verified: number;
    failed: number;
    noAnchor: number;
  } | null>(null);

  const handleVerifyAll = async () => {
    setIsVerifying(true);
    setResults([]);
    setSummary(null);

    try {
      const receipts = listReceipts();
      const anchoredReceipts = receipts.filter(r => 
        'anchor_ref' in r && r.anchor_ref !== null
      );

      if (anchoredReceipts.length === 0) {
        toast.warning('No anchored receipts found');
        setIsVerifying(false);
        return;
      }

      // Build local Merkle tree from all anchored receipts
      const receiptHashes = await Promise.all(
        anchoredReceipts.map(async receipt => await Canonical.hash(receipt))
      );

      const { root: localRoot } = await buildMerkle(receiptHashes);
      
      const verificationResults: VerificationResult[] = [];
      let verified = 0, failed = 0, noAnchor = 0;

      // Verify each receipt
      for (let i = 0; i < receipts.length; i++) {
        const receipt = receipts[i];
        
        if (!('anchor_ref' in receipt) || !receipt.anchor_ref) {
          verificationResults.push({
            receipt,
            status: 'no-anchor'
          });
          noAnchor++;
          continue;
        }

        try {
          const receiptHash = await Canonical.hash(receipt);
          const receiptIndex = receiptHashes.indexOf(receiptHash);
          
          if (receiptIndex === -1) {
            verificationResults.push({
              receipt,
              status: 'failed',
              error: 'Receipt not found in local tree'
            });
            failed++;
            continue;
          }

          // Verify against local root
          const isValid = receipt.anchor_ref.merkle_root === localRoot;
          const receiptRoot = receipt.anchor_ref.merkle_root;
          
          if (isValid) {
            verificationResults.push({
              receipt,
              status: 'verified',
              localRoot,
              receiptRoot
            });
            verified++;
          } else {
            verificationResults.push({
              receipt,
              status: 'failed',
              localRoot,
              receiptRoot,
              error: 'Root mismatch'
            });
            failed++;
          }
        } catch (error) {
          verificationResults.push({
            receipt,
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error'
          });
          failed++;
        }
      }

      setResults(verificationResults);
      setSummary({
        total: receipts.length,
        verified,
        failed,
        noAnchor
      });

      toast.success('Anchor verification complete', {
        description: `${verified} verified, ${failed} failed, ${noAnchor} unanchored`
      });

    } catch (error) {
      toast.error('Verification failed', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const getStatusIcon = (status: VerificationResult['status']) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'no-anchor':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: VerificationResult['status']) => {
    switch (status) {
      case 'verified':
        return <Badge variant="default">Verified</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'no-anchor':
        return <Badge variant="secondary">No Anchor</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Anchor Verification
            </CardTitle>
            <CardDescription>
              Verify Merkle proofs and anchor integrity
            </CardDescription>
          </div>
          <Button 
            onClick={handleVerifyAll} 
            disabled={isVerifying}
          >
            {isVerifying ? 'Verifying...' : 'Verify All'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {summary && (
          <div className="grid grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold">{summary.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{summary.verified}</div>
              <div className="text-sm text-muted-foreground">Verified</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{summary.failed}</div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{summary.noAnchor}</div>
              <div className="text-sm text-muted-foreground">No Anchor</div>
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-3">
            {results.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <div className="font-mono text-sm">{result.receipt.id.slice(0, 8)}...</div>
                    <div className="text-xs text-muted-foreground">{result.receipt.type}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(result.status)}
                  {result.error && (
                    <div className="text-xs text-red-500">{result.error}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {results.length === 0 && !isVerifying && (
          <div className="text-center py-8 text-muted-foreground">
            Click "Verify All" to run anchor verification
          </div>
        )}
      </CardContent>
    </Card>
  );
}