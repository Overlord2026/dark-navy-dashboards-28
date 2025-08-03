import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, AlertCircle, Play, FileText, Upload, Search, Users, Navigation, Smartphone } from "lucide-react";
import { toast } from "sonner";
// import { useRouter } from "@/hooks/useRouter";

interface QATestResult {
  id: string;
  category: string;
  test: string;
  status: 'pass' | 'fail' | 'warning' | 'pending';
  message: string;
  route?: string;
  element?: string;
}

export function AttorneyManualQARunner() {
  const [testResults, setTestResults] = useState<QATestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState('');

  const runNavigationTests = async () => {
    const results: QATestResult[] = [];
    
    // Test Attorney Navigation Routes
    const attorneyRoutes = [
      '/attorney/estate-planning',
      '/attorney/business-law', 
      '/attorney/contracts',
      '/attorney/research'
    ];

    for (const route of attorneyRoutes) {
      setCurrentTest(`Testing navigation to ${route}`);
      
      // Check if route elements exist
      const navLinks = document.querySelectorAll(`[href="${route}"]`);
      
      results.push({
        id: `nav-${route.replace('/', '-')}`,
        category: 'Navigation',
        test: `Navigate to ${route}`,
        status: navLinks.length > 0 ? 'pass' : 'fail',
        message: navLinks.length > 0 
          ? `Navigation link found and accessible`
          : `Navigation link not found for ${route}`,
        route,
        element: `[href="${route}"]`
      });

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return results;
  };

  const runFormTests = async () => {
    const results: QATestResult[] = [];
    
    // Test Form Elements
    const forms = document.querySelectorAll('form, [data-testid*="form"]');
    const inputs = document.querySelectorAll('input, textarea, select');
    const buttons = document.querySelectorAll('button');
    
    results.push({
      id: 'forms-presence',
      category: 'Forms',
      test: 'Form Elements Detection',
      status: forms.length > 0 ? 'pass' : 'warning',
      message: `Found ${forms.length} forms, ${inputs.length} inputs, ${buttons.length} buttons`,
      element: 'form, input, button'
    });

    // Test Form Validation
    const requiredInputs = document.querySelectorAll('input[required], textarea[required]');
    results.push({
      id: 'forms-validation',
      category: 'Forms',
      test: 'Required Field Validation',
      status: requiredInputs.length > 0 ? 'pass' : 'warning',
      message: `${requiredInputs.length} required fields found`,
      element: 'input[required]'
    });

    // Test Form Labels
    const unlabeledInputs = Array.from(inputs).filter(input => {
      const label = document.querySelector(`label[for="${input.id}"]`);
      return !label && !input.getAttribute('aria-label') && !input.getAttribute('placeholder');
    });

    results.push({
      id: 'forms-labels',
      category: 'Forms',
      test: 'Form Field Labels',
      status: unlabeledInputs.length === 0 ? 'pass' : 'fail',
      message: unlabeledInputs.length === 0 
        ? 'All form fields properly labeled'
        : `${unlabeledInputs.length} unlabeled form fields found`,
      element: 'input, label'
    });

    return results;
  };

  const runUploadTests = async () => {
    const results: QATestResult[] = [];
    
    // Test Upload Components
    const fileInputs = document.querySelectorAll('input[type="file"]');
    const uploadButtons = document.querySelectorAll('[data-testid*="upload"], button:contains("upload")');
    const dropzones = document.querySelectorAll('[data-testid*="dropzone"], .dropzone');
    
    results.push({
      id: 'upload-components',
      category: 'File Upload',
      test: 'Upload Components Present',
      status: fileInputs.length > 0 || uploadButtons.length > 0 ? 'pass' : 'warning',
      message: `Found ${fileInputs.length} file inputs, ${uploadButtons.length} upload buttons`,
      element: 'input[type="file"]'
    });

    // Test Drag & Drop Support
    results.push({
      id: 'upload-dragdrop',
      category: 'File Upload',
      test: 'Drag & Drop Support',
      status: dropzones.length > 0 ? 'pass' : 'warning',
      message: dropzones.length > 0 
        ? `${dropzones.length} drag & drop zones found`
        : 'No drag & drop zones detected',
      element: '[data-testid*="dropzone"]'
    });

    return results;
  };

  const runTableTests = async () => {
    const results: QATestResult[] = [];
    
    // Test Table Elements
    const tables = document.querySelectorAll('table, [role="table"]');
    const tableHeaders = document.querySelectorAll('th, [role="columnheader"]');
    const tableRows = document.querySelectorAll('tr, [role="row"]');
    
    results.push({
      id: 'tables-structure',
      category: 'Data Tables',
      test: 'Table Structure',
      status: tables.length > 0 ? 'pass' : 'warning',
      message: `Found ${tables.length} tables with ${tableHeaders.length} headers and ${tableRows.length} rows`,
      element: 'table, th, tr'
    });

    // Test Table Accessibility
    const accessibleTables = Array.from(tables).filter(table => {
      const hasHeaders = table.querySelectorAll('th').length > 0;
      const hasCaption = table.querySelector('caption') !== null;
      return hasHeaders || hasCaption;
    });

    results.push({
      id: 'tables-accessibility',
      category: 'Data Tables',
      test: 'Table Accessibility',
      status: accessibleTables.length === tables.length ? 'pass' : 'warning',
      message: `${accessibleTables.length}/${tables.length} tables have proper headers or captions`,
      element: 'table th, caption'
    });

    return results;
  };

  const runMobileTests = async () => {
    const results: QATestResult[] = [];
    
    // Test Mobile Responsive Elements
    const viewport = window.innerWidth;
    const isMobile = viewport < 768;
    
    results.push({
      id: 'mobile-viewport',
      category: 'Mobile UX',
      test: 'Viewport Detection',
      status: 'pass',
      message: `Current viewport: ${viewport}px (${isMobile ? 'Mobile' : 'Desktop'})`,
      element: 'viewport'
    });

    // Test Touch Targets
    const buttons = document.querySelectorAll('button, a[href], input[type="button"]');
    const smallButtons = Array.from(buttons).filter(btn => {
      const rect = btn.getBoundingClientRect();
      return rect.height < 44 || rect.width < 44;
    });

    results.push({
      id: 'mobile-touch-targets',
      category: 'Mobile UX',
      test: 'Touch Target Size',
      status: smallButtons.length === 0 ? 'pass' : 'fail',
      message: smallButtons.length === 0 
        ? `All ${buttons.length} buttons meet minimum 44px touch target`
        : `${smallButtons.length} buttons below 44px minimum size`,
      element: 'button'
    });

    // Test Mobile Navigation
    const mobileMenus = document.querySelectorAll('[data-testid*="mobile"], .mobile-menu, [aria-label*="mobile"]');
    results.push({
      id: 'mobile-navigation',
      category: 'Mobile UX',
      test: 'Mobile Navigation',
      status: mobileMenus.length > 0 || !isMobile ? 'pass' : 'warning',
      message: isMobile 
        ? `${mobileMenus.length} mobile navigation elements found`
        : 'Desktop viewport - mobile nav not required',
      element: '[data-testid*="mobile"]'
    });

    return results;
  };

  const runSearchTests = async () => {
    const results: QATestResult[] = [];
    
    // Test Search Components
    const searchInputs = document.querySelectorAll('input[type="search"], input[placeholder*="search" i], [data-testid*="search"]');
    const searchButtons = document.querySelectorAll('button:contains("search"), [aria-label*="search" i]');
    
    results.push({
      id: 'search-components',
      category: 'Search',
      test: 'Search Components',
      status: searchInputs.length > 0 ? 'pass' : 'warning',
      message: `Found ${searchInputs.length} search inputs and ${searchButtons.length} search buttons`,
      element: 'input[type="search"]'
    });

    // Test Search Functionality
    if (searchInputs.length > 0) {
      const firstSearch = searchInputs[0] as HTMLInputElement;
      const hasOnChange = firstSearch.onchange !== null || firstSearch.oninput !== null;
      
      results.push({
        id: 'search-functionality',
        category: 'Search',
        test: 'Search Functionality',
        status: hasOnChange ? 'pass' : 'warning',
        message: hasOnChange ? 'Search input has event handlers' : 'Search functionality unclear',
        element: 'search event handlers'
      });
    }

    return results;
  };

  const runWorkflowTests = async () => {
    const results: QATestResult[] = [];
    
    // Test Contract Workflow Elements
    const contractElements = document.querySelectorAll('[data-testid*="contract"], [class*="contract"], button:contains("contract")');
    results.push({
      id: 'workflow-contracts',
      category: 'Attorney Workflows',
      test: 'Contract Workflow Elements',
      status: contractElements.length > 0 ? 'pass' : 'warning',
      message: `${contractElements.length} contract-related elements found`,
      element: '[data-testid*="contract"]'
    });

    // Test Document Management
    const documentElements = document.querySelectorAll('[data-testid*="document"], [class*="document"], button:contains("document")');
    results.push({
      id: 'workflow-documents',
      category: 'Attorney Workflows', 
      test: 'Document Management Elements',
      status: documentElements.length > 0 ? 'pass' : 'warning',
      message: `${documentElements.length} document management elements found`,
      element: '[data-testid*="document"]'
    });

    // Test Client Management
    const clientElements = document.querySelectorAll('[data-testid*="client"], [class*="client"], button:contains("client")');
    results.push({
      id: 'workflow-clients',
      category: 'Attorney Workflows',
      test: 'Client Management Elements', 
      status: clientElements.length > 0 ? 'pass' : 'warning',
      message: `${clientElements.length} client management elements found`,
      element: '[data-testid*="client"]'
    });

    return results;
  };

  const runComprehensiveQA = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    try {
      setCurrentTest('Testing navigation...');
      const navigationResults = await runNavigationTests();
      setTestResults(prev => [...prev, ...navigationResults]);

      setCurrentTest('Testing forms...');
      const formResults = await runFormTests();
      setTestResults(prev => [...prev, ...formResults]);

      setCurrentTest('Testing file uploads...');
      const uploadResults = await runUploadTests();
      setTestResults(prev => [...prev, ...uploadResults]);

      setCurrentTest('Testing data tables...');
      const tableResults = await runTableTests();
      setTestResults(prev => [...prev, ...tableResults]);

      setCurrentTest('Testing mobile experience...');
      const mobileResults = await runMobileTests();
      setTestResults(prev => [...prev, ...mobileResults]);

      setCurrentTest('Testing search functionality...');
      const searchResults = await runSearchTests();
      setTestResults(prev => [...prev, ...searchResults]);

      setCurrentTest('Testing attorney workflows...');
      const workflowResults = await runWorkflowTests();
      setTestResults(prev => [...prev, ...workflowResults]);

      const allResults = [
        ...navigationResults,
        ...formResults,
        ...uploadResults,
        ...tableResults,
        ...mobileResults,
        ...searchResults,
        ...workflowResults
      ];

      const summary = allResults.reduce((acc, test) => {
        acc[test.status]++;
        return acc;
      }, { pass: 0, fail: 0, warning: 0, pending: 0 });

      toast.success(`Manual QA completed: ${summary.pass}/${allResults.length} tests passed`);

    } catch (error) {
      console.error('Manual QA failed:', error);
      toast.error('Manual QA testing encountered an error');
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'fail': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Navigation': return <Navigation className="h-4 w-4" />;
      case 'Forms': return <FileText className="h-4 w-4" />;
      case 'File Upload': return <Upload className="h-4 w-4" />;
      case 'Search': return <Search className="h-4 w-4" />;
      case 'Mobile UX': return <Smartphone className="h-4 w-4" />;
      case 'Attorney Workflows': return <Users className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const testsByCategory = testResults.reduce((acc, test) => {
    if (!acc[test.category]) acc[test.category] = [];
    acc[test.category].push(test);
    return acc;
  }, {} as Record<string, QATestResult[]>);

  const summary = testResults.reduce((acc, test) => {
    acc[test.status]++;
    return acc;
  }, { pass: 0, fail: 0, warning: 0, pending: 0 });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Attorney Portal Manual QA Suite
          </CardTitle>
          <CardDescription>
            Live testing of attorney routes, forms, uploads, and workflows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <Button 
              onClick={runComprehensiveQA}
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              {isRunning ? 'Running QA Tests...' : 'Run Manual QA Suite'}
            </Button>
          </div>

          {isRunning && (
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">Currently testing: {currentTest}</p>
            </div>
          )}

          {testResults.length > 0 && (
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{summary.pass}</div>
                <div className="text-sm text-muted-foreground">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{summary.warning}</div>
                <div className="text-sm text-muted-foreground">Warnings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{summary.fail}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{testResults.length}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {Object.keys(testsByCategory).length > 0 && (
        <Tabs defaultValue={Object.keys(testsByCategory)[0]} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            {Object.keys(testsByCategory).map((category) => (
              <TabsTrigger key={category} value={category} className="text-xs">
                {category.replace('Attorney ', '')}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(testsByCategory).map(([category, tests]) => (
            <TabsContent key={category} value={category} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getCategoryIcon(category)}
                    {category} Tests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tests.map((test, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(test.status)}
                          <div>
                            <h4 className="font-medium text-sm">{test.test}</h4>
                            <p className="text-xs text-muted-foreground">{test.message}</p>
                            {test.element && (
                              <p className="text-xs text-muted-foreground">Element: {test.element}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            test.status === 'pass' ? 'default' :
                            test.status === 'warning' ? 'secondary' : 'destructive'
                          }>
                            {test.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Manual Testing Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Manual Testing Checklist</CardTitle>
          <CardDescription>Additional manual tests to complete</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">Navigation & Routing</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Navigate through all attorney dashboard routes</li>
                <li>• Test breadcrumb navigation</li>
                <li>• Verify no dead-end pages</li>
                <li>• Test browser back/forward buttons</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Document Workflows</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Upload PDF, DOC, DOCX files</li>
                <li>• Test file preview functionality</li>
                <li>• Verify download/export features</li>
                <li>• Test document sharing with clients</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Mobile Experience</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Test on mobile device or DevTools</li>
                <li>• Verify touch gestures work</li>
                <li>• Check responsive layout breakpoints</li>
                <li>• Test mobile file upload flow</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Role-Based Access</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Verify attorney-only features restricted</li>
                <li>• Test client portal access permissions</li>
                <li>• Check secure messaging functionality</li>
                <li>• Verify document privilege controls</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}