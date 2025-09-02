import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ReceiptChip } from '@/components/receipts/ReceiptChip';
import { saveDecisionRDS } from '@/services/decisions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { DecisionRDS } from '@/services/decisions';

/**
 * Example component showing how any demo can save a Decision-RDS and show a ReceiptChip
 */
export function DemoWithReceiptExample() {
  const [saving, setSaving] = useState(false);
  const [receipt, setReceipt] = useState<DecisionRDS | null>(null);
  const { toast } = useToast();

  const handleSaveDecision = async (action: string, reasons: string[]) => {
    setSaving(true);
    try {
      const newReceipt = await saveDecisionRDS({
        subject: '44444444-4444-4444-4444-444444444444', // Demo family ID
        action,
        reasons,
        meta: {
          demo: true,
          component: 'DemoWithReceiptExample'
        }
      });

      setReceipt(newReceipt);
      
      toast({
        title: "Decision Recorded",
        description: `${action.replace(/_/g, ' ')} decision saved with receipt`,
      });
      
    } catch (error) {
      console.error('Error saving decision:', error);
      toast({
        title: "Error",
        description: "Failed to save decision",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Demo: Save Decision & Show Receipt</CardTitle>
        <CardDescription>
          Example of unified saveDecisionRDS() function used by any demo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Demo Actions */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => handleSaveDecision('retirement_planning', ['GOALS_REALISTIC', 'INCOME_VERIFIED'])}
            disabled={saving}
            size="sm"
          >
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Plan Retirement
          </Button>
          
          <Button
            onClick={() => handleSaveDecision('fee_benchmark', ['PEER_GROUP_VALIDATED', 'COMPETITIVE_RATE'])}
            disabled={saving}
            size="sm"
            variant="outline"
          >
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Fee Benchmark
          </Button>
          
          <Button
            onClick={() => handleSaveDecision('portfolio_rebalance', ['RISK_APPROPRIATE', 'DIVERSIFIED'])}
            disabled={saving}
            size="sm"
            variant="outline"
          >
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Rebalance Portfolio
          </Button>
        </div>

        {/* Receipt Display */}
        {receipt && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-2">Latest Receipt:</h4>
            <ReceiptChip receipt={receipt} variant="detailed" />
          </div>
        )}

        {!receipt && (
          <div className="text-center py-4 text-muted-foreground text-sm">
            Click any action above to save a decision and see the receipt chip
          </div>
        )}
      </CardContent>
    </Card>
  );
}