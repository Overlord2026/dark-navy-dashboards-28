import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Calculator, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Target, 
  BarChart3, 
  FileText,
  Settings,
  PlayCircle,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Calculator {
  id: string;
  name: string;
  description: string;
  category: string;
  complexity: string;
  flag_key: string;
  inputs: any[];
  outputs: any[];
  assumptions: any[];
  tests: any[];
  implementation_status: string;
  last_updated: string;
  maintainer: string;
}

interface CalculatorData {
  calculators: Calculator[];
  analysis: {
    total_calculators: number;
    by_status: Record<string, number>;
    by_complexity: Record<string, number>;
    total_inputs: number;
    total_outputs: number;
    total_tests: number;
    test_coverage: number;
  };
  recommendations: string[];
}

export default function CalculatorInventoryPage() {
  const [calculatorData, setCalculatorData] = useState<CalculatorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCalculator, setSelectedCalculator] = useState<string | null>(null);

  useEffect(() => {
    fetchCalculatorInventory();
  }, []);

  const fetchCalculatorInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: functionError } = await supabase.functions.invoke('calc-inventory');
      
      if (functionError) {
        throw new Error(functionError.message || 'Failed to fetch calculator inventory');
      }
      
      setCalculatorData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'production': return 'bg-green-500';
      case 'tested': return 'bg-blue-500';
      case 'implemented': return 'bg-yellow-500';
      case 'in_progress': return 'bg-orange-500';
      case 'planned': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getComplexityBadge = (complexity: string) => {
    switch (complexity) {
      case 'basic': return <Badge variant="secondary">Basic</Badge>;
      case 'intermediate': return <Badge variant="default">Intermediate</Badge>;
      case 'advanced': return <Badge variant="destructive">Advanced</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading calculator inventory...</span>
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
              Error Loading Calculator Inventory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchCalculatorInventory} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!calculatorData) {
    return null;
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Calculator className="h-8 w-8 mr-3 text-primary" />
              Calculator Inventory
            </h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive analysis of calculator inputs, outputs, assumptions, and tests
            </p>
          </div>
          <Button onClick={fetchCalculatorInventory} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Calculators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculatorData.analysis.total_calculators}</div>
            <p className="text-xs text-muted-foreground">Across all categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Test Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculatorData.analysis.test_coverage.toFixed(1)}%</div>
            <Progress value={calculatorData.analysis.test_coverage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Inputs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculatorData.analysis.total_inputs}</div>
            <p className="text-xs text-muted-foreground">Parameters tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculatorData.analysis.total_tests}</div>
            <p className="text-xs text-muted-foreground">Test cases defined</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="calculators">Calculators</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Implementation Status</CardTitle>
              <CardDescription>Current status of all calculators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(calculatorData.analysis.by_status).map(([status, count]) => (
                  <div key={status} className="text-center">
                    <div className={`w-full h-2 rounded ${getStatusColor(status)} mb-2`}></div>
                    <div className="text-sm font-medium capitalize">{status.replace('_', ' ')}</div>
                    <div className="text-2xl font-bold">{count}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Complexity Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Complexity Distribution</CardTitle>
              <CardDescription>Calculator complexity breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(calculatorData.analysis.by_complexity).map(([complexity, count]) => (
                  <div key={complexity} className="text-center p-4 border rounded-lg">
                    <div className="text-sm font-medium capitalize mb-2">{complexity}</div>
                    <div className="text-3xl font-bold">{count}</div>
                    <div className="text-xs text-muted-foreground">calculators</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculators" className="space-y-6">
          <div className="grid gap-6">
            {calculatorData.calculators.map((calculator) => (
              <Card key={calculator.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <Calculator className="h-5 w-5 mr-2 text-primary" />
                        {calculator.name}
                      </CardTitle>
                      <CardDescription>{calculator.description}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getComplexityBadge(calculator.complexity)}
                      <Badge 
                        variant={calculator.implementation_status === 'production' ? 'default' : 'secondary'}
                        className={getStatusColor(calculator.implementation_status)}
                      >
                        {calculator.implementation_status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="details">
                      <AccordionTrigger>View Details</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Inputs */}
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center">
                              <Settings className="h-4 w-4 mr-2" />
                              Inputs ({calculator.inputs.length})
                            </h4>
                            <div className="space-y-2">
                              {calculator.inputs.slice(0, 3).map((input, index) => (
                                <div key={index} className="text-sm p-2 bg-muted rounded">
                                  <div className="font-medium">{input.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {input.type} • {input.required ? 'Required' : 'Optional'}
                                  </div>
                                </div>
                              ))}
                              {calculator.inputs.length > 3 && (
                                <div className="text-xs text-muted-foreground">
                                  +{calculator.inputs.length - 3} more inputs
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Outputs */}
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center">
                              <BarChart3 className="h-4 w-4 mr-2" />
                              Outputs ({calculator.outputs.length})
                            </h4>
                            <div className="space-y-2">
                              {calculator.outputs.map((output, index) => (
                                <div key={index} className="text-sm p-2 bg-muted rounded">
                                  <div className="font-medium">{output.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {output.type} • {output.format}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Tests */}
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center">
                              <Target className="h-4 w-4 mr-2" />
                              Tests ({calculator.tests.length})
                            </h4>
                            <div className="space-y-2">
                              {calculator.tests.map((test, index) => (
                                <div key={index} className="text-sm p-2 bg-muted rounded">
                                  <div className="font-medium">{test.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {test.category} • ±{test.tolerance * 100}% tolerance
                                  </div>
                                </div>
                              ))}
                              {calculator.tests.length === 0 && (
                                <div className="text-sm text-muted-foreground italic">
                                  No tests defined
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analysis</CardTitle>
              <CardDescription>Comprehensive calculator metrics and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Test Coverage Analysis</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Overall Coverage</span>
                      <span className="font-medium">{calculatorData.analysis.test_coverage.toFixed(1)}%</span>
                    </div>
                    <Progress value={calculatorData.analysis.test_coverage} />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {calculatorData.calculators.filter(c => c.tests.length === 0).length} calculators have no tests
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Implementation Progress</h4>
                  <div className="space-y-2">
                    {Object.entries(calculatorData.analysis.by_status).map(([status, count]) => (
                      <div key={status} className="flex justify-between">
                        <span className="capitalize">{status.replace('_', ' ')}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                Recommendations
              </CardTitle>
              <CardDescription>Suggested improvements for calculator quality</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {calculatorData.recommendations.map((recommendation, index) => (
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