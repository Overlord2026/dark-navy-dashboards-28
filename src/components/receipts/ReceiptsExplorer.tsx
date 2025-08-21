import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, FileText, Shield, CheckCircle, AlertTriangle, Eye } from 'lucide-react';
import { verifyReceipt } from '@/lib/receipt-verifier';
import { useRetryFetch } from '@/hooks/useRetryFetch';
import { SkeletonLoader } from '@/components/ui/skeleton-loader';
import { useToast } from '@/hooks/use-toast';

interface Receipt {
  id: string;
  type: string;
  timestamp: string;
  data: any;
  session_id: string;
  verified?: boolean;
}

export const ReceiptsExplorer: React.FC = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const { toast } = useToast();

  const { data: mockReceipts, loading, error, retry } = useRetryFetch<Receipt[]>(
    async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return [
        {
          id: 'receipt_001',
          type: 'onboard_rds',
          timestamp: new Date().toISOString(),
          data: { step: 'persona', persona: 'aspiring', session_id: 'session_123' },
          session_id: 'session_123'
        },
        {
          id: 'receipt_002',
          type: 'decision_rds',
          timestamp: new Date().toISOString(),
          data: { action: 'create_goal', persona: 'aspiring', tier: 'foundational' },
          session_id: 'session_123'
        }
      ];
    }
  );

  useEffect(() => {
    if (mockReceipts) {
      setReceipts(mockReceipts);
    }
  }, [mockReceipts]);

  const filteredReceipts = receipts.filter(receipt =>
    receipt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receipt.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVerifyReceipt = (receipt: Receipt) => {
    try {
      const result = verifyReceipt(receipt.data);
      setReceipts(prev => prev.map(r => 
        r.id === receipt.id ? { ...r, verified: result.isValid } : r
      ));
      toast({
        title: result.isValid ? "Receipt Verified" : "Verification Failed",
        description: result.message,
        variant: result.isValid ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Verification Error",
        description: "Failed to verify receipt",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6">
        <SkeletonLoader count={5} height="120px" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Receipts</h3>
            <Button onClick={retry}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (receipts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No receipts yet</h3>
            <p className="text-muted-foreground text-center">
              Complete one action and they'll appear here.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Receipts Explorer</h1>
          <p className="text-muted-foreground mt-2">View and verify your RDS receipts</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search receipts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
          aria-label="Search receipts"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredReceipts.map((receipt) => (
          <Card key={receipt.id} className="cursor-pointer transition-all hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <CardTitle className="text-lg">{receipt.id}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  {receipt.verified !== undefined && (
                    <Badge variant={receipt.verified ? "default" : "destructive"} className="text-xs">
                      {receipt.verified ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Invalid
                        </>
                      )}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">{receipt.type}</Badge>
                </div>
              </div>
              <CardDescription>
                {new Date(receipt.timestamp).toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleVerifyReceipt(receipt)}>
                  <Shield className="h-4 w-4 mr-2" />
                  Verify
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelectedReceipt(receipt)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedReceipt} onOpenChange={() => setSelectedReceipt(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Receipt Details: {selectedReceipt?.id}</DialogTitle>
            <DialogDescription>
              Type: {selectedReceipt?.type} • {selectedReceipt && new Date(selectedReceipt.timestamp).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          {selectedReceipt && (
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto max-h-96">
              {JSON.stringify(selectedReceipt.data, null, 2)}
            </pre>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};