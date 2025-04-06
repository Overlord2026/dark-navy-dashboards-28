
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WifiOff, AlertOctagon, Bug, ShieldX, FileWarning } from 'lucide-react';
import { logger } from '@/services/logging/loggingService';

// Different error types that can be simulated
const ERROR_TYPES = [
  {
    id: 'network',
    name: 'Network Error',
    icon: WifiOff,
    description: 'Simulate network connectivity issues like timeouts, connection refused, etc.',
    scenarios: [
      { id: 'timeout', name: 'Connection Timeout', severity: 'warning' },
      { id: 'connection-refused', name: 'Connection Refused', severity: 'error' },
      { id: 'dns-failure', name: 'DNS Resolution Failure', severity: 'error' },
      { id: 'offline', name: 'Network Offline', severity: 'error' }
    ]
  },
  {
    id: 'api',
    name: 'API Error',
    icon: AlertOctagon,
    description: 'Simulate API response errors like 404, 500, authentication failures, etc.',
    scenarios: [
      { id: '400', name: 'Bad Request (400)', severity: 'warning' },
      { id: '401', name: 'Unauthorized (401)', severity: 'error' },
      { id: '404', name: 'Not Found (404)', severity: 'warning' },
      { id: '500', name: 'Server Error (500)', severity: 'error' }
    ]
  },
  {
    id: 'validation',
    name: 'Validation Error',
    icon: FileWarning,
    description: 'Simulate validation errors for user inputs',
    scenarios: [
      { id: 'required-field', name: 'Required Field Missing', severity: 'warning' },
      { id: 'invalid-format', name: 'Invalid Format', severity: 'warning' },
      { id: 'data-mismatch', name: 'Data Type Mismatch', severity: 'warning' },
      { id: 'constraint-violation', name: 'Constraint Violation', severity: 'error' }
    ]
  },
  {
    id: 'security',
    name: 'Security Error',
    icon: ShieldX,
    description: 'Simulate security-related errors like token invalidation, access denied, etc.',
    scenarios: [
      { id: 'token-expired', name: 'Token Expired', severity: 'warning' },
      { id: 'token-invalid', name: 'Token Invalid', severity: 'error' },
      { id: 'permission-denied', name: 'Permission Denied', severity: 'error' },
      { id: 'suspicious-activity', name: 'Suspicious Activity Detected', severity: 'error' }
    ]
  },
  {
    id: 'runtime',
    name: 'Runtime Error',
    icon: Bug,
    description: 'Simulate runtime JavaScript errors',
    scenarios: [
      { id: 'null-reference', name: 'Null Reference', severity: 'error' },
      { id: 'undefined-property', name: 'Undefined Property', severity: 'error' },
      { id: 'type-error', name: 'Type Error', severity: 'error' },
      { id: 'syntax-error', name: 'Syntax Error', severity: 'error' }
    ]
  }
];

export function ErrorSimulator() {
  const [activeTab, setActiveTab] = useState('network');
  const [selectedScenario, setSelectedScenario] = useState('timeout');
  const [custom, setCustom] = useState({ message: '', code: '', details: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Find the currently selected error type and scenario
  const errorType = ERROR_TYPES.find(type => type.id === activeTab);
  const scenario = errorType?.scenarios.find(s => s.id === selectedScenario);

  // Function to simulate the selected error
  const simulateError = () => {
    setIsLoading(true);

    // Create the error message
    const errorName = `${errorType?.name}: ${scenario?.name}`;
    const errorMessage = custom.message || `Simulated ${errorName}`;
    const errorCode = custom.code || scenario?.id;
    const errorDetails = custom.details || `This is a simulated ${errorType?.name.toLowerCase()} error for testing purposes`;

    // Log the error with appropriate level based on severity
    if (scenario?.severity === 'error') {
      logger.error(errorMessage, { code: errorCode, details: errorDetails }, 'ErrorSimulator');
    } else {
      logger.warning(errorMessage, { code: errorCode, details: errorDetails }, 'ErrorSimulator');
    }

    // Show toast notification
    setTimeout(() => {
      if (scenario?.severity === 'error') {
        toast.error(errorMessage, {
          description: errorDetails,
        });
      } else {
        toast.warning(errorMessage, {
          description: errorDetails,
        });
      }
      setIsLoading(false);
    }, 1000);

    // Return a simulated result based on the error type
    const simulateErrorByType = () => {
      switch (activeTab) {
        case 'network':
          if (selectedScenario === 'offline') {
            // Simulate network offline
            console.warn('Network offline simulation active');
          } else if (selectedScenario === 'timeout') {
            // Simulate request timeout
            console.warn('Network timeout simulation active');
          }
          break;

        case 'api':
          // Show a more realistic API error in console
          console.error('API Error:', {
            status: parseInt(selectedScenario),
            statusText: scenario?.name,
            url: 'https://api.example.com/data',
            message: errorMessage
          });
          break;

        case 'validation':
          // Show validation errors in console
          console.warn('Validation Error:', {
            field: 'username',
            constraints: { [selectedScenario]: errorMessage },
            value: 'invalid_input'
          });
          break;

        case 'security':
          // Show security error in console
          console.error('Security Error:', {
            type: selectedScenario,
            message: errorMessage,
            timestamp: new Date().toISOString()
          });
          break;

        case 'runtime':
          // Simulate actual JavaScript errors in console
          if (selectedScenario === 'null-reference') {
            console.error('Simulated TypeError: Cannot read property of null');
          } else if (selectedScenario === 'undefined-property') {
            console.error('Simulated TypeError: Cannot read property of undefined');
          } else if (selectedScenario === 'type-error') {
            console.error('Simulated TypeError: is not a function');
          } else {
            console.error('Simulated SyntaxError: Unexpected token');
          }
          break;
      }
    };

    simulateErrorByType();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <AlertOctagon className="h-5 w-5 text-yellow-500" />
          Error Simulator
        </CardTitle>
        <CardDescription>
          Simulate various error scenarios to test error handling and logging
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="network" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 mb-4">
            {ERROR_TYPES.map(type => (
              <TabsTrigger key={type.id} value={type.id} className="flex items-center gap-1">
                <type.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{type.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {ERROR_TYPES.map(type => (
            <TabsContent key={type.id} value={type.id} className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">{type.description}</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Error Scenario</label>
                  <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an error scenario" />
                    </SelectTrigger>
                    <SelectContent>
                      {type.scenarios.map(scenario => (
                        <SelectItem key={scenario.id} value={scenario.id}>
                          {scenario.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4 border-t pt-4 mt-4">
                  <h3 className="text-sm font-medium">Custom Error Details</h3>
                  
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="errorMessage">
                        Error Message
                      </label>
                      <Input
                        id="errorMessage"
                        placeholder="Custom error message"
                        value={custom.message}
                        onChange={(e) => setCustom(prev => ({ ...prev, message: e.target.value }))}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="errorCode">
                          Error Code
                        </label>
                        <Input
                          id="errorCode"
                          placeholder="ERR_CODE"
                          value={custom.code}
                          onChange={(e) => setCustom(prev => ({ ...prev, code: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="errorDetails">
                          Additional Details
                        </label>
                        <Input
                          id="errorDetails"
                          placeholder="Additional error context"
                          value={custom.details}
                          onChange={(e) => setCustom(prev => ({ ...prev, details: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  onClick={simulateError} 
                  disabled={isLoading}
                  variant={scenario?.severity === 'error' ? 'destructive' : 'default'}
                >
                  {isLoading ? 'Simulating...' : 'Simulate Error'}
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
