import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ReceiptChip } from '@/components/receipts/ReceiptChip';
import { useReceiptSaver, useLatestReceipt } from '@/hooks/useReceipt';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface DemoReceiptExampleProps {
  subjectId: string;
  title?: string;
  description?: string;
}

export function DemoReceiptExample({ 
  subjectId, 
  title = "Demo Receipt System",
  description = "Test the unified Decision-RDS system"
}: DemoReceiptExampleProps) {
  const { saveReceipt, saving } = useReceiptSaver();
  const { receipt, refetch } = useLatestReceipt(subjectId);
  const { toast } = useToast();
  const [lastAction, setLastAction] = useState<string>('');

  const handleSaveReceipt = async (action: string, reasons: string[]) => {
    try {
      setLastAction(action);
      const receipt = await saveReceipt({
        subject: subjectId,
        action,
        reasons,
        meta: {
          demo: true,
          timestamp: new Date().toISOString()
        }
      });

      toast({
        title: "Receipt Saved",
        description: `Decision-RDS for ${action} created successfully`,
      });

      // Refresh the latest receipt
      await refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save receipt",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Demo Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Button
            onClick={() => handleSaveReceipt('retirement_planning', ['GOALS_REALISTIC', 'INCOME_VERIFIED'])}
            disabled={saving}
            variant="outline"
          >
            {saving && lastAction === 'retirement_planning' && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Plan Retirement
          </Button>
          
          <Button
            onClick={() => handleSaveReceipt('fee_benchmark', ['PEER_GROUP_VALIDATED', 'COMPETITIVE_RATE'])}
            disabled={saving}
            variant="outline"
          >
            {saving && lastAction === 'fee_benchmark' && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Fee Benchmark
          </Button>
          
          <Button
            onClick={() => handleSaveReceipt('portfolio_rebalance', ['RISK_APPROPRIATE', 'DIVERSIFIED'])}
            disabled={saving}
            variant="outline"
          >
            {saving && lastAction === 'portfolio_rebalance' && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Rebalance Portfolio
          </Button>
          
          <Button
            onClick={() => handleSaveReceipt('cohort_analysis', ['PRIVACY_PRESERVED', 'STATISTICALLY_SIGNIFICANT'])}
            disabled={saving}
            variant="outline"
          >
            {saving && lastAction === 'cohort_analysis' && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Analyze Cohort
          </Button>
        </div>

        {/* Latest Receipt Display */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-2">Latest Receipt:</h4>
          {receipt ? (
            <ReceiptChip receipt={receipt} variant="detailed" />
          ) : (
            <p className="text-sm text-muted-foreground">No receipts yet. Click an action above to create one.</p>
          )}
        </div>

        {/* Receipt Variants Demo */}
        {receipt && (
          <div className="border-t pt-4 space-y-2">
            <h4 className="text-sm font-medium">Receipt Variants:</h4>
            <div className="flex flex-wrap gap-2">
              <ReceiptChip receipt={receipt} variant="compact" />
              <ReceiptChip receipt={receipt} variant="default" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}