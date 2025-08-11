import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield, CheckCircle, Clock } from 'lucide-react';

interface SecurityIssue {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'fixed' | 'in_progress' | 'pending';
  description: string;
}

const securityIssues: SecurityIssue[] = [
  {
    id: 'html-sanitization',
    title: 'Unsafe HTML Rendering Removed',
    severity: 'high',
    status: 'fixed',
    description: 'Removed all unsafe dangerouslySetInnerHTML usage and replaced with secure text rendering.'
  },
  {
    id: 'rls-policies',
    title: 'Missing RLS Policies',
    severity: 'critical',
    status: 'in_progress',
    description: '51 tables with RLS enabled but no policies. This allows unrestricted data access.'
  },
  {
    id: 'build-errors',
    title: 'TypeScript Build Errors',
    severity: 'medium',
    status: 'in_progress', 
    description: 'Multiple TypeScript errors preventing secure compilation.'
  },
  {
    id: 'input-validation',
    title: 'Enhanced Input Validation',
    severity: 'medium',
    status: 'pending',
    description: 'Implement comprehensive server-side input validation and rate limiting.'
  }
];

export const SecurityFixesSummary: React.FC = () => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'fixed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const fixedIssues = securityIssues.filter(issue => issue.status === 'fixed');
  const remainingIssues = securityIssues.filter(issue => issue.status !== 'fixed');

  return (
    <div className="space-y-6">
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Shield className="h-5 w-5" />
            Security Fixes Implemented
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {fixedIssues.map((issue) => (
              <div key={issue.id} className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                {getStatusIcon(issue.status)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{issue.title}</span>
                    <Badge className={getSeverityColor(issue.severity)} variant="secondary">
                      {issue.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{issue.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800">
            <AlertTriangle className="h-5 w-5" />
            Remaining Security Issues
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {remainingIssues.map((issue) => (
              <div key={issue.id} className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                {getStatusIcon(issue.status)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{issue.title}</span>
                    <Badge className={getSeverityColor(issue.severity)} variant="secondary">
                      {issue.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{issue.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-medium text-red-800 mb-2">⚠️ Critical Action Required</h4>
            <p className="text-sm text-red-700 mb-3">
              RLS policies must be implemented immediately to prevent unauthorized data access.
            </p>
            <Button variant="destructive" size="sm">
              Implement RLS Policies Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};