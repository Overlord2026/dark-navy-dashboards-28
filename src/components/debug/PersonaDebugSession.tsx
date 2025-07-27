import React, { useState, useEffect } from 'react';
import { useRoleContext } from '@/context/RoleContext';
import { useUser } from '@/context/UserContext';
import { getRoleNavigation } from '@/utils/roleNavigation';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PersonaDebugSummary } from './PersonaDebugSummary';
import { 
  PlayCircle, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  User, 
  Navigation, 
  Route,
  Shield,
  Bug,
  RefreshCw
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

interface PersonaTestResult {
  persona: string;
  tier?: 'basic' | 'premium';
  navigationItems: number;
  dashboardRoute: string;
  accessGranted: boolean;
  issues: string[];
  details: {
    navigation: any[];
    routeExists: boolean;
    roleCheck: boolean;
    tierCheck: boolean;
    componentRenders: boolean;
  };
}

const PERSONAS_TO_TEST = [
  { role: 'client', tier: 'basic', name: 'Client Basic' },
  { role: 'client', tier: 'premium', name: 'Client Premium' },
  { role: 'advisor', name: 'Advisor' },
  { role: 'accountant', name: 'Accountant' },
  { role: 'consultant', name: 'Consultant' },
  { role: 'attorney', name: 'Attorney' },
  { role: 'admin', name: 'Admin' },
  { role: 'tenant_admin', name: 'Tenant Admin' },
  { role: 'system_administrator', name: 'System Administrator' }
];

export function PersonaDebugSession() {
  const { 
    setEmulatedRole, 
    setClientTier, 
    getCurrentRole, 
    getCurrentClientTier, 
    isDevMode, 
    getRoleDashboard 
  } = useRoleContext();
  const { userProfile } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<PersonaTestResult[]>([]);
  const [currentTest, setCurrentTest] = useState<string | null>(null);
  const [expandedResults, setExpandedResults] = useState<Record<string, boolean>>({});
  const [showSummary, setShowSummary] = useState(false);

  if (!isDevMode) return null;

  const runFullDebugSession = async () => {
    setIsRunning(true);
    setResults([]);
    
    const testResults: PersonaTestResult[] = [];

    for (const persona of PERSONAS_TO_TEST) {
      setCurrentTest(persona.name);
      
      // Emulate the role
      setEmulatedRole(persona.role);
      if (persona.tier) {
        setClientTier(persona.tier as 'basic' | 'premium');
      }
      
      // Wait for role context to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Get navigation for this role
      const navigation = getRoleNavigation(persona.role, persona.tier as 'basic' | 'premium');
      const dashboardRoute = getRoleDashboard(persona.role);
      
      // Test access control
      const issues: string[] = [];
      let accessGranted = true;
      
      // Check if navigation exists
      if (navigation.length === 0) {
        issues.push('No navigation items found for this role');
        accessGranted = false;
      }
      
      // Check if dashboard route exists
      let routeExists = true;
      if (!dashboardRoute || dashboardRoute === '/') {
        issues.push('No specific dashboard route configured');
        routeExists = false;
      }
      
      // Check role validation
      const currentRole = getCurrentRole();
      const currentTier = getCurrentClientTier();
      
      let roleCheck = currentRole === persona.role;
      let tierCheck = !persona.tier || currentTier === persona.tier;
      
      if (!roleCheck) {
        issues.push(`Role mismatch: expected ${persona.role}, got ${currentRole}`);
        accessGranted = false;
      }
      
      if (!tierCheck) {
        issues.push(`Tier mismatch: expected ${persona.tier}, got ${currentTier}`);
        accessGranted = false;
      }

      // Test component rendering (simplified check)
      let componentRenders = true;
      try {
        // This is a basic check - in a real scenario we'd mount the component
        if (dashboardRoute && !dashboardRoute.includes(persona.role)) {
          componentRenders = false;
          issues.push('Dashboard route does not match role pattern');
        }
      } catch (error) {
        componentRenders = false;
        issues.push(`Component render error: ${error}`);
      }

      const result: PersonaTestResult = {
        persona: persona.name,
        tier: persona.tier as 'basic' | 'premium' | undefined,
        navigationItems: navigation.length,
        dashboardRoute,
        accessGranted,
        issues,
        details: {
          navigation,
          routeExists,
          roleCheck,
          tierCheck,
          componentRenders
        }
      };
      
      testResults.push(result);
      setResults([...testResults]);
      
      // Brief pause between tests
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setCurrentTest(null);
    setIsRunning(false);
  };

  const testSpecificPersona = (persona: typeof PERSONAS_TO_TEST[0]) => {
    setEmulatedRole(persona.role);
    if (persona.tier) {
      setClientTier(persona.tier as 'basic' | 'premium');
    }
    
    // Navigate to the dashboard
    const dashboardRoute = getRoleDashboard(persona.role);
    if (dashboardRoute && dashboardRoute !== '/') {
      navigate(dashboardRoute);
    }
  };

  const getStatusIcon = (result: PersonaTestResult) => {
    if (result.accessGranted && result.issues.length === 0) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (result.accessGranted && result.issues.length > 0) {
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    } else {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const toggleExpanded = (persona: string) => {
    setExpandedResults(prev => ({
      ...prev,
      [persona]: !prev[persona]
    }));
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-md">
      <Card className="bg-background border shadow-xl">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Bug className="h-4 w-4" />
              Persona Debug Session
            </h3>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowSummary(!showSummary)}
                size="sm"
                variant="ghost"
              >
                Analysis
              </Button>
              <Button
                onClick={runFullDebugSession}
                disabled={isRunning}
                size="sm"
                variant="outline"
              >
                {isRunning ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <PlayCircle className="h-4 w-4 mr-2" />
                )}
                {isRunning ? 'Running...' : 'Run Full Test'}
              </Button>
            </div>
          </div>

          {showSummary && (
            <div className="mb-4 max-h-64 overflow-y-auto">
              <PersonaDebugSummary />
            </div>
          )}

          {currentTest && (
            <div className="mb-4 p-2 bg-muted rounded text-sm">
              Currently testing: <strong>{currentTest}</strong>
            </div>
          )}

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {PERSONAS_TO_TEST.map((persona) => {
              const result = results.find(r => r.persona === persona.name);
              const isExpanded = expandedResults[persona.name];
              
              return (
                <div key={persona.name} className="border border-border rounded">
                  <Collapsible>
                    <CollapsibleTrigger 
                      className="w-full"
                      onClick={() => toggleExpanded(persona.name)}
                    >
                      <div className="flex items-center justify-between p-3 hover:bg-muted/50">
                        <div className="flex items-center gap-3">
                          {result ? getStatusIcon(result) : <User className="h-4 w-4 text-muted-foreground" />}
                          <div className="text-left">
                            <div className="font-medium text-sm">{persona.name}</div>
                            {result && (
                              <div className="text-xs text-muted-foreground">
                                {result.navigationItems} nav items • {result.issues.length} issues
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              testSpecificPersona(persona);
                            }}
                            size="sm"
                            variant="ghost"
                            className="text-xs"
                          >
                            Test
                          </Button>
                          <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    
                    {result && (
                      <CollapsibleContent>
                        <div className="p-3 border-t border-border bg-muted/20">
                          <div className="space-y-3 text-xs">
                            {/* Navigation Status */}
                            <div className="flex items-center gap-2">
                              <Navigation className="h-3 w-3" />
                              <span className="font-medium">Navigation:</span>
                              <Badge variant={result.navigationItems > 0 ? "default" : "destructive"}>
                                {result.navigationItems} items
                              </Badge>
                            </div>

                            {/* Dashboard Route */}
                            <div className="flex items-center gap-2">
                              <Route className="h-3 w-3" />
                              <span className="font-medium">Dashboard:</span>
                              <code className="text-xs bg-muted px-1 rounded">
                                {result.dashboardRoute || 'none'}
                              </code>
                            </div>

                            {/* Access Control */}
                            <div className="flex items-center gap-2">
                              <Shield className="h-3 w-3" />
                              <span className="font-medium">Access:</span>
                              <Badge variant={result.accessGranted ? "default" : "destructive"}>
                                {result.accessGranted ? 'Granted' : 'Denied'}
                              </Badge>
                            </div>

                            {/* Detailed Checks */}
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className={`flex items-center gap-1 ${result.details.roleCheck ? 'text-green-600' : 'text-red-600'}`}>
                                {result.details.roleCheck ? '✓' : '✗'} Role Check
                              </div>
                              <div className={`flex items-center gap-1 ${result.details.tierCheck ? 'text-green-600' : 'text-red-600'}`}>
                                {result.details.tierCheck ? '✓' : '✗'} Tier Check
                              </div>
                              <div className={`flex items-center gap-1 ${result.details.routeExists ? 'text-green-600' : 'text-red-600'}`}>
                                {result.details.routeExists ? '✓' : '✗'} Route Exists
                              </div>
                              <div className={`flex items-center gap-1 ${result.details.componentRenders ? 'text-green-600' : 'text-red-600'}`}>
                                {result.details.componentRenders ? '✓' : '✗'} Component OK
                              </div>
                            </div>

                            {/* Issues */}
                            {result.issues.length > 0 && (
                              <div>
                                <div className="font-medium text-red-600 mb-1">Issues:</div>
                                <ul className="space-y-1 text-red-600">
                                  {result.issues.map((issue, idx) => (
                                    <li key={idx} className="text-xs">• {issue}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Navigation Preview */}
                            {result.details.navigation.length > 0 && (
                              <div>
                                <div className="font-medium mb-1">Navigation Items:</div>
                                <div className="text-xs space-y-1 max-h-20 overflow-y-auto">
                                  {result.details.navigation.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-1">
                                      <span className="text-muted-foreground">•</span>
                                      <span>{item.title}</span>
                                      {item.children && (
                                        <Badge variant="secondary" className="text-xs">
                                          {item.children.length} sub
                                        </Badge>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CollapsibleContent>
                    )}
                  </Collapsible>
                </div>
              );
            })}
          </div>

          {results.length > 0 && (
            <div className="mt-4 p-2 bg-muted rounded text-xs">
              <div className="font-medium mb-1">Summary:</div>
              <div>
                ✓ {results.filter(r => r.accessGranted && r.issues.length === 0).length} / {results.length} fully working
              </div>
              <div>
                ⚠ {results.filter(r => r.accessGranted && r.issues.length > 0).length} with warnings
              </div>
              <div>
                ✗ {results.filter(r => !r.accessGranted).length} with critical issues
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}