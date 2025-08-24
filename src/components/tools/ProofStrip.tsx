import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Receipt } from 'lucide-react';
import { listReceipts } from '@/features/receipts/record';

interface ProofStripProps {
  lastReceiptId?: string;
}

export const ProofStrip: React.FC<ProofStripProps> = ({ lastReceiptId }) => {
  const [lastReceipt, setLastReceipt] = React.useState<any>(null);

  React.useEffect(() => {
    const receipts = listReceipts();
    
    if (lastReceiptId) {
      // Find specific receipt by ID
      const receipt = receipts.find(r => r.id === lastReceiptId);
      setLastReceipt(receipt);
    } else {
      // Get the most recent receipt
      const recent = receipts[0]; // receipts are stored with newest first
      setLastReceipt(recent);
    }
  }, [lastReceiptId]);

  if (!lastReceipt) return null;

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return date.toLocaleDateString();
  };

  const isAnchored = !!lastReceipt.anchor_ref;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Proof Slip Generated</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {lastReceipt.type}
            </Badge>
            {isAnchored && (
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-xs text-green-600 font-medium">Included ✓</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {formatTimestamp(lastReceipt.created_at)}
          </div>
        </div>
        
        <div className="mt-2 text-xs text-muted-foreground">
          ID: {lastReceipt.id} • {lastReceipt.policy_version}
        </div>
        
        {lastReceipt.reasons && lastReceipt.reasons.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {lastReceipt.reasons.map((reason: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {reason}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};