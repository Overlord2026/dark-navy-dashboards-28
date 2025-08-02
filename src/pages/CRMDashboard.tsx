import React, { useState } from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContactBook } from '@/components/crm/ContactBook';
import { PipelineManager } from '@/components/crm/PipelineManager';
import { ActivityFeed } from '@/components/crm/ActivityFeed';
import { SmartReminders } from '@/components/crm/SmartReminders';
import { CRMAnalytics } from '@/components/crm/CRMAnalytics';
import { ImportExport } from '@/components/crm/ImportExport';
import { Users, Pipeline, Activity, Bell, BarChart3, Upload } from 'lucide-react';

export default function CRMDashboard() {
  const [activeTab, setActiveTab] = useState('contacts');

  return (
    <ThreeColumnLayout title="CRM Dashboard">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">CRM Dashboard</h1>
            <p className="text-muted-foreground">
              Unified contact management and pipeline tracking
            </p>
          </div>
        </div>

        {/* CRM Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Contacts
            </TabsTrigger>
            <TabsTrigger value="pipeline" className="flex items-center gap-2">
              <Pipeline className="h-4 w-4" />
              Pipeline
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="reminders" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Reminders
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="import" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Import/Export
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contacts" className="mt-6">
            <ContactBook />
          </TabsContent>

          <TabsContent value="pipeline" className="mt-6">
            <PipelineManager />
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <ActivityFeed />
          </TabsContent>

          <TabsContent value="reminders" className="mt-6">
            <SmartReminders />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <CRMAnalytics />
          </TabsContent>

          <TabsContent value="import" className="mt-6">
            <ImportExport />
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
}