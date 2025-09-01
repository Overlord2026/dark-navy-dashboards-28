import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OverviewTab } from './OverviewTab';
import { RoadmapTab } from './RoadmapTab';
import { IPLedgerTab } from './IPLedgerTab';
import { SecurityTab } from './SecurityTab';
import { PersonaDemosTab } from './PersonaDemosTab';
import { PublishTab } from './PublishTab';

export default function HQDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="bfo-header p-6 -m-6 mb-6">
          <h1 className="text-3xl font-bold text-white">HQ</h1>
          <p className="text-bfo-gold mt-2">Strategic oversight and execution center</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-card border border-border">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Overview
            </TabsTrigger>
            <TabsTrigger value="roadmap" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Roadmap
            </TabsTrigger>
            <TabsTrigger value="ip-ledger" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              IP Ledger
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Security
            </TabsTrigger>
            <TabsTrigger value="persona-demos" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Persona Demos
            </TabsTrigger>
            <TabsTrigger value="publish" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Publish
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="roadmap">
            <RoadmapTab />
          </TabsContent>

          <TabsContent value="ip-ledger">
            <IPLedgerTab />
          </TabsContent>

          <TabsContent value="security">
            <SecurityTab />
          </TabsContent>

          <TabsContent value="persona-demos">
            <PersonaDemosTab />
          </TabsContent>

          <TabsContent value="publish">
            <PublishTab />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}