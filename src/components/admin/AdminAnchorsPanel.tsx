import React, { useState, useMemo } from 'react';
import { listReceipts } from '@/features/receipts/record';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, CheckCircle, AlertCircle, Play } from 'lucide-react';
import { toast } from 'sonner';
import type { AnyRDS } from '@/features/receipts/types';

export function AdminAnchorsPanel() {
  const receipts = listReceipts();
  const [verificationResults, setVerificationResults] = useState<Record<string, boolean>>({});
  const [isVerifying, setIsVerifying] = useState(false);

  // Filter receipts that have anchor references
  const anchoredReceipts = useMemo(() => {
    return receipts.filter(receipt => (receipt as any).anchor_ref);
  }, [receipts]);

  const buildLocalMerkle = (receipts: AnyRDS[]) => {
    // Simple mock Merkle root calculation for demo
    const receiptIds = receipts.map(r => (r as any).id || '').sort();
    const concatenated = receiptIds.join('');
    // Simple hash simulation (in real implementation, use proper crypto)
    return btoa(concatenated).substring(0, 32);
  };

  const verifyReceipt = async (receipt: AnyRDS) => {
    const receiptId = (receipt as any).id;
    const anchorRef = (receipt as any).anchor_ref;
    
    if (!anchorRef) return false;

    // Simulate verification logic
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Mock verification - in real implementation, check against actual anchor
    const localRoot = buildLocalMerkle([receipt]);
    const isValid = anchorRef.merkle_root && localRoot.length > 0;
    
    return isValid;
  };

  const verifyAllAnchors = async () => {
    setIsVerifying(true);
    const results: Record<string, boolean> = {};
    
    for (const receipt of anchoredReceipts) {
      const receiptId = (receipt as any).id;
      const isValid = await verifyReceipt(receipt);
      results[receiptId] = isValid;
    }
    
    setVerificationResults(results);
    setIsVerifying(false);
    
    const passCount = Object.values(results).filter(Boolean).length;
    const totalCount = Object.keys(results).length;
    
    toast.success(`Anchor verification complete: ${passCount}/${totalCount} valid`);
  };

  const verifySingleAnchor = async (receipt: AnyRDS) => {
    const receiptId = (receipt as any).id;
    const isValid = await verifyReceipt(receipt);
    
    setVerificationResults(prev => ({
      ...prev,
      [receiptId]: isValid
    }));
    
    toast.success(`Anchor verified: ${isValid ? 'Valid' : 'Invalid'}`);
  };

  const getVerificationStatus = (receiptId: string) => {
    if (!(receiptId in verificationResults)) return null;
    return verificationResults[receiptId];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Anchor Verification
          </span>
          <Button 
            onClick={verifyAllAnchors}
            disabled={isVerifying || anchoredReceipts.length === 0}
            variant="default"
          >
            <Play className="h-4 w-4 mr-2" />
            Verify All
          </Button>
        </CardTitle>
        <CardDescription>
          Web-based verification panel for anchored receipts with Merkle proof validation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 border rounded-lg">
            <p className="text-2xl font-bold">{anchoredReceipts.length}</p>
            <p className="text-sm text-muted-foreground">Anchored Receipts</p>
          </div>
          <div className="text-center p-3 border rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {Object.values(verificationResults).filter(Boolean).length}
            </p>
            <p className="text-sm text-muted-foreground">Valid Proofs</p>
          </div>
          <div className="text-center p-3 border rounded-lg">
            <p className="text-2xl font-bold text-red-600">
              {Object.values(verificationResults).filter(v => v === false).length}
            </p>
            <p className="text-sm text-muted-foreground">Invalid Proofs</p>
          </div>
        </div>

        {/* Anchored Receipts Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Anchor Root</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {anchoredReceipts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No anchored receipts found
                  </TableCell>
                </TableRow>
              ) : (
                anchoredReceipts.map((receipt, index) => {
                  const receiptId = (receipt as any).id || `receipt-${index}`;
                  const anchorRef = (receipt as any).anchor_ref;
                  const verificationStatus = getVerificationStatus(receiptId);
                  
                  return (
                    <TableRow key={receiptId}>
                      <TableCell className="font-mono text-xs">
                        {receiptId.substring(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{receipt.type}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {anchorRef?.merkle_root?.substring(0, 16) || 'N/A'}...
                      </TableCell>
                      <TableCell>
                        {verificationStatus === null ? (
                          <Badge variant="secondary">Not Verified</Badge>
                        ) : verificationStatus ? (
                          <Badge variant="default" className="bg-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Valid
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Invalid
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => verifySingleAnchor(receipt)}
                          disabled={isVerifying}
                        >
                          Verify
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {anchoredReceipts.length > 0 && (
          <div className="text-sm text-muted-foreground">
            <p>
              <strong>Note:</strong> This is a demo-grade verification using local Merkle roots. 
              In production, proofs would be validated against the actual blockchain anchors.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}