/**
 * Long-Term Care Stress Testing Analyzer Component
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LTCStressInputs } from './LTCStressInputs';
import { LTCStressResults } from './LTCStressResults';
import { LTCScenarioComparison } from './LTCScenarioComparison';
import { useLTCStressAnalysis } from '@/hooks/useLTCStressAnalysis';
import { AlertTriangle, Heart, Shield } from 'lucide-react';

export function LTCStressAnalyzer() {
  const {
    inputs,
    updateInputs,
    analysis,
    loading,
    error,
    runAnalysis,
    clearResults
  } = useLTCStressAnalysis();

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Long-Term Care Stress Testing
          </h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          Comprehensive analysis of long-term care costs with state-specific data, 
          gender considerations, and multiple scenario modeling to protect your retirement.
        </p>
      </div>

      {/* Key Metrics Banner */}
      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">LTC Probability</p>
                  <p className="text-xl font-semibold">
                    {Math.round(analysis.baselineRisk.primaryPersonProbability * 100)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-warning">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <div>
                  <p className="text-sm text-muted-foreground">Insurance Gap</p>
                  <p className="text-xl font-semibold">
                    ${(analysis.insuranceGap / 1000).toFixed(0)}K
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-destructive">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-destructive" />
                <div>
                  <p className="text-sm text-muted-foreground">Worst Case Impact</p>
                  <p className="text-xl font-semibold">
                    {Math.round(analysis.worstCaseScenario.impactOnNetWorth * 100)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="inputs" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="inputs">Analysis Setup</TabsTrigger>
          <TabsTrigger value="results" disabled={!analysis}>
            Stress Test Results
          </TabsTrigger>
          <TabsTrigger value="scenarios" disabled={!analysis}>
            Scenario Comparison
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inputs" className="mt-6">
          <LTCStressInputs
            inputs={inputs}
            onInputsChange={updateInputs}
            onRunAnalysis={runAnalysis}
            loading={loading}
            error={error}
            onClearResults={clearResults}
          />
        </TabsContent>

        <TabsContent value="results" className="mt-6">
          {analysis && (
            <LTCStressResults analysis={analysis} />
          )}
        </TabsContent>

        <TabsContent value="scenarios" className="mt-6">
          {analysis && (
            <LTCScenarioComparison analysis={analysis} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}