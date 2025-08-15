import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { LTCStressResult } from '@/lib/scorecard/ltc';

interface LTCPanelProps {
  ltcResult: {
    riskScore: number;
    pvCost: number;
    selfFundFeasible: boolean;
  };
}

export function LTCPanel({ ltcResult }: LTCPanelProps) {
  const { riskScore, pvCost, selfFundFeasible } = ltcResult;
  
  // Calculate derived values for display
  const annualCost = pvCost * 0.06; // Approximate annual cost from PV
  const durationYears = 3.2; // Average LTC duration

  const getRiskLevel = (score: number) => {
    if (score <= 30) return { level: 'Low', color: 'bg-green-500', icon: CheckCircle };
    if (score <= 60) return { level: 'Moderate', color: 'bg-yellow-500', icon: AlertTriangle };
    return { level: 'High', color: 'bg-red-500', icon: XCircle };
  };

  const riskLevel = getRiskLevel(riskScore);
  const RiskIcon = riskLevel.icon;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatLargeCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return formatCurrency(value);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Long-Term Care Risk Assessment
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RiskIcon className="h-4 w-4" />
            <span className="font-medium">Risk Level:</span>
          </div>
          <Badge variant="secondary" className={`${riskLevel.color} text-white`}>
            {riskLevel.level}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Risk Score:</span>
              <span className="font-medium">{riskScore}/100</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Annual Cost:</span>
              <span className="font-medium">{formatCurrency(annualCost)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Expected Duration:</span>
              <span className="font-medium">{durationYears.toFixed(1)} years</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Present Value Cost:</span>
              <span className="font-medium">{formatLargeCurrency(pvCost)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Self-Fund Feasible:</span>
              <span className={`font-medium ${selfFundFeasible ? 'text-green-600' : 'text-red-600'}`}>
                {selfFundFeasible ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-start gap-2">
            <div className={`w-2 h-2 rounded-full mt-2 ${riskLevel.color}`} />
            <div className="text-xs text-muted-foreground">
              {riskScore <= 30 && (
                "Your LTC risk appears well-managed through insurance or adequate self-funding capacity."
              )}
              {riskScore > 30 && riskScore <= 60 && (
                "Consider reviewing your LTC coverage. Additional insurance or reserves may be beneficial."
              )}
              {riskScore > 60 && (
                "High LTC risk detected. Recommend immediate review of insurance options and care planning."
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}