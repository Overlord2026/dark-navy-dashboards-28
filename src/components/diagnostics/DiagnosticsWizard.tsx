
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApiEndpointDiagnostics } from './ApiEndpointDiagnostics';
import { FormValidationTests } from './FormValidationTests';
import { NavigationTests } from './NavigationTests';
import { PerformanceTests } from './PerformanceTests';
import { SecurityTests } from './SecurityTests';
import { 
  AlertTriangle, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  FileWarning, 
  Shield, 
  Wrench, 
  Zap 
} from 'lucide-react';
import { toast } from 'sonner';
import { DiagnosticResultSummary } from '@/types/diagnostics';

interface DiagnosticsWizardProps {
  onClose: () => void;
  onComplete: () => void;
}

export const DiagnosticsWizard: React.FC<DiagnosticsWizardProps> = ({
  onClose,
  onComplete,
}) => {
  const [activeTab, setActiveTab] = useState("intro");
  const [diagnosticSummary, setDiagnosticSummary] = useState<DiagnosticResultSummary | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const runAllTests = () => {
    setIsRunning(true);
    setProgress(0);
    
    toast.info("Running comprehensive diagnostics...");
    
    // Simulate tests running with progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          setActiveTab("results");
          toast.success("Diagnostics completed!");
          
          // Mock results
          setDiagnosticSummary({
            apiTests: { passed: 8, failed: 2, total: 10 },
            formValidationTests: { passed: 5, failed: 0, total: 5 },
            navigationTests: { passed: 12, failed: 1, total: 13 },
            performanceTests: { passed: 6, failed: 2, total: 8 },
            securityTests: { passed: 7, failed: 0, total: 7 },
            timestamp: new Date().toISOString(),
            recommendations: [
              {
                id: 'rec-1',
                title: 'Optimize API response times',
                priority: 'medium',
                description: 'Several API endpoints are responding slower than the recommended threshold',
                actionable: true
              },
              {
                id: 'rec-2',
                title: 'Fix broken navigation link',
                priority: 'high',
                description: 'The profile settings link is not navigating correctly',
                actionable: true
              }
            ]
          });
          
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };

  const tabs = [
    { id: "intro", label: "Introduction" },
    { id: "api-tests", label: "API Tests" },
    { id: "validation-tests", label: "Form Validation" },
    { id: "navigation-tests", label: "Navigation" },
    { id: "performance-tests", label: "Performance" },
    { id: "security-tests", label: "Security" },
    { id: "results", label: "Results" },
  ];
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-7 mb-6">
          {tabs.map((tab) => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id}
              disabled={isRunning}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="intro">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-2 rounded-full mr-4">
                  <Wrench className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold">System Diagnostics Wizard</h2>
              </div>
              
              <p className="mb-6 text-gray-600">
                This wizard will help you diagnose and fix potential issues with your Family Office Marketplace integration. 
                It will test various aspects of your system including API connections, form validation, navigation, 
                performance metrics, and security features.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="bg-amber-100 p-2 rounded-full mr-4 mt-1">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">API Diagnostics</h3>
                    <p className="text-sm text-gray-600">Tests connectivity and response times for all integrated APIs</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-purple-100 p-2 rounded-full mr-4 mt-1">
                    <FileWarning className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Form Validation</h3>
                    <p className="text-sm text-gray-600">Ensures all forms work correctly with proper error handling</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-4 mt-1">
                    <Zap className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Navigation & Routing</h3>
                    <p className="text-sm text-gray-600">Validates all navigation paths work as expected</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-teal-100 p-2 rounded-full mr-4 mt-1">
                    <Check className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Performance Metrics</h3>
                    <p className="text-sm text-gray-600">Measures load times, rendering performance, and overall responsiveness</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-rose-100 p-2 rounded-full mr-4 mt-1">
                    <Shield className="h-5 w-5 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Security Tests</h3>
                    <p className="text-sm text-gray-600">Checks for proper authentication, authorization, and data protection</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <div className="space-x-2">
                  <Button 
                    onClick={() => setActiveTab("api-tests")}
                    variant="outline"
                  >
                    Step by Step
                  </Button>
                  <Button 
                    onClick={runAllTests}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={isRunning}
                  >
                    {isRunning ? (
                      <>
                        Running Tests... {progress}%
                        <div className="ml-2 h-4 w-24 bg-blue-300 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-white transition-all duration-300" 
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </>
                    ) : (
                      "Run All Tests"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api-tests">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <div className="bg-amber-100 p-2 rounded-full mr-4">
                  <Wrench className="h-6 w-6 text-amber-600" />
                </div>
                <h2 className="text-2xl font-semibold">API Diagnostics</h2>
              </div>
              
              <ApiEndpointDiagnostics />
              
              <div className="flex justify-between mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("intro")}
                  className="flex items-center"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button 
                  onClick={() => setActiveTab("validation-tests")}
                  className="flex items-center"
                >
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="validation-tests">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-2 rounded-full mr-4">
                  <FileWarning className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-semibold">Form Validation Tests</h2>
              </div>
              
              <FormValidationTests />
              
              <div className="flex justify-between mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("api-tests")}
                  className="flex items-center"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button 
                  onClick={() => setActiveTab("navigation-tests")}
                  className="flex items-center"
                >
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="navigation-tests">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-2 rounded-full mr-4">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold">Navigation Tests</h2>
              </div>
              
              <NavigationTests />
              
              <div className="flex justify-between mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("validation-tests")}
                  className="flex items-center"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button 
                  onClick={() => setActiveTab("performance-tests")}
                  className="flex items-center"
                >
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance-tests">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <div className="bg-teal-100 p-2 rounded-full mr-4">
                  <Check className="h-6 w-6 text-teal-600" />
                </div>
                <h2 className="text-2xl font-semibold">Performance Tests</h2>
              </div>
              
              <PerformanceTests />
              
              <div className="flex justify-between mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("navigation-tests")}
                  className="flex items-center"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button 
                  onClick={() => setActiveTab("security-tests")}
                  className="flex items-center"
                >
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security-tests">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <div className="bg-rose-100 p-2 rounded-full mr-4">
                  <Shield className="h-6 w-6 text-rose-600" />
                </div>
                <h2 className="text-2xl font-semibold">Security Tests</h2>
              </div>
              
              <SecurityTests />
              
              <div className="flex justify-between mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("performance-tests")}
                  className="flex items-center"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button 
                  onClick={runAllTests}
                  className="flex items-center"
                >
                  Complete All Tests
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="results">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-2 rounded-full mr-4">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold">Diagnostic Results</h2>
              </div>
              
              {diagnosticSummary && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <Card className="bg-gradient-to-br from-amber-50 to-amber-100">
                      <CardContent className="p-4">
                        <h3 className="text-sm font-medium text-amber-800">API Tests</h3>
                        <div className="flex items-end justify-between mt-2">
                          <div className="text-2xl font-bold text-amber-900">
                            {diagnosticSummary.apiTests.passed}/{diagnosticSummary.apiTests.total}
                          </div>
                          <div className="text-sm text-amber-700">
                            {Math.round((diagnosticSummary.apiTests.passed / diagnosticSummary.apiTests.total) * 100)}% pass
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
                      <CardContent className="p-4">
                        <h3 className="text-sm font-medium text-purple-800">Form Validation</h3>
                        <div className="flex items-end justify-between mt-2">
                          <div className="text-2xl font-bold text-purple-900">
                            {diagnosticSummary.formValidationTests.passed}/{diagnosticSummary.formValidationTests.total}
                          </div>
                          <div className="text-sm text-purple-700">
                            {Math.round((diagnosticSummary.formValidationTests.passed / diagnosticSummary.formValidationTests.total) * 100)}% pass
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-br from-green-50 to-green-100">
                      <CardContent className="p-4">
                        <h3 className="text-sm font-medium text-green-800">Navigation</h3>
                        <div className="flex items-end justify-between mt-2">
                          <div className="text-2xl font-bold text-green-900">
                            {diagnosticSummary.navigationTests.passed}/{diagnosticSummary.navigationTests.total}
                          </div>
                          <div className="text-sm text-green-700">
                            {Math.round((diagnosticSummary.navigationTests.passed / diagnosticSummary.navigationTests.total) * 100)}% pass
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-br from-teal-50 to-teal-100">
                      <CardContent className="p-4">
                        <h3 className="text-sm font-medium text-teal-800">Performance</h3>
                        <div className="flex items-end justify-between mt-2">
                          <div className="text-2xl font-bold text-teal-900">
                            {diagnosticSummary.performanceTests.passed}/{diagnosticSummary.performanceTests.total}
                          </div>
                          <div className="text-sm text-teal-700">
                            {Math.round((diagnosticSummary.performanceTests.passed / diagnosticSummary.performanceTests.total) * 100)}% pass
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-br from-rose-50 to-rose-100">
                      <CardContent className="p-4">
                        <h3 className="text-sm font-medium text-rose-800">Security</h3>
                        <div className="flex items-end justify-between mt-2">
                          <div className="text-2xl font-bold text-rose-900">
                            {diagnosticSummary.securityTests.passed}/{diagnosticSummary.securityTests.total}
                          </div>
                          <div className="text-sm text-rose-700">
                            {Math.round((diagnosticSummary.securityTests.passed / diagnosticSummary.securityTests.total) * 100)}% pass
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Recommendations</h3>
                    <div className="space-y-4">
                      {diagnosticSummary.recommendations.map((rec) => (
                        <Card key={rec.id} className={`
                          ${rec.priority === 'high' ? 'border-l-4 border-l-red-500' : ''}
                          ${rec.priority === 'medium' ? 'border-l-4 border-l-amber-500' : ''}
                          ${rec.priority === 'low' ? 'border-l-4 border-l-blue-500' : ''}
                        `}>
                          <CardContent className="p-4">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{rec.title}</h4>
                              <span className={`
                                text-xs px-2 py-1 rounded-full
                                ${rec.priority === 'high' ? 'bg-red-100 text-red-700' : ''}
                                ${rec.priority === 'medium' ? 'bg-amber-100 text-amber-700' : ''}
                                ${rec.priority === 'low' ? 'bg-blue-100 text-blue-700' : ''}
                              `}>
                                {rec.priority} priority
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                            {rec.actionable && (
                              <Button size="sm" variant="outline" className="mt-2">
                                Fix Issue
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("security-tests")}
                  className="flex items-center"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button 
                  onClick={onComplete}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Complete
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DiagnosticsWizard;
