import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Bug,
  Navigation,
  Route,
  Shield,
  Code
} from 'lucide-react';

export function PersonaDebugSummary() {
  // Pre-analysis of the persona system based on current codebase
  const issues = [
    {
      severity: 'critical',
      type: 'routing',
      title: 'Dashboard Components Location Mismatch',
      description: 'Some dashboard components are in /pages/ while routes expect them in /pages/dashboard/',
      affected: ['AdminDashboard', 'ClientDashboard', 'AccountantDashboard', 'ConsultantDashboard', 'AttorneyDashboard'],
      fix: 'Move components to correct directories or update import paths'
    },
    {
      severity: 'warning',
      type: 'navigation',
      title: 'Navigation Structure Inconsistency',
      description: 'Using both getRoleNavigation() and hierarchicalNav structures',
      affected: ['All personas'],
      fix: 'Standardize on single navigation system'
    },
    {
      severity: 'critical',
      type: 'access-control',
      title: 'Missing Dashboard Routes for Some Roles',
      description: 'tenant_admin and system_administrator map to /admin-dashboard but may need specific routes',
      affected: ['tenant_admin', 'system_administrator'],
      fix: 'Create specific dashboard routes or update role mapping'
    },
    {
      severity: 'info',
      type: 'feature',
      title: 'Premium Features Not Fully Implemented',
      description: 'Premium client features are defined in navigation but routes may not exist',
      affected: ['client_premium'],
      fix: 'Implement premium feature routes and components'
    }
  ];

  const expectedPersonaResults = [
    { persona: 'Client Basic', expectedStatus: 'working', navItems: 3, issues: ['Some nav routes may 404'] },
    { persona: 'Client Premium', expectedStatus: 'partial', navItems: 3, issues: ['Premium features not fully implemented'] },
    { persona: 'Advisor', expectedStatus: 'working', navItems: 4, issues: ['Dashboard layout updated, should work'] },
    { persona: 'Accountant', expectedStatus: 'working', navItems: 3, issues: ['Component exists, routing fixed'] },
    { persona: 'Consultant', expectedStatus: 'working', navItems: 3, issues: ['Component exists, routing fixed'] },
    { persona: 'Attorney', expectedStatus: 'working', navItems: 3, issues: ['Component exists, routing fixed'] },
    { persona: 'Admin', expectedStatus: 'working', navItems: 3, issues: ['Basic admin dashboard exists'] },
    { persona: 'Tenant Admin', expectedStatus: 'partial', navItems: 3, issues: ['Maps to admin dashboard'] },
    { persona: 'System Administrator', expectedStatus: 'partial', navItems: 3, issues: ['Maps to admin dashboard'] }
  ];

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default: return <Bug className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'working': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'partial': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'broken': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Bug className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Bug className="h-5 w-5" />
          Persona Emulation System Analysis
        </h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Identified Issues</h3>
            <div className="space-y-3">
              {issues.map((issue, idx) => (
                <div key={idx} className="border border-border rounded p-3">
                  <div className="flex items-start gap-3">
                    {getSeverityIcon(issue.severity)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{issue.title}</span>
                        <Badge variant={issue.severity === 'critical' ? 'destructive' : 
                                      issue.severity === 'warning' ? 'secondary' : 'default'}>
                          {issue.severity}
                        </Badge>
                        <Badge variant="outline">{issue.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{issue.description}</p>
                      <div className="text-xs">
                        <strong>Affected:</strong> {issue.affected.join(', ')}
                      </div>
                      <div className="text-xs mt-1">
                        <strong>Fix:</strong> {issue.fix}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Expected Persona Test Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {expectedPersonaResults.map((result, idx) => (
                <div key={idx} className="border border-border rounded p-3">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(result.expectedStatus)}
                    <span className="font-medium text-sm">{result.persona}</span>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="flex items-center gap-1">
                      <Navigation className="h-3 w-3" />
                      <span>{result.navItems} nav items</span>
                    </div>
                    <div className="text-muted-foreground">
                      Issues: {result.issues.join(', ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Code className="h-4 w-4" />
              Quick Fixes Required
            </h4>
            <div className="text-sm space-y-1">
              <div>1. <strong>Dashboard Components:</strong> Ensure all dashboard components are in correct locations</div>
              <div>2. <strong>Route Navigation:</strong> Verify all navigation routes actually exist and render</div>
              <div>3. <strong>Role Access:</strong> Test role switching and access control for each persona</div>
              <div>4. <strong>Premium Features:</strong> Implement or disable premium navigation items that don't have routes</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}