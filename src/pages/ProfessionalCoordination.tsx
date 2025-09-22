import React, { useState } from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { ProfessionalTeamDashboard } from '@/components/professional/ProfessionalTeamDashboard';
import { ClientCoordinationPanel } from '@/components/professional/ClientCoordinationPanel';
import { CrossProfessionalWorkflows } from '@/components/professional/CrossProfessionalWorkflows';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Network, Zap } from 'lucide-react';

export default function ProfessionalCoordinationPage() {
  const [activeTab, setActiveTab] = useState('team');

  const secondaryMenuItems = [
    {
      id: 'team',
      label: 'Team Dashboard',
      icon: Users,
      onClick: () => setActiveTab('team')
    },
    {
      id: 'coordination',
      label: 'Client Coordination',
      icon: Network,
      onClick: () => setActiveTab('coordination')
    },
    {
      id: 'workflows',
      label: 'Automated Workflows',
      icon: Zap,
      onClick: () => setActiveTab('workflows')
    }
  ];

  return (
    <ThreeColumnLayout 
      title="Professional Coordination" 
      activeMainItem="professional-coordination"
      activeSecondaryItem={activeTab}
      secondaryMenuItems={secondaryMenuItems}
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Professional Coordination</h1>
          <p className="text-muted-foreground">
            Manage multi-professional teams, coordinate client care, and automate cross-professional workflows
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team Dashboard
            </TabsTrigger>
            <TabsTrigger value="coordination" className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              Client Coordination
            </TabsTrigger>
            <TabsTrigger value="workflows" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Automated Workflows
            </TabsTrigger>
          </TabsList>

          <TabsContent value="team" className="mt-6">
            <ProfessionalTeamDashboard />
          </TabsContent>

          <TabsContent value="coordination" className="mt-6">
            <ClientCoordinationPanel />
          </TabsContent>

          <TabsContent value="workflows" className="mt-6">
            <CrossProfessionalWorkflows />
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
}