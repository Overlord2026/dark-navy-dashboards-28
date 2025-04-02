
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, CheckCircle, RotateCw, XCircle } from 'lucide-react';
import { logger } from '@/services/logging/loggingService';

type DiagnosticResult = {
  status: 'success' | 'warning' | 'error';
  message: string;
  details?: string;
};

export const SidebarDiagnostics: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [lastRunTime, setLastRunTime] = useState<string | null>(null);

  const runDiagnostics = async () => {
    setIsRunning(true);
    setResults([]);
    logger.debug('Starting sidebar diagnostics', {}, 'SidebarDiagnostics');
    
    try {
      // Perform a series of diagnostic checks
      const diagnosticResults: DiagnosticResult[] = [];
      
      // Check if relevant sidebar elements are in the DOM
      const sidebarElement = document.querySelector('[data-sidebar="main-sidebar"]');
      diagnosticResults.push({
        status: sidebarElement ? 'success' : 'error',
        message: sidebarElement ? 'Sidebar component found in DOM' : 'Sidebar component not found in DOM',
      });
      
      // Check for Banking menu
      const bankingMenu = document.querySelector('[data-nav-item="Banking"]');
      diagnosticResults.push({
        status: bankingMenu ? 'success' : 'error',
        message: bankingMenu ? 'Banking menu item found' : 'Banking menu item not found',
        details: bankingMenu ? `Data attributes: ${JSON.stringify(Array.from(bankingMenu.attributes).reduce((obj, attr) => ({ ...obj, [attr.name]: attr.value }), {}))}` : undefined
      });
      
      // Check Banking submenu trigger
      const bankingSubmenuTrigger = document.querySelector('[data-submenu-trigger="Banking"]');
      diagnosticResults.push({
        status: bankingSubmenuTrigger ? 'success' : 'warning',
        message: bankingSubmenuTrigger ? 'Banking submenu trigger found' : 'Banking submenu trigger not found',
      });
      
      // Check Banking submenu content
      const bankingSubmenuContent = document.querySelector('[data-submenu-content="Banking"]');
      const bankingTriggerExpanded = bankingSubmenuTrigger?.getAttribute('data-expanded') === 'true';
      
      if (bankingSubmenuTrigger) {
        diagnosticResults.push({
          status: bankingTriggerExpanded === !!bankingSubmenuContent ? 'success' : 'error',
          message: bankingTriggerExpanded === !!bankingSubmenuContent 
            ? `Banking submenu visibility matches trigger state (${bankingTriggerExpanded ? 'expanded' : 'collapsed'})` 
            : `Banking submenu visibility (${!!bankingSubmenuContent ? 'visible' : 'hidden'}) doesn't match trigger state (${bankingTriggerExpanded ? 'expanded' : 'collapsed'})`,
        });
      }
      
      // Check all category components are rendered
      const categoriesRendered = document.querySelectorAll('[data-component-rendered="true"]');
      diagnosticResults.push({
        status: categoriesRendered.length >= 4 ? 'success' : 'warning',
        message: `${categoriesRendered.length} out of 4 categories rendered`,
      });
      
      // Check for expanded categories
      const expandedCategories = document.querySelectorAll('[data-sidebar-category][data-expanded="true"]');
      diagnosticResults.push({
        status: expandedCategories.length > 0 ? 'success' : 'warning',
        message: `${expandedCategories.length} categories are expanded`,
        details: Array.from(expandedCategories).map(el => el.getAttribute('data-sidebar-category')).join(', ')
      });
    
      setResults(diagnosticResults);
      logger.debug('Sidebar diagnostics complete', { 
        resultCount: diagnosticResults.length,
        success: diagnosticResults.filter(r => r.status === 'success').length,
        warnings: diagnosticResults.filter(r => r.status === 'warning').length,
        errors: diagnosticResults.filter(r => r.status === 'error').length,
      }, 'SidebarDiagnostics');
      
      setLastRunTime(new Date().toLocaleTimeString());
    } catch (error) {
      logger.error('Error running sidebar diagnostics', error, 'SidebarDiagnostics');
      setResults([
        {
          status: 'error',
          message: 'Error running diagnostics',
          details: error instanceof Error ? error.message : String(error)
        }
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  // Automatically run diagnostics on component mount
  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusIcon = (status: 'success' | 'warning' | 'error') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>Sidebar Diagnostics</span>
          {lastRunTime && <span className="text-sm font-normal text-muted-foreground">Last run: {lastRunTime}</span>}
        </CardTitle>
        <CardDescription>
          Run diagnostics to identify issues with the sidebar menu system
        </CardDescription>
      </CardHeader>
      <CardContent>
        {results.length > 0 ? (
          <div className="space-y-2">
            {results.map((result, index) => (
              <div key={index} className="p-3 rounded-md border" style={{ borderColor: result.status === 'success' ? '#22c55e' : result.status === 'warning' ? '#f59e0b' : '#ef4444' }}>
                <div className="flex items-start gap-2">
                  {getStatusIcon(result.status)}
                  <div>
                    <p className="font-medium">{result.message}</p>
                    {result.details && <p className="text-sm text-muted-foreground mt-1">{result.details}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : isRunning ? (
          <div className="flex flex-col items-center justify-center py-4">
            <RotateCw className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2">Running diagnostics...</p>
          </div>
        ) : (
          <Alert>
            <AlertTitle>No diagnostic results</AlertTitle>
            <AlertDescription>
              Click the button below to run sidebar diagnostics
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={runDiagnostics} 
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? (
            <>
              <RotateCw className="mr-2 h-4 w-4 animate-spin" />
              Running...
            </>
          ) : (
            'Run Diagnostics'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
