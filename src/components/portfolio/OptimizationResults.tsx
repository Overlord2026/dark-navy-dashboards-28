import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import type { OptimizationProposal } from '@/hooks/usePortfolio';

interface OptimizationResultsProps {
  proposal: OptimizationProposal;
  onCreateTicket: () => void;
  onExportPDF: () => void;
  loading?: boolean;
}

export const OptimizationResults: React.FC<OptimizationResultsProps> = ({
  proposal,
  onCreateTicket,
  onExportPDF,
  loading = false
}) => {
  const { trades, rationale, expectedReturn, risk, driftCorrections } = proposal;

  const totalTradeValue = trades.reduce((sum, trade) => 
    sum + (trade.quantity * trade.estimatedPrice), 0
  );

  const buyTrades = trades.filter(t => t.action === 'buy');
  const sellTrades = trades.filter(t => t.action === 'sell');

  const getActionIcon = (action: string) => {
    return action === 'buy' ? 
      <TrendingUp className="h-4 w-4 text-green-600" /> : 
      <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  const getActionColor = (action: string) => {
    return action === 'buy' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trades.length}</div>
            <p className="text-xs text-muted-foreground">
              {buyTrades.length} buy, {sellTrades.length} sell
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expected Return</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {(expectedReturn * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Annualized projection
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {(risk * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Volatility estimate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Drift Corrections */}
      {driftCorrections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Drift Corrections</CardTitle>
            <CardDescription>
              Asset class allocation adjustments needed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {driftCorrections.map((correction, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{correction.assetClass}</span>
                    <Badge variant={Math.abs(correction.drift) > 0.05 ? "destructive" : "secondary"}>
                      {correction.drift > 0 ? '+' : ''}{(correction.drift * 100).toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>Current: {(correction.currentWeight * 100).toFixed(1)}%</div>
                    <div>Target: {(correction.targetWeight * 100).toFixed(1)}%</div>
                  </div>
                  <Progress 
                    value={correction.currentWeight * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trade List */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Trades</CardTitle>
          <CardDescription>
            Total trade value: ${totalTradeValue.toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trades.map((trade, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getActionIcon(trade.action)}
                  <div>
                    <div className="font-medium">{trade.symbol}</div>
                    <div className="text-sm text-muted-foreground">{trade.assetClass}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`font-medium ${getActionColor(trade.action)}`}>
                    {trade.action.toUpperCase()} {trade.quantity.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    @ ${trade.estimatedPrice.toFixed(2)}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-medium">
                    ${(trade.quantity * trade.estimatedPrice).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rationale */}
      <Card>
        <CardHeader>
          <CardTitle>Optimization Rationale</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {rationale}
          </p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={onCreateTicket}
          disabled={loading || trades.length === 0}
          className="flex-1"
        >
          Create Rebalancing Ticket
        </Button>
        
        <Button 
          onClick={onExportPDF}
          variant="outline"
          disabled={loading}
          className="flex-1"
        >
          Export PDF Report
        </Button>
      </div>
    </div>
  );
};