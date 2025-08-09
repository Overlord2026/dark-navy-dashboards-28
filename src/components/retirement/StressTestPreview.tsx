import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { TrendingDown, Shield, Activity, AlertTriangle } from 'lucide-react';
import { analytics } from '@/lib/analytics';

interface StressTestInputs {
  portfolioValue: number;
  annualFee: number;
  growthRate: number;
  monthlySpending: number;
  inflation: number;
  timeHorizon: number;
}

interface StressTestScenario {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  successProbability: number;
  phaseImpacts: string[];
  chartData: Array<{ year: number; value: number }>;
}

interface StressTestPreviewProps {
  inputs: StressTestInputs;
  scenarios?: ('earlyRetirement' | 'marketCrash' | 'ltc' | 'inflationSpike')[];
  onScenarioClick?: (scenarioId: string) => void;
  showBookingCTA?: boolean;
  demoMode?: boolean;
}

export const StressTestPreview: React.FC<StressTestPreviewProps> = ({
  inputs,
  scenarios = ['earlyRetirement', 'marketCrash', 'ltc', 'inflationSpike'],
  onScenarioClick,
  showBookingCTA = true,
  demoMode = false
}) => {
  // Mock calculation function for demo purposes
  const calculateScenario = (scenarioType: string): StressTestScenario => {
    const baseValue = inputs.portfolioValue;
    const years = inputs.timeHorizon;
    
    let successProbability: number;
    let title: string;
    let description: string;
    let icon: React.ReactNode;
    let phaseImpacts: string[];
    let multiplier: number;
    
    switch (scenarioType) {
      case 'earlyRetirement':
        successProbability = 78;
        title = 'Early Retirement (-5 Years)';
        description = 'Retiring 5 years earlier than planned';
        icon = <TrendingDown className="h-5 w-5" />;
        phaseImpacts = ['Income Now', 'Income Later'];
        multiplier = 0.85;
        break;
        
      case 'marketCrash':
        successProbability = 65;
        title = 'Market Crash (-30%)';
        description = '30% portfolio decline in year 1';
        icon = <AlertTriangle className="h-5 w-5" />;
        phaseImpacts = ['Growth', 'Legacy'];
        multiplier = 0.7;
        break;
        
      case 'ltc':
        successProbability = 72;
        title = 'Long-Term Care';
        description = '$100k/year care costs for 3 years';
        icon = <Shield className="h-5 w-5" />;
        phaseImpacts = ['Income Later', 'Legacy'];
        multiplier = 0.8;
        break;
        
      case 'inflationSpike':
        successProbability = 69;
        title = 'Inflation Spike (5%)';
        description = '5% inflation for 10 years';
        icon = <Activity className="h-5 w-5" />;
        phaseImpacts = ['Income Now', 'Income Later', 'Growth'];
        multiplier = 0.75;
        break;
        
      default:
        successProbability = 80;
        title = 'Standard Plan';
        description = 'Base scenario';
        icon = <Shield className="h-5 w-5" />;
        phaseImpacts = [];
        multiplier = 1;
    }
    
    // Generate chart data
    const chartData = Array.from({ length: Math.min(years, 20) }, (_, i) => {
      const growthFactor = Math.pow(1 + (inputs.growthRate / 100), i);
      const adjustedValue = baseValue * growthFactor * multiplier;
      return {
        year: i,
        value: adjustedValue / 1000000 // Convert to millions for readability
      };
    });
    
    return {
      id: scenarioType,
      title,
      description,
      icon,
      successProbability,
      phaseImpacts,
      chartData
    };
  };

  const handleScenarioClick = (scenarioId: string) => {
    analytics.track('stress_preview_cta_click', {
      scenario: scenarioId,
      action: 'view_full_roadmap',
      demo_mode: demoMode
    });
    
    if (onScenarioClick) {
      onScenarioClick(scenarioId);
    } else if (showBookingCTA) {
      // Default action - open booking modal or route to signup
      if (demoMode) {
        // In demo mode, show a message or route to signup
        console.log('Demo mode: would route to signup');
      } else {
        // Open booking modal or external link
        window.open('/schedule', '_blank');
      }
    }
  };

  React.useEffect(() => {
    analytics.track('stress_preview_viewed', {
      scenarios: scenarios.length,
      demo_mode: demoMode
    });
  }, [scenarios, demoMode]);

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">SWAG™ Stress Test Preview</h3>
        <p className="text-muted-foreground">
          See how your plan performs under different scenarios
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scenarios.map((scenarioType) => {
          const scenario = calculateScenario(scenarioType);
          const isHighSuccess = scenario.successProbability >= 75;
          const isMediumSuccess = scenario.successProbability >= 65;
          
          return (
            <Card key={scenario.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {scenario.icon}
                    <CardTitle className="text-base">{scenario.title}</CardTitle>
                  </div>
                  <Badge 
                    variant={isHighSuccess ? "default" : isMediumSuccess ? "secondary" : "destructive"}
                    className="text-xs"
                  >
                    {scenario.successProbability}% Success
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{scenario.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Phase Impact Tags */}
                <div className="flex flex-wrap gap-1">
                  {scenario.phaseImpacts.map((phase) => (
                    <Badge key={phase} variant="outline" className="text-xs">
                      {phase}
                    </Badge>
                  ))}
                </div>
                
                {/* Mini Chart */}
                <div className="h-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={scenario.chartData}>
                      <XAxis 
                        dataKey="year" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis hide />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                {/* CTA Button */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleScenarioClick(scenario.id)}
                >
                  {demoMode ? 'Customize & Continue' : 'See Full Roadmap'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};