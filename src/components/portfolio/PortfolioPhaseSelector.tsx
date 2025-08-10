import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PhaseConfig {
  id: string;
  name: string;
  description: string;
  horizonYears: number;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  liquidityTarget: number;
}

const PHASE_CONFIGS: PhaseConfig[] = [
  {
    id: 'income_now',
    name: 'Income Now',
    description: 'Focus on current income generation with capital preservation',
    horizonYears: 5,
    riskTolerance: 'conservative',
    liquidityTarget: 0.8
  },
  {
    id: 'income_later',
    name: 'Income Later',
    description: 'Balanced growth with future income planning',
    horizonYears: 15,
    riskTolerance: 'moderate',
    liquidityTarget: 0.6
  },
  {
    id: 'growth',
    name: 'Growth',
    description: 'Long-term wealth accumulation and capital appreciation',
    horizonYears: 25,
    riskTolerance: 'aggressive',
    liquidityTarget: 0.4
  },
  {
    id: 'legacy',
    name: 'Legacy',
    description: 'Multi-generational wealth transfer optimization',
    horizonYears: 50,
    riskTolerance: 'moderate',
    liquidityTarget: 0.3
  }
];

interface PortfolioPhaseSelectorProps {
  selectedPhase: string;
  onPhaseChange: (phase: string) => void;
  className?: string;
}

export const PortfolioPhaseSelector: React.FC<PortfolioPhaseSelectorProps> = ({
  selectedPhase,
  onPhaseChange,
  className = ''
}) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'conservative': return 'bg-blue-100 text-blue-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'aggressive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <h3 className="text-lg font-semibold text-foreground">SWAG Phase Policy</h3>
        <p className="text-sm text-muted-foreground">
          Select your investment phase to optimize portfolio allocation
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PHASE_CONFIGS.map((phase) => (
          <Card 
            key={phase.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedPhase === phase.id 
                ? 'ring-2 ring-primary border-primary' 
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => onPhaseChange(phase.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{phase.name}</CardTitle>
                <Badge className={getRiskColor(phase.riskTolerance)}>
                  {phase.riskTolerance}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-sm mb-3">
                {phase.description}
              </CardDescription>
              
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Time Horizon:</span>
                  <span className="font-medium">{phase.horizonYears} years</span>
                </div>
                <div className="flex justify-between">
                  <span>Liquidity Target:</span>
                  <span className="font-medium">{(phase.liquidityTarget * 100).toFixed(0)}%</span>
                </div>
              </div>
              
              {selectedPhase === phase.id && (
                <Button size="sm" className="w-full mt-3" variant="secondary">
                  Selected
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};