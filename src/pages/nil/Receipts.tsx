import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Receipt } from 'lucide-react';
import { listReceipts, getReceiptsByType } from '@/features/receipts/record';
import { acceptNofM } from '@/features/anchor/simple-providers';
import { AnyRDS } from '@/features/receipts/types';
import { toast } from 'sonner';

export default function ReceiptsPage() {
  const [receipts, setReceipts] = React.useState<AnyRDS[]>([]);
  const [filter, setFilter] = React.useState<string>('all');

  React.useEffect(() => {
    if (filter === 'all') {
      setReceipts(listReceipts());
    } else {
      setReceipts(getReceiptsByType(filter as any));
    }
  }, [filter]);

  const handleVerifyAnchor = (receipt: AnyRDS) => {
    if ('anchor_ref' in receipt && receipt.anchor_ref) {
      const verified = acceptNofM(receipt.anchor_ref, 1);
      if (verified) {
        toast.success('Anchor verified ✓', { description: 'Receipt is properly anchored' });
      } else {
        toast.error('Anchor verification failed');
      }
    } else {
      toast.warning('No anchor reference found');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">NIL Receipts</h1>
        <p className="text-muted-foreground">View and verify compliance receipts</p>
      </div>

      <div className="mb-6">
        <div className="flex gap-2">
          {['all', 'Decision-RDS', 'Consent-RDS', 'Settlement-RDS', 'Delta-RDS'].map((type) => (
            <Button
              key={type}
              variant={filter === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(type)}
            >
              {type === 'all' ? 'All' : type}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {receipts.map((receipt) => (
          <Card key={receipt.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="h-5 w-5" />
                    {receipt.type}
                  </CardTitle>
                  <CardDescription>ID: {receipt.id}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {'result' in receipt && (
                    <Badge variant={receipt.result === 'approve' ? 'default' : 'destructive'}>
                      {receipt.result}
                    </Badge>
                  )}
                  {'anchor_ref' in receipt && receipt.anchor_ref && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVerifyAnchor(receipt)}
                    >
                      Verify
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Timestamp</p>
                  <p className="text-muted-foreground">{new Date(receipt.ts).toLocaleString()}</p>
                </div>
                {'reasons' in receipt && (
                  <div>
                    <p className="font-medium">Reasons</p>
                    <div className="flex flex-wrap gap-1">
                      {receipt.reasons.map((reason, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">{reason}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {receipts.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No receipts found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}