import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Download, Eye, Shield, Search, GitBranch } from 'lucide-react';
import { listReceipts, getReceiptsByType } from '@/features/receipts/record';
import { AnyRDS } from '@/features/receipts/types';
import { acceptNofM } from '@/features/anchor/providers';
import { toast } from 'sonner';

const RECEIPT_TYPES = ['Decision-RDS', 'Consent-RDS', 'Settlement-RDS', 'Delta-RDS'] as const;

export default function ReceiptsTable() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [searchId, setSearchId] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<AnyRDS | null>(null);
  
  const allReceipts = listReceipts();
  
  const filteredReceipts = useMemo(() => {
    let receipts = selectedTypes.length > 0 
      ? allReceipts.filter(r => selectedTypes.includes(r.type))
      : allReceipts;
    
    if (searchId.trim()) {
      receipts = receipts.filter(r => r.id.toLowerCase().includes(searchId.toLowerCase()));
    }
    
    return receipts.sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());
  }, [allReceipts, selectedTypes, searchId]);

  const toggleTypeFilter = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const getAnchorStatus = (receipt: AnyRDS): { status: 'verified' | 'unverified' | 'none'; variant: 'default' | 'secondary' | 'outline' } => {
    if (!('anchor_ref' in receipt) || !receipt.anchor_ref) {
      return { status: 'none', variant: 'outline' };
    }
    
    try {
      const verified = acceptNofM(receipt.anchor_ref, 1);
      return verified 
        ? { status: 'verified', variant: 'default' }
        : { status: 'unverified', variant: 'secondary' };
    } catch {
      return { status: 'unverified', variant: 'secondary' };
    }
  };

  const handleVerifyReceipt = (receipt: AnyRDS) => {
    if (!('anchor_ref' in receipt) || !receipt.anchor_ref) {
      toast.warning('No anchor reference found');
      return;
    }
    
    try {
      const verified = acceptNofM(receipt.anchor_ref, 1);
      if (verified) {
        toast.success('Receipt verified ✓', { 
          description: 'Anchor proof is valid' 
        });
      } else {
        toast.error('Verification failed', {
          description: 'Anchor proof is invalid'
        });
      }
    } catch (error) {
      toast.error('Verification error', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const exportToCSV = () => {
    if (filteredReceipts.length === 0) {
      toast.error('No receipts to export');
      return;
    }

    const headers = ['ID', 'Type', 'Timestamp', 'Reasons', 'Anchor Status'];
    const rows = filteredReceipts.map(receipt => [
      receipt.id,
      receipt.type,
      new Date(receipt.ts).toLocaleString(),
      'reasons' in receipt ? receipt.reasons.join('; ') : '',
      getAnchorStatus(receipt).status
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nil-receipts-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('CSV exported successfully');
  };

  const getReceiptBadgeVariant = (type: string) => {
    const variants = {
      'Decision-RDS': 'default',
      'Consent-RDS': 'secondary', 
      'Settlement-RDS': 'outline',
      'Delta-RDS': 'destructive'
    } as const;
    return variants[type as keyof typeof variants] || 'outline';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>NIL Receipts</CardTitle>
            <CardDescription>
              View and verify compliance receipts ({filteredReceipts.length} of {allReceipts.length})
            </CardDescription>
          </div>
          <Button onClick={exportToCSV} disabled={filteredReceipts.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {RECEIPT_TYPES.map((type) => (
              <Button
                key={type}
                variant={selectedTypes.includes(type) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleTypeFilter(type)}
              >
                {type}
              </Button>
            ))}
            {selectedTypes.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTypes([])}
              >
                Clear filters
              </Button>
            )}
          </div>
          
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-5 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold">{allReceipts.length}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
          {RECEIPT_TYPES.map((type) => {
            const count = allReceipts.filter(r => r.type === type).length;
            return (
              <div key={type} className="text-center">
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm text-muted-foreground">{type.split('-')[0]}</div>
              </div>
            );
          })}
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Reasons</TableHead>
                <TableHead>Anchor</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReceipts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {allReceipts.length === 0 ? 'No receipts found' : 'No receipts match your filters'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredReceipts.map((receipt) => {
                  const anchorStatus = getAnchorStatus(receipt);
                  return (
                    <TableRow key={receipt.id}>
                      <TableCell className="font-mono text-sm">
                        {receipt.id.slice(0, 8)}...
                      </TableCell>
                       <TableCell>
                         <div className="flex items-center gap-1">
                           <Badge variant={getReceiptBadgeVariant(receipt.type)}>
                             {receipt.type === 'Delta-RDS' && <GitBranch className="h-3 w-3 mr-1" />}
                             {receipt.type}
                           </Badge>
                         </div>
                       </TableCell>
                      <TableCell>{new Date(receipt.ts).toLocaleString()}</TableCell>
                      <TableCell>
                        {'reasons' in receipt && receipt.reasons.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {receipt.reasons[0]}
                            {receipt.reasons.length > 1 && ` +${receipt.reasons.length - 1}`}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={anchorStatus.variant}>
                          {anchorStatus.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Sheet>
                            <SheetTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedReceipt(receipt)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </SheetTrigger>
                            <SheetContent className="w-[600px] sm:w-[700px]">
                              <SheetHeader>
                                <SheetTitle>Receipt Details</SheetTitle>
                                <SheetDescription>
                                  {selectedReceipt?.type} - {selectedReceipt?.id}
                                </SheetDescription>
                              </SheetHeader>
                              <div className="mt-6 space-y-4">
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => selectedReceipt && handleVerifyReceipt(selectedReceipt)}
                                    disabled={!selectedReceipt || !('anchor_ref' in selectedReceipt) || !selectedReceipt.anchor_ref}
                                  >
                                    <Shield className="h-4 w-4 mr-2" />
                                    Verify This Receipt
                                  </Button>
                                </div>
                                <div className="bg-muted p-4 rounded-lg">
                                  <pre className="text-sm overflow-auto max-h-96">
                                    {selectedReceipt && JSON.stringify(selectedReceipt, null, 2)}
                                  </pre>
                                </div>
                              </div>
                            </SheetContent>
                          </Sheet>
                          
                          {('anchor_ref' in receipt) && receipt.anchor_ref && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleVerifyReceipt(receipt)}
                            >
                              <Shield className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}