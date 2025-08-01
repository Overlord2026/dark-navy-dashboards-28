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

export default function CPADashboard() {
  return (
    <div className="space-y-6 p-6">
      <DashboardHeader 
        heading="CPA Practice Management Suite"
        text="Complete practice management platform with onboarding, client communication, document management, and analytics"
      />

      <Tabs defaultValue="onboarding" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="organizers">Client Organizers</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="signatures">E-Signatures</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="onboarding">
          <CPAOnboardingModule />
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