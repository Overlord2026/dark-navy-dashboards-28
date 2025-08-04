import React from 'react';
import { AuthWrapper } from '@/components/auth/AuthWrapper';
import { ROLE_GROUPS } from '@/utils/roleHierarchy';
import { ComplianceOverview } from '@/components/compliance/ComplianceOverview';
import { ComplianceWorkflow } from '@/components/compliance/ComplianceWorkflow';
import { ComplianceDocumentVault } from '@/components/compliance/ComplianceDocumentVault';
import { ComplianceRiskScoring } from '@/components/compliance/ComplianceRiskScoring';
import { ComplianceCommunity } from '@/components/compliance/ComplianceCommunity';
import { ComplianceAICopilot } from '@/components/compliance/ComplianceAICopilot';
import { MockAuditCenter } from '@/components/compliance/MockAuditCenter';
import { RegulatoryAlertsFeed } from '@/components/compliance/RegulatoryAlertsFeed';
import { CETrackingModule } from '@/components/compliance/CETrackingModule';
import { ComplianceIncidentReporting } from '@/components/compliance/ComplianceIncidentReporting';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const ComplianceDashboard: React.FC = () => {
  return (
    <AuthWrapper 
      requireAuth={true} 
      allowedRoles={ROLE_GROUPS.COMPLIANCE_ACCESS}
    >
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Compliance Center
            </h1>
            <p className="text-muted-foreground">
              Regulatory oversight, risk management, and compliance monitoring
            </p>
          </div>
        </div>

        <ComplianceOverview />

        <Tabs defaultValue="workflow" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 text-xs">
            <TabsTrigger value="workflow">Workflow</TabsTrigger>
            <TabsTrigger value="audits">Mock Audits</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="incidents">Incidents</TabsTrigger>
            <TabsTrigger value="ce-tracking">CE Tracking</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="risk">Risk</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="copilot">AI Copilot</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="workflow">
            <ComplianceWorkflow />
          </TabsContent>

          <TabsContent value="audits">
            <MockAuditCenter />
          </TabsContent>

          <TabsContent value="alerts">
            <RegulatoryAlertsFeed />
          </TabsContent>

          <TabsContent value="incidents">
            <ComplianceIncidentReporting />
          </TabsContent>

          <TabsContent value="ce-tracking">
            <CETrackingModule />
          </TabsContent>

          <TabsContent value="documents">
            <ComplianceDocumentVault />
          </TabsContent>

          <TabsContent value="risk">
            <ComplianceRiskScoring />
          </TabsContent>

          <TabsContent value="community">
            <ComplianceCommunity />
          </TabsContent>

          <TabsContent value="copilot">
            <ComplianceAICopilot />
          </TabsContent>

          <TabsContent value="reports">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Compliance reporting module coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AuthWrapper>
  );
};