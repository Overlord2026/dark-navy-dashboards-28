import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SwagPhase, PhaseAllocation, PhaseProjection } from '@/types/swag-retirement';

interface SwagPhaseManagerProps {
  phases: SwagPhase[];
  allocations: PhaseAllocation[];
  projections: PhaseProjection[];
}

export const SwagPhaseManager: React.FC<SwagPhaseManagerProps> = ({
  phases,
  allocations,
  projections
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {phases.map((phase) => {
        const allocation = allocations.find(a => a.phaseId === phase.id);
        const projection = projections.find(p => p.phaseId === phase.id);
        
        return (
          <Card key={phase.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">{phase.name}</CardTitle>
              <div className="text-xs text-muted-foreground">
                Years {phase.yearStart}-{phase.yearEnd || '∞'}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <div className="text-lg font-semibold">
                    {formatCurrency(allocation?.allocatedAmount || 0)}
                  </div>
                  <div className="text-xs text-muted-foreground">Allocated</div>
                </div>
                {projection && (
                  <Progress value={projection.confidenceLevel} className="h-2" />
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};