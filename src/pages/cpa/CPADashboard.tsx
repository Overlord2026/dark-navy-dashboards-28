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
import { ClientInviteOnboardingFlow } from '@/components/cpa/ClientInviteOnboardingFlow';
import { CPAFirmSetupWizard } from '@/components/cpa/CPAFirmSetupWizard';
import { ClientOrganizerDynamic } from '@/components/cpa/ClientOrganizerDynamic';
import { DataImportMapperEnhanced } from '@/components/cpa/DataImportMapperEnhanced';
import { PostReturnEngagement } from '@/components/cpa/PostReturnEngagement';

export default function CPADashboard() {
  return (
    <div className="space-y-6 p-6">
      <DashboardHeader 
        heading="CPA Practice Management Suite"
        text="Complete practice management platform with onboarding, client communication, document management, and analytics"
      />

      <Tabs defaultValue="setup" className="space-y-6">
        <TabsList className="grid w-full grid-cols-12 text-xs">
          <TabsTrigger value="setup">Setup Wizard</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="staff">Staff & Roles</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="organizers">Client Organizer</TabsTrigger>
          <TabsTrigger value="portal">Portal Setup</TabsTrigger>
          <TabsTrigger value="import">Data Import</TabsTrigger>
          <TabsTrigger value="mapping">Client Mapping</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="signatures">E-Signatures</TabsTrigger>
          <TabsTrigger value="engagement">Post-Return</TabsTrigger>
        </TabsList>

        <TabsContent value="setup">
          <CPAFirmSetupWizard />
        </TabsContent>

        <TabsContent value="dashboard">
          <PracticeDashboard />
        </TabsContent>

        <TabsContent value="staff">
          <StaffRoleManagement />
        </TabsContent>

        <TabsContent value="onboarding">
          <ClientInviteOnboardingFlow />
        </TabsContent>

        <TabsContent value="portal">
          <WhiteLabelPortalActivation />
        </TabsContent>

        <TabsContent value="import">
          <DataImportMapperEnhanced />
        </TabsContent>

        <TabsContent value="mapping">
          <ClientMappingEngine />
        </TabsContent>

        <TabsContent value="organizers">
          <ClientOrganizerDynamic />
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

        <TabsContent value="engagement">
          <PostReturnEngagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}