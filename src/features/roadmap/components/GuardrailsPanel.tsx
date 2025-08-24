import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';
import type { Review } from '../types';

interface GuardrailsPanelProps {
  review: Review | null;
  onApplyRecommendation?: () => void;
}

export function GuardrailsPanel({ review, onApplyRecommendation }: GuardrailsPanelProps) {
  if (!review) {
    return (
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">
          Run a scenario to see guardrails analysis
        </p>
      </Card>
    );
  }

  const { successProb } = review.results;
  const { triggered, recommend } = review.guardrails;

  const getStatus = () => {
    if (successProb >= 0.9) return { level: 'excellent', color: 'green' };
    if (successProb >= 0.8) return { level: 'good', color: 'blue' };
    if (successProb >= 0.7) return { level: 'caution', color: 'yellow' };
    return { level: 'concern', color: 'red' };
  };

  const status = getStatus();

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-foreground">Guardrails</h4>
        <Badge
          variant={status.level === 'excellent' || status.level === 'good' ? 'default' : 'destructive'}
          className="flex items-center gap-1"
        >
          {triggered ? (
            <AlertTriangle className="h-3 w-3" />
          ) : (
            <CheckCircle className="h-3 w-3" />
          )}
          {status.level}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Success Rate</span>
          <span className="font-medium">{(successProb * 100).toFixed(1)}%</span>
        </div>
        
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              status.color === 'green' ? 'bg-green-500' :
              status.color === 'blue' ? 'bg-blue-500' :
              status.color === 'yellow' ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
            style={{ width: `${successProb * 100}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>70%</span>
          <span>90%</span>
        </div>
      </div>

      {recommend && (
        <div className="border-t pt-4">
          <div className="flex items-start gap-2">
            {recommend.type === 'spend_up' ? (
              <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium">
                {recommend.type === 'spend_up' && 'Consider Increasing Spending'}
                {recommend.type === 'spend_down' && 'Consider Reducing Spending'}
                {recommend.type === 'annuity' && 'Consider Income Annuity'}
                {recommend.type === 'delay_ss' && 'Consider Delaying Social Security'}
              </p>
              {recommend.amountPct && (
                <p className="text-xs text-muted-foreground">
                  Adjust by {recommend.amountPct}%
                </p>
              )}
            </div>
          </div>
          
          {onApplyRecommendation && (
            <Button
              variant="outline"
              size="sm"
              className="mt-2 w-full"
              onClick={onApplyRecommendation}
            >
              Apply Recommendation
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}