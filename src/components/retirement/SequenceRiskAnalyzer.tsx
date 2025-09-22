import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, TrendingDown, Shield, BarChart3 } from "lucide-react";
import { useSequenceRiskAnalysis } from '@/hooks/useSequenceRiskAnalysis';
import { SequenceRiskInputs } from './SequenceRiskInputs';
import { SequenceRiskResults } from './SequenceRiskResults';
import { SequenceRiskComparison } from './SequenceRiskComparison';
import { formatCurrency, formatPercentage } from '@/lib/utils';

export const SequenceRiskAnalyzer: React.FC = () => {
  const {
    input,
    results,
    phaseComparison,
    scenarioComparisons,
    loading,
    updateInput,
    updateAssetAllocation,
    updatePhaseProtection,
    loadPresetScenario,
    resetToDefaults
  } = useSequenceRiskAnalysis();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Sequence of Returns Risk Analysis</h2>
          <p className="text-muted-foreground">
            Test portfolio resilience against historical market downturns
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => loadPresetScenario('dotComCrash')}
            className="flex items-center gap-2"
          >
            <TrendingDown className="h-4 w-4" />
            2000 Crash
          </Button>
          <Button
            variant="outline"
            onClick={() => loadPresetScenario('financialCrisis')}
            className="flex items-center gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            2008 Crisis
          </Button>
          <Button variant="secondary" onClick={resetToDefaults}>
            Reset
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      {results && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Portfolio Survival</p>
                  <p className="text-2xl font-bold text-foreground">
                    {results.portfolioSurvivalYears} years
                  </p>
                </div>
                <Badge variant={results.success ? "default" : "destructive"}>
                  {results.success ? 'Success' : 'Failed'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Final Portfolio Value</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(results.finalPortfolioValue)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {results.portfolioDepletionYear ? `Depleted in ${results.portfolioDepletionYear}` : 'Survived'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Max Withdrawal Rate</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatPercentage(results.maxWithdrawalRate / 100)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Started at {formatPercentage(input.withdrawalRate / 100)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Withdrawals</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(results.totalWithdrawals)}
                </p>
                {results.shortfall > 0 && (
                  <p className="text-xs text-destructive">
                    Shortfall: {formatCurrency(results.shortfall)}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Analysis Tabs */}
      <Tabs defaultValue="inputs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inputs" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Setup
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4" />
            Results
          </TabsTrigger>
          <TabsTrigger value="protection" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Phase Protection
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Scenarios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inputs">
          <SequenceRiskInputs
            input={input}
            onUpdateInput={updateInput}
            onUpdateAssetAllocation={updateAssetAllocation}
            onUpdatePhaseProtection={updatePhaseProtection}
          />
        </TabsContent>

        <TabsContent value="results">
          {results && (
            <SequenceRiskResults
              results={results}
              input={input}
              loading={loading}
            />
          )}
        </TabsContent>

        <TabsContent value="protection">
          {phaseComparison && results && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Phase Protection Analysis
                </CardTitle>
                <CardDescription>
                  Compare portfolio performance with and without phase protection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Without Protection</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Survival Years:</span>
                        <span>{phaseComparison.withoutProtection.portfolioSurvivalYears}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Final Value:</span>
                        <span>{formatCurrency(phaseComparison.withoutProtection.finalPortfolioValue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Success:</span>
                        <Badge variant={phaseComparison.withoutProtection.success ? "default" : "destructive"}>
                          {phaseComparison.withoutProtection.success ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">With Protection</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Survival Years:</span>
                        <span>{phaseComparison.withProtection.portfolioSurvivalYears}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Final Value:</span>
                        <span>{formatCurrency(phaseComparison.withProtection.finalPortfolioValue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Success:</span>
                        <Badge variant={phaseComparison.withProtection.success ? "default" : "destructive"}>
                          {phaseComparison.withProtection.success ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Protection Benefit</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-muted-foreground">Additional Years:</span>
                      <span className="ml-2 font-medium text-primary">
                        +{phaseComparison.benefitYears} years
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Additional Value:</span>
                      <span className="ml-2 font-medium text-primary">
                        {formatCurrency(phaseComparison.benefitAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="comparison">
          <SequenceRiskComparison
            scenarios={scenarioComparisons}
            input={input}
            loading={loading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};