import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardHeader } from '@/components/ui/DashboardHeader';
import { CPAOnboardingModule } from '@/components/cpa/CPAOnboardingModule';
import { ClientOrganizerModule } from '@/components/cpa/ClientOrganizerModule';
import { CommunicationsDashboard } from '@/components/cpa/CommunicationsDashboard';
import { DocumentRequestEngine } from '@/components/cpa/DocumentRequestEngine';
import { WhiteLabelTemplateEditor } from '@/components/cpa/WhiteLabelTemplateEditor';
import { ESignatureWorkflow } from '@/components/cpa/ESignatureWorkflow';
import { PracticeAnalytics } from '@/components/cpa/PracticeAnalytics';
import { DataImportMapper } from '@/components/cpa/DataImportMapper';
import { ClientMappingEngine } from '@/components/cpa/ClientMappingEngine';
import { WhiteLabelPortalActivation } from '@/components/cpa/WhiteLabelPortalActivation';
import { StaffRoleManagement } from '@/components/cpa/StaffRoleManagement';
import { PracticeDashboard } from '@/components/cpa/PracticeDashboard';

export default function CPADashboard() {
  return (
    <div className="space-y-6 p-6">
      <DashboardHeader 
        heading="CPA Practice Management Suite"
        text="Complete practice management platform with onboarding, client communication, document management, and analytics"
      />

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-12 text-xs">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="staff">Staff & Roles</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="portal">Portal Setup</TabsTrigger>
          <TabsTrigger value="import">Data Import</TabsTrigger>
          <TabsTrigger value="mapping">Client Mapping</TabsTrigger>
          <TabsTrigger value="organizers">Organizers</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="signatures">E-Signatures</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <PracticeDashboard />
        </TabsContent>

        <TabsContent value="staff">
          <StaffRoleManagement />
        </TabsContent>

        <TabsContent value="onboarding">
          <CPAOnboardingModule />
        </TabsContent>

        <TabsContent value="portal">
          <WhiteLabelPortalActivation />
        </TabsContent>

        <TabsContent value="import">
          <DataImportMapper />
        </TabsContent>

        <TabsContent value="mapping">
          <ClientMappingEngine />
        </TabsContent>

        <TabsContent value="organizers">
          <ClientOrganizerModule />
        </TabsContent>

        <TabsContent value="communications">
          <CommunicationsDashboard />
        </TabsContent>

        <TabsContent value="documents">
          <DocumentRequestEngine />
        </TabsContent>

        <TabsContent value="templates">
          <WhiteLabelTemplateEditor />
        </TabsContent>

        <TabsContent value="signatures">
          <ESignatureWorkflow />
        </TabsContent>

        <TabsContent value="analytics">
          <PracticeAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}