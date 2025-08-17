import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Target, 
  BarChart3, 
  FileText,
  AlertTriangle,
  RefreshCw,
  Database
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TestResult {
  testName: string;
  passed: boolean;
  actualOutput: any;
  expectedOutput: any;
  tolerance: number;
  variance: number;
  executionTime: number;
  errorMessage?: string;
}

interface CalculatorTestSuite {
  calculator: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  testResults: TestResult[];
  performance: {
    averageExecutionTime: number;
    maxExecutionTime: number;
    minExecutionTime: number;
  };
  coverage: {
    inputCoverage: number;
    outputCoverage: number;
    edgeCaseCoverage: number;
  };
}

interface TestData {
  goldenDatasets: any[];
  testSuites: Record<string, CalculatorTestSuite>;
  overallStats: {
    totalDatasets: number;
    totalTestSuites: number;
    overallPassRate: number;
    categoryBreakdown: Record<string, number>;
    confidenceBreakdown: Record<string, number>;
  };
  recommendations: string[];
}

export default function CalculatorTestsPage() {
  const [testData, setTestData] = useState<TestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [runningTests, setRunningTests] = useState(false);

  useEffect(() => {
    fetchTestData();
  }, []);

  const fetchTestData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: functionError } = await supabase.functions.invoke('calc-tests');
      
      if (functionError) {
        throw new Error(functionError.message || 'Failed to fetch test data');
      }
      
      setTestData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const runAllTests = async () => {
    setRunningTests(true);
    // Simulate test execution
    await new Promise(resolve => setTimeout(resolve, 2000));
    await fetchTestData();
    setRunningTests(false);
  };

  const getTestResultIcon = (passed: boolean) => {
    return passed ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getCoverageColor = (coverage: number) => {
    if (coverage >= 80) return 'text-green-600';
    if (coverage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading test data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <XCircle className="h-5 w-5 mr-2" />
              Error Loading Test Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchTestData} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!testData) {
    return null;
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Target className="h-8 w-8 mr-3 text-primary" />
              Calculator Tests
            </h1>
            <p className="text-muted-foreground mt-1">
              Unit and integration tests with golden datasets for all calculators
            </p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={fetchTestData} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={runAllTests} disabled={runningTests}>
              {runningTests ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              {runningTests ? 'Running Tests...' : 'Run All Tests'}
            </Button>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Datasets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testData.overallStats.totalDatasets}</div>
            <p className="text-xs text-muted-foreground">Golden datasets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testData.overallStats.overallPassRate.toFixed(1)}%</div>
            <Progress value={testData.overallStats.overallPassRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Test Suites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testData.overallStats.totalTestSuites}</div>
            <p className="text-xs text-muted-foreground">Calculator suites</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">High Confidence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testData.overallStats.confidenceBreakdown.high}</div>
            <p className="text-xs text-muted-foreground">High confidence tests</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="test-suites">Test Suites</TabsTrigger>
          <TabsTrigger value="golden-datasets">Golden Datasets</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Test Categories</CardTitle>
              <CardDescription>Distribution of test types across all calculators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(testData.overallStats.categoryBreakdown).map(([category, count]) => (
                  <div key={category} className="text-center p-4 border rounded-lg">
                    <div className="text-sm font-medium capitalize mb-2">
                      {category.replace('_', ' ')}
                    </div>
                    <div className="text-3xl font-bold">{count}</div>
                    <div className="text-xs text-muted-foreground">tests</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Confidence Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Test Confidence Levels</CardTitle>
              <CardDescription>Quality distribution of test datasets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(testData.overallStats.confidenceBreakdown).map(([confidence, count]) => (
                  <div key={confidence} className="text-center p-4 border rounded-lg">
                    <div className="text-sm font-medium capitalize mb-2">{confidence}</div>
                    <div className="text-3xl font-bold">{count}</div>
                    <Badge 
                      variant={confidence === 'high' ? 'default' : confidence === 'medium' ? 'secondary' : 'outline'}
                      className="mt-2"
                    >
                      {confidence} confidence
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test-suites" className="space-y-6">
          <div className="grid gap-6">
            {Object.entries(testData.testSuites).map(([calculatorName, suite]) => (
              <Card key={calculatorName}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <Target className="h-5 w-5 mr-2 text-primary" />
                        {calculatorName.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </CardTitle>
                      <CardDescription>
                        {suite.totalTests} tests • {suite.passedTests} passed • {suite.failedTests} failed
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge 
                        variant={suite.passedTests === suite.totalTests ? 'default' : 'destructive'}
                      >
                        {((suite.passedTests / suite.totalTests) * 100).toFixed(1)}% Pass Rate
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Coverage Metrics */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getCoverageColor(suite.coverage.inputCoverage)}`}>
                        {suite.coverage.inputCoverage.toFixed(0)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Input Coverage</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getCoverageColor(suite.coverage.outputCoverage)}`}>
                        {suite.coverage.outputCoverage.toFixed(0)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Output Coverage</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getCoverageColor(suite.coverage.edgeCaseCoverage)}`}>
                        {suite.coverage.edgeCaseCoverage.toFixed(0)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Edge Case Coverage</div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-lg font-bold">
                        {suite.performance.averageExecutionTime.toFixed(2)}ms
                      </div>
                      <div className="text-sm text-muted-foreground">Avg Execution</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">
                        {suite.performance.maxExecutionTime.toFixed(2)}ms
                      </div>
                      <div className="text-sm text-muted-foreground">Max Execution</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">
                        {suite.performance.minExecutionTime.toFixed(2)}ms
                      </div>
                      <div className="text-sm text-muted-foreground">Min Execution</div>
                    </div>
                  </div>

                  {/* Test Results */}
                  <div className="space-y-2">
                    <h4 className="font-semibold">Test Results</h4>
                    {suite.testResults.map((result, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getTestResultIcon(result.passed)}
                          <div>
                            <div className="font-medium">{result.testName}</div>
                            {result.errorMessage && (
                              <div className="text-sm text-red-600">{result.errorMessage}</div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {result.executionTime.toFixed(2)}ms
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ±{(result.tolerance * 100).toFixed(1)}% tolerance
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="golden-datasets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2 text-primary" />
                Golden Datasets
              </CardTitle>
              <CardDescription>
                High-quality test datasets for calculator validation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {testData.goldenDatasets.slice(0, 10).map((dataset, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{dataset.name}</h4>
                        <p className="text-sm text-muted-foreground">{dataset.description}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant={dataset.category === 'golden' ? 'default' : 'secondary'}>
                          {dataset.category}
                        </Badge>
                        <Badge variant={dataset.confidence === 'high' ? 'default' : 'outline'}>
                          {dataset.confidence}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Calculator: {dataset.calculator} • Source: {dataset.source}
                    </div>
                  </div>
                ))}
                {testData.goldenDatasets.length > 10 && (
                  <div className="text-center text-muted-foreground">
                    +{testData.goldenDatasets.length - 10} more datasets
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                Testing Recommendations
              </CardTitle>
              <CardDescription>Suggested improvements for calculator testing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testData.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm">{recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}