import React, { useState } from 'react';
import { Plus, Building2, AlertTriangle, Calendar, FileText, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEntityManagement } from '@/hooks/useEntityManagement';
import { EntityCreationWizard } from './EntityCreationWizard';
import { EntityCard } from './EntityCard';
import { FilingScheduleList } from './FilingScheduleList';
import { ComplianceAlerts } from './ComplianceAlerts';
import { ProfessionalComplianceDashboard } from './ProfessionalComplianceDashboard';

export const EntityManagementDashboard = () => {
  const [showWizard, setShowWizard] = useState(false);
  const { entities, filings, alerts, isLoading } = useEntityManagement();

  const activeEntities = entities.filter(e => e.status === 'active');
  const upcomingFilings = filings.filter(f => {
    const dueDate = new Date(f.due_date);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return dueDate <= thirtyDaysFromNow && f.status !== 'completed';
  });
  
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' || a.severity === 'high');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Entity Management & Compliance Center</h1>
          <p className="text-muted-foreground">
            Manage your business entities, track compliance, and stay on top of filing deadlines
          </p>
        </div>
        <Button onClick={() => setShowWizard(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Entity
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Entities</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeEntities.length}</div>
            <p className="text-xs text-muted-foreground">
              Across {new Set(entities.map(e => e.jurisdiction)).size} jurisdictions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Filings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingFilings.length}</div>
            <p className="text-xs text-muted-foreground">
              Next 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{criticalAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              Critical & high priority
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {filings.length > 0 ? Math.round((filings.filter(f => f.status === 'completed').length / filings.length) * 100) : 100}%
            </div>
            <p className="text-xs text-muted-foreground">
              Year to date
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="entities" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="entities">Entities</TabsTrigger>
          <TabsTrigger value="filings">Filing Schedule</TabsTrigger>
          <TabsTrigger value="alerts">Compliance Alerts</TabsTrigger>
          <TabsTrigger value="professionals">Professional Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="entities" className="space-y-4">
          {entities.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold">No entities created</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Get started by creating your first business entity.
                  </p>
                  <div className="mt-6">
                    <Button onClick={() => setShowWizard(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Entity
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {entities.map((entity) => (
                <EntityCard key={entity.id} entity={entity} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="filings" className="space-y-4">
          <FilingScheduleList filings={filings} entities={entities} />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <ComplianceAlerts alerts={alerts} />
        </TabsContent>

        <TabsContent value="professionals" className="space-y-4">
          <ProfessionalComplianceDashboard />
        </TabsContent>
      </Tabs>

      {/* Entity Creation Wizard */}
      {showWizard && (
        <EntityCreationWizard
          open={showWizard}
          onClose={() => setShowWizard(false)}
        />
      )}
    </div>
  );
};