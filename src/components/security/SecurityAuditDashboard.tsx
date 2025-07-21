
import React, { useState, useEffect } from 'react';
import { authSecurityService } from '@/services/security/authSecurity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  TrendingUp,
  Lock
} from "lucide-react";

interface AuditResults {
  totalUsers: number;
  privilegedUsers: number;
  mfaCompliantPrivileged: number;
  orphanedAccounts: number;
  recommendations: string[];
}

export function SecurityAuditDashboard() {
  const [auditResults, setAuditResults] = useState<AuditResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastAuditTime, setLastAuditTime] = useState<Date | null>(null);

  useEffect(() => {
    runSecurityAudit();
  }, []);

  const runSecurityAudit = async () => {
    setLoading(true);
    try {
      const results = await authSecurityService.auditUserAccounts();
      setAuditResults(results);
      setLastAuditTime(new Date());
    } catch (error) {
      console.error('Error running security audit:', error);
    }
    setLoading(false);
  };

  const getMFACompliancePercentage = (): number => {
    if (!auditResults || auditResults.privilegedUsers === 0) return 100;
    return Math.round((auditResults.mfaCompliantPrivileged / auditResults.privilegedUsers) * 100);
  };

  const getSecurityScore = (): { score: number; level: 'critical' | 'warning' | 'good' | 'excellent' } => {
    if (!auditResults) return { score: 0, level: 'critical' };
    
    const mfaCompliance = getMFACompliancePercentage();
    const orphanedRatio = auditResults.totalUsers > 0 ? (auditResults.orphanedAccounts / auditResults.totalUsers) * 100 : 0;
    
    let score = 100;
    score -= (100 - mfaCompliance) * 0.5; // MFA compliance is 50% of score
    score -= orphanedRatio * 0.3; // Orphaned accounts are 30% of score
    score = Math.max(0, Math.round(score));

    if (score >= 90) return { score, level: 'excellent' };
    if (score >= 75) return { score, level: 'good' };
    if (score >= 50) return { score, level: 'warning' };
    return { score, level: 'critical' };
  };

  if (loading && !auditResults) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Running security audit...</span>
      </div>
    );
  }

  if (!auditResults) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Failed to load security audit results</p>
          <Button onClick={runSecurityAudit}>Retry Audit</Button>
        </CardContent>
      </Card>
    );
  }

  const securityScore = getSecurityScore();

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{securityScore.score}%</div>
              <Badge 
                variant={securityScore.level === 'excellent' ? 'default' : 
                        securityScore.level === 'good' ? 'secondary' :
                        securityScore.level === 'warning' ? 'outline' : 'destructive'}
              >
                {securityScore.level}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditResults.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Privileged Users</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditResults.privilegedUsers}</div>
            <p className="text-xs text-muted-foreground">
              {auditResults.mfaCompliantPrivileged} with MFA
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MFA Compliance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getMFACompliancePercentage()}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Results */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  MFA Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Privileged users with MFA:</span>
                  <span className="font-medium">
                    {auditResults.mfaCompliantPrivileged}/{auditResults.privilegedUsers}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${getMFACompliancePercentage()}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Account Hygiene
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Potentially orphaned accounts:</span>
                  <span className="font-medium">{auditResults.orphanedAccounts}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active accounts:</span>
                  <span className="font-medium">
                    {auditResults.totalUsers - auditResults.orphanedAccounts}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          {auditResults.recommendations.length > 0 ? (
            <div className="space-y-3">
              {auditResults.recommendations.map((rec, index) => (
                <Alert key={index}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{rec}</AlertDescription>
                </Alert>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-lg font-medium text-green-800">All Good!</p>
                <p className="text-muted-foreground">No security recommendations at this time.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Actions</CardTitle>
                <CardDescription>
                  Perform security maintenance tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Run Security Audit</p>
                    <p className="text-sm text-muted-foreground">
                      Last run: {lastAuditTime?.toLocaleString() || 'Never'}
                    </p>
                  </div>
                  <Button 
                    onClick={runSecurityAudit} 
                    disabled={loading}
                    variant="outline"
                  >
                    {loading ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Refresh Audit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
