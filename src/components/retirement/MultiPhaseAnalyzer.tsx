/**
 * Multi-Phase Performance Analyzer
 * SWAG™ phase-based portfolio optimization with alternative assets
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  Shield, 
  Target, 
  DollarSign, 
  Clock, 
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useMultiPhaseAnalysis } from '@/hooks/useMultiPhaseAnalysis';
import { MultiPhaseInputs } from './MultiPhaseInputs';
import { PhaseAllocationChart } from './PhaseAllocationChart';
import { PerformanceComparison } from './PerformanceComparison';
import { AlternativeAssetsPanel } from './AlternativeAssetsPanel';

export function MultiPhaseAnalyzer() {
  const {
    input,
    results,
    isAnalyzing,
    error,
    currentPhase,
    hasAlternativeAssetAccess,
    performanceComparison,
    runAnalysis,
    updateInput,
    updateAlternativeAssets,
    updateAdvisorOverrides
  } = useMultiPhaseAnalysis();

  const handleRunAnalysis = async () => {
    try {
      await runAnalysis();
    } catch (err) {
      console.error('Analysis failed:', err);
    }
  };

  const getPhaseColor = (phaseId: string) => {
    const colors = {
      growth: 'bg-green-500',
      income_later: 'bg-blue-500', 
      income_now: 'bg-purple-500',
      legacy: 'bg-amber-500'
    };
    return colors[phaseId as keyof typeof colors] || 'bg-gray-500';
  };

  const getPhaseLabel = (phaseId: string) => {
    const labels = {
      growth: 'Growth Phase',
      income_later: 'Pre-Retirement',
      income_now: 'Income Now',
      legacy: 'Legacy Phase'
    };
    return labels[phaseId as keyof typeof labels] || phaseId;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Multi-Phase Performance Analyzer</h2>
          <p className="text-muted-foreground">
            SWAG™ phase-based optimization with alternative asset integration
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge 
            variant="secondary" 
            className={`${getPhaseColor(currentPhase)} text-white`}
          >
            Current: {getPhaseLabel(currentPhase)}
          </Badge>
          <Button 
            onClick={handleRunAnalysis} 
            disabled={isAnalyzing}
            className="bg-primary hover:bg-primary/90"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <BarChart3 className="mr-2 h-4 w-4" />
                Run Analysis
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="inputs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="inputs">Analysis Inputs</TabsTrigger>
          <TabsTrigger value="phases" disabled={!results}>Phase Allocations</TabsTrigger>
          <TabsTrigger value="alternatives" disabled={!results}>Alternative Assets</TabsTrigger>
          <TabsTrigger value="comparison" disabled={!results}>Performance</TabsTrigger>
          <TabsTrigger value="recommendations" disabled={!results}>Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="inputs">
          <MultiPhaseInputs
            input={input}
            onInputChange={updateInput}
            onAlternativeAssetsChange={updateAlternativeAssets}
            onAdvisorOverridesChange={updateAdvisorOverrides}
            hasAlternativeAssetAccess={hasAlternativeAssetAccess}
          />
        </TabsContent>

        <TabsContent value="phases">
          {results && (
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Phase Transition Timeline
                  </CardTitle>
                  <CardDescription>
                    Projected portfolio phase transitions based on age and portfolio value
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {results.transitions.map((transition, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${getPhaseColor(transition.fromPhase)}`} />
                          <span className="text-sm">Age {transition.triggerAge}</span>
                          <span className="text-muted-foreground">→</span>
                          <div className={`w-3 h-3 rounded-full ${getPhaseColor(transition.toPhase)}`} />
                          <span className="font-medium">{getPhaseLabel(transition.toPhase)}</span>
                        </div>
                        {transition.rebalancingRequired && (
                          <Badge variant="outline">Rebalancing Required</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <PhaseAllocationChart phases={results.phases} />
            </div>
          )}
        </TabsContent>

        <TabsContent value="alternatives">
          {results && (
            <AlternativeAssetsPanel
              alternativeMetrics={results.alternativeAssetMetrics}
              hasAccess={hasAlternativeAssetAccess}
              input={input}
              onInputChange={updateAlternativeAssets}
            />
          )}
        </TabsContent>

        <TabsContent value="comparison">
          {results && performanceComparison && (
            <PerformanceComparison
              results={results}
              comparison={performanceComparison}
            />
          )}
        </TabsContent>

        <TabsContent value="recommendations">
          {results && (
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Strategy Recommendation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium">Recommended Strategy:</span>
                      <Badge 
                        variant={results.recommendedStrategy === 'multi_phase' ? 'default' : 'secondary'}
                        className="text-lg px-4 py-2"
                      >
                        {results.recommendedStrategy === 'multi_phase' ? 'Multi-Phase SWAG™' : 'Traditional 60/40'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span>Confidence Score:</span>
                      <Progress value={results.confidenceScore} className="flex-1" />
                      <span className="font-medium">{results.confidenceScore}%</span>
                    </div>

                    {results.recommendedStrategy === 'multi_phase' && (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          The multi-phase approach is projected to reduce sequence of returns risk by{' '}
                          {performanceComparison?.sequenceRiskReduction.toFixed(1)}% while maintaining{' '}
                          similar growth potential through strategic phase transitions.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-500" />
                      Risk Reduction Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Maximum Drawdown Reduction:</span>
                      <span className="font-medium text-green-600">
                        -{performanceComparison?.drawdownReduction.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Sequence Risk Reduction:</span>
                      <span className="font-medium text-green-600">
                        -{performanceComparison?.sequenceRiskReduction.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Income Gap Reduction:</span>
                      <span className="font-medium text-green-600">
                        -{performanceComparison?.incomeGapReduction.toFixed(1)}%
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      Growth Enhancement
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Portfolio Value Improvement:</span>
                      <span className="font-medium text-green-600">
                        +{performanceComparison?.finalValueImprovement.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Alternative Asset Premium:</span>
                      <span className="font-medium text-blue-600">
                        +{((results.alternativeAssetMetrics.privateCredit.etay || 0) * 100).toFixed(1)}% ETAY
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Tax Efficiency Gain:</span>
                      <span className="font-medium text-blue-600">
                        +0.5-1.2% annually
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}