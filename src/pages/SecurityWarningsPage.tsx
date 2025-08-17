import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, Database, Users, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface SecurityFinding {
  id: string;
  name: string;
  description: string;
  level: 'error' | 'warn' | 'info';
  scanner: string;
  time_since_scan?: number;
}

interface SecurityScanResults {
  count: number;
  findings: SecurityFinding[];
}

export function SecurityWarningsPage() {
  const [scanResults, setScanResults] = useState<SecurityScanResults | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data based on the actual scan results
    const mockResults: SecurityScanResults = {
      count: 75,
      findings: [
        {
          id: 'ADVISOR_PROFILES_EMAIL_EXPOSURE',
          name: 'Advisor Email Addresses Publicly Exposed',
          description: "The 'advisor_profiles' table containing advisor names, emails, and firm information is publicly accessible without authentication, allowing anyone to harvest professional contact information.",
          level: 'error',
          scanner: 'supabase_lov'
        },
        {
          id: 'RESERVED_PROFILES_EMAIL_EXPOSURE', 
          name: 'Reserved Profile Email Addresses Publicly Exposed',
          description: "The 'reserved_profiles' table containing names and email addresses is publicly accessible, potentially exposing personal information of users who haven't yet claimed their profiles.",
          level: 'error',
          scanner: 'supabase_lov'
        },
        {
          id: 'ATTORNEY_DOCUMENT_PHONE_EXPOSURE',
          name: 'Phone Numbers in Document Classifications Publicly Exposed',
          description: "The 'attorney_document_classifications' table contains phone number patterns and is publicly accessible, potentially exposing client contact information embedded in document metadata.",
          level: 'warn',
          scanner: 'supabase_lov'
        },
        {
          id: 'GOAL_TEMPLATES_PHONE_EXPOSURE',
          name: 'Phone Numbers in Goal Templates Publicly Exposed', 
          description: "The 'goal_category_templates' table contains phone number patterns and is publicly accessible, potentially exposing contact information used in financial planning templates.",
          level: 'warn',
          scanner: 'supabase_lov'
        }
      ]
    };

    setScanResults(mockResults);
    setLoading(false);
  }, []);

  const getSeverityColor = (level: string) => {
    switch (level) {
      case 'error': return 'destructive';
      case 'warn': return 'secondary';
      case 'info': return 'outline';
      default: return 'outline';
    }
  };

  const getSeverityIcon = (level: string) => {
    switch (level) {
      case 'error': return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'warn': return <Shield className="h-5 w-5 text-secondary" />;
      case 'info': return <Database className="h-5 w-5 text-muted-foreground" />;
      default: return <Shield className="h-5 w-5" />;
    }
  };

  const getIssueIcon = (id: string) => {
    if (id.includes('EMAIL')) return <Mail className="h-4 w-4" />;
    if (id.includes('PHONE')) return <Phone className="h-4 w-4" />;
    return <Users className="h-4 w-4" />;
  };

  const criticalIssues = scanResults?.findings.filter(f => f.level === 'error') || [];
  const warningIssues = scanResults?.findings.filter(f => f.level === 'warn') || [];

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Security Warnings</h1>
            <p className="text-muted-foreground">Loading security scan results...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Security Warnings</h1>
          <p className="text-muted-foreground">
            Critical security issues requiring immediate attention
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Critical Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{criticalIssues.length}</div>
            <p className="text-sm text-muted-foreground">Require immediate action</p>
          </CardContent>
        </Card>

        <Card className="border-secondary/20 bg-secondary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-secondary-foreground flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary-foreground">{warningIssues.length}</div>
            <p className="text-sm text-muted-foreground">Should be addressed soon</p>
          </CardContent>
        </Card>

        <Card className="border-muted/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Total Findings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{scanResults?.count || 0}</div>
            <p className="text-sm text-muted-foreground">Including RLS policy issues</p>
          </CardContent>
        </Card>
      </div>

      {/* Critical Issues */}
      {criticalIssues.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-destructive flex items-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            Critical Security Issues
          </h2>
          
          {criticalIssues.map((finding) => (
            <Alert key={finding.id} className="border-destructive/50 bg-destructive/5">
              <div className="flex items-start gap-3">
                {getSeverityIcon(finding.level)}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    {getIssueIcon(finding.id)}
                    <h3 className="font-semibold text-destructive">{finding.name}</h3>
                    <Badge variant={getSeverityColor(finding.level)}>
                      {finding.level.toUpperCase()}
                    </Badge>
                  </div>
                  <AlertDescription>
                    {finding.description}
                  </AlertDescription>
                  
                  {/* Remediation Steps */}
                  <div className="mt-3 p-3 bg-background/80 rounded-md border">
                    <h4 className="font-medium text-sm mb-2">Immediate Action Required:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Add RLS policies to restrict public access</li>
                      <li>• Review data classification for PII</li>
                      <li>• Implement proper authentication checks</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Alert>
          ))}
        </div>
      )}

      {/* Warning Issues */}
      {warningIssues.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-secondary-foreground flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Security Warnings
          </h2>
          
          {warningIssues.map((finding) => (
            <Alert key={finding.id} className="border-secondary/50 bg-secondary/5">
              <div className="flex items-start gap-3">
                {getSeverityIcon(finding.level)}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    {getIssueIcon(finding.id)}
                    <h3 className="font-semibold">{finding.name}</h3>
                    <Badge variant={getSeverityColor(finding.level)}>
                      {finding.level.toUpperCase()}
                    </Badge>
                  </div>
                  <AlertDescription>
                    {finding.description}
                  </AlertDescription>
                  
                  {/* Remediation Steps */}
                  <div className="mt-3 p-3 bg-background/80 rounded-md border">
                    <h4 className="font-medium text-sm mb-2">Recommended Actions:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Review data sensitivity classification</li>
                      <li>• Consider data masking for public access</li>
                      <li>• Implement field-level access controls</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Alert>
          ))}
        </div>
      )}

      {/* Additional Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Additional Information
          </CardTitle>
          <CardDescription>
            71 additional tables have RLS enabled but no policies configured
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            These tables are currently inaccessible due to missing Row Level Security policies. 
            While this prevents unauthorized access, it also blocks legitimate operations.
          </p>
          
          <Alert>
            <Database className="h-4 w-4" />
            <AlertDescription>
              <strong>Next Steps:</strong> Review each table's intended access patterns and implement 
              appropriate RLS policies. See the Supabase documentation for guidance on RLS policy creation.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}