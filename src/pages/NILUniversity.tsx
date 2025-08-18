import React, { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  School, 
  Users, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analytics } from '@/lib/analytics';

export const NILUniversity: React.FC = () => {
  const { toast } = useToast();
  const activeDisclosures = 12;
  const pendingApprovals = 4;
  const complianceScore = 94;

  const handleViewCompliance = () => {
    trackEvent('compliance.opened', { context: 'nil_university' });
    toast.success('University Compliance Center opened');
  };

  const handleManageAthletes = () => {
    trackEvent('athletes.manage', { context: 'nil_university' });
    toast.success('Athlete Management opened');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">NIL for Universities</h1>
          <p className="text-xl text-muted-foreground">
            Manage student-athlete NIL compliance and oversight
          </p>
        </div>

        {/* KPI Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Disclosures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <span className="text-2xl font-bold">{activeDisclosures}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span className="text-2xl font-bold">{pendingApprovals}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span className="text-2xl font-bold">{complianceScore}%</span>
              </div>
              <Badge variant={complianceScore >= 90 ? "default" : "destructive"} className="mt-2">
                {complianceScore >= 90 ? "Excellent" : "Needs Attention"}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Compliance Center
              </CardTitle>
              <CardDescription>
                Monitor and manage NIL compliance across all student-athletes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Overall Status</span>
                  <Badge variant="default">Active Monitoring</Badge>
                </div>
                <Button onClick={handleViewCompliance} className="w-full">
                  View Compliance Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Athlete Management
              </CardTitle>
              <CardDescription>
                Oversee student-athlete NIL activities and agreements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Athletes</span>
                  <Badge variant="outline">248 Enrolled</Badge>
                </div>
                <Button onClick={handleManageAthletes} className="w-full">
                  Manage Athletes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NILUniversity;