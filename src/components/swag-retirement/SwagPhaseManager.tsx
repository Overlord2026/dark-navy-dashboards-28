import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Target,
  AlertTriangle,
  CheckCircle,
  Settings,
  BarChart3
} from 'lucide-react';
import { SwagPhase, PhaseAllocation, PhaseProjection } from '@/types/swag-retirement';

interface SwagPhaseManagerProps {
  phases: SwagPhase[];
  allocations: PhaseAllocation[];
  projections: PhaseProjection[];
  onPhaseUpdate?: (phaseId: string, updates: Partial<SwagPhase>) => void;
  isAdmin?: boolean;
}

export const SwagPhaseManager: React.FC<SwagPhaseManagerProps> = ({
  phases,
  allocations,
  projections,
  onPhaseUpdate,
  isAdmin = false
}) => {
  const [activeView, setActiveView] = useState<'overview' | 'allocations' | 'projections'>('overview');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getPhaseIcon = (phaseName: string) => {
    if (phaseName.includes('Income Now')) return <DollarSign className="h-5 w-5 text-emerald" />;
    if (phaseName.includes('Income Later')) return <Calendar className="h-5 w-5 text-blue-500" />;
    if (phaseName.includes('Growth')) return <TrendingUp className="h-5 w-5 text-purple-500" />;
    if (phaseName.includes('Legacy')) return <Target className="h-5 w-5 text-amber-500" />;
    return <BarChart3 className="h-5 w-5 text-muted-foreground" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overfunded': return 'text-emerald';
      case 'on_track': return 'text-blue-500';
      case 'underfunded': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'overfunded':
      case 'on_track':
        return <CheckCircle className="h-4 w-4 text-emerald" />;
      case 'underfunded':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">SWAG Retirement Roadmap™</h2>
          <p className="text-muted-foreground">4-Phase Strategic Wealth Allocation & Growth Framework</p>
        </div>
        {isAdmin && (
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Configure Phases
          </Button>
        )}
      </div>

      <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Phase Overview</TabsTrigger>
          <TabsTrigger value="allocations">Current Allocations</TabsTrigger>
          <TabsTrigger value="projections">Future Projections</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {phases.map((phase) => {
              const allocation = allocations.find(a => a.phaseId === phase.id);
              const projection = projections.find(p => p.phaseId === phase.id);
              
              return (
                <Card key={phase.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getPhaseIcon(phase.name)}
                        <CardTitle className="text-lg">{phase.name}</CardTitle>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {phase.yearStart}{phase.yearEnd ? `-${phase.yearEnd}y` : '+'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{phase.description}</p>
                    
                    {allocation && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Current Allocation</span>
                          {getStatusIcon(allocation.fundingStatus)}
                        </div>
                        <div className="text-lg font-semibold">
                          {formatCurrency(allocation.allocatedAmount)}
                        </div>
                        <div className={`text-sm ${getStatusColor(allocation.fundingStatus)}`}>
                          {allocation.fundingStatus.replace('_', ' ')}
                        </div>
                      </div>
                    )}
                    
                    {projection && (
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Projected Income</div>
                        <div className="text-base font-medium">
                          {formatCurrency(projection.projectedIncome)}
                        </div>
                        <Progress value={projection.confidenceLevel} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          {projection.confidenceLevel.toFixed(0)}% confidence
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Investment Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Investment Categories by Phase</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {phases.map((phase) => (
                <Card key={`${phase.id}-categories`}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      {getPhaseIcon(phase.name)}
                      <CardTitle className="text-base">{phase.name} Investments</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {phase.investmentCategories.map((category) => (
                        <div key={category.id} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm">{category.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {category.riskLevel} risk • {category.expectedReturn}% return
                            </div>
                          </div>
                          <Badge variant="secondary">
                            {category.targetAllocation}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="allocations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {allocations.map((allocation) => {
                const phase = phases.find(p => p.id === allocation.phaseId);
                if (!phase) return null;

                return (
                  <Card key={allocation.phaseId}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getPhaseIcon(phase.name)}
                          <CardTitle className="text-lg">{phase.name}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(allocation.fundingStatus)}
                          <Badge variant={allocation.fundingStatus === 'on_track' ? 'default' : 
                                         allocation.fundingStatus === 'overfunded' ? 'secondary' : 'destructive'}>
                            {allocation.fundingStatus.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Current Allocation</div>
                          <div className="text-xl font-semibold">
                            {formatCurrency(allocation.allocatedAmount)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Projected Income</div>
                          <div className="text-xl font-semibold">
                            {formatCurrency(allocation.projectedIncome)}
                          </div>
                        </div>
                      </div>
                      
                      {allocation.recommendedActions.length > 0 && (
                        <div className="mt-4">
                          <div className="text-sm font-medium mb-2">Recommended Actions:</div>
                          <ul className="text-sm space-y-1">
                            {allocation.recommendedActions.map((action, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Allocation Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {allocations.map((allocation) => {
                      const phase = phases.find(p => p.id === allocation.phaseId);
                      const totalAllocated = allocations.reduce((sum, a) => sum + a.allocatedAmount, 0);
                      const percentage = (allocation.allocatedAmount / totalAllocated) * 100;

                      return (
                        <div key={allocation.phaseId} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{phase?.name}</span>
                            <span className="text-sm font-medium">{percentage.toFixed(1)}%</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Rebalancing Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {allocations
                      .filter(a => a.fundingStatus === 'underfunded')
                      .map(allocation => {
                        const phase = phases.find(p => p.id === allocation.phaseId);
                        return (
                          <div key={allocation.phaseId} className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                            <span className="text-sm">{phase?.name} needs funding</span>
                          </div>
                        );
                      })}
                    {allocations.every(a => a.fundingStatus !== 'underfunded') && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald" />
                        <span className="text-sm">All phases properly funded</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="projections" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projections.map((projection) => {
              const phase = phases.find(p => p.id === projection.phaseId);
              if (!phase) return null;

              return (
                <Card key={projection.phaseId}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      {getPhaseIcon(phase.name)}
                      <CardTitle className="text-lg">{phase.name} Projection</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Projected Balance</div>
                        <div className="text-xl font-semibold">
                          {formatCurrency(projection.projectedBalance)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Annual Income</div>
                        <div className="text-xl font-semibold">
                          {formatCurrency(projection.projectedIncome)}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Confidence Level</span>
                        <span className="text-sm font-medium">{projection.confidenceLevel.toFixed(0)}%</span>
                      </div>
                      <Progress value={projection.confidenceLevel} className="h-2" />
                    </div>

                    {projection.shortfall > 0 && (
                      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                          <span className="text-sm font-medium text-destructive">Shortfall Alert</span>
                        </div>
                        <div className="text-sm text-destructive">
                          {formatCurrency(projection.shortfall)} annual shortfall projected
                        </div>
                      </div>
                    )}

                    {projection.riskFactors.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Risk Factors:</div>
                        <ul className="text-sm space-y-1">
                          {projection.riskFactors.map((risk, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-warning rounded-full" />
                              {risk}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};