import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Calculator, 
  FileUp, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Play,
  Download,
  User,
  Shield
} from 'lucide-react';
import { useValidationRunner } from '@/hooks/useValidationRunner';

export function CalculatorValidationSuite() {
  const {
    isRunning,
    currentTest,
    progress,
    results,
    runValidationSuite,
    generateReport
  } = useValidationRunner();

  const [selectedPersona, setSelectedPersona] = useState<string>('all');

  const personas = [
    { id: 'client_basic', label: 'Client Basic', icon: User },
    { id: 'client_premium', label: 'Client Premium', icon: User },
    { id: 'advisor', label: 'Financial Advisor', icon: Shield },
    { id: 'accountant', label: 'Accountant', icon: Shield },
    { id: 'attorney', label: 'Attorney', icon: Shield },
    { id: 'consultant', label: 'Consultant', icon: Shield },
    { id: 'admin', label: 'Administrator', icon: Shield },
    { id: 'system_administrator', label: 'System Admin', icon: Shield }
  ];

  const calculatorTools = [
    { 
      id: 'roth_conversion', 
      name: 'Roth Conversion Analyzer',
      route: '/tax-planning',
      component: 'RothConversionAnalyzer',
      requiredRoles: ['advisor', 'client_premium', 'admin'],
      testData: {
        currentAge: 45,
        conversionAmount: 50000,
        currentTaxRate: 0.24,
        retirementTaxRate: 0.22
      }
    },
    { 
      id: 'withdrawal_sequencer', 
      name: 'Withdrawal Sequencer',
      route: '/retirement-planning',
      component: 'WithdrawalSequencer',
      requiredRoles: ['advisor', 'client_premium', 'admin'],
      testData: {
        retirementAge: 65,
        totalRetirementSavings: 1000000,
        annualExpenses: 80000
      }
    },
    { 
      id: 'tax_analyzer', 
      name: 'Tax Analyzer',
      route: '/tax-planning',
      component: 'UnifiedTaxAnalyzer',
      requiredRoles: ['advisor', 'accountant', 'client_premium', 'admin'],
      testData: {
        income: 150000,
        filingStatus: 'married',
        deductions: 25000
      }
    },
    { 
      id: 'property_valuation', 
      name: 'Property Valuation',
      route: '/property-management',
      component: 'PropertyLookupTool',
      requiredRoles: ['advisor', 'client_premium', 'admin'],
      testData: {
        address: '123 Main St, Anytown, CA 90210'
      }
    },
    { 
      id: 'portfolio_analyzer', 
      name: 'Portfolio Analyzer',
      route: '/advisor-dashboard',
      component: 'PortfolioToolsModal',
      requiredRoles: ['advisor', 'admin'],
      testData: {
        portfolioValue: 500000,
        riskTolerance: 'moderate',
        timeHorizon: 20
      }
    }
  ];

  const fileUploadTests = [
    {
      id: 'tax_return_upload',
      name: 'Tax Return Upload',
      acceptedTypes: ['.pdf', '.png', '.jpg'],
      maxSize: '10MB',
      requiredRoles: ['accountant', 'client_premium', 'advisor', 'admin'],
      testFiles: ['sample_tax_return.pdf', 'w2_form.pdf']
    },
    {
      id: 'contract_upload',
      name: 'Contract Upload',
      acceptedTypes: ['.pdf', '.doc', '.docx'],
      maxSize: '25MB',
      requiredRoles: ['attorney', 'advisor', 'client_premium', 'admin'],
      testFiles: ['sample_contract.pdf', 'legal_document.docx']
    },
    {
      id: 'bank_statement_upload',
      name: 'Bank Statement Upload',
      acceptedTypes: ['.pdf', '.csv', '.xlsx'],
      maxSize: '5MB',
      requiredRoles: ['advisor', 'accountant', 'client_premium', 'admin'],
      testFiles: ['bank_statement.pdf', 'transactions.csv']
    },
    {
      id: 'identity_document_upload',
      name: 'Identity Document Upload',
      acceptedTypes: ['.pdf', '.png', '.jpg'],
      maxSize: '5MB',
      requiredRoles: ['advisor', 'attorney', 'accountant', 'admin'],
      testFiles: ['drivers_license.pdf', 'passport.jpg']
    }
  ];

  const handleRunValidation = async () => {
    await runValidationSuite(selectedPersona === 'all' ? undefined : selectedPersona);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'fail': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return null;
    }
  };

  const getSummaryStats = () => {
    if (!results) return { total: 0, passed: 0, failed: 0, warnings: 0 };
    
    const allTests = Object.values(results).flat();
    return {
      total: allTests.length,
      passed: allTests.filter(t => t.status === 'pass').length,
      failed: allTests.filter(t => t.status === 'fail').length,
      warnings: allTests.filter(t => t.status === 'warning').length
    };
  };

  const stats = getSummaryStats();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Calculator & Upload Validation Suite
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Test Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Select Persona(s) to Test:</label>
            <select 
              value={selectedPersona}
              onChange={(e) => setSelectedPersona(e.target.value)}
              className="w-full p-2 border rounded-md"
              disabled={isRunning}
            >
              <option value="all">All Personas</option>
              {personas.map(persona => (
                <option key={persona.id} value={persona.id}>
                  {persona.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleRunValidation}
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              {isRunning ? 'Running Tests...' : 'Run Validation'}
            </Button>
            
            {results && (
              <Button
                variant="outline"
                onClick={generateReport}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export Report
              </Button>
            )}
          </div>
        </div>

        {/* Progress */}
        {isRunning && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Validation Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
            {currentTest && (
              <p className="text-sm text-muted-foreground">
                Currently testing: {currentTest}
              </p>
            )}
          </div>
        )}

        {/* Summary Stats */}
        {results && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Tests</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.passed}</div>
                <div className="text-sm text-muted-foreground">Passed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.warnings}</div>
                <div className="text-sm text-muted-foreground">Warnings</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Calculator Tools Overview */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Calculator Tools to Test</h3>
          <div className="grid gap-3">
            {calculatorTools.map(tool => (
              <Card key={tool.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    <span className="font-medium">{tool.name}</span>
                  </div>
                  <div className="flex gap-1">
                    {tool.requiredRoles.map(role => (
                      <Badge key={role} variant="outline" className="text-xs">
                        {role.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* File Upload Tests Overview */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">File Upload Tests</h3>
          <div className="grid gap-3">
            {fileUploadTests.map(test => (
              <Card key={test.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileUp className="h-4 w-4" />
                    <span className="font-medium">{test.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {test.maxSize}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    {test.requiredRoles.map(role => (
                      <Badge key={role} variant="outline" className="text-xs">
                        {role.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Results */}
        {results && (
          <Tabs defaultValue="calculators" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="calculators">Calculator Tests</TabsTrigger>
              <TabsTrigger value="uploads">Upload Tests</TabsTrigger>
              <TabsTrigger value="personas">By Persona</TabsTrigger>
            </TabsList>

            <TabsContent value="calculators" className="space-y-4">
              <div className="grid gap-4">
                {calculatorTools.map(tool => {
                  const toolTests = Object.values(results).flat().filter(t => 
                    t.category === 'calculator' && t.toolId === tool.id
                  );
                  
                  return (
                    <Card key={tool.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Calculator className="h-4 w-4" />
                            <span className="font-medium">{tool.name}</span>
                          </div>
                          <Badge variant={toolTests.some(t => t.status === 'fail') ? "destructive" : 
                                        toolTests.some(t => t.status === 'warning') ? "secondary" : "default"}>
                            {toolTests.some(t => t.status === 'fail') ? "Failed" : 
                             toolTests.some(t => t.status === 'warning') ? "Warning" : "Passed"}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          {toolTests.map((test, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(test.status)}
                                <span className="text-sm">{test.name}</span>
                              </div>
                              <Badge variant="outline">
                                {test.persona}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="uploads" className="space-y-4">
              <div className="grid gap-4">
                {fileUploadTests.map(test => {
                  const uploadTests = Object.values(results).flat().filter(t => 
                    t.category === 'file_upload' && t.toolId === test.id
                  );
                  
                  return (
                    <Card key={test.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <FileUp className="h-4 w-4" />
                            <span className="font-medium">{test.name}</span>
                          </div>
                          <Badge variant={uploadTests.some(t => t.status === 'fail') ? "destructive" : 
                                        uploadTests.some(t => t.status === 'warning') ? "secondary" : "default"}>
                            {uploadTests.some(t => t.status === 'fail') ? "Failed" : 
                             uploadTests.some(t => t.status === 'warning') ? "Warning" : "Passed"}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          {uploadTests.map((test, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(test.status)}
                                <span className="text-sm">{test.name}</span>
                              </div>
                              <Badge variant="outline">
                                {test.persona}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="personas" className="space-y-4">
              <div className="grid gap-4">
                {personas.map(persona => {
                  const personaTests = results[persona.id] || [];
                  const passed = personaTests.filter(t => t.status === 'pass').length;
                  const failed = personaTests.filter(t => t.status === 'fail').length;
                  const warnings = personaTests.filter(t => t.status === 'warning').length;
                  
                  return (
                    <Card key={persona.id}>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <persona.icon className="h-4 w-4" />
                            {persona.label}
                          </div>
                          <Badge 
                            variant={failed > 0 ? "destructive" : warnings > 0 ? "secondary" : "default"}
                          >
                            {failed > 0 ? "Failed" : warnings > 0 ? "Warning" : "Passed"}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {personaTests.map((test, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(test.status)}
                                <span className="text-sm">{test.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">
                                  {test.category}
                                </Badge>
                                {test.error && (
                                  <Badge variant="destructive" className="text-xs">
                                    Error
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Instructions */}
        {!results && !isRunning && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This validation suite will systematically test all calculator tools (Roth Conversion Analyzer, 
              Withdrawal Sequencer, Tax Analyzer, Property Valuation, Portfolio tools) and file upload 
              functionality across all user personas. Select a persona or test all at once.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}