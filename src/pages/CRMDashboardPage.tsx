import React from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Pipeline, BarChart3, Calendar, Bell, Upload, Video, Mail, Target } from 'lucide-react';
import { LeadCaptureForm } from '@/components/crm/LeadCaptureForm';
import { PipelineKanban } from '@/components/crm/PipelineKanban';
import { MeetingIntegrations } from '@/components/crm/MeetingIntegrations';
import { ROIDashboard } from '@/components/crm/ROIDashboard';
import { ContactManagement } from '@/components/crm/ContactManagement';
import { AutomatedReminders } from '@/components/crm/AutomatedReminders';

export default function CRMDashboardPage() {
  return (
    <ThreeColumnLayout 
      title="CRM Dashboard" 
      activeMainItem="crm"
      activeSecondaryItem="dashboard"
      secondaryMenuItems={[]}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">CRM & Pipeline Management</h1>
            <p className="text-muted-foreground">
              Complete customer relationship management with automated workflows
            </p>
          </div>
          <LeadCaptureForm />
        </div>

        <Tabs defaultValue="pipeline" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="pipeline" className="flex items-center gap-2">
              <Pipeline className="h-4 w-4" />
              Pipeline
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Contacts
            </TabsTrigger>
            <TabsTrigger value="meetings" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Meetings
            </TabsTrigger>
            <TabsTrigger value="roi" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              ROI Analytics
            </TabsTrigger>
            <TabsTrigger value="reminders" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Automation
            </TabsTrigger>
            <TabsTrigger value="import" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Import/Export
            </TabsTrigger>
            <TabsTrigger value="automation" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email/SMS
            </TabsTrigger>
            <TabsTrigger value="ads" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Ad Tracking
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pipeline" className="space-y-4">
            <PipelineKanban />
          </TabsContent>

          <TabsContent value="contacts" className="space-y-4">
            <ContactManagement />
          </TabsContent>

          <TabsContent value="meetings" className="space-y-4">
            <MeetingIntegrations />
          </TabsContent>

          <TabsContent value="roi" className="space-y-4">
            <ROIDashboard />
          </TabsContent>

          <TabsContent value="reminders" className="space-y-4">
            <AutomatedReminders />
          </TabsContent>

          <TabsContent value="import" className="space-y-4">
            <div className="text-center py-12">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Import/Export Tools</h3>
              <p className="text-muted-foreground">
                Bulk import contacts, export pipeline reports, and sync with external CRM systems
              </p>
            </div>
          </TabsContent>

          <TabsContent value="automation" className="space-y-4">
            <EmailAutomation />
          </TabsContent>

          <TabsContent value="ads" className="space-y-4">
            <AdIntegrations />
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
}